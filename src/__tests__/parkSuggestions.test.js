import { describe, it, expect } from 'vitest'
import {
  inferTheme,
  inferTags,
  parseShowTime,
  getParkSuggestions,
  PARK_SUGGESTIONS,
} from '../data/parkSuggestions.js'

// ── inferTheme ──────────────────────────────────────────────────────────────

describe('inferTheme', () => {
  it('returns "fireworks" for nighttime spectaculars', () => {
    expect(inferTheme('Happily Ever After Fireworks')).toBe('fireworks')
    expect(inferTheme('Luminous: The Symphony of Us')).toBe('fireworks')
    expect(inferTheme('Fantasmic!')).toBe('fireworks')
    expect(inferTheme('Star Wars: A Galactic Spectacular')).toBe('fireworks')
  })

  it('returns "default" for parades', () => {
    expect(inferTheme('Festival of Fantasy Parade')).toBe('default')
    expect(inferTheme('Harambe Wildlife Cavalcade')).toBe('default')
  })

  it('returns "character" for meet & greets', () => {
    expect(inferTheme('Meet Mickey Mouse')).toBe('character')
    expect(inferTheme("Mickey's Magical Friendship Faire")).toBe('character')
  })

  it('returns "nature" for animal/nature shows', () => {
    expect(inferTheme('Tree of Life Awakening')).toBe('nature')
    expect(inferTheme('Rivers of Light')).toBe('nature')
  })

  it('returns "default" for unrecognised shows', () => {
    expect(inferTheme('Some Unknown Show')).toBe('default')
  })
})

// ── inferTags ───────────────────────────────────────────────────────────────

describe('inferTags', () => {
  it('returns max 3 tags', () => {
    const tags = inferTags('Meet Elsa from Frozen', 'character')
    expect(tags.length).toBeLessThanOrEqual(3)
  })

  it('identifies Star Wars franchise', () => {
    const tags = inferTags('Star Wars: A Galactic Spectacular', 'fireworks')
    expect(tags).toContain('#starwars')
  })

  it('identifies Frozen franchise from film name in title', () => {
    const tags = inferTags('Frozen Sing-Along Celebration', 'default')
    expect(tags).toContain('#frozen')
  })

  it('identifies Elsa and Anna characters even when film name is absent', () => {
    // "Royal Sommerhus" is the location — film name not in title, so franchise tag absent
    const tags = inferTags('Meet Anna and Elsa at Royal Sommerhus', 'character')
    expect(tags.some(t => t === '#elsa' || t === '#anna')).toBe(true)
    expect(tags).toContain('#meetandgreet')
  })

  it('identifies fireworks activity tag', () => {
    const tags = inferTags('Happily Ever After Fireworks', 'fireworks')
    expect(tags).toContain('#fireworks')
  })

  it('identifies meet & greet activity tag', () => {
    const tags = inferTags('Meet Mickey Mouse', 'character')
    expect(tags).toContain('#meetandgreet')
  })

  it('identifies parade activity tag', () => {
    const tags = inferTags('Festival of Fantasy Parade', 'default')
    expect(tags).toContain('#parade')
  })

  it('identifies Indiana Jones franchise', () => {
    const tags = inferTags('Indiana Jones Epic Stunt Spectacular', 'default')
    expect(tags).toContain('#indianajones')
  })

  it('returns deduplicated tags', () => {
    const tags = inferTags('Figment Journey into Imagination Meet', 'character')
    const unique = new Set(tags)
    expect(unique.size).toBe(tags.length)
  })

  it('returns a fallback tag when nothing matches', () => {
    const tags = inferTags('Completely Unknown Show', 'default')
    expect(tags.length).toBeGreaterThan(0)
  })

  it('identifies Toy Story franchise', () => {
    const tags = inferTags('Toy Story Midway Mania', 'default')
    expect(tags).toContain('#toystory')
  })

  it('identifies princess category', () => {
    const tags = inferTags('Meet Cinderella at Fantasyland', 'character')
    expect(tags).toContain('#princess')
  })
})

// ── parseShowTime ────────────────────────────────────────────────────────────

describe('parseShowTime', () => {
  it('extracts HH:MM from ISO 8601 string', () => {
    expect(parseShowTime('2024-12-25T14:30:00-05:00')).toBe('14:30')
    expect(parseShowTime('2024-07-04T21:00:00Z')).toBe('21:00')
    expect(parseShowTime('2024-01-01T09:05:00+00:00')).toBe('09:05')
  })

  it('returns null for null input', () => {
    expect(parseShowTime(null)).toBeNull()
  })

  it('returns null for undefined input', () => {
    expect(parseShowTime(undefined)).toBeNull()
  })

  it('returns null for strings without a time component', () => {
    expect(parseShowTime('2024-12-25')).toBeNull()
    expect(parseShowTime('not-a-date')).toBeNull()
  })
})

// ── PARK_SUGGESTIONS shape ───────────────────────────────────────────────────

describe('PARK_SUGGESTIONS', () => {
  const ALL_PARKS = [
    'Magic Kingdom',
    'EPCOT',
    "Disney's Hollywood Studios",
    "Disney's Animal Kingdom",
  ]

  it('contains an entry for all four WDW parks', () => {
    ALL_PARKS.forEach(park => {
      expect(PARK_SUGGESTIONS).toHaveProperty(park)
      expect(Array.isArray(PARK_SUGGESTIONS[park])).toBe(true)
      expect(PARK_SUGGESTIONS[park].length).toBeGreaterThan(0)
    })
  })

  it('every suggestion has required fields', () => {
    ALL_PARKS.forEach(park => {
      PARK_SUGGESTIONS[park].forEach(s => {
        expect(s).toHaveProperty('id')
        expect(s).toHaveProperty('label')
        expect(s).toHaveProperty('time')
        expect(s).toHaveProperty('type')
        expect(s).toHaveProperty('theme')
        expect(Array.isArray(s.tags)).toBe(true)
        expect(s).toHaveProperty('infoUrl')
        expect(s).toHaveProperty('mapUrl')
      })
    })
  })

  it('time fields are in HH:MM format', () => {
    ALL_PARKS.forEach(park => {
      PARK_SUGGESTIONS[park].forEach(s => {
        expect(s.time).toMatch(/^\d{2}:\d{2}$/)
      })
    })
  })

  it('ids are unique across all parks', () => {
    const ids = ALL_PARKS.flatMap(p => PARK_SUGGESTIONS[p].map(s => s.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
})

// ── getParkSuggestions ───────────────────────────────────────────────────────

describe('getParkSuggestions', () => {
  it('returns suggestions for a single park', () => {
    const suggestions = getParkSuggestions('Magic Kingdom', null)
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.every(s => s.id.startsWith('mk-'))).toBe(true)
  })

  it('combines suggestions from two parks', () => {
    const suggestions = getParkSuggestions('Magic Kingdom', 'EPCOT')
    const mkIds = suggestions.filter(s => s.id.startsWith('mk-'))
    const epIds = suggestions.filter(s => s.id.startsWith('ep-'))
    expect(mkIds.length).toBeGreaterThan(0)
    expect(epIds.length).toBeGreaterThan(0)
  })

  it('returns empty array for unknown park', () => {
    expect(getParkSuggestions('Unknown Park', null)).toEqual([])
  })

  it('handles both parks being undefined/null', () => {
    expect(getParkSuggestions(null, null)).toEqual([])
    expect(getParkSuggestions(undefined, undefined)).toEqual([])
  })
})

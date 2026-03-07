import { describe, it, expect } from 'vitest'
import {
  createEventItem,
  parseRideSelection,
  patchDayPlan,
  DEFAULT_DRAFT,
  resetDraftForType,
  normalizeEventItem,
  formatTime,
  buildEventLabel,
  detectTheme,
} from '../App.jsx'

// ── createEventItem ──────────────────────────────────────────────────────────

describe('createEventItem', () => {
  it('returns a fully-populated item when overrides cover all fields', () => {
    const item = createEventItem({ type: 'Ride', ride: 'Space Mountain', ridePark: 'Magic Kingdom' })
    expect(item.type).toBe('Ride')
    expect(item.ride).toBe('Space Mountain')
    expect(item.ridePark).toBe('Magic Kingdom')
  })

  it('fills every missing field with a blank string default', () => {
    const item = createEventItem({ type: 'Fireworks' })
    expect(item.restaurant).toBe('')
    expect(item.customRestaurant).toBe('')
    expect(item.menuUrl).toBe('')
    expect(item.bookingUrl).toBe('')
    expect(item.heroImage).toBe('')
    expect(item.ride).toBe('')
    expect(item.ridePark).toBe('')
    expect(item.note).toBe('')
    expect(item.time).toBe('')
    expect(item.theme).toBe('')
  })

  it('returns a plain object — not the same reference each call', () => {
    const a = createEventItem({})
    const b = createEventItem({})
    expect(a).not.toBe(b)
  })
})

// ── parseRideSelection ───────────────────────────────────────────────────────

describe('parseRideSelection', () => {
  it('splits "Park::Ride" into parts', () => {
    const { ridePark, ride } = parseRideSelection('Magic Kingdom::Space Mountain')
    expect(ridePark).toBe('Magic Kingdom')
    expect(ride).toBe('Space Mountain')
  })

  it('returns empty strings for null / undefined / empty input', () => {
    expect(parseRideSelection(null)).toEqual({ ridePark: '', ride: '' })
    expect(parseRideSelection(undefined)).toEqual({ ridePark: '', ride: '' })
    expect(parseRideSelection('')).toEqual({ ridePark: '', ride: '' })
  })

  it('handles a value with no separator', () => {
    const { ridePark, ride } = parseRideSelection('SomethingWithoutSeparator')
    expect(ridePark).toBe('SomethingWithoutSeparator')
    expect(ride).toBe('')
  })
})

// ── patchDayPlan ─────────────────────────────────────────────────────────────

describe('patchDayPlan', () => {
  const base = {
    tripName: 'Test',
    dayPlans: {
      '2026-03-10': { dayType: 'Park', park: 'Magic Kingdom', items: [] }
    }
  }

  it('merges the patch into the target date', () => {
    const result = patchDayPlan(base, '2026-03-10', { park: 'EPCOT' })
    expect(result.dayPlans['2026-03-10'].park).toBe('EPCOT')
    expect(result.dayPlans['2026-03-10'].dayType).toBe('Park')
  })

  it('does not mutate the original state', () => {
    patchDayPlan(base, '2026-03-10', { park: 'EPCOT' })
    expect(base.dayPlans['2026-03-10'].park).toBe('Magic Kingdom')
  })

  it('preserves top-level fields other than dayPlans', () => {
    const result = patchDayPlan(base, '2026-03-10', { park: 'EPCOT' })
    expect(result.tripName).toBe('Test')
  })

  it('creates a new dayPlans entry if the date did not exist', () => {
    const result = patchDayPlan(base, '2026-03-11', { dayType: 'Travel' })
    expect(result.dayPlans['2026-03-11'].dayType).toBe('Travel')
  })
})

// ── DEFAULT_DRAFT ────────────────────────────────────────────────────────────

describe('DEFAULT_DRAFT', () => {
  it('has all expected fields with blank/default values', () => {
    expect(DEFAULT_DRAFT.type).toBe('Fireworks')
    expect(DEFAULT_DRAFT.restaurant).toBe('')
    expect(DEFAULT_DRAFT.ride).toBe('')
    expect(DEFAULT_DRAFT.note).toBe('')
    expect(DEFAULT_DRAFT.time).toBe('')
  })
})

// ── resetDraftForType ────────────────────────────────────────────────────────

describe('resetDraftForType', () => {
  it('resets all fields and sets new type', () => {
    const old = { type: 'Dinner', restaurant: 'Be Our Guest', note: 'celebration', ride: '' }
    const next = resetDraftForType(old, 'Ride')
    expect(next.type).toBe('Ride')
    expect(next.restaurant).toBe('')
    expect(next.ride).toBe('')
  })

  it('preserves the note from the previous draft', () => {
    const old = { type: 'Fireworks', note: 'special night', restaurant: '' }
    const next = resetDraftForType(old, 'Parade')
    expect(next.note).toBe('special night')
  })

  it('handles null draft safely', () => {
    const next = resetDraftForType(null, 'Ride')
    expect(next.type).toBe('Ride')
    expect(next.note).toBe('')
  })
})

// ── normalizeEventItem ───────────────────────────────────────────────────────

describe('normalizeEventItem', () => {
  it('normalizes a structured item, filling blank defaults', () => {
    const item = { type: 'Ride', ride: 'Space Mountain', ridePark: 'Magic Kingdom' }
    const result = normalizeEventItem(item)
    expect(result.type).toBe('Ride')
    expect(result.ride).toBe('Space Mountain')
    expect(result.restaurant).toBe('')
    expect(result.menuUrl).toBe('')
  })

  it('normalizes a legacy text item', () => {
    const result = normalizeEventItem({ text: 'Dinner at resort', time: '19:00' })
    expect(result.note).toBe('Dinner at resort')
    expect(result.time).toBe('19:00')
    expect(result.type).toBe('')
  })

  it('handles null/undefined safely', () => {
    const result = normalizeEventItem(null)
    expect(result.note).toBe('')
    expect(result.type).toBe('')
  })
})

// ── formatTime ───────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('converts 24h to 12h am/pm', () => {
    expect(formatTime('09:00')).toBe('9:00am')
    expect(formatTime('13:30')).toBe('1:30pm')
    expect(formatTime('21:00')).toBe('9:00pm')
    expect(formatTime('00:00')).toBe('12:00am')
    expect(formatTime('12:00')).toBe('12:00pm')
  })

  it('returns empty string for empty input', () => {
    expect(formatTime('')).toBe('')
    expect(formatTime(null)).toBe('')
    expect(formatTime(undefined)).toBe('')
  })
})

// ── buildEventLabel ──────────────────────────────────────────────────────────

describe('buildEventLabel', () => {
  it('formats ride with park', () => {
    const label = buildEventLabel({ type: 'Ride', ride: 'Space Mountain', ridePark: 'Magic Kingdom', restaurant: '', note: '' })
    expect(label).toBe('Ride: Space Mountain (Magic Kingdom)')
  })

  it('formats ride without park', () => {
    const label = buildEventLabel({ type: 'Ride', ride: 'Space Mountain', ridePark: '', restaurant: '', note: '' })
    expect(label).toBe('Ride: Space Mountain')
  })

  it('formats restaurant as "Type at Restaurant"', () => {
    const label = buildEventLabel({ type: 'Dinner', restaurant: 'Be Our Guest', ride: '', note: '' })
    expect(label).toBe('Dinner at Be Our Guest')
  })

  it('formats note as "Type: Note"', () => {
    const label = buildEventLabel({ type: 'Fireworks', restaurant: '', ride: '', note: 'Happily Ever After' })
    expect(label).toBe('Fireworks: Happily Ever After')
  })

  it('returns the type alone when no ride/restaurant/note', () => {
    const label = buildEventLabel({ type: 'Fireworks', restaurant: '', ride: '', note: '' })
    expect(label).toBe('Fireworks')
  })

  it('falls back to text or "Event" for legacy items', () => {
    expect(buildEventLabel({ type: '', restaurant: '', ride: '', note: '', text: 'Custom note' })).toBe('Custom note')
    expect(buildEventLabel({ type: '', restaurant: '', ride: '', note: '', text: '' })).toBe('Event')
  })
})

// ── detectTheme ──────────────────────────────────────────────────────────────

describe('detectTheme', () => {
  it('detects fireworks theme from keyword "firework"', () => {
    expect(detectTheme('Happily Ever After Fireworks')).toBe('fireworks')
  })

  it('detects fireworks theme from "parade"', () => {
    expect(detectTheme('Festival of Fantasy Parade')).toBe('fireworks')
  })

  it('detects character theme', () => {
    expect(detectTheme('Mickey Mouse Meet & Greet')).toBe('character')
  })

  it('detects nature theme from "animal"', () => {
    expect(detectTheme('Wildlife & Animal Experience')).toBe('nature')
  })

  it('falls back to default for unmatched text', () => {
    expect(detectTheme('Lunch at the resort')).toBe('default')
  })
})

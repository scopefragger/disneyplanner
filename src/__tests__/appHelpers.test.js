import { describe, it, expect } from 'vitest'
import {
  createEventItem,
  createBlankDayPlan,
  parseRideSelection,
  patchDayPlan,
  DEFAULT_DRAFT,
  resetDraftForType,
  normalizeEventItem,
  formatTime,
  buildEventLabel,
  detectTheme,
  getDateRange,
  formatPrettyDate,
  formatShortDate,
  getItemSlot,
  getEventTypeConfig,
  getSecondParkOptions,
  hashtagLabel,
  getDayTypeChipColor,
  getDayTypeIcon,
  normalizePlan,
  getRideOptionsForDay,
  getTimeSlots,
  getLocationDisplay,
  RIDES_BY_PARK,
  RIDE_IMAGES,
  generateId,
  getRestaurantResources,
  getDayCardStyle,
} from '../App.jsx'
import { RIDE_URLS, RIDE_TAGS } from '../data/rideData.js'

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

// ── createBlankDayPlan (TD-017) ───────────────────────────────────────────────

describe('createBlankDayPlan', () => {
  it('returns a blank day plan with all required fields', () => {
    const dp = createBlankDayPlan()
    expect(dp.dayType).toBe('')
    expect(dp.park).toBe('')
    expect(dp.secondPark).toBe('')
    expect(dp.parkHop).toBe(false)
    expect(dp.swimSpot).toBe('')
    expect(dp.staySpot).toBe('')
    expect(Array.isArray(dp.items)).toBe(true)
    expect(Array.isArray(dp.dismissedSuggestions)).toBe(true)
  })

  it('merges overrides over defaults', () => {
    const dp = createBlankDayPlan({ dayType: 'Park', park: 'Magic Kingdom' })
    expect(dp.dayType).toBe('Park')
    expect(dp.park).toBe('Magic Kingdom')
    expect(dp.parkHop).toBe(false)
  })

  it('returns a new object each call', () => {
    expect(createBlankDayPlan()).not.toBe(createBlankDayPlan())
  })
})

// ── getDateRange (TD-018) ─────────────────────────────────────────────────────

describe('getDateRange', () => {
  it('returns an array of date strings between start and end inclusive', () => {
    const dates = getDateRange('2026-03-01', '2026-03-03')
    expect(dates).toEqual(['2026-03-01', '2026-03-02', '2026-03-03'])
  })

  it('returns a single-element array for same start and end', () => {
    expect(getDateRange('2026-03-10', '2026-03-10')).toEqual(['2026-03-10'])
  })

  it('returns empty array when end is before start', () => {
    expect(getDateRange('2026-03-10', '2026-03-01')).toEqual([])
  })

  it('returns empty array for empty/null input', () => {
    expect(getDateRange('', '')).toEqual([])
    expect(getDateRange(null, null)).toEqual([])
  })
})

// ── formatPrettyDate (TD-018) ─────────────────────────────────────────────────

describe('formatPrettyDate', () => {
  it('returns a localised short date string', () => {
    const result = formatPrettyDate('2026-03-07')
    expect(result).toContain('Mar')
    expect(result).toContain('7')
  })

  it('includes the weekday abbreviation', () => {
    const result = formatPrettyDate('2026-03-07')
    expect(result).toMatch(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/)
  })
})

// ── formatShortDate (TD-018) ──────────────────────────────────────────────────

describe('formatShortDate', () => {
  it('returns "M/D" format without leading zeros', () => {
    expect(formatShortDate('2026-03-07')).toBe('3/7')
    expect(formatShortDate('2026-12-25')).toBe('12/25')
    expect(formatShortDate('2026-01-01')).toBe('1/1')
  })

  it('returns empty string for falsy input', () => {
    expect(formatShortDate('')).toBe('')
    expect(formatShortDate(null)).toBe('')
  })
})

// ── getItemSlot (TD-019) ──────────────────────────────────────────────────────

describe('getItemSlot', () => {
  it('derives slot from time when present', () => {
    expect(getItemSlot({ time: '09:00', type: 'Dinner' })).toBe('morning')
    expect(getItemSlot({ time: '12:30', type: 'Ride' })).toBe('midday')
    expect(getItemSlot({ time: '15:00', type: 'Ride' })).toBe('afternoon')
    expect(getItemSlot({ time: '18:00', type: 'Ride' })).toBe('evening')
    expect(getItemSlot({ time: '21:00', type: 'Fireworks' })).toBe('night')
  })

  it('falls back to type-based default when no time', () => {
    expect(getItemSlot({ time: '', type: 'Fireworks' })).toBe('night')
    expect(getItemSlot({ time: '', type: 'Dinner' })).toBe('evening')
    expect(getItemSlot({ time: '', type: 'Lunch' })).toBe('midday')
  })

  it('falls back to "midday" for unknown type with no time', () => {
    expect(getItemSlot({ time: '', type: 'Unknown' })).toBe('midday')
  })
})

// ── getEventTypeConfig (TD-019) ───────────────────────────────────────────────

describe('getEventTypeConfig', () => {
  it('returns config matching the given type', () => {
    const config = getEventTypeConfig('Dinner')
    expect(config.value).toBe('Dinner')
    expect(config.theme).toBe('dining')
    expect(config.requiresRestaurant).toBe(true)
  })

  it('returns first config (Breakfast) for unknown type', () => {
    const config = getEventTypeConfig('UnknownType')
    expect(config.value).toBe('Breakfast')
  })

  it('ride type does not require restaurant', () => {
    const config = getEventTypeConfig('Ride')
    expect(config.requiresRestaurant).toBe(false)
    expect(config.theme).toBe('ride')
  })
})

// ── getSecondParkOptions (TD-019) ─────────────────────────────────────────────

describe('getSecondParkOptions', () => {
  it('excludes the first park from the options', () => {
    const options = getSecondParkOptions('Magic Kingdom')
    expect(options).not.toContain('Magic Kingdom')
    expect(options.length).toBeGreaterThan(0)
  })

  it('includes all other parks when a park is selected', () => {
    const options = getSecondParkOptions('EPCOT')
    expect(options).toContain('Magic Kingdom')
    expect(options).toContain("Disney's Hollywood Studios")
    expect(options).not.toContain('EPCOT')
  })

  it('returns all parks when first park is unknown/null', () => {
    const options = getSecondParkOptions(null)
    expect(options.length).toBeGreaterThan(0)
  })
})

// ── hashtagLabel (TD-020) ─────────────────────────────────────────────────────

describe('hashtagLabel', () => {
  it('prepends # and strips spaces', () => {
    expect(hashtagLabel('Magic Kingdom')).toBe('#MagicKingdom')
  })

  it('returns "#Choose" for falsy input', () => {
    expect(hashtagLabel('')).toBe('#Choose')
    expect(hashtagLabel(null)).toBe('#Choose')
    expect(hashtagLabel(undefined)).toBe('#Choose')
  })

  it('handles single word without modification', () => {
    expect(hashtagLabel('EPCOT')).toBe('#EPCOT')
  })
})

// ── getDayTypeChipColor (TD-020) ──────────────────────────────────────────────

describe('getDayTypeChipColor', () => {
  it('returns the Park colour', () => {
    expect(getDayTypeChipColor('Park')).toBe('rgba(0, 87, 184, 0.2)')
  })

  it('returns the Swimming colour', () => {
    expect(getDayTypeChipColor('Swimming')).toBe('rgba(0, 157, 200, 0.2)')
  })

  it('returns the Hotel/Shopping colour', () => {
    expect(getDayTypeChipColor('Hotel/Shopping')).toBe('rgba(144, 109, 201, 0.24)')
  })

  it('returns the Travel colour', () => {
    expect(getDayTypeChipColor('Travel')).toBe('rgba(92, 134, 201, 0.22)')
  })

  it('returns fallback colour for unknown day type', () => {
    expect(getDayTypeChipColor('Unknown')).toBe('rgba(0, 87, 184, 0.14)')
    expect(getDayTypeChipColor('')).toBe('rgba(0, 87, 184, 0.14)')
  })
})

// ── getDayTypeIcon (TD-020) ───────────────────────────────────────────────────

describe('getDayTypeIcon', () => {
  it('returns a non-empty string for known day types', () => {
    expect(getDayTypeIcon('Park')).toBeTruthy()
    expect(getDayTypeIcon('Swimming')).toBeTruthy()
    expect(getDayTypeIcon('Travel')).toBeTruthy()
  })

  it('returns empty string for unknown day type', () => {
    expect(getDayTypeIcon('Unknown')).toBe('')
    expect(getDayTypeIcon('')).toBe('')
  })
})

// ── normalizePlan (TD-021) ────────────────────────────────────────────────────

describe('normalizePlan', () => {
  it('fills missing top-level fields with DEFAULT_PLAN values', () => {
    const result = normalizePlan({})
    expect(result.tripName).toBe('Our Disney Holiday')
    expect(result.adults).toBe(2)
    expect(Array.isArray(result.priorities)).toBe(true)
    expect(Array.isArray(result.checklist)).toBe(true)
    expect(Array.isArray(result.favoriteTags)).toBe(true)
  })

  it('preserves provided top-level fields', () => {
    const result = normalizePlan({ tripName: 'Epic Trip', adults: 4 })
    expect(result.tripName).toBe('Epic Trip')
    expect(result.adults).toBe(4)
  })

  it('normalises dayPlans entries — fills blank strings and arrays', () => {
    const raw = {
      dayPlans: {
        '2026-03-10': { dayType: 'Park', park: 'Magic Kingdom' }
      }
    }
    const result = normalizePlan(raw)
    const day = result.dayPlans['2026-03-10']
    expect(day.dayType).toBe('Park')
    expect(day.park).toBe('Magic Kingdom')
    expect(day.secondPark).toBe('')
    expect(day.parkHop).toBe(false)
    expect(Array.isArray(day.items)).toBe(true)
    expect(Array.isArray(day.dismissedSuggestions)).toBe(true)
  })

  it('handles missing dayPlans gracefully', () => {
    const result = normalizePlan({ tripName: 'Test' })
    expect(result.dayPlans).toEqual({})
  })

  it('preserves existing items and dismissedSuggestions in dayPlans', () => {
    const items = [{ type: 'Fireworks', note: 'test' }]
    const dismissed = ['mk-happily-ever-after']
    const raw = {
      dayPlans: { '2026-03-10': { dayType: 'Park', park: 'EPCOT', items, dismissedSuggestions: dismissed } }
    }
    const result = normalizePlan(raw)
    expect(result.dayPlans['2026-03-10'].items).toEqual(items)
    expect(result.dayPlans['2026-03-10'].dismissedSuggestions).toEqual(dismissed)
  })

  it('uses default priorities when rawPlan.priorities is empty', () => {
    const result = normalizePlan({ priorities: [] })
    expect(result.priorities).toEqual(['Magic Kingdom'])
  })
})

// ── getRideOptionsForDay (TD-022) ─────────────────────────────────────────────

describe('getRideOptionsForDay', () => {
  it('returns an empty array for non-Park day types', () => {
    expect(getRideOptionsForDay({ dayType: 'Swimming', park: '' })).toEqual([])
    expect(getRideOptionsForDay({ dayType: '', park: '' })).toEqual([])
  })

  it('returns ride options for a single park', () => {
    const options = getRideOptionsForDay({ dayType: 'Park', park: 'Magic Kingdom', parkHop: false, secondPark: '' })
    expect(options.length).toBeGreaterThan(0)
    options.forEach(o => {
      expect(o.value).toContain('Magic Kingdom::')
      expect(o.label).toBeTruthy()
    })
  })

  it('combines rides from both parks on a park-hop day', () => {
    const options = getRideOptionsForDay({ dayType: 'Park', park: 'Magic Kingdom', parkHop: true, secondPark: 'EPCOT' })
    const mkRides = options.filter(o => o.value.startsWith('Magic Kingdom::'))
    const epRides = options.filter(o => o.value.startsWith('EPCOT::'))
    expect(mkRides.length).toBeGreaterThan(0)
    expect(epRides.length).toBeGreaterThan(0)
  })

  it('does not duplicate rides when secondPark equals park', () => {
    const single = getRideOptionsForDay({ dayType: 'Park', park: 'Magic Kingdom', parkHop: false, secondPark: '' })
    const hopSame = getRideOptionsForDay({ dayType: 'Park', park: 'Magic Kingdom', parkHop: true, secondPark: 'Magic Kingdom' })
    expect(hopSame.length).toBe(single.length)
  })
})

// ── getTimeSlots (TD-022) ─────────────────────────────────────────────────────

describe('getTimeSlots', () => {
  it('returns 6 time slots', () => {
    expect(getTimeSlots('Park').length).toBe(6)
    expect(getTimeSlots('Swimming').length).toBe(6)
  })

  it('uses "Rope drop" as the morning label for Park days', () => {
    const slots = getTimeSlots('Park')
    expect(slots[0].label).toBe('Rope drop')
  })

  it('uses "Water park opens" for Swimming days', () => {
    const slots = getTimeSlots('Swimming')
    expect(slots[0].label).toBe('Water park opens')
  })

  it('uses generic "Morning" for non-park days', () => {
    const slots = getTimeSlots('Travel')
    expect(slots[0].label).toBe('Morning')
  })

  it('every slot has slot, time, and label fields', () => {
    getTimeSlots('Park').forEach(s => {
      expect(s).toHaveProperty('slot')
      expect(s).toHaveProperty('time')
      expect(s).toHaveProperty('label')
    })
  })
})

// ── getLocationDisplay (TD-023) ───────────────────────────────────────────────

describe('getLocationDisplay', () => {
  it('returns park label and icon for a Park day', () => {
    const result = getLocationDisplay({ dayType: 'Park', park: 'Magic Kingdom', parkHop: false, secondPark: '' }, '')
    expect(result.label).toBe('Magic Kingdom')
    expect(result.icon).toBeTruthy()
  })

  it('shows "Park to SecondPark" label on a park-hop day', () => {
    const result = getLocationDisplay({ dayType: 'Park', park: 'Magic Kingdom', parkHop: true, secondPark: 'EPCOT' }, '')
    expect(result.label).toBe('Magic Kingdom to EPCOT')
  })

  it('returns swim spot label for Swimming day', () => {
    const result = getLocationDisplay({ dayType: 'Swimming', swimSpot: "Disney's Typhoon Lagoon Water Park" }, '')
    expect(result.label).toBe("Disney's Typhoon Lagoon Water Park")
  })

  it('returns staySpot label for Hotel/Shopping day', () => {
    const result = getLocationDisplay({ dayType: 'Hotel/Shopping', staySpot: "Disney's Contemporary Resort" }, '')
    expect(result.label).toContain("Disney's Contemporary Resort")
  })

  it('prefixes "My hotel:" when staySpot matches myHotel', () => {
    const hotel = "Disney's Grand Floridian Resort & Spa"
    const result = getLocationDisplay({ dayType: 'Hotel/Shopping', staySpot: hotel }, hotel)
    expect(result.label).toBe(`My hotel: ${hotel}`)
  })

  it('returns null for Travel or unset day type', () => {
    expect(getLocationDisplay({ dayType: 'Travel' }, '')).toBeNull()
    expect(getLocationDisplay({ dayType: '' }, '')).toBeNull()
  })

  it('returns Disney Springs badge icon for Disney Springs stay', () => {
    const result = getLocationDisplay({ dayType: 'Hotel/Shopping', staySpot: 'Disney Springs' }, '')
    expect(result.label).toBe('Disney Springs')
    expect(result.icon).toBeTruthy()
  })
})

// ── Ride data integrity (TD-024) ──────────────────────────────────────────────

describe('Ride data integrity', () => {
  const allRides = Object.values(RIDES_BY_PARK).flat()

  it('every ride in RIDES_BY_PARK has a matching RIDE_URLS entry', () => {
    // Disney Springs balloon is not a typical attraction — exclude
    const ridesToCheck = allRides.filter(r => r !== 'Aerophile - The World Leader in Balloon Flight')
    ridesToCheck.forEach(ride => {
      expect(RIDE_URLS).toHaveProperty(ride)
    })
  })

  it('every ride in RIDES_BY_PARK has a matching RIDE_IMAGES entry', () => {
    const ridesToCheck = allRides.filter(r => r !== 'Aerophile - The World Leader in Balloon Flight')
    ridesToCheck.forEach(ride => {
      expect(RIDE_IMAGES).toHaveProperty(ride)
    })
  })

  it('every ride in RIDES_BY_PARK has a matching RIDE_TAGS entry', () => {
    const ridesToCheck = allRides.filter(r => r !== 'Aerophile - The World Leader in Balloon Flight')
    ridesToCheck.forEach(ride => {
      expect(RIDE_TAGS).toHaveProperty(ride)
      expect(Array.isArray(RIDE_TAGS[ride])).toBe(true)
      expect(RIDE_TAGS[ride].length).toBeGreaterThan(0)
    })
  })
})

// ── getRestaurantResources (TD-025) ───────────────────────────────────────────

describe('getRestaurantResources', () => {
  it('returns metadata object for a known restaurant', () => {
    const result = getRestaurantResources('Be Our Guest Restaurant')
    expect(result).toHaveProperty('menuUrl')
    expect(result).toHaveProperty('bookingUrl')
    expect(result).toHaveProperty('heroImage')
    expect(result.menuUrl).toContain('be-our-guest')
  })

  it('falls back to a search URL for an unknown restaurant', () => {
    const result = getRestaurantResources('Unknown Place')
    expect(result.menuUrl).toContain('Unknown')
    expect(result.bookingUrl).toContain('Unknown')
    expect(result.heroImage).toBe('')
  })
})

// ── generateId (TD-025) ───────────────────────────────────────────────────────

describe('generateId', () => {
  it('starts with "proj-"', () => {
    expect(generateId()).toMatch(/^proj-/)
  })

  it('generates unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateId()))
    expect(ids.size).toBe(20)
  })
})

// ── getDayCardStyle (TD-026) ──────────────────────────────────────────────────

describe('getDayCardStyle', () => {
  it('returns an object with all required CSS custom properties', () => {
    const style = getDayCardStyle({ dayType: 'Park', park: 'Magic Kingdom', parkHop: false, secondPark: '' })
    expect(style).toHaveProperty('--day-bg-image')
    expect(style).toHaveProperty('--day-tint')
    expect(style).toHaveProperty('--day-tint-overlay')
    expect(style).toHaveProperty('--park-logo-image')
    expect(style).toHaveProperty('--park-logo-image-2')
  })

  it('sets a park photo background for a known park', () => {
    const style = getDayCardStyle({ dayType: 'Park', park: 'EPCOT', parkHop: false, secondPark: '' })
    expect(style['--day-bg-image']).toContain('epcot')
  })

  it('uses the park-hop gradient overlay when parkHop is set', () => {
    const style = getDayCardStyle({ dayType: 'Park', park: 'Magic Kingdom', parkHop: true, secondPark: 'EPCOT' })
    expect(style['--day-tint-overlay']).toContain('linear-gradient')
    expect(style['--park-logo-image-2']).not.toBe('none')
  })

  it('uses swim logo for Swimming days', () => {
    const style = getDayCardStyle({ dayType: 'Swimming', swimSpot: "Disney's Typhoon Lagoon Water Park" })
    expect(style['--park-logo-image']).toContain('typhoon-lagoon')
  })

  it('falls back to a default background for Travel days', () => {
    const style = getDayCardStyle({ dayType: 'Travel' })
    expect(style['--day-bg-image']).toContain('day-travel')
  })
})

// ── normalizePlan edge cases (TD-027) ─────────────────────────────────────────

describe('normalizePlan edge cases', () => {
  it('initialises favoriteTags to empty array when missing', () => {
    const result = normalizePlan({})
    expect(result.favoriteTags).toEqual([])
  })

  it('preserves provided favoriteTags', () => {
    const result = normalizePlan({ favoriteTags: ['#frozen', '#starwars'] })
    expect(result.favoriteTags).toEqual(['#frozen', '#starwars'])
  })

  it('uses default checklist when rawPlan.checklist is empty', () => {
    const result = normalizePlan({ checklist: [] })
    expect(result.checklist.length).toBeGreaterThan(0)
  })

  it('preserves non-empty checklist from rawPlan', () => {
    const custom = ['Book flights', 'Pack bags']
    const result = normalizePlan({ checklist: custom })
    expect(result.checklist).toEqual(custom)
  })

  it('handles a dayPlan entry with null items gracefully', () => {
    const raw = { dayPlans: { '2026-03-10': { dayType: 'Park', park: 'EPCOT', items: null } } }
    const result = normalizePlan(raw)
    expect(Array.isArray(result.dayPlans['2026-03-10'].items)).toBe(true)
  })

  it('handles a dayPlan with parkHop truthy value', () => {
    const raw = { dayPlans: { '2026-03-10': { dayType: 'Park', park: 'Magic Kingdom', parkHop: 1 } } }
    const result = normalizePlan(raw)
    expect(result.dayPlans['2026-03-10'].parkHop).toBe(true)
  })
})

// ── buildEventLabel additional branches (TD-028) ──────────────────────────────

describe('buildEventLabel additional branches', () => {
  it('returns type alone when ride is set but type is not Ride', () => {
    const label = buildEventLabel({ type: 'Fireworks', restaurant: '', ride: 'Space Mountain', note: '' })
    expect(label).toBe('Fireworks')
  })

  it('returns "Event" fallback when type, ride, restaurant, note, and text are all empty', () => {
    expect(buildEventLabel({ type: '', restaurant: '', ride: '', note: '', text: '' })).toBe('Event')
  })
})

// ── detectTheme additional branches (TD-028) ──────────────────────────────────

describe('detectTheme additional branches', () => {
  it('detects dining theme from "dining"', () => {
    expect(detectTheme('Character Dining Experience')).toBe('dining')
  })

  it('detects dining theme from "restaurant"', () => {
    expect(detectTheme('Restaurant visit')).toBe('dining')
  })

  it('detects dining theme from "breakfast"', () => {
    expect(detectTheme('Character Breakfast')).toBe('dining')
  })

  it('detects ride theme from "ride"', () => {
    expect(detectTheme('Best Ride ever')).toBe('ride')
  })

  it('detects ride theme from "coaster"', () => {
    expect(detectTheme('Roller Coaster fun')).toBe('ride')
  })

  it('detects character theme from "princess"', () => {
    expect(detectTheme('Princess Meet')).toBe('character')
  })

  it('detects nature theme from "trail"', () => {
    expect(detectTheme('Nature Trail Walk')).toBe('nature')
  })

  it('detects nature theme from "safari"', () => {
    expect(detectTheme('Kilimanjaro Safari')).toBe('nature')
  })
})

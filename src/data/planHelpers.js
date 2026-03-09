// Plan-shape factories and pure state helpers — no React / DOM dependencies (TD-034)
import { EVENT_TYPES } from './tripOptions.js'

export const DEFAULT_PLAN = {
  tripName: 'Our Disney Holiday',
  startDate: '',
  endDate: '',
  myHotel: '',
  adults: 2,
  children: 0,
  budget: 3500,
  priorities: ['Magic Kingdom'],
  diningStyle: 'No dining plan',
  notes: '',
  dayPlans: {},
  checklist: ['Park tickets', 'Resort booking', 'Genie+ plan']
}

// ── Default blank draft item — single source of truth (TD-003) ──────────────
export const DEFAULT_DRAFT = {
  type: 'Fireworks',
  restaurant: '',
  customRestaurant: '',
  ride: '',
  note: '',
  time: '',
}

// ── Show-type normaliser for quickAdd (TD-011) ────────────────────────────────
// API 'Show' type maps to our 'Fireworks' category (closest match for nighttime spectaculars)
export const SHOW_TYPE_MAP = {
  Fireworks: 'Fireworks',
  Parade: 'Parade',
  Show: 'Fireworks',
  'Character Meet': 'Character Meet',
}

// ── Factory: blank day plan shape — single source of truth (TD-017) ─────────
export function createBlankDayPlan(overrides) {
  return {
    dayType: '', park: '', secondPark: '', parkHop: false,
    swimSpot: '', staySpot: '', items: [], dismissedSuggestions: [],
    ...overrides
  }
}

// ── Factory: creates a blank event item merged with overrides (TD-002) ──────
export function createEventItem(overrides) {
  return {
    type: '', restaurant: '', customRestaurant: '',
    menuUrl: '', bookingUrl: '', heroImage: '',
    ride: '', ridePark: '', note: '', time: '', theme: '',
    ...overrides
  }
}

// ── Utility: parse "Park::RideName" value into its parts (TD-004) ────────────
export function parseRideSelection(value) {
  const [ridePark = '', ride = ''] = (value || '').split('::')
  return { ridePark, ride }
}

// ── Pure state helper: patch a single day's plan (TD-001) ───────────────────
export function patchDayPlan(current, date, patch) {
  return {
    ...current,
    dayPlans: {
      ...current.dayPlans,
      [date]: { ...current.dayPlans[date], ...patch }
    }
  }
}

// Infer a display theme from a show/event name (used by parkSuggestions and detectTheme)
export function inferTheme(name) {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('firework') || nameLower.includes('illuminate') || nameLower.includes('luminous') ||
      nameLower.includes('fantasmic') || nameLower.includes('galactic') || nameLower.includes('harmonious') ||
      nameLower.includes('happily ever') || nameLower.includes('star wars')) return 'fireworks'
  if (nameLower.includes('parade') || nameLower.includes('festival of fantasy') || nameLower.includes('cavalcade') ||
      nameLower.includes('harambe')) return 'default'
  if (nameLower.includes('character') || nameLower.includes('mickey') || nameLower.includes('friendship faire') ||
      nameLower.includes('meet')) return 'character'
  if (nameLower.includes('nature') || nameLower.includes('animal') || nameLower.includes('tree of life') ||
      nameLower.includes('rivers of light')) return 'nature'
  return 'default'
}

export function detectTheme(text) {
  const value = text.toLowerCase()

  // Event-type keywords take priority — these aren't show-name patterns
  if (value.includes('dining') || value.includes('restaurant') || value.includes('breakfast')) {
    return 'dining'
  }
  if (value.includes('ride') || value.includes('coaster') || value.includes('genie+')) {
    return 'ride'
  }
  // Parades get fireworks-style display even though inferTheme maps them to 'default'
  if (value.includes('parade') || value.includes('night show')) {
    return 'fireworks'
  }
  // Activity-based nature keywords not covered by inferTheme
  if (value.includes('trail') || value.includes('safari')) {
    return 'nature'
  }

  // Delegate show-name detection to inferTheme (richer Disney-specific keywords)
  return inferTheme(text)
}

export function getEventTypeConfig(type) {
  return EVENT_TYPES.find((eventType) => eventType.value === type) || EVENT_TYPES[0]
}

export function normalizeEventItem(item) {
  if (item?.type) {
    return createEventItem({
      type: item.type,
      restaurant: item.restaurant || '',
      customRestaurant: item.customRestaurant || '',
      menuUrl: item.menuUrl || '',
      bookingUrl: item.bookingUrl || '',
      heroImage: item.heroImage || '',
      ride: item.ride || '',
      ridePark: item.ridePark || '',
      note: item.note || '',
      time: item.time || '',
      theme: item.theme || getEventTypeConfig(item.type).theme
    })
  }

  const text = item?.text || ''
  return createEventItem({
    note: text,
    time: item?.time || '',
    theme: item?.theme || detectTheme(text),
    text
  })
}

export function buildEventLabel(item) {
  if (item.type === 'Ride' && item.ride) {
    return `Ride: ${item.ride}${item.ridePark ? ` (${item.ridePark})` : ''}`
  }
  if (item.type && item.restaurant) {
    return `${item.type} at ${item.restaurant}`
  }
  if (item.type && item.note) {
    return `${item.type}: ${item.note}`
  }
  if (item.type) return item.type
  return item.text || 'Event'
}

export function normalizePlan(rawPlan) {
  const normalizedDayPlans = Object.entries(rawPlan.dayPlans || {}).reduce((acc, [date, dayPlan]) => {
    acc[date] = createBlankDayPlan({
      dayType: dayPlan.dayType || '',
      park: dayPlan.park || '',
      secondPark: dayPlan.secondPark || '',
      parkHop: Boolean(dayPlan.parkHop),
      swimSpot: dayPlan.swimSpot || '',
      staySpot: dayPlan.staySpot || '',
      items: dayPlan.items || [],
      dismissedSuggestions: dayPlan.dismissedSuggestions || []
    })
    return acc
  }, {})

  return {
    ...DEFAULT_PLAN,
    ...rawPlan,
    priorities: rawPlan.priorities?.length ? rawPlan.priorities : DEFAULT_PLAN.priorities,
    checklist: rawPlan.checklist?.length ? rawPlan.checklist : DEFAULT_PLAN.checklist,
    favoriteTags: rawPlan.favoriteTags || [],
    dayPlans: normalizedDayPlans
  }
}

// ── Helper: reset draft fields when the event type changes (TD-007) ──────────
export function resetDraftForType(draft, newType) {
  return { ...DEFAULT_DRAFT, type: newType, note: draft?.note || '' }
}

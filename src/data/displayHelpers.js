// Pure display and style helpers — no React / DOM dependencies (TD-035)
import { DAY_TYPES, PARK_OPTIONS, SWIM_OPTIONS, EVENT_TYPES } from './tripOptions.js'
import { RIDES_BY_PARK, getRideDescription, RIDE_AREAS } from './rideData.js'
import { getRestaurantDescription } from './restaurantMetadata.js'
import { SHOW_AREAS } from './parkSuggestions.js'
import { IMG_BASE } from './constants.js'

const DAY_TYPE_BACKGROUNDS = {
  Park: `${IMG_BASE}day-park.svg`,
  Swimming: `${IMG_BASE}day-swimming.svg`,
  'Hotel/Shopping': `${IMG_BASE}day-hotel-shopping.svg`,
  Travel: `${IMG_BASE}day-travel.svg`
}

const PARK_TINTS = {
  'Magic Kingdom':              'rgba(103, 133, 246, 0.24)',
  'EPCOT':                      'rgba(0, 154, 199, 0.2)',
  "Disney's Hollywood Studios": 'rgba(250, 127, 111, 0.22)',
  "Disney's Animal Kingdom":    'rgba(78, 167, 119, 0.22)',
  'Disney Springs':             'rgba(167, 118, 208, 0.2)'
}

const PARKS_IMG = `${IMG_BASE}parks/`
const PARK_IMAGES = {
  'Magic Kingdom':              `${PARKS_IMG}magic-kingdom.jpg`,
  'EPCOT':                      `${PARKS_IMG}epcot.jpg`,
  "Disney's Hollywood Studios": `${PARKS_IMG}hollywood-studios.jpg`,
  "Disney's Animal Kingdom":    `${PARKS_IMG}animal-kingdom.jpg`,
  'Disney Springs':             `${PARKS_IMG}disney-springs.jpg`,
}

const PARK_LOGO_BACKGROUNDS = {
  'Magic Kingdom':              `${IMG_BASE}park-logos/magic-kingdom.svg`,
  'EPCOT':                      `${IMG_BASE}park-logos/epcot.svg`,
  "Disney's Hollywood Studios": `${IMG_BASE}park-logos/hollywood-studios.svg`,
  "Disney's Animal Kingdom":    `${IMG_BASE}park-logos/animal-kingdom.svg`,
  'Disney Springs':             `${IMG_BASE}park-logos/disney-springs.svg`
}

const PARK_BADGE_ICONS = {
  'Magic Kingdom':              `${IMG_BASE}park-icons/magic-kingdom.svg`,
  'EPCOT':                      `${IMG_BASE}park-icons/epcot.svg`,
  "Disney's Hollywood Studios": `${IMG_BASE}park-icons/hollywood-studios.svg`,
  "Disney's Animal Kingdom":    `${IMG_BASE}park-icons/animal-kingdom.svg`,
  'Disney Springs':             `${IMG_BASE}park-icons/disney-springs.svg`
}

const SWIM_TINTS = {
  "Disney's Typhoon Lagoon Water Park": 'rgba(0, 157, 200, 0.2)',
  "Disney's Blizzard Beach Water Park": 'rgba(89, 173, 239, 0.2)'
}

const SWIM_LOGO_BACKGROUNDS = {
  "Disney's Typhoon Lagoon Water Park": `${IMG_BASE}swim-icons/typhoon-lagoon.svg`,
  "Disney's Blizzard Beach Water Park": `${IMG_BASE}swim-icons/blizzard-beach.svg`
}

const HOTEL_ICON = `${IMG_BASE}day-type-icons/hotel-shopping.svg`
const HOTEL_TINT = 'rgba(144, 109, 201, 0.2)'
const DEFAULT_TINT = 'rgba(0, 87, 184, 0.14)'

/** @returns {{ label: string, icon: string } | null} */
export function getLocationDisplay(dayPlan, myHotel) {
  if (dayPlan.dayType === 'Park' && dayPlan.park) {
    const parkLabel =
      dayPlan.parkHop && dayPlan.secondPark ? `${dayPlan.park} to ${dayPlan.secondPark}` : dayPlan.park
    return {
      label: parkLabel,
      icon: PARK_BADGE_ICONS[dayPlan.park] || PARK_LOGO_BACKGROUNDS[dayPlan.park] || ''
    }
  }

  if (dayPlan.dayType === 'Swimming' && dayPlan.swimSpot) {
    const match = SWIM_OPTIONS.find((option) => option.value === dayPlan.swimSpot)
    return { label: dayPlan.swimSpot, icon: match?.icon || HOTEL_ICON }
  }

  if (dayPlan.dayType === 'Hotel/Shopping' && dayPlan.staySpot) {
    if (dayPlan.staySpot === 'Disney Springs') {
      return {
        label: dayPlan.staySpot,
        icon: PARK_BADGE_ICONS['Disney Springs']
      }
    }

    const isMyHotel = myHotel && dayPlan.staySpot === myHotel
    return { label: isMyHotel ? `My hotel: ${dayPlan.staySpot}` : dayPlan.staySpot, icon: HOTEL_ICON }
  }

  return null
}

export const DAY_CHIP_COLORS = {
  Park:             'rgba(0, 87, 184, 0.2)',
  Swimming:         'rgba(0, 157, 200, 0.2)',
  'Hotel/Shopping': 'rgba(144, 109, 201, 0.24)',
  Travel:           'rgba(92, 134, 201, 0.22)',
}

export function getDayTypeChipColor(dayType) {
  return DAY_CHIP_COLORS[dayType] ?? DEFAULT_TINT
}

export function hashtagLabel(value) {
  return value ? `#${value.replace(/\s+/g, '')}` : '#Choose'
}

/**
 * Returns CSS custom properties for a day card's background, tint, and park logos.
 * @returns {{ '--day-bg-image': string, '--day-bg-image-2': string, '--day-park-blend': string,
 *             '--day-tint': string, '--day-tint-overlay': string,
 *             '--park-logo-image': string, '--park-logo-image-2': string }}
 */
export function getDayCardStyle(dayPlan) {
  const dayTypeImage = DAY_TYPE_BACKGROUNDS[dayPlan.dayType] || DAY_TYPE_BACKGROUNDS.Park
  let tint = DEFAULT_TINT
  let tintOverlay = `linear-gradient(135deg, ${tint}, ${tint})`
  let logo = ''
  let logo2 = ''
  let parkPhoto = ''
  let parkPhoto2 = ''

  if (dayPlan.dayType === 'Park' && dayPlan.park) {
    const firstTint = PARK_TINTS[dayPlan.park] || tint
    tint = firstTint
    tintOverlay = `linear-gradient(135deg, ${firstTint}, ${firstTint})`
    logo = PARK_LOGO_BACKGROUNDS[dayPlan.park] || ''
    parkPhoto = PARK_IMAGES[dayPlan.park] || ''

    if (dayPlan.parkHop && dayPlan.secondPark) {
      const secondTint = PARK_TINTS[dayPlan.secondPark] || firstTint
      tintOverlay = `linear-gradient(135deg, ${firstTint} 0 49%, ${secondTint} 51% 100%)`
      logo2 = PARK_LOGO_BACKGROUNDS[dayPlan.secondPark] || ''
      parkPhoto2 = PARK_IMAGES[dayPlan.secondPark] || ''
    }
  } else if (dayPlan.dayType === 'Swimming' && dayPlan.swimSpot) {
    tint = SWIM_TINTS[dayPlan.swimSpot] || tint
    tintOverlay = `linear-gradient(135deg, ${tint}, ${tint})`
    logo = SWIM_LOGO_BACKGROUNDS[dayPlan.swimSpot] || ''
  } else if (dayPlan.dayType === 'Hotel/Shopping' && dayPlan.staySpot) {
    tint = dayPlan.staySpot === 'Disney Springs' ? PARK_TINTS['Disney Springs'] : HOTEL_TINT
    tintOverlay = `linear-gradient(135deg, ${tint}, ${tint})`
    logo =
      dayPlan.staySpot === 'Disney Springs'
        ? PARK_LOGO_BACKGROUNDS['Disney Springs']
        : HOTEL_ICON
  }

  return {
    '--day-bg-image': parkPhoto ? `url(${parkPhoto})` : `url(${dayTypeImage})`,
    '--day-bg-image-2': parkPhoto2 ? `url(${parkPhoto2})` : 'none',
    '--day-park-blend': parkPhoto2 ? 'linear-gradient(135deg, white 35%, transparent 65%)' : 'none',
    '--day-tint': tint,
    '--day-tint-overlay': tintOverlay,
    '--park-logo-image': logo ? `url(${logo})` : 'none',
    '--park-logo-image-2': logo2 ? `url(${logo2})` : 'none'
  }
}

export function getDayTypeIcon(dayType) {
  const match = DAY_TYPES.find((type) => type.value === dayType)
  return match?.icon || ''
}

export function getSecondParkOptions(firstPark) {
  return PARK_OPTIONS.filter((park) => park !== firstPark)
}

export function getRideOptionsForDay(dayPlan) {
  if (dayPlan.dayType !== 'Park') return []

  const parks = []
  if (dayPlan.park) parks.push(dayPlan.park)
  if (dayPlan.parkHop && dayPlan.secondPark && dayPlan.secondPark !== dayPlan.park) {
    parks.push(dayPlan.secondPark)
  }

  return parks.flatMap((park) =>
    (RIDES_BY_PARK[park] || []).map((ride) => ({
      value: `${park}::${ride}`,
      label: dayPlan.parkHop ? `${ride} (${park})` : ride
    }))
  )
}

// Fallback slot assignment when an event has no explicit time
const DEFAULT_SLOT = {
  Breakfast: 'morning',
  'Travel Transfer': 'morning',
  Ride: 'morning',
  'Character Meet': 'morning',
  Lunch: 'midday',
  Snack: 'midday',
  'Pool Time': 'midday',
  Shopping: 'afternoon',
  Parade: 'afternoon',
  Tea: 'afternoon',
  Dinner: 'evening',
  Fireworks: 'night',
}

// Named boundaries for time-of-day slot assignment (hour thresholds)
const SLOT_BOUNDARIES = { night: 21, evening: 18, afternoon: 15, midday: 12, morning: 9 }

export function getItemSlot(item) {
  if (item.time) {
    const [h] = item.time.split(':').map(Number)
    if (h >= SLOT_BOUNDARIES.night)     return 'night'
    if (h >= SLOT_BOUNDARIES.evening)   return 'evening'
    if (h >= SLOT_BOUNDARIES.afternoon) return 'afternoon'
    if (h >= SLOT_BOUNDARIES.midday)    return 'midday'
    if (h >= SLOT_BOUNDARIES.morning)   return 'morning'
    return 'latenight' // before 9am — midnight runs, very early departures
  }
  return DEFAULT_SLOT[item.type] || 'midday'
}

export function getTimeSlots(dayType) {
  const isPark = dayType === 'Park'
  const isSwim = dayType === 'Swimming'
  return [
    { slot: 'morning',   time: '9:00am',   label: isPark ? 'Rope drop' : isSwim ? 'Water park opens' : 'Morning' },
    { slot: 'midday',    time: '12:00pm',  label: isPark ? 'In the parks' : isSwim ? 'Midday splash' : 'Midday' },
    { slot: 'afternoon', time: '3:00pm',   label: 'Afternoon' },
    { slot: 'evening',   time: '6:00pm',   label: isPark ? 'Evening magic' : 'Evening' },
    { slot: 'night',     time: '9:00pm',   label: isPark ? 'Night shows' : 'Night' },
    { slot: 'latenight', time: 'Midnight', label: 'Late night' },
  ]
}

// ── Area lookup (for walking time connectors) ─────────────────────────────────
// Returns the park area string for a confirmed event item, or null.
export function getEventArea(normalizedItem) {
  if (normalizedItem.ride) {
    const rideName = normalizedItem.ride.split('::').pop()
    return RIDE_AREAS[rideName] ?? null
  }
  if (normalizedItem.type === 'Show' || normalizedItem.type === 'Parade' || normalizedItem.type === 'Fireworks') {
    return SHOW_AREAS[normalizedItem.label] ?? null
  }
  return null
}

// ── Description lookup ────────────────────────────────────────────────────────
// Returns a short description string for a confirmed event item, or null.
export function getEventDescription(normalizedItem) {
  if (normalizedItem.ride) {
    const rideName = normalizedItem.ride.split('::').pop()
    const rideDesc = getRideDescription(rideName)
    if (rideDesc) return rideDesc
  }
  if (normalizedItem.restaurant) {
    const restaurantDesc = getRestaurantDescription(normalizedItem.restaurant)
    if (restaurantDesc) return restaurantDesc
  }
  const eventType = EVENT_TYPES.find(e => e.value === normalizedItem.type)
  return eventType?.description ?? null
}

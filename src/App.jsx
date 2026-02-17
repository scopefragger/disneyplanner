import { useEffect, useMemo, useState } from 'react'
import { RESTAURANT_METADATA } from './data/restaurantMetadata'

const IMG_BASE = `${import.meta.env.BASE_URL}images/`

const PARK_OPTIONS = [
  'Magic Kingdom',
  'EPCOT',
  'Disney\'s Hollywood Studios',
  'Disney\'s Animal Kingdom',
  'Disney Springs'
]

const DINING_OPTIONS = [
  'Character Dining',
  'Quick Service',
  'Signature Dining',
  'Snack Crawl',
  'No Set Plan'
]

const DAY_TYPES = [
  { value: 'Park', icon: `${IMG_BASE}day-type-icons/park.svg` },
  { value: 'Swimming', icon: `${IMG_BASE}day-type-icons/swimming.svg` },
  { value: 'Hotel/Shopping', icon: `${IMG_BASE}day-type-icons/hotel-shopping.svg` },
  { value: 'Travel', icon: `${IMG_BASE}day-type-icons/travel.svg` }
]

const SWIM_OPTIONS = [
  { value: "Disney's Typhoon Lagoon Water Park", icon: `${IMG_BASE}swim-icons/typhoon-lagoon.svg` },
  { value: "Disney's Blizzard Beach Water Park", icon: `${IMG_BASE}swim-icons/blizzard-beach.svg` }
]

const DISNEY_HOTELS = [
  "Disney's Contemporary Resort",
  "Disney's Grand Floridian Resort & Spa",
  "Disney's Polynesian Village Resort",
  "Disney's Wilderness Lodge",
  "Disney's Animal Kingdom Lodge",
  "Disney's Yacht Club Resort",
  "Disney's Beach Club Resort",
  "Disney's BoardWalk Inn",
  "Disney's Coronado Springs Resort",
  "Disney's Caribbean Beach Resort",
  "Disney's Port Orleans Resort - Riverside",
  "Disney's Port Orleans Resort - French Quarter",
  "Disney's Pop Century Resort",
  "Disney's Art of Animation Resort",
  "Disney's All-Star Movies Resort",
  "Disney's All-Star Music Resort",
  "Disney's All-Star Sports Resort",
  "Disney's Saratoga Springs Resort & Spa",
  "Disney's Old Key West Resort",
  "Disney's Riviera Resort"
]
const EVENT_TYPES = [
  { value: 'Breakfast', theme: 'dining', requiresRestaurant: true },
  { value: 'Lunch', theme: 'dining', requiresRestaurant: true },
  { value: 'Dinner', theme: 'dining', requiresRestaurant: true },
  { value: 'Tea', theme: 'dining', requiresRestaurant: true },
  { value: 'Snack', theme: 'dining', requiresRestaurant: true },
  { value: 'Fireworks', theme: 'fireworks', requiresRestaurant: false },
  { value: 'Parade', theme: 'fireworks', requiresRestaurant: false },
  { value: 'Ride', theme: 'ride', requiresRestaurant: false },
  { value: 'Character Meet', theme: 'character', requiresRestaurant: false },
  { value: 'Pool Time', theme: 'nature', requiresRestaurant: false },
  { value: 'Shopping', theme: 'default', requiresRestaurant: false },
  { value: 'Travel Transfer', theme: 'default', requiresRestaurant: false }
]

const RESTAURANT_GROUPS = {
  'Magic Kingdom': [
    "Cinderella's Royal Table",
    'Be Our Guest Restaurant',
    'The Crystal Palace',
    'Liberty Tree Tavern',
    'The Diamond Horseshoe',
    'Jungle Navigation Co. LTD Skipper Canteen',
    "Tony's Town Square Restaurant",
    'The Plaza Restaurant',
    "Casey's Corner",
    'Columbia Harbour House',
    "Cosmic Ray's Starlight Cafe",
    "Pecos Bill Tall Tale Inn and Cafe"
  ],
  EPCOT: [
    'Space 220 Restaurant',
    'Le Cellier Steakhouse',
    'Chefs de France',
    'Monsieur Paul',
    'Rose and Crown Dining Room',
    'Spice Road Table',
    'Via Napoli Ristorante e Pizzeria',
    'Tutto Italia Ristorante',
    'Biergarten Restaurant',
    'Teppan Edo',
    'Shiki-Sai: Sushi Izakaya',
    'Coral Reef Restaurant',
    'Garden Grill Restaurant',
    'Akershus Royal Banquet Hall',
    'San Angel Inn Restaurante',
    'La Hacienda de San Angel',
    'Regal Eagle Smokehouse',
    'Connections Eatery'
  ],
  "Disney's Hollywood Studios": [
    "The Hollywood Brown Derby",
    "Roundup Rodeo BBQ",
    "50's Prime Time Cafe",
    'Sci-Fi Dine-In Theater Restaurant',
    "Oga's Cantina at the Walt Disney World Resort",
    'Docking Bay 7 Food and Cargo',
    'Ronto Roasters',
    "Woody's Lunch Box",
    'Hollywood and Vine',
    'ABC Commissary',
    'Backlot Express'
  ],
  "Disney's Animal Kingdom": [
    'Tiffins Restaurant',
    'Yak and Yeti Restaurant',
    'Tusker House Restaurant',
    "Satu'li Canteen",
    'Flame Tree Barbecue',
    'Restaurantosaurus',
    'Nomad Lounge'
  ],
  'Disney Springs': [
    'The BOATHOUSE',
    'Wine Bar George',
    'Morimoto Asia',
    "Chef Art Smith's Homecomin'",
    'Raglan Road Irish Pub and Restaurant',
    'Paddlefish',
    'Frontera Cocina',
    'Jaleo by Jose Andres',
    'STK Orlando',
    'City Works Eatery and Pour House',
    'Planet Hollywood',
    'Wolfgang Puck Bar and Grill'
  ],
  'Resort Dining': [
    "Chef Mickey's",
    "Topolino's Terrace - Flavors of the Riviera",
    "California Grill",
    'Steakhouse 71',
    'Boma - Flavors of Africa',
    'Jiko - The Cooking Place',
    'Sanaa',
    "Ohana",
    'Kona Cafe',
    "Capt. Cook's",
    'Grand Floridian Cafe',
    "Narcoossee's",
    "Citricos",
    'Victoria and Alberts',
    '1900 Park Fare',
    'Whispering Canyon Cafe',
    'Story Book Dining at Artist Point',
    'Geyser Point Bar and Grill',
    'Cape May Cafe',
    'Ale and Compass Restaurant',
    'Beaches and Cream Soda Shop',
    'Yachtsman Steakhouse',
    'Flying Fish',
    "Sebastian's Bistro",
    'Toledo - Tapas, Steak and Seafood',
    'Three Bridges Bar and Grill',
    'Trattoria al Forno'
  ]
}

const DISNEY_WORLD_BASE_URL = 'https://www.disneyworld.co.uk'

function getRestaurantResources(restaurantName) {
  const metadata = RESTAURANT_METADATA[restaurantName]
  if (metadata) return metadata

  const query = encodeURIComponent(restaurantName)
  const searchUrl = `${DISNEY_WORLD_BASE_URL}/search/?q=${query}`
  return {
    menuUrl: searchUrl,
    bookingUrl: searchUrl,
    heroImage: ''
  }
}

const DEFAULT_PLAN = {
  tripName: 'Our Disney Holiday',
  startDate: '',
  endDate: '',
  myHotel: '',
  adults: 2,
  children: 0,
  budget: 3500,
  priorities: ['Magic Kingdom'],
  diningStyle: 'Quick Service',
  notes: '',
  dayPlans: {},
  checklist: ['Park tickets', 'Resort booking', 'Genie+ plan']
}

const STORAGE_KEY = 'disney-holiday-planner'
const EVENT_BACKGROUNDS = {
  fireworks: `${IMG_BASE}fireworks.svg`,
  dining: `${IMG_BASE}dining.svg`,
  ride: `${IMG_BASE}rides.svg`,
  character: `${IMG_BASE}characters.svg`,
  nature: `${IMG_BASE}nature.svg`,
  default: `${IMG_BASE}magic.svg`
}

function normalizePlan(rawPlan) {
  const normalizedDayPlans = Object.entries(rawPlan.dayPlans || {}).reduce((acc, [date, dayPlan]) => {
    acc[date] = {
      dayType: dayPlan.dayType || '',
      park: dayPlan.park || '',
      secondPark: dayPlan.secondPark || '',
      parkHop: Boolean(dayPlan.parkHop),
      swimSpot: dayPlan.swimSpot || '',
      staySpot: dayPlan.staySpot || '',
      items: dayPlan.items || []
    }
    return acc
  }, {})

  return {
    ...DEFAULT_PLAN,
    ...rawPlan,
    priorities: rawPlan.priorities?.length ? rawPlan.priorities : DEFAULT_PLAN.priorities,
    checklist: rawPlan.checklist?.length ? rawPlan.checklist : DEFAULT_PLAN.checklist,
    dayPlans: normalizedDayPlans
  }
}

function getDateRange(startDate, endDate) {
  if (!startDate || !endDate) return []
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return []

  const dates = []
  const cursor = new Date(start)
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

function formatPrettyDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

function detectTheme(text) {
  const value = text.toLowerCase()

  if (
    value.includes('firework') ||
    value.includes('night show') ||
    value.includes('parade')
  ) {
    return 'fireworks'
  }
  if (value.includes('dining') || value.includes('restaurant') || value.includes('breakfast')) {
    return 'dining'
  }
  if (value.includes('ride') || value.includes('coaster') || value.includes('genie+')) {
    return 'ride'
  }
  if (value.includes('character') || value.includes('princess') || value.includes('meet')) {
    return 'character'
  }
  if (value.includes('trail') || value.includes('safari') || value.includes('animal')) {
    return 'nature'
  }

  return 'default'
}

function getEventTypeConfig(type) {
  return EVENT_TYPES.find((eventType) => eventType.value === type) || EVENT_TYPES[0]
}

function buildEventLabel(item) {
  if (item.type && item.restaurant) {
    return `${item.type} at ${item.restaurant}`
  }
  if (item.type && item.note) {
    return `${item.type}: ${item.note}`
  }
  if (item.type) return item.type
  return item.text || 'Event'
}

function normalizeEventItem(item) {
  if (item?.type) {
    return {
      type: item.type,
      restaurant: item.restaurant || '',
      customRestaurant: item.customRestaurant || '',
      menuUrl: item.menuUrl || '',
      bookingUrl: item.bookingUrl || '',
      heroImage: item.heroImage || '',
      note: item.note || '',
      theme: item.theme || getEventTypeConfig(item.type).theme
    }
  }

  const text = item?.text || ''
  return {
    type: '',
    restaurant: '',
    customRestaurant: '',
    menuUrl: '',
    bookingUrl: '',
    heroImage: '',
    note: text,
    theme: item?.theme || detectTheme(text),
    text
  }
}

const DAY_TYPE_BACKGROUNDS = {
  Park: `${IMG_BASE}day-park.svg`,
  Swimming: `${IMG_BASE}day-swimming.svg`,
  'Hotel/Shopping': `${IMG_BASE}day-hotel-shopping.svg`,
  Travel: `${IMG_BASE}day-travel.svg`
}

const PARK_TINTS = {
  'Magic Kingdom': 'rgba(103, 133, 246, 0.24)',
  EPCOT: 'rgba(0, 154, 199, 0.2)',
  "Disney's Hollywood Studios": 'rgba(250, 127, 111, 0.22)',
  "Disney's Animal Kingdom": 'rgba(78, 167, 119, 0.22)',
  'Disney Springs': 'rgba(167, 118, 208, 0.2)'
}

const PARK_LOGO_BACKGROUNDS = {
  'Magic Kingdom': `${IMG_BASE}park-logos/magic-kingdom.svg`,
  EPCOT: `${IMG_BASE}park-logos/epcot.svg`,
  "Disney's Hollywood Studios": `${IMG_BASE}park-logos/hollywood-studios.svg`,
  "Disney's Animal Kingdom": `${IMG_BASE}park-logos/animal-kingdom.svg`,
  'Disney Springs': `${IMG_BASE}park-logos/disney-springs.svg`
}

const PARK_BADGE_ICONS = {
  'Magic Kingdom': `${IMG_BASE}park-icons/magic-kingdom.svg`,
  EPCOT: `${IMG_BASE}park-icons/epcot.svg`,
  "Disney's Hollywood Studios": `${IMG_BASE}park-icons/hollywood-studios.svg`,
  "Disney's Animal Kingdom": `${IMG_BASE}park-icons/animal-kingdom.svg`,
  'Disney Springs': `${IMG_BASE}park-icons/disney-springs.svg`
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

function getLocationDisplay(dayPlan, myHotel) {
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

function getDayTypeChipColor(dayType) {
  if (dayType === 'Park') return 'rgba(0, 87, 184, 0.2)'
  if (dayType === 'Swimming') return 'rgba(0, 157, 200, 0.2)'
  if (dayType === 'Hotel/Shopping') return 'rgba(144, 109, 201, 0.24)'
  if (dayType === 'Travel') return 'rgba(92, 134, 201, 0.22)'
  return 'rgba(0, 87, 184, 0.14)'
}

function hashtagLabel(value) {
  return value ? `#${value.replace(/\s+/g, '')}` : '#Choose'
}

function getDayCardStyle(dayPlan) {
  const dayTypeImage = DAY_TYPE_BACKGROUNDS[dayPlan.dayType] || DAY_TYPE_BACKGROUNDS.Park
  let tint = 'rgba(0, 87, 184, 0.14)'
  let tintOverlay = `linear-gradient(135deg, ${tint}, ${tint})`
  let logo = ''
  let logo2 = ''

  if (dayPlan.dayType === 'Park' && dayPlan.park) {
    const firstTint = PARK_TINTS[dayPlan.park] || tint
    tint = firstTint
    tintOverlay = `linear-gradient(135deg, ${firstTint}, ${firstTint})`
    logo = PARK_LOGO_BACKGROUNDS[dayPlan.park] || ''

    if (dayPlan.parkHop && dayPlan.secondPark) {
      const secondTint = PARK_TINTS[dayPlan.secondPark] || firstTint
      tintOverlay = `linear-gradient(135deg, ${firstTint} 0 49%, ${secondTint} 51% 100%)`
      logo2 = PARK_LOGO_BACKGROUNDS[dayPlan.secondPark] || ''
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
    '--day-bg-image': `url(${dayTypeImage})`,
    '--day-tint': tint,
    '--day-tint-overlay': tintOverlay,
    '--park-logo-image': logo ? `url(${logo})` : 'none',
    '--park-logo-image-2': logo2 ? `url(${logo2})` : 'none'
  }
}

function getDayTypeIcon(dayType) {
  const match = DAY_TYPES.find((type) => type.value === dayType)
  return match?.icon || ''
}

function getSecondParkOptions(firstPark) {
  return PARK_OPTIONS.filter((park) => park !== firstPark)
}

function App() {
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_PLAN

    try {
      return normalizePlan(JSON.parse(saved))
    } catch {
      return DEFAULT_PLAN
    }
  })

  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [draftDayItems, setDraftDayItems] = useState({})

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
  }, [plan])

  const tripDates = useMemo(() => {
    return getDateRange(plan.startDate, plan.endDate)
  }, [plan.startDate, plan.endDate])

  const tripLength = tripDates.length || null

  useEffect(() => {
    setPlan((current) => {
      const currentPlans = current.dayPlans || {}
      const nextDayPlans = {}
      let hasChanges = Object.keys(currentPlans).length !== tripDates.length

      tripDates.forEach((date) => {
        if (currentPlans[date]) {
          nextDayPlans[date] = {
            dayType: currentPlans[date].dayType || '',
            park: currentPlans[date].park || '',
            secondPark: currentPlans[date].secondPark || '',
            parkHop: Boolean(currentPlans[date].parkHop),
            swimSpot: currentPlans[date].swimSpot || '',
            staySpot: currentPlans[date].staySpot || '',
            items: currentPlans[date].items || []
          }
        } else {
          hasChanges = true
          nextDayPlans[date] = {
            dayType: '',
            park: '',
            secondPark: '',
            parkHop: false,
            swimSpot: '',
            staySpot: '',
            items: []
          }
        }
      })

      if (!hasChanges) return current
      return { ...current, dayPlans: nextDayPlans }
    })
  }, [tripDates])

  const updateField = (field, value) => {
    setPlan((current) => ({ ...current, [field]: value }))
  }

  const togglePriority = (park) => {
    setPlan((current) => {
      const exists = current.priorities.includes(park)
      const priorities = exists
        ? current.priorities.filter((item) => item !== park)
        : [...current.priorities, park]

      return { ...current, priorities }
    })
  }

  const updateDayPlan = (date, key, value) => {
    setPlan((current) => {
      const currentDay = current.dayPlans?.[date]
      if (!currentDay) return current

      return {
        ...current,
        dayPlans: {
          ...current.dayPlans,
          [date]: {
            ...currentDay,
            [key]: value
          }
        }
      }
    })
  }

  const addDayItem = (date) => {
    const draft = draftDayItems[date] || {
      type: 'Fireworks',
      restaurant: '',
      customRestaurant: '',
      note: ''
    }
    const eventType = getEventTypeConfig(draft.type)
    const restaurant =
      draft.restaurant === '__custom__'
        ? (draft.customRestaurant || '').trim()
        : (draft.restaurant || '').trim()
    const note = (draft.note || '').trim()
    const restaurantResources = restaurant ? getRestaurantResources(restaurant) : null

    if (eventType.requiresRestaurant && !restaurant) return
    if (!eventType.requiresRestaurant && !note && !draft.type) return

    setPlan((current) => ({
      ...current,
      dayPlans: {
        ...current.dayPlans,
        [date]: {
          ...current.dayPlans[date],
          items: [
            ...(current.dayPlans[date]?.items || []),
            {
              type: draft.type,
              restaurant,
              customRestaurant: draft.restaurant === '__custom__' ? restaurant : '',
              menuUrl: restaurantResources?.menuUrl || '',
              bookingUrl: restaurantResources?.bookingUrl || '',
              heroImage: restaurantResources?.heroImage || '',
              note,
              theme: eventType.theme
            }
          ]
        }
      }
    }))
    setDraftDayItems((current) => ({
      ...current,
      [date]: { type: draft.type, restaurant: '', customRestaurant: '', note: '' }
    }))
  }

  const removeDayItem = (date, itemIndex) => {
    setPlan((current) => ({
      ...current,
      dayPlans: {
        ...current.dayPlans,
        [date]: {
          ...current.dayPlans[date],
          items: (current.dayPlans[date]?.items || []).filter((_, idx) => idx !== itemIndex)
        }
      }
    }))
  }

  const clearDayType = (date) => {
    updateDayPlan(date, 'dayType', '')
  }

  const clearPark = (date) => {
    setPlan((current) => ({
      ...current,
      dayPlans: {
        ...current.dayPlans,
        [date]: {
          ...current.dayPlans[date],
          park: '',
          secondPark: '',
          parkHop: false
        }
      }
    }))
  }

  const clearSwimSpot = (date) => {
    updateDayPlan(date, 'swimSpot', '')
  }

  const clearStaySpot = (date) => {
    updateDayPlan(date, 'staySpot', '')
  }

  const resetDay = (date) => {
    setPlan((current) => {
      const currentDay = current.dayPlans?.[date]
      if (!currentDay) return current

      return {
        ...current,
        dayPlans: {
          ...current.dayPlans,
          [date]: {
            ...currentDay,
            dayType: '',
            park: '',
            secondPark: '',
            parkHop: false,
            swimSpot: '',
            staySpot: '',
            items: []
          }
        }
      }
    })

    setDraftDayItems((current) => ({
      ...current,
      [date]: { type: 'Fireworks', restaurant: '', customRestaurant: '', note: '' }
    }))
  }

  const setDayType = (date, dayType) => {
    setPlan((current) => {
      const currentDay = current.dayPlans?.[date]
      if (!currentDay) return current

      return {
        ...current,
        dayPlans: {
          ...current.dayPlans,
          [date]: {
            ...currentDay,
            dayType,
            park: '',
            secondPark: '',
            parkHop: false,
            swimSpot: '',
            staySpot: ''
          }
        }
      }
    })
  }

  const addChecklistItem = () => {
    const item = newChecklistItem.trim()
    if (!item) return

    setPlan((current) => ({
      ...current,
      checklist: [...current.checklist, item]
    }))
    setNewChecklistItem('')
  }

  const removeChecklistItem = (index) => {
    setPlan((current) => ({
      ...current,
      checklist: current.checklist.filter((_, itemIndex) => itemIndex !== index)
    }))
  }

  const resetPlan = () => {
    setPlan(DEFAULT_PLAN)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <p className="eyebrow">Disney World-Inspired Holiday Tool</p>
        <h1>{plan.tripName}</h1>
        <p className="subtitle">
          Build your park days, spending target, and must-do list in one place.
        </p>
      </header>

      <main className="planner-grid">
        <section className="card">
          <h2>Trip Basics</h2>
          <label>
            Trip name
            <input
              value={plan.tripName}
              onChange={(event) => updateField('tripName', event.target.value)}
              placeholder="Magical Family Getaway"
            />
          </label>

          <label>
            My hotel
            <input
              list="hotel-list"
              value={plan.myHotel}
              onChange={(event) => updateField('myHotel', event.target.value)}
              placeholder="Type or pick your Disney hotel"
            />
          </label>
          <datalist id="hotel-list">
            {DISNEY_HOTELS.map((hotel) => (
              <option key={hotel} value={hotel} />
            ))}
          </datalist>

          <div className="inline-fields">
            <label>
              Start
              <input
                type="date"
                value={plan.startDate}
                onChange={(event) => updateField('startDate', event.target.value)}
              />
            </label>
            <label>
              End
              <input
                type="date"
                value={plan.endDate}
                onChange={(event) => updateField('endDate', event.target.value)}
              />
            </label>
          </div>

          <div className="inline-fields">
            <label>
              Adults
              <input
                type="number"
                min="1"
                value={plan.adults}
                onChange={(event) => updateField('adults', Number(event.target.value))}
              />
            </label>
            <label>
              Children
              <input
                type="number"
                min="0"
                value={plan.children}
                onChange={(event) => updateField('children', Number(event.target.value))}
              />
            </label>
          </div>

          <label>
            Holiday budget (GBP)
            <input
              type="number"
              min="0"
              step="50"
              value={plan.budget}
              onChange={(event) => updateField('budget', Number(event.target.value))}
            />
          </label>

          <div className="summary-row">
            <span>Length</span>
            <strong>{tripLength ? `${tripLength} day${tripLength > 1 ? 's' : ''}` : 'Pick dates'}</strong>
          </div>
        </section>

        <section className="card">
          <h2>Parks and Dining</h2>
          <p className="section-hint">Tap your top parks.</p>
          <div className="chip-row">
            {PARK_OPTIONS.map((park) => (
              <button
                key={park}
                type="button"
                className={plan.priorities.includes(park) ? 'chip selected' : 'chip'}
                onClick={() => togglePriority(park)}
              >
                {park}
              </button>
            ))}
          </div>

          <label>
            Dining style
            <select
              value={plan.diningStyle}
              onChange={(event) => updateField('diningStyle', event.target.value)}
            >
              {DINING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            Extra notes
            <textarea
              rows="4"
              value={plan.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Parades, fireworks, room requests, transport ideas..."
            />
          </label>
        </section>

        <section className="card card-wide">
          <div className="card-title-row day-header">
            <h2>Daily Plan by Date</h2>
            <span className="section-hint">Date range auto-builds each day section.</span>
          </div>

          {!tripDates.length && (
            <p className="section-hint">Set your start and end date to unlock daily planning cards.</p>
          )}

          <div className="date-plan-grid">
            {tripDates.map((date, index) => {
              const dayPlan = plan.dayPlans?.[date] || {
                dayType: '',
                park: '',
                secondPark: '',
                parkHop: false,
                swimSpot: '',
                staySpot: '',
                items: []
              }
              const hotelShoppingOptions = [
                ...(plan.myHotel.trim()
                  ? [{ value: plan.myHotel.trim(), label: `My hotel: ${plan.myHotel.trim()}` }]
                  : []),
                { value: 'Disney Springs', label: 'Disney Springs' },
                ...DISNEY_HOTELS
                  .filter((hotel) => hotel !== plan.myHotel.trim())
                  .map((hotel) => ({ value: hotel, label: hotel }))
              ]
              const draft = draftDayItems[date] || {
                type: 'Fireworks',
                restaurant: '',
                customRestaurant: '',
                note: ''
              }
              const selectedEventType = getEventTypeConfig(draft.type)
              const locationDisplay = getLocationDisplay(dayPlan, plan.myHotel.trim())
              const dayTypeChipColor = getDayTypeChipColor(dayPlan.dayType)
              const secondParkOptions = getSecondParkOptions(dayPlan.park)

              return (
                <article key={date} className="date-card" style={getDayCardStyle(dayPlan)}>
                  <div className="card-badges">
                    {dayPlan.dayType && (
                      <button
                        type="button"
                        className="day-type-badge"
                        onClick={() => clearDayType(date)}
                        title="Remove day type"
                      >
                        <img src={getDayTypeIcon(dayPlan.dayType)} alt={dayPlan.dayType} />
                      </button>
                    )}
                    {locationDisplay && (
                      <button
                        type="button"
                        className="day-type-badge"
                        onClick={() => {
                          if (dayPlan.dayType === 'Park') clearPark(date)
                          if (dayPlan.dayType === 'Swimming') clearSwimSpot(date)
                          if (dayPlan.dayType === 'Hotel/Shopping') clearStaySpot(date)
                        }}
                        title={`Remove ${locationDisplay.label}`}
                      >
                        <img src={locationDisplay.icon} alt={locationDisplay.label} />
                      </button>
                    )}
                  </div>
                  <div className="date-card-head">
                    <div className="date-title-row">
                      <h3>Day {index + 1}</h3>
                    </div>
                    <p>{formatPrettyDate(date)}</p>
                    {dayPlan.dayType && (
                      <div className="day-summary-group">
                        <span
                          className="day-summary-pill day-summary-type"
                          style={{ '--chip-color': dayTypeChipColor }}
                        >
                          {hashtagLabel(dayPlan.dayType)}
                        </span>
                        {dayPlan.dayType === 'Park' && dayPlan.parkHop && (
                          <span
                            className="day-summary-pill day-summary-type"
                            style={{ '--chip-color': dayTypeChipColor }}
                          >
                            {hashtagLabel('ParkHop')}
                          </span>
                        )}
                        <span
                          className="day-summary-pill day-summary-location"
                          style={{ '--chip-color': dayTypeChipColor }}
                        >
                          {hashtagLabel(dayPlan.parkHop && dayPlan.dayType === 'Park'
                            ? dayPlan.park || 'Choose first park'
                            : locationDisplay
                              ? locationDisplay.label.replace(/^My hotel:\s*/i, '')
                              : 'Choose location')}
                        </span>
                        {dayPlan.dayType === 'Park' && dayPlan.parkHop && (
                          <span
                            className="day-summary-pill day-summary-location"
                            style={{ '--chip-color': dayTypeChipColor }}
                          >
                            {hashtagLabel(dayPlan.secondPark || 'Choose second park')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="day-form-stack">
                    <div className="day-meta-row">
                      {!dayPlan.dayType && (
                        <label className="field-compact">
                          Day type
                          <select
                            value={dayPlan.dayType}
                            onChange={(event) => setDayType(date, event.target.value)}
                          >
                            <option value="">Select day type</option>
                            {DAY_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.value}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      {dayPlan.dayType === 'Park' && !dayPlan.park && (
                        <label className="field-compact">
                          Park
                          <select
                            value={dayPlan.park}
                            onChange={(event) => {
                              const selectedPark = event.target.value
                              setPlan((current) => {
                                const currentDay = current.dayPlans?.[date]
                                if (!currentDay) return current

                                const nextSecondPark =
                                  currentDay.secondPark === selectedPark ? '' : currentDay.secondPark

                                return {
                                  ...current,
                                  dayPlans: {
                                    ...current.dayPlans,
                                    [date]: {
                                      ...currentDay,
                                      park: selectedPark,
                                      secondPark: nextSecondPark
                                    }
                                  }
                                }
                              })
                            }}
                          >
                            <option value="">Select park</option>
                            {PARK_OPTIONS.map((park) => (
                              <option key={park} value={park}>
                                {park}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      {dayPlan.dayType === 'Park' && dayPlan.park && dayPlan.parkHop && (
                        <label className="field-compact">
                          Hop to
                          <select
                            value={dayPlan.secondPark}
                            onChange={(event) => updateDayPlan(date, 'secondPark', event.target.value)}
                          >
                            <option value="">Select second park</option>
                            {secondParkOptions.map((park) => (
                              <option key={park} value={park}>
                                {park}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      {dayPlan.dayType === 'Swimming' && !dayPlan.swimSpot && (
                        <label className="field-compact">
                          Swim park
                          <select
                            value={dayPlan.swimSpot}
                            onChange={(event) => updateDayPlan(date, 'swimSpot', event.target.value)}
                          >
                            <option value="">Select water park</option>
                            {SWIM_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.value}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      {dayPlan.dayType === 'Hotel/Shopping' && !dayPlan.staySpot && (
                        <label className="field-compact">
                          Hotel / shopping location
                          <select
                            value={dayPlan.staySpot}
                            onChange={(event) => updateDayPlan(date, 'staySpot', event.target.value)}
                          >
                            <option value="">Select location</option>
                            {hotelShoppingOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="event-builder">
                    <div className="day-meta-row">
                      <label className="field-compact">
                        Event type
                        <select
                          value={draft.type}
                          onChange={(event) =>
                            setDraftDayItems((current) => ({
                              ...current,
                              [date]: {
                                type: event.target.value,
                                restaurant: '',
                                customRestaurant: '',
                                note: current[date]?.note || ''
                              }
                            }))
                          }
                        >
                          {EVENT_TYPES.map((eventType) => (
                            <option key={eventType.value} value={eventType.value}>
                              {eventType.value}
                            </option>
                          ))}
                        </select>
                      </label>

                      {selectedEventType.requiresRestaurant ? (
                        <label className="field-compact">
                          Restaurant
                          <select
                            value={draft.restaurant}
                            onChange={(event) =>
                              setDraftDayItems((current) => ({
                                ...current,
                                [date]: {
                                  ...draft,
                                  restaurant: event.target.value,
                                  customRestaurant:
                                    event.target.value === '__custom__'
                                      ? current[date]?.customRestaurant || ''
                                      : ''
                                }
                              }))
                            }
                          >
                            <option value="">Choose restaurant</option>
                            {Object.entries(RESTAURANT_GROUPS).map(([group, restaurants]) => (
                              <optgroup key={group} label={group}>
                                {restaurants.map((restaurant) => (
                                  <option key={restaurant} value={restaurant}>
                                    {restaurant}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                            <option value="__custom__">Other (type manually)</option>
                          </select>
                        </label>
                      ) : (
                        <label className="field-compact">
                          Notes
                          <input
                            value={draft.note}
                            onChange={(event) =>
                              setDraftDayItems((current) => ({
                                ...current,
                                [date]: { ...draft, note: event.target.value }
                              }))
                            }
                            placeholder="Optional details"
                          />
                        </label>
                      )}
                    </div>
                    {selectedEventType.requiresRestaurant && draft.restaurant === '__custom__' && (
                      <label className="field-compact">
                        Custom restaurant
                        <input
                          value={draft.customRestaurant}
                          onChange={(event) =>
                            setDraftDayItems((current) => ({
                              ...current,
                              [date]: { ...draft, customRestaurant: event.target.value }
                            }))
                          }
                          placeholder="Type restaurant name"
                        />
                      </label>
                    )}

                    <div className="event-action-row">
                      <button type="button" className="action action-compact" onClick={() => addDayItem(date)}>
                        Add event
                      </button>
                    </div>
                  </div>

                  <div className="event-list">
                    {!dayPlan.items?.length && (
                      <p className="event-empty">No events yet for this day.</p>
                    )}
                    {dayPlan.items?.map((item, itemIndex) => {
                      const normalizedItem = normalizeEventItem(item)
                      const label = buildEventLabel(normalizedItem)
                      const menuUrl = normalizedItem.menuUrl
                      const bookingUrl = normalizedItem.bookingUrl
                      const hasRestaurantLinks = Boolean(
                        normalizedItem.restaurant && (menuUrl || bookingUrl)
                      )
                      const fallbackEventImage =
                        EVENT_BACKGROUNDS[normalizedItem.theme] || EVENT_BACKGROUNDS.default
                      const eventBackgroundLayers = normalizedItem.heroImage
                        ? `url(${normalizedItem.heroImage}), url(${fallbackEventImage})`
                        : `url(${fallbackEventImage})`
                      return (
                        <div
                          key={`${label}-${itemIndex}`}
                          className="event-tile"
                          style={{
                            '--event-image': eventBackgroundLayers
                          }}
                        >
                          <div className="event-content">
                            <div className="event-text">
                              <p>{label}</p>
                              {hasRestaurantLinks && (
                                <div className="event-links">
                                  {menuUrl && (
                                    <a href={menuUrl} target="_blank" rel="noreferrer noopener">
                                      View menu
                                    </a>
                                  )}
                                  {bookingUrl && (
                                    <a href={bookingUrl} target="_blank" rel="noreferrer noopener">
                                      Book
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                            <button type="button" onClick={() => removeDayItem(date, itemIndex)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="park-hop-dock">
                    <button
                      type="button"
                      className={dayPlan.dayType === 'Park' ? 'park-hop-btn' : 'park-hop-btn disabled'}
                      onClick={() => {
                        if (dayPlan.dayType !== 'Park') return
                        setPlan((current) => {
                          const currentDay = current.dayPlans?.[date]
                          if (!currentDay) return current
                          const nextHop = !currentDay.parkHop
                          return {
                            ...current,
                            dayPlans: {
                              ...current.dayPlans,
                              [date]: {
                                ...currentDay,
                                parkHop: nextHop,
                                secondPark: nextHop ? currentDay.secondPark : ''
                              }
                            }
                          }
                        })
                      }}
                    >
                      {dayPlan.parkHop ? 'Remove park hop' : 'Park hop'}
                    </button>
                    <button
                      type="button"
                      className="park-hop-btn reset-day-btn"
                      onClick={() => resetDay(date)}
                    >
                      Reset day
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="card">
          <h2>Checklist</h2>
          <div className="inline-fields">
            <input
              value={newChecklistItem}
              onChange={(event) => setNewChecklistItem(event.target.value)}
              placeholder="Add task"
            />
            <button type="button" className="action" onClick={addChecklistItem}>
              Add
            </button>
          </div>

          <ul className="checklist">
            {plan.checklist.map((item, index) => (
              <li key={`${item}-${index}`}>
                <span>{item}</span>
                <button type="button" onClick={() => removeChecklistItem(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer-bar">
        <p>Saved automatically in your browser.</p>
        <button type="button" className="danger" onClick={resetPlan}>
          Reset planner
        </button>
      </footer>
    </div>
  )
}

export default App

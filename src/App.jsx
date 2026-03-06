import { useEffect, useMemo, useState } from 'react'
import { RESTAURANT_METADATA } from './data/restaurantMetadata'
import { getParkSuggestions, fetchLiveParkShows } from './data/parkSuggestions.js'
import { fuzzyMatch } from './utils.js'

const IMG_BASE = `${import.meta.env.BASE_URL}images/`

const PARK_OPTIONS = [
  'Magic Kingdom',
  'EPCOT',
  'Disney\'s Hollywood Studios',
  'Disney\'s Animal Kingdom',
  'Disney Springs'
]

const DINING_OPTIONS = [
  'No dining plan',
  'Quick service dining plan',
  'Table service dining plan'
]

const ENTERTAINMENT_TYPES = [
  { tag: '#fireworks',    label: 'Fireworks & Spectaculars' },
  { tag: '#parade',       label: 'Parades'                  },
  { tag: '#meetandgreet', label: 'Character Meet & Greets'  },
  { tag: '#adventure',    label: 'Stunts & Adventure'       },
  { tag: '#nature',       label: 'Nature & Wildlife'        },
  { tag: '#princess',     label: 'Princess Experiences'     },
]

const FRANCHISE_OPTIONS = [
  // Disney Animation
  { tag: '#frozen',            label: 'Frozen'               },
  { tag: '#lionking',          label: 'The Lion King'        },
  { tag: '#moana',             label: 'Moana'                },
  { tag: '#tangled',           label: 'Tangled'              },
  { tag: '#aladdin',           label: 'Aladdin'              },
  { tag: '#littlemermaid',     label: 'The Little Mermaid'   },
  { tag: '#beautyandthebeast', label: 'Beauty & the Beast'   },
  { tag: '#liloandstitch',     label: 'Lilo & Stitch'        },
  { tag: '#mulan',             label: 'Mulan'                },
  { tag: '#cinderella',        label: 'Cinderella'           },
  { tag: '#snowwhite',         label: 'Snow White'           },
  { tag: '#brave',             label: 'Brave'                },
  // Pixar
  { tag: '#toystory',          label: 'Toy Story'            },
  { tag: '#findingnemo',       label: 'Finding Nemo'         },
  { tag: '#up',                label: 'Up'                   },
  { tag: '#incredibles',       label: 'The Incredibles'      },
  { tag: '#coco',              label: 'Coco'                 },
  { tag: '#monsters',          label: 'Monsters, Inc.'       },
  { tag: '#insideout',         label: 'Inside Out'           },
  // Marvel
  { tag: '#spiderman',              label: 'Spider-Man'              },
  { tag: '#guardiansofthegalaxy',   label: 'Guardians of the Galaxy' },
  { tag: '#blackpanther',           label: 'Black Panther'           },
  { tag: '#thor',                   label: 'Thor'                    },
  // Star Wars & Classics
  { tag: '#starwars',          label: 'Star Wars'            },
  { tag: '#indianajones',      label: 'Indiana Jones'        },
  { tag: '#muppets',           label: 'The Muppets'          },
  { tag: '#pooh',              label: 'Winnie the Pooh'      },
  { tag: '#figment',           label: 'Figment'              },
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

const RIDES_BY_PARK = {
  'Magic Kingdom': [
    'TRON Lightcycle / Run',
    'Seven Dwarfs Mine Train',
    'Space Mountain',
    'Big Thunder Mountain Railroad',
    "Pirates of the Caribbean",
    'Haunted Mansion',
    'Peter Pan’s Flight',
    "Tiana's Bayou Adventure",
    'Jungle Cruise'
  ],
  EPCOT: [
    'Guardians of the Galaxy: Cosmic Rewind',
    'Test Track',
    'Frozen Ever After',
    'Remys Ratatouille Adventure',
    'Soarin Around the World',
    'Mission: SPACE',
    'Spaceship Earth'
  ],
  "Disney's Hollywood Studios": [
    'Star Wars: Rise of the Resistance',
    'Millennium Falcon: Smugglers Run',
    'Slinky Dog Dash',
    'Tower of Terror',
    'Rock n Roller Coaster',
    'Mickey and Minnies Runaway Railway',
    'Toy Story Mania'
  ],
  "Disney's Animal Kingdom": [
    'Avatar Flight of Passage',
    'Na vi River Journey',
    'Expedition Everest',
    'Kilimanjaro Safaris',
    "Kali River Rapids",
    "DINOSAUR"
  ],
  'Disney Springs': ['Aerophile - The World Leader in Balloon Flight']
}

const DW_ATTRACTIONS = 'https://disneyworld.disney.go.com/attractions'
const RIDE_URLS = {
  // Magic Kingdom
  'TRON Lightcycle / Run':              `${DW_ATTRACTIONS}/magic-kingdom/tron-lightcycle-run/`,
  'Seven Dwarfs Mine Train':            `${DW_ATTRACTIONS}/magic-kingdom/seven-dwarfs-mine-train/`,
  'Space Mountain':                     `${DW_ATTRACTIONS}/magic-kingdom/space-mountain/`,
  'Big Thunder Mountain Railroad':      `${DW_ATTRACTIONS}/magic-kingdom/big-thunder-mountain-railroad/`,
  'Pirates of the Caribbean':           `${DW_ATTRACTIONS}/magic-kingdom/pirates-of-the-caribbean/`,
  'Haunted Mansion':                    `${DW_ATTRACTIONS}/magic-kingdom/haunted-mansion/`,
  "Peter Pan\u2019s Flight":            `${DW_ATTRACTIONS}/magic-kingdom/peter-pans-flight/`,
  "Tiana's Bayou Adventure":            `${DW_ATTRACTIONS}/magic-kingdom/tianas-bayou-adventure/`,
  'Jungle Cruise':                      `${DW_ATTRACTIONS}/magic-kingdom/jungle-cruise/`,
  // EPCOT
  'Guardians of the Galaxy: Cosmic Rewind': `${DW_ATTRACTIONS}/epcot/guardians-of-the-galaxy-cosmic-rewind/`,
  'Test Track':                         `${DW_ATTRACTIONS}/epcot/test-track/`,
  'Frozen Ever After':                  `${DW_ATTRACTIONS}/epcot/frozen-ever-after/`,
  'Remys Ratatouille Adventure':        `${DW_ATTRACTIONS}/epcot/remys-ratatouille-adventure/`,
  'Soarin Around the World':            `${DW_ATTRACTIONS}/epcot/soarin/`,
  'Mission: SPACE':                     `${DW_ATTRACTIONS}/epcot/mission-space/`,
  'Spaceship Earth':                    `${DW_ATTRACTIONS}/epcot/spaceship-earth/`,
  // Hollywood Studios
  'Star Wars: Rise of the Resistance':  `${DW_ATTRACTIONS}/hollywood-studios/star-wars-rise-of-the-resistance/`,
  'Millennium Falcon: Smugglers Run':   `${DW_ATTRACTIONS}/hollywood-studios/millennium-falcon-smugglers-run/`,
  'Slinky Dog Dash':                    `${DW_ATTRACTIONS}/hollywood-studios/slinky-dog-dash/`,
  'Tower of Terror':                    `${DW_ATTRACTIONS}/hollywood-studios/the-twilight-zone-tower-of-terror/`,
  'Rock n Roller Coaster':              `${DW_ATTRACTIONS}/hollywood-studios/rock-n-roller-coaster-starring-aerosmith/`,
  'Mickey and Minnies Runaway Railway': `${DW_ATTRACTIONS}/hollywood-studios/mickey-minnies-runaway-railway/`,
  'Toy Story Mania':                    `${DW_ATTRACTIONS}/hollywood-studios/toy-story-mania/`,
  // Animal Kingdom
  'Avatar Flight of Passage':           `${DW_ATTRACTIONS}/animal-kingdom/avatar-flight-of-passage/`,
  'Na vi River Journey':                `${DW_ATTRACTIONS}/animal-kingdom/navi-river-journey/`,
  'Expedition Everest':                 `${DW_ATTRACTIONS}/animal-kingdom/expedition-everest-legend-of-the-forbidden-mountain/`,
  'Kilimanjaro Safaris':                `${DW_ATTRACTIONS}/animal-kingdom/kilimanjaro-safaris/`,
  'Kali River Rapids':                  `${DW_ATTRACTIONS}/animal-kingdom/kali-river-rapids/`,
  'DINOSAUR':                           `${DW_ATTRACTIONS}/animal-kingdom/dinosaur/`,
}

const RIDES_IMG = `${IMG_BASE}rides/`
const RIDE_IMAGES = {
  // Magic Kingdom
  'TRON Lightcycle / Run':              `${RIDES_IMG}tron.jpg`,
  'Seven Dwarfs Mine Train':            `${RIDES_IMG}seven-dwarfs-mine-train.jpg`,
  'Space Mountain':                     `${RIDES_IMG}space-mountain.jpg`,
  'Big Thunder Mountain Railroad':      `${RIDES_IMG}big-thunder-mountain.jpg`,
  'Pirates of the Caribbean':           `${RIDES_IMG}pirates-of-the-caribbean.jpg`,
  'Haunted Mansion':                    `${RIDES_IMG}haunted-mansion.jpg`,
  "Peter Pan\u2019s Flight":            `${RIDES_IMG}peter-pans-flight.jpg`,
  "Tiana's Bayou Adventure":            `${RIDES_IMG}tianas-bayou-adventure.jpg`,
  'Jungle Cruise':                      `${RIDES_IMG}jungle-cruise.jpg`,
  // EPCOT
  'Guardians of the Galaxy: Cosmic Rewind': `${RIDES_IMG}guardians-cosmic-rewind.jpg`,
  'Test Track':                         `${RIDES_IMG}test-track.jpg`,
  'Frozen Ever After':                  `${RIDES_IMG}frozen-ever-after.jpg`,
  'Remys Ratatouille Adventure':        `${RIDES_IMG}remys-ratatouille-adventure.jpg`,
  'Soarin Around the World':            `${RIDES_IMG}soarin.jpg`,
  'Mission: SPACE':                     `${RIDES_IMG}mission-space.jpg`,
  'Spaceship Earth':                    `${RIDES_IMG}spaceship-earth.jpg`,
  // Hollywood Studios
  'Star Wars: Rise of the Resistance':  `${RIDES_IMG}star-wars-rise-of-the-resistance.jpg`,
  'Millennium Falcon: Smugglers Run':   `${RIDES_IMG}millennium-falcon-smugglers-run.jpg`,
  'Slinky Dog Dash':                    `${RIDES_IMG}slinky-dog-dash.jpg`,
  'Tower of Terror':                    `${RIDES_IMG}tower-of-terror.jpg`,
  'Rock n Roller Coaster':              `${RIDES_IMG}rock-n-roller-coaster.jpg`,
  'Mickey and Minnies Runaway Railway': `${RIDES_IMG}mickey-minnies-runaway-railway.jpg`,
  'Toy Story Mania':                    `${RIDES_IMG}toy-story-mania.jpg`,
  // Animal Kingdom
  'Avatar Flight of Passage':           `${RIDES_IMG}avatar-flight-of-passage.jpg`,
  'Na vi River Journey':                `${RIDES_IMG}navi-river-journey.jpg`,
  'Expedition Everest':                 `${RIDES_IMG}expedition-everest.jpg`,
  'Kilimanjaro Safaris':                `${RIDES_IMG}kilimanjaro-safaris.jpg`,
  'Kali River Rapids':                  `${RIDES_IMG}kali-river-rapids.jpg`,
  'DINOSAUR':                           `${RIDES_IMG}dinosaur.jpg`,
}

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

const ALL_RESTAURANTS = Object.values(RESTAURANT_GROUPS).flat()

// Dining style tags for search (e.g. "buffet", "character", "steakhouse")
const RESTAURANT_TAGS = {
  // Magic Kingdom
  "Cinderella's Royal Table":                       ['character', 'princess', 'fine dining', 'table service'],
  'Be Our Guest Restaurant':                         ['table service', 'character', 'french', 'beauty and the beast', 'fine dining'],
  'The Crystal Palace':                              ['buffet', 'character', 'family style'],
  'Liberty Tree Tavern':                             ['family style', 'american', 'table service'],
  'The Diamond Horseshoe':                           ['quick service', 'american'],
  'Jungle Navigation Co. LTD Skipper Canteen':       ['table service', 'american'],
  "Tony's Town Square Restaurant":                   ['table service', 'italian', 'pasta'],
  'The Plaza Restaurant':                            ['table service', 'american'],
  "Casey's Corner":                                  ['quick service', 'hot dogs'],
  'Columbia Harbour House':                          ['quick service', 'seafood'],
  "Cosmic Ray's Starlight Cafe":                     ['quick service', 'american'],
  'Pecos Bill Tall Tale Inn and Cafe':               ['quick service', 'american', 'mexican'],
  // EPCOT
  'Space 220 Restaurant':                            ['table service', 'american', 'fine dining'],
  'Le Cellier Steakhouse':                           ['table service', 'steakhouse', 'fine dining'],
  'Chefs de France':                                 ['table service', 'french'],
  'Monsieur Paul':                                   ['table service', 'french', 'fine dining'],
  'Rose and Crown Dining Room':                      ['table service', 'british', 'pub'],
  'Spice Road Table':                                ['table service', 'mediterranean'],
  'Via Napoli Ristorante e Pizzeria':                ['table service', 'italian', 'pizza'],
  'Tutto Italia Ristorante':                         ['table service', 'italian'],
  'Biergarten Restaurant':                           ['buffet', 'german', 'family style'],
  'Teppan Edo':                                      ['table service', 'japanese', 'hibachi', 'teppanyaki'],
  'Shiki-Sai: Sushi Izakaya':                        ['table service', 'japanese', 'sushi'],
  'Coral Reef Restaurant':                           ['table service', 'seafood'],
  'Garden Grill Restaurant':                         ['character', 'family style', 'table service', 'american'],
  'Akershus Royal Banquet Hall':                     ['character', 'buffet', 'norwegian', 'princess', 'family style'],
  'San Angel Inn Restaurante':                       ['table service', 'mexican'],
  'La Hacienda de San Angel':                        ['table service', 'mexican'],
  'Regal Eagle Smokehouse':                          ['quick service', 'bbq', 'american'],
  'Connections Eatery':                              ['quick service', 'american'],
  // Hollywood Studios
  'The Hollywood Brown Derby':                       ['table service', 'american', 'fine dining'],
  'Roundup Rodeo BBQ':                               ['table service', 'bbq', 'family style', 'american'],
  "50's Prime Time Cafe":                            ['table service', 'american', 'comfort food'],
  'Sci-Fi Dine-In Theater Restaurant':               ['table service', 'american'],
  "Oga's Cantina at the Walt Disney World Resort":   ['bar', 'star wars', 'quick service', 'cocktails'],
  'Docking Bay 7 Food and Cargo':                    ['quick service', 'star wars'],
  'Ronto Roasters':                                  ['quick service', 'star wars'],
  "Woody's Lunch Box":                               ['quick service', 'toy story'],
  'Hollywood and Vine':                              ['buffet', 'character', 'family style'],
  'ABC Commissary':                                  ['quick service', 'american'],
  'Backlot Express':                                 ['quick service', 'american'],
  // Animal Kingdom
  'Tiffins Restaurant':                              ['table service', 'fine dining', 'african', 'asian', 'indian'],
  'Yak and Yeti Restaurant':                         ['table service', 'asian', 'pan-asian'],
  'Tusker House Restaurant':                         ['buffet', 'character', 'family style', 'african'],
  "Satu'li Canteen":                                 ['quick service', 'avatar', 'american'],
  'Flame Tree Barbecue':                             ['quick service', 'bbq'],
  'Restaurantosaurus':                               ['quick service', 'american'],
  'Nomad Lounge':                                    ['bar', 'lounge', 'cocktails'],
  // Disney Springs
  'The BOATHOUSE':                                   ['table service', 'seafood', 'american'],
  'Wine Bar George':                                 ['bar', 'wine', 'tapas'],
  'Morimoto Asia':                                   ['table service', 'asian', 'japanese', 'fine dining'],
  "Chef Art Smith's Homecomin'":                     ['table service', 'american', 'southern'],
  'Raglan Road Irish Pub and Restaurant':             ['table service', 'irish', 'pub'],
  'Paddlefish':                                      ['table service', 'seafood'],
  'Frontera Cocina':                                 ['table service', 'mexican'],
  'Jaleo by Jose Andres':                            ['table service', 'spanish', 'tapas'],
  'STK Orlando':                                     ['table service', 'steakhouse', 'fine dining'],
  'City Works Eatery and Pour House':                ['bar', 'american'],
  'Planet Hollywood':                                ['table service', 'american'],
  'Wolfgang Puck Bar and Grill':                     ['table service', 'american', 'fine dining'],
  // Resort Dining
  "Chef Mickey's":                                   ['character', 'buffet', 'family style'],
  "Topolino's Terrace - Flavors of the Riviera":     ['character', 'french', 'italian', 'fine dining', 'table service'],
  'California Grill':                                ['table service', 'fine dining', 'american', 'sushi'],
  'Steakhouse 71':                                   ['table service', 'steakhouse', 'american'],
  'Boma - Flavors of Africa':                        ['buffet', 'african', 'family style'],
  'Jiko - The Cooking Place':                        ['table service', 'fine dining', 'african'],
  'Sanaa':                                           ['table service', 'indian', 'african'],
  'Ohana':                                           ['family style', 'character', 'hawaiian'],
  'Kona Cafe':                                       ['table service', 'asian', 'pacific rim'],
  "Capt. Cook's":                                    ['quick service', 'american'],
  'Grand Floridian Cafe':                            ['table service', 'american'],
  "Narcoossee's":                                    ['table service', 'seafood', 'fine dining'],
  'Citricos':                                        ['table service', 'fine dining', 'american'],
  'Victoria and Alberts':                            ['table service', 'fine dining', 'upscale'],
  '1900 Park Fare':                                  ['buffet', 'character', 'family style'],
  'Whispering Canyon Cafe':                          ['table service', 'american', 'bbq', 'family style'],
  'Story Book Dining at Artist Point':               ['character', 'table service', 'american'],
  'Geyser Point Bar and Grill':                      ['bar', 'american'],
  'Cape May Cafe':                                   ['buffet', 'seafood', 'character'],
  'Ale and Compass Restaurant':                      ['table service', 'american', 'seafood'],
  'Beaches and Cream Soda Shop':                     ['table service', 'american', 'dessert', 'ice cream'],
  'Yachtsman Steakhouse':                            ['table service', 'steakhouse', 'fine dining'],
  'Flying Fish':                                     ['table service', 'seafood', 'fine dining'],
  "Sebastian's Bistro":                              ['table service', 'caribbean'],
  'Toledo - Tapas, Steak and Seafood':               ['table service', 'tapas', 'steakhouse', 'seafood'],
  'Three Bridges Bar and Grill':                     ['bar', 'american'],
  'Trattoria al Forno':                              ['table service', 'italian', 'character'],
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
  diningStyle: 'No dining plan',
  notes: '',
  dayPlans: {},
  checklist: ['Park tickets', 'Resort booking', 'Genie+ plan']
}

const STORAGE_KEY = 'disney-holiday-planner'
const PROJECTS_KEY = 'disney-holiday-projects'

function generateId() {
  return `proj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function loadAllProjects() {
  const saved = localStorage.getItem(PROJECTS_KEY)
  if (saved) {
    try { return JSON.parse(saved) } catch { return {} }
  }
  // Migrate old single-plan format
  const old = localStorage.getItem(STORAGE_KEY)
  if (old) {
    try {
      const plan = normalizePlan(JSON.parse(old))
      const id = generateId()
      const projects = { [id]: { id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), plan } }
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
      localStorage.removeItem(STORAGE_KEY)
      return projects
    } catch { return {} }
  }
  return {}
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
      items: dayPlan.items || [],
      dismissedSuggestions: dayPlan.dismissedSuggestions || []
    }
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

function formatTime(time) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')}${period}`
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
      ride: item.ride || '',
      ridePark: item.ridePark || '',
      note: item.note || '',
      time: item.time || '',
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
    ride: '',
    ridePark: '',
    note: text,
    time: item?.time || '',
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

const PARKS_IMG = `${IMG_BASE}parks/`
const PARK_IMAGES = {
  'Magic Kingdom':              `${PARKS_IMG}magic-kingdom.jpg`,
  EPCOT:                        `${PARKS_IMG}epcot.jpg`,
  "Disney's Hollywood Studios": `${PARKS_IMG}hollywood-studios.jpg`,
  "Disney's Animal Kingdom":    `${PARKS_IMG}animal-kingdom.jpg`,
  'Disney Springs':             `${PARKS_IMG}disney-springs.jpg`,
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

function getDayTypeIcon(dayType) {
  const match = DAY_TYPES.find((type) => type.value === dayType)
  return match?.icon || ''
}

function getSecondParkOptions(firstPark) {
  return PARK_OPTIONS.filter((park) => park !== firstPark)
}

function getRideOptionsForDay(dayPlan) {
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

function getItemSlot(item) {
  if (item.time) {
    const [h] = item.time.split(':').map(Number)
    if (h >= 21) return 'night'
    if (h >= 18) return 'evening'
    if (h >= 15) return 'afternoon'
    if (h >= 12) return 'midday'
    if (h >= 9)  return 'morning'
    return 'latenight'
  }
  return DEFAULT_SLOT[item.type] || 'midday'
}

function getTimeSlots(dayType) {
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

function formatShortDate(dateStr) {
  if (!dateStr) return ''
  const [, month, day] = dateStr.split('-')
  return `${parseInt(month, 10)}/${parseInt(day, 10)}`
}

function App() {
  const [projects, setProjects] = useState(() => loadAllProjects())
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [plan, setPlan] = useState(DEFAULT_PLAN)
  const [draftDayItems, setDraftDayItems] = useState({})
  const [setupDone, setSetupDone] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [activeDay, setActiveDay] = useState(0)
  const [editingDayItem, setEditingDayItem] = useState(null) // { date, index, draft }
  const [addEventOpen, setAddEventOpen] = useState(false)
  const [eventSearch, setEventSearch] = useState('')
  const [liveShowData, setLiveShowData] = useState({}) // keyed by park name
  const [prefSearch, setPrefSearch] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, 6))
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1))

  const toggleFavoriteTag = tag => {
    setPlan(p => ({
      ...p,
      favoriteTags: p.favoriteTags?.includes(tag)
        ? p.favoriteTags.filter(t => t !== tag)
        : [...(p.favoriteTags || []), tag]
    }))
  }

  useEffect(() => {
    if (!activeProjectId) return
    setProjects(prev => {
      const updated = {
        ...prev,
        [activeProjectId]: { ...prev[activeProjectId], updatedAt: new Date().toISOString(), plan }
      }
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [plan, activeProjectId])

  const tripDates = useMemo(() => {
    return getDateRange(plan.startDate, plan.endDate)
  }, [plan.startDate, plan.endDate])

  const tripLength = tripDates.length || null

  useEffect(() => {
    setActiveDay(prev => Math.min(prev, Math.max(tripDates.length - 1, 0)))
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

  // Fetch live show data for any park that appears in the trip plan
  useEffect(() => {
    const parks = [...new Set(
      Object.values(plan.dayPlans)
        .filter(dp => dp.dayType === 'Park')
        .flatMap(dp => [dp.park, dp.secondPark].filter(Boolean))
    )]
    parks.forEach(park => {
      if (liveShowData[park] !== undefined) return // already fetched or in-flight
      setLiveShowData(prev => ({ ...prev, [park]: null })) // mark in-flight
      fetchLiveParkShows(park).then(shows => {
        if (shows) setLiveShowData(prev => ({ ...prev, [park]: shows }))
      })
    })
  }, [plan.dayPlans]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateField = (field, value) => {
    setPlan((current) => ({ ...current, [field]: value }))
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
      ride: '',
      note: ''
    }
    const eventType = getEventTypeConfig(draft.type)
    const restaurant =
      draft.restaurant === '__custom__'
        ? (draft.customRestaurant || '').trim()
        : (draft.restaurant || '').trim()
    const rideSelection = draft.ride || ''
    const [ridePark = '', ride = ''] = rideSelection.split('::')
    const note = (draft.note || '').trim()
    const restaurantResources = restaurant ? getRestaurantResources(restaurant) : null

    if (eventType.requiresRestaurant && !restaurant) return
    if (draft.type === 'Ride' && !rideSelection) return
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
              ride,
              ridePark,
              note,
              time: draft.time || '',
              theme: eventType.theme
            }
          ]
        }
      }
    }))
    setDraftDayItems((current) => ({
      ...current,
      [date]: { type: draft.type, restaurant: '', customRestaurant: '', ride: '', note: '', time: '' }
    }))
  }

  const updateDayItem = (date, itemIndex, updates) => {
    setPlan((current) => ({
      ...current,
      dayPlans: {
        ...current.dayPlans,
        [date]: {
          ...current.dayPlans[date],
          items: current.dayPlans[date].items.map((item, idx) =>
            idx === itemIndex ? { ...item, ...updates } : item
          )
        }
      }
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

  const acceptSuggestion = (date, suggestion) => {
    setPlan((current) => ({
      ...current,
      dayPlans: {
        ...current.dayPlans,
        [date]: {
          ...current.dayPlans[date],
          items: [
            ...(current.dayPlans[date]?.items || []),
            { type: suggestion.type, restaurant: '', customRestaurant: '', menuUrl: '', bookingUrl: '',
              heroImage: '', ride: '', ridePark: '', note: suggestion.label, time: suggestion.time, theme: suggestion.theme }
          ],
          dismissedSuggestions: [...(current.dayPlans[date]?.dismissedSuggestions || []), suggestion.id]
        }
      }
    }))
  }

  const dismissSuggestion = (date, suggestionId) => {
    setPlan((current) => ({
      ...current,
      dayPlans: {
        ...current.dayPlans,
        [date]: {
          ...current.dayPlans[date],
          dismissedSuggestions: [...(current.dayPlans[date]?.dismissedSuggestions || []), suggestionId]
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
      [date]: { type: 'Fireworks', restaurant: '', customRestaurant: '', ride: '', note: '' }
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

  const resetPlan = () => {
    setPlan(DEFAULT_PLAN)
    setSetupDone(false)
    setDraftDayItems({})
  }

  const createProject = () => {
    const id = generateId()
    const newProject = { id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), plan: DEFAULT_PLAN }
    setProjects(prev => {
      const updated = { ...prev, [id]: newProject }
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated))
      return updated
    })
    setPlan(DEFAULT_PLAN)
    setSetupDone(false)
    setDraftDayItems({})
    setActiveProjectId(id)
  }

  const openProject = (id) => {
    const project = projects[id]
    setPlan(project.plan)
    setSetupDone(!!(project.plan.startDate && project.plan.endDate))
    setCurrentStep(1)
    setDraftDayItems({})
    setActiveProjectId(id)
  }

  const deleteProject = (id) => {
    setProjects(prev => {
      const next = { ...prev }
      delete next[id]
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(next))
      return next
    })
  }

  const goHome = () => {
    setActiveProjectId(null)
  }

  return (
    <div className="page-shell">
      {activeProjectId === null ? (
        <>
          <header className="hero">
            <p className="eyebrow">Disney World Holiday Planner</p>
            <h1>My Holidays</h1>
            <p className="subtitle">Plan and manage all your Disney World adventures.</p>
          </header>

          <main className="home-grid">
            {Object.keys(projects).length > 0 && (
              <section className="card card-wide">
                <h2 className="home-section-title">Your holidays</h2>
                <div className="project-list">
                  {Object.values(projects)
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map(project => {
                      const p = project.plan
                      const len = getDateRange(p.startDate, p.endDate).length
                      return (
                        <div key={project.id} className="project-row" onClick={() => openProject(project.id)}>
                          <div className="project-row-info">
                            <strong>{p.tripName || 'Untitled Holiday'}</strong>
                            <span>
                              {p.startDate
                                ? `${formatPrettyDate(p.startDate)} – ${formatPrettyDate(p.endDate)} · ${len} day${len !== 1 ? 's' : ''}`
                                : 'Dates not set'}
                              {p.myHotel ? ` · ${p.myHotel}` : ''}
                            </span>
                          </div>
                          <button
                            className="chip"
                            onClick={(e) => { e.stopPropagation(); deleteProject(project.id) }}
                          >
                            Delete
                          </button>
                        </div>
                      )
                    })}
                </div>
              </section>
            )}

            <button className="new-project-btn" onClick={createProject}>
              + New holiday
            </button>

            {Object.keys(projects).length === 0 && (
              <p className="home-empty">No holidays yet. Start planning your first Disney trip!</p>
            )}
          </main>
        </>
      ) : (
        <>
          <header className="hero">
            <button className="back-btn" onClick={goHome}>← My Holidays</button>
            <h1>{plan.tripName}</h1>
            <p className="subtitle">
              Build your park days, spending target, and must-do list in one place.
            </p>
          </header>

          <main className="planner-grid">
        {!setupDone && (
          <section key={currentStep} className="card card-wide setup-step">
            <p className="step-label">Step {currentStep} of 5</p>

            {currentStep === 1 && <>
              <h2 className="step-question">Name your holiday</h2>
              <p className="step-sub">Every great adventure deserves a great name.</p>
              <input
                className="step-input"
                value={plan.tripName}
                onChange={(event) => updateField('tripName', event.target.value)}
                placeholder="e.g. Magical Family Getaway"
                autoFocus
              />
            </>}

            {currentStep === 2 && <>
              <h2 className="step-question">When are you going?</h2>
              <p className="step-sub">Pick your dates and we'll build your day-by-day planner automatically.</p>
              <div className="step-date-row">
                <label>
                  From
                  <input
                    type="date"
                    value={plan.startDate}
                    onChange={(event) => updateField('startDate', event.target.value)}
                  />
                </label>
                <label>
                  To
                  <input
                    type="date"
                    value={plan.endDate}
                    onChange={(event) => updateField('endDate', event.target.value)}
                  />
                </label>
                {tripLength > 0 && (
                  <span className="step-length-pill">{tripLength} day{tripLength !== 1 ? 's' : ''}</span>
                )}
              </div>
            </>}

            {currentStep === 3 && <>
              <h2 className="step-question">Where are you staying?</h2>
              <p className="step-sub">Your resort sets the tone — from castle views to savannah sunrises.</p>
              <input
                className="step-input"
                list="hotel-list"
                value={plan.myHotel}
                onChange={(event) => updateField('myHotel', event.target.value)}
                placeholder="Type or pick a Disney hotel"
                autoFocus
              />
              <datalist id="hotel-list">
                {DISNEY_HOTELS.map((hotel) => (
                  <option key={hotel} value={hotel} />
                ))}
              </datalist>
            </>}

            {currentStep === 4 && <>
              <h2 className="step-question">Who's going?</h2>
              <p className="step-sub">The more the merrier — every party size gets the magic treatment.</p>
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
            </>}

            {currentStep === 5 && <>
              <h2 className="step-question">How do you like to dine?</h2>
              <p className="step-sub">Disney dining is half the fun — let's make sure you've got a plan.</p>
              <div className="step-dining-grid">
                {DINING_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={plan.diningStyle === option ? 'dining-chip selected' : 'dining-chip'}
                    onClick={() => updateField('diningStyle', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>}

            {currentStep === 6 && <>
              <h2 className="step-question">What do you love most?</h2>
              <p className="step-sub">We'll use this to surface the shows, parades and meet & greets that matter to you.</p>

              <input
                className="pref-search"
                type="search"
                placeholder="Search entertainment, franchises, characters…"
                value={prefSearch}
                onChange={e => setPrefSearch(e.target.value)}
              />

              {(() => {
                const filteredEntertainment = ENTERTAINMENT_TYPES.filter(({ label }) => fuzzyMatch(prefSearch, label))
                const filteredFranchises    = FRANCHISE_OPTIONS.filter(({ label }) => fuzzyMatch(prefSearch, label))
                const noResults = !filteredEntertainment.length && !filteredFranchises.length
                return noResults ? (
                  <p className="pref-no-results">No matches for "{prefSearch}"</p>
                ) : <>
                  {filteredEntertainment.length > 0 && <>
                    <p className="pref-section-label">Entertainment style</p>
                    <div className="pref-chip-grid">
                      {filteredEntertainment.map(({ tag, label }) => (
                        <button key={tag} type="button"
                          className={plan.favoriteTags?.includes(tag) ? 'pref-chip selected' : 'pref-chip'}
                          onClick={() => toggleFavoriteTag(tag)}
                        >{label}</button>
                      ))}
                    </div>
                  </>}
                  {filteredFranchises.length > 0 && <>
                    <p className="pref-section-label">Favourite worlds & franchises</p>
                    <div className="pref-chip-grid">
                      {filteredFranchises.map(({ tag, label }) => (
                        <button key={tag} type="button"
                          className={plan.favoriteTags?.includes(tag) ? 'pref-chip selected' : 'pref-chip'}
                          onClick={() => toggleFavoriteTag(tag)}
                        >{label}</button>
                      ))}
                    </div>
                  </>}
                </>
              })()}
            </>}

            <div className="step-nav">
              {currentStep > 1 && (
                <button className="step-back-btn" onClick={prevStep}>← Back</button>
              )}
              {currentStep < 6 ? (
                <button className="setup-continue-btn" onClick={nextStep}>Next →</button>
              ) : (
                <>
                  <button
                    className="setup-continue-btn"
                    disabled={!plan.startDate || !plan.endDate}
                    onClick={() => setSetupDone(true)}
                  >
                    Start Planning →
                  </button>
                  {(!plan.startDate || !plan.endDate) && (
                    <span className="setup-hint">Set your dates in Step 2 to continue</span>
                  )}
                </>
              )}
            </div>
          </section>
        )}

        {setupDone && (
          <div className="setup-summary card card-wide">
            <div className="setup-summary-inner">
              <div className="setup-summary-info">
                <strong>{plan.tripName}</strong>
                <span>{formatPrettyDate(plan.startDate)} – {formatPrettyDate(plan.endDate)} · {tripLength} day{tripLength !== 1 ? 's' : ''}</span>
                <span>{plan.adults} adult{plan.adults !== 1 ? 's' : ''}{plan.children > 0 ? `, ${plan.children} child${plan.children !== 1 ? 'ren' : ''}` : ''} · £{Number(plan.budget).toLocaleString()} · {plan.diningStyle}</span>
              </div>
              <div className="setup-summary-actions">
                <button className="chip" onClick={() => { setSetupDone(false); setCurrentStep(1) }}>Edit setup</button>
                <button className="chip" onClick={() => { setPrefSearch(''); setSetupDone(false); setCurrentStep(6) }}>✦ My preferences</button>
                <button className="chip" onClick={() => { setSettingsOpen(true); setResetConfirm(false) }}>⚙ Settings</button>
              </div>
            </div>
          </div>
        )}

        {setupDone && <section className="card card-wide">
          <div className="card-title-row day-header">
            <h2>Daily Plan by Date</h2>
            <div className="day-nav-arrows">
              <button disabled={activeDay === 0} onClick={() => setActiveDay(d => d - 1)}>←</button>
              <span>Day {activeDay + 1} of {tripDates.length || 0}</span>
              <button disabled={activeDay >= tripDates.length - 1} onClick={() => setActiveDay(d => d + 1)}>→</button>
            </div>
          </div>

          {!tripDates.length && (
            <p className="section-hint">Set your start and end date to unlock daily planning cards.</p>
          )}

          <div className="date-plan-grid">
            <div className="day-nav-strip">
              {tripDates.map((date, index) => {
                const dp = plan.dayPlans?.[date]
                const isPlanned = !!(dp?.dayType || dp?.items?.length)
                return (
                  <button
                    key={date}
                    type="button"
                    className={['day-nav-btn', index === activeDay ? 'active' : '', isPlanned ? 'has-plan' : ''].filter(Boolean).join(' ')}
                    onClick={() => setActiveDay(index)}
                  >
                    <span className="day-nav-num">{index + 1}</span>
                    <span className="day-nav-date">{formatShortDate(date)}</span>
                  </button>
                )
              })}
            </div>
            {tripDates.length > 0 && (() => {
              const date = tripDates[activeDay]
              const index = activeDay
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
                ride: '',
                note: '',
                time: ''
              }
              const selectedEventType = getEventTypeConfig(draft.type)
              const locationDisplay = getLocationDisplay(dayPlan, plan.myHotel.trim())
              const dayTypeChipColor = getDayTypeChipColor(dayPlan.dayType)
              const secondParkOptions = getSecondParkOptions(dayPlan.park)
              const rideOptions = getRideOptionsForDay(dayPlan)
              const itemsWithIndex = (dayPlan.items || []).map((item, idx) => ({ ...item, _idx: idx }))
              const timeSlots = getTimeSlots(dayPlan.dayType)
              const dismissed = dayPlan.dismissedSuggestions || []
              const ghostSuggestions = (() => {
                if (dayPlan.dayType !== 'Park') return []
                const parks = [dayPlan.park, dayPlan.secondPark].filter(Boolean)
                const fromLive = parks.flatMap(park => liveShowData[park] || [])
                const fromStatic = getParkSuggestions(dayPlan.park, dayPlan.secondPark)
                const base = fromLive.length ? fromLive : fromStatic
                const favSet = new Set(plan.favoriteTags || [])
                return base.filter(s => {
                  if (dismissed.includes(s.id)) return false
                  if (!favSet.size) return true // no prefs set → show all
                  return s.tags?.some(t => favSet.has(t))
                })
              })()

              const searchQ = eventSearch.trim()
              const eventSearchResults = searchQ ? {
                shows: getParkSuggestions(dayPlan.park, dayPlan.secondPark)
                  .filter(s => fuzzyMatch(searchQ, s.label)).slice(0, 4),
                restaurants: ALL_RESTAURANTS.map(r => {
                  const tags = RESTAURANT_TAGS[r] || []
                  const matchingTag = tags.find(t => fuzzyMatch(searchQ, t))
                  return (fuzzyMatch(searchQ, r) || matchingTag) ? { name: r, tag: matchingTag || null } : null
                }).filter(Boolean).slice(0, 6),
                rides: rideOptions.filter(r => fuzzyMatch(searchQ, r.label)).slice(0, 4),
              } : null
              const hasSearchResults = eventSearchResults &&
                (eventSearchResults.shows.length || eventSearchResults.restaurants.length || eventSearchResults.rides.length)

              const applySearchResult = (kind, item) => {
                const SHOW_TYPE_MAP = { Fireworks: 'Fireworks', Parade: 'Parade', Show: 'Fireworks', 'Character Meet': 'Character Meet' }
                if (kind === 'show') {
                  setDraftDayItems(cur => ({
                    ...cur,
                    [date]: { ...draft, type: SHOW_TYPE_MAP[item.type] || 'Fireworks', note: item.label, time: item.time }
                  }))
                } else if (kind === 'restaurant') {
                  const mealType = ['Breakfast', 'Lunch', 'Dinner', 'Tea', 'Snack'].includes(draft.type) ? draft.type : 'Dinner'
                  setDraftDayItems(cur => ({
                    ...cur,
                    [date]: { ...draft, type: mealType, restaurant: item, customRestaurant: '' }
                  }))
                } else if (kind === 'ride') {
                  setDraftDayItems(cur => ({
                    ...cur,
                    [date]: { ...draft, type: 'Ride', ride: item.value }
                  }))
                }
                setEventSearch('')
              }

              return (
                <>
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

                <div className="day-timeline-card card">
                  {addEventOpen && (
                    <div className="event-builder-panel">
                      <div className="event-builder-header">
                        <span>Add event</span>
                        <button type="button" className="event-builder-close" onClick={() => { setAddEventOpen(false); setEventSearch('') }}>×</button>
                      </div>
                      <div className="event-search-wrap">
                        <input
                          className="event-search-input"
                          type="search"
                          placeholder="Search rides, shows, restaurants…"
                          value={eventSearch}
                          onChange={e => setEventSearch(e.target.value)}
                          autoFocus
                        />
                        {hasSearchResults && (
                          <div className="event-search-results">
                            {eventSearchResults.shows.length > 0 && <>
                              <div className="esr-group-label">Shows &amp; Events</div>
                              {eventSearchResults.shows.map(s => (
                                <button key={s.id} type="button" className="esr-item" onClick={() => applySearchResult('show', s)}>
                                  <span className="esr-name">{s.label}</span>
                                  <span className="esr-meta">{s.time} · {s.type}</span>
                                </button>
                              ))}
                            </>}
                            {eventSearchResults.restaurants.length > 0 && <>
                              <div className="esr-group-label">Restaurants</div>
                              {eventSearchResults.restaurants.map(r => (
                                <button key={r.name} type="button" className="esr-item" onClick={() => applySearchResult('restaurant', r.name)}>
                                  <span className="esr-name">{r.name}</span>
                                  <span className="esr-meta">{r.tag ?? 'Dining'}</span>
                                </button>
                              ))}
                            </>}
                            {eventSearchResults.rides.length > 0 && <>
                              <div className="esr-group-label">Rides</div>
                              {eventSearchResults.rides.map(r => (
                                <button key={r.value} type="button" className="esr-item" onClick={() => applySearchResult('ride', r)}>
                                  <span className="esr-name">{r.label}</span>
                                  <span className="esr-meta">Ride</span>
                                </button>
                              ))}
                            </>}
                          </div>
                        )}
                      </div>
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
                                  ride: '',
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
                        ) : draft.type === 'Ride' ? (
                          <label className="field-compact">
                            Ride
                            <select
                              value={draft.ride}
                              onChange={(event) =>
                                setDraftDayItems((current) => ({
                                  ...current,
                                  [date]: { ...draft, ride: event.target.value }
                                }))
                              }
                              disabled={!rideOptions.length}
                            >
                              <option value="">
                                {rideOptions.length
                                  ? 'Choose ride'
                                  : 'Select park(s) for this day first'}
                              </option>
                              {rideOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
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
                        <label className="field-compact field-time">
                          Time
                          <input
                            type="time"
                            value={draft.time || ''}
                            onChange={(event) =>
                              setDraftDayItems((current) => ({
                                ...current,
                                [date]: { ...draft, time: event.target.value }
                              }))
                            }
                          />
                        </label>
                        <button type="button" className="action action-compact" onClick={() => { addDayItem(date); setAddEventOpen(false); setEventSearch('') }}>
                          Add event
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="day-timeline">
                    {timeSlots.flatMap(slot => {
                      const slotItems = itemsWithIndex.filter(item => getItemSlot(item) === slot.slot)
                      const slotGhosts = ghostSuggestions.filter(s => getItemSlot(s) === slot.slot)
                      if (!slotItems.length && !slotGhosts.length) return []
                      return [(
                        <div key={`slot-${slot.slot}`} className="timeline-slot">
                          <div className="timeline-anchor">
                            <span className="timeline-anchor-time">{slot.time}</span>
                            <span className="timeline-anchor-label">{slot.label}</span>
                          </div>
                          <div className="timeline-node" />
                          <div className="timeline-slot-events">
                            {slotItems.map(item => {
                              const normalizedItem = normalizeEventItem(item)
                              const label = buildEventLabel(normalizedItem)
                              const menuUrl = normalizedItem.menuUrl
                              const bookingUrl = normalizedItem.bookingUrl
                              const hasRestaurantLinks = Boolean(normalizedItem.type !== 'Ride' && normalizedItem.restaurant && (menuUrl || bookingUrl))
                              const rideName = normalizedItem.ride ? normalizedItem.ride.split('::').pop() : ''
                              const rideUrl = RIDE_URLS[rideName] || ''
                              const rideImage = RIDE_IMAGES[rideName] || ''
                              const mapSearchTerm = rideName || normalizedItem.restaurant || normalizedItem.note || dayPlan.park || 'Walt Disney World'
                              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapSearchTerm + ' Walt Disney World')}`
                              const viewInfoUrl = !menuUrl
                                ? (rideUrl || `https://www.google.com/search?q=${encodeURIComponent(mapSearchTerm + ' Walt Disney World')}`)
                                : ''
                              const isEditing = editingDayItem?.date === date && editingDayItem?.index === item._idx
                              return (
                                <div key={`event-${item._idx}`} className="timeline-event">
                                  {isEditing ? (
                                    <div className="timeline-event-edit" data-theme={normalizedItem.theme}>
                                      <div className="event-edit-fields">
                                        <label className="event-edit-label">
                                          Time
                                          <input
                                            type="time"
                                            value={editingDayItem.draft.time || ''}
                                            onChange={(e) => setEditingDayItem(prev => ({ ...prev, draft: { ...prev.draft, time: e.target.value } }))}
                                          />
                                        </label>
                                        <label className="event-edit-label">
                                          Note
                                          <input
                                            type="text"
                                            placeholder="Optional note"
                                            value={editingDayItem.draft.note || ''}
                                            onChange={(e) => setEditingDayItem(prev => ({ ...prev, draft: { ...prev.draft, note: e.target.value } }))}
                                          />
                                        </label>
                                      </div>
                                      <div className="event-edit-actions">
                                        <button
                                          type="button"
                                          className="event-edit-save"
                                          onClick={() => {
                                            updateDayItem(date, item._idx, editingDayItem.draft)
                                            setEditingDayItem(null)
                                          }}
                                        >Save</button>
                                        <button
                                          type="button"
                                          className="event-edit-cancel"
                                          onClick={() => setEditingDayItem(null)}
                                        >Cancel</button>
                                        <button
                                          type="button"
                                          className="event-edit-delete"
                                          onClick={() => { removeDayItem(date, item._idx); setEditingDayItem(null) }}
                                        >Delete</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className="timeline-event-content"
                                      data-theme={normalizedItem.theme}
                                      style={rideImage ? { backgroundImage: `linear-gradient(to bottom right, rgba(255,255,255,1) 30%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0) 100%), url(${rideImage})`, backgroundSize: 'cover', backgroundPosition: 'center right' } : undefined}
                                    >
                                      <div className="event-text">
                                        {normalizedItem.time && (
                                          <span className="event-time">{formatTime(normalizedItem.time)}</span>
                                        )}
                                        <p>{label}</p>
                                        <div className="event-links">
                                          {hasRestaurantLinks && menuUrl && (
                                            <a href={menuUrl} target="_blank" rel="noreferrer noopener">View menu</a>
                                          )}
                                          {hasRestaurantLinks && bookingUrl && (
                                            <a href={bookingUrl} target="_blank" rel="noreferrer noopener">Book</a>
                                          )}
                                          {viewInfoUrl && (
                                            <a href={viewInfoUrl} target="_blank" rel="noreferrer noopener">View info</a>
                                          )}
                                          <a href={mapUrl} target="_blank" rel="noreferrer noopener">View on map</a>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        className="event-edit-btn"
                                        title="Edit"
                                        onClick={() => setEditingDayItem({ date, index: item._idx, draft: { time: normalizedItem.time || '', note: normalizedItem.note || '' } })}
                                      >✏</button>
                                      <button type="button" className="event-delete-btn" onClick={() => removeDayItem(date, item._idx)}>×</button>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                            {slotGhosts.map(suggestion => (
                              <div key={suggestion.id} className="timeline-event">
                                <div className="ghost-event-content" data-theme={suggestion.theme}>
                                  <div className="event-text">
                                    <span className="event-time">{formatTime(suggestion.time)}</span>
                                    <p>{suggestion.label}</p>
                                    {suggestion.tags?.length > 0 && (
                                      <div className="ghost-tags">
                                        {suggestion.tags.map(tag => (
                                          <span key={tag} className="ghost-tag">{tag}</span>
                                        ))}
                                      </div>
                                    )}
                                    <div className="ghost-links">
                                      {suggestion.infoUrl && (
                                        <a href={suggestion.infoUrl} target="_blank" rel="noreferrer noopener"
                                          className="ghost-link" title="About this show">ℹ Info</a>
                                      )}
                                      {suggestion.mapUrl && (
                                        <a href={suggestion.mapUrl} target="_blank" rel="noreferrer noopener"
                                          className="ghost-link" title="View on map">📍 Map</a>
                                      )}
                                    </div>
                                  </div>
                                  <div className="ghost-actions">
                                    <button type="button" className="ghost-accept-btn" title="Add to my plan"
                                      onClick={() => acceptSuggestion(date, suggestion)}>✓</button>
                                    <button type="button" className="ghost-dismiss-btn" title="Not for me"
                                      onClick={() => dismissSuggestion(date, suggestion.id)}>✕</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )]
                    })}
                    {!dayPlan.items?.length && (
                      <p className="timeline-empty">Tap + to add your first event</p>
                    )}
                  </div>
                </div>
                </>
              )
            })()}
          </div>
        </section>}

        {setupDone && !addEventOpen && (
          <div className="fab-group">
            <button
              type="button"
              className="fab-day-map"
              aria-label="View day on map"
              onClick={() => {
                const date = tripDates[activeDay]
                const dayPlan = plan.dayPlans?.[date]
                const items = (dayPlan?.items || [])
                const stops = [
                  dayPlan?.park,
                  ...items.map(item => {
                    const n = normalizeEventItem(item)
                    return n.ride ? n.ride.split('::').pop() : (n.restaurant || n.note || null)
                  })
                ].filter(Boolean).map(s => encodeURIComponent(s + ' Walt Disney World'))
                const url = stops.length
                  ? `https://www.google.com/maps/dir/${stops.join('/')}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((dayPlan?.park || 'Walt Disney World') + ' Walt Disney World')}`
                window.open(url, '_blank', 'noreferrer')
              }}
            >🗺</button>
            <button
              type="button"
              className="fab-add-event"
              onClick={() => { setAddEventOpen(prev => !prev); setEventSearch('') }}
              aria-label="Add event"
            >
              <span className={addEventOpen ? 'fab-icon fab-icon-close' : 'fab-icon'}>+</span>
            </button>
          </div>
        )}

          </main>

          {settingsOpen && (
            <div className="settings-overlay" onClick={() => setSettingsOpen(false)}>
              <div className="settings-panel card" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                  <h3>Trip settings</h3>
                  <button type="button" className="close-panel-btn" onClick={() => setSettingsOpen(false)}>✕</button>
                </div>
                <p className="settings-note">Your plan is saved automatically in your browser.</p>
                <hr className="settings-divider" />
                <div className="settings-section">
                  <strong>Danger zone</strong>
                  {resetConfirm ? (
                    <div className="settings-confirm-row">
                      <span>This will erase everything. Are you sure?</span>
                      <button type="button" className="danger" onClick={() => { resetPlan(); setSettingsOpen(false) }}>Yes, reset</button>
                      <button type="button" className="chip" onClick={() => setResetConfirm(false)}>Cancel</button>
                    </div>
                  ) : (
                    <button type="button" className="danger" onClick={() => setResetConfirm(true)}>Reset planner</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App

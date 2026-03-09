// Static UI option arrays — all trip-planning dropdown data lives here (TD-031)
import { IMG_BASE } from './constants.js'

export const PARK_OPTIONS = [
  'Magic Kingdom',
  'EPCOT',
  "Disney's Hollywood Studios",
  "Disney's Animal Kingdom",
  'Disney Springs'
]

export const DINING_OPTIONS = [
  'No dining plan',
  'Quick service dining plan',
  'Table service dining plan'
]

export const ENTERTAINMENT_TYPES = [
  { tag: '#fireworks',    label: 'Fireworks & Spectaculars' },
  { tag: '#parade',       label: 'Parades'                  },
  { tag: '#meetandgreet', label: 'Character Meet & Greets'  },
  { tag: '#adventure',    label: 'Stunts & Adventure'       },
  { tag: '#nature',       label: 'Nature & Wildlife'        },
  { tag: '#princess',     label: 'Princess Experiences'     },
]

export const FRANCHISE_OPTIONS = [
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

export const DAY_TYPES = [
  { value: 'Park',           icon: `${IMG_BASE}day-type-icons/park.svg`          },
  { value: 'Swimming',       icon: `${IMG_BASE}day-type-icons/swimming.svg`       },
  { value: 'Hotel/Shopping', icon: `${IMG_BASE}day-type-icons/hotel-shopping.svg` },
  { value: 'Travel',         icon: `${IMG_BASE}day-type-icons/travel.svg`         }
]

export const SWIM_OPTIONS = [
  { value: "Disney's Typhoon Lagoon Water Park", icon: `${IMG_BASE}swim-icons/typhoon-lagoon.svg` },
  { value: "Disney's Blizzard Beach Water Park", icon: `${IMG_BASE}swim-icons/blizzard-beach.svg` }
]

export const DISNEY_HOTELS = [
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

export const EVENT_TYPES = [
  { value: 'Breakfast',        theme: 'dining',     requiresRestaurant: true  },
  { value: 'Lunch',            theme: 'dining',     requiresRestaurant: true  },
  { value: 'Dinner',           theme: 'dining',     requiresRestaurant: true  },
  { value: 'Tea',              theme: 'dining',     requiresRestaurant: true  },
  { value: 'Snack',            theme: 'dining',     requiresRestaurant: true  },
  { value: 'Fireworks',        theme: 'fireworks',  requiresRestaurant: false },
  { value: 'Parade',           theme: 'fireworks',  requiresRestaurant: false },
  { value: 'Ride',             theme: 'ride',       requiresRestaurant: false },
  { value: 'Character Meet',   theme: 'character',  requiresRestaurant: false },
  { value: 'Pool Time',        theme: 'nature',     requiresRestaurant: false },
  { value: 'Shopping',         theme: 'default',    requiresRestaurant: false },
  { value: 'Travel Transfer',  theme: 'default',    requiresRestaurant: false }
]

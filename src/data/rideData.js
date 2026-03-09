// Ride reference data — all ride constants live here (TD-029 completes TD-015)

const DW_ATTRACTIONS = 'https://disneyworld.disney.go.com/attractions'

export const RIDE_URLS = {
  // Magic Kingdom
  'TRON Lightcycle / Run':              `${DW_ATTRACTIONS}/magic-kingdom/tron-lightcycle-run/`,
  'Seven Dwarfs Mine Train':            `${DW_ATTRACTIONS}/magic-kingdom/seven-dwarfs-mine-train/`,
  'Space Mountain':                     `${DW_ATTRACTIONS}/magic-kingdom/space-mountain/`,
  'Big Thunder Mountain Railroad':      `${DW_ATTRACTIONS}/magic-kingdom/big-thunder-mountain-railroad/`,
  'Pirates of the Caribbean':           `${DW_ATTRACTIONS}/magic-kingdom/pirates-of-the-caribbean/`,
  'Haunted Mansion':                    `${DW_ATTRACTIONS}/magic-kingdom/haunted-mansion/`,
  "Peter Pan's Flight":            `${DW_ATTRACTIONS}/magic-kingdom/peter-pans-flight/`,
  "Tiana's Bayou Adventure":            `${DW_ATTRACTIONS}/magic-kingdom/tianas-bayou-adventure/`,
  'Jungle Cruise':                      `${DW_ATTRACTIONS}/magic-kingdom/jungle-cruise/`,
  // EPCOT
  'Guardians of the Galaxy: Cosmic Rewind': `${DW_ATTRACTIONS}/epcot/guardians-of-the-galaxy-cosmic-rewind/`,
  'Test Track':                         `${DW_ATTRACTIONS}/epcot/test-track/`,
  'Frozen Ever After':                  `${DW_ATTRACTIONS}/epcot/frozen-ever-after/`,
  "Remy's Ratatouille Adventure":        `${DW_ATTRACTIONS}/epcot/remys-ratatouille-adventure/`,
  'Soarin Around the World':            `${DW_ATTRACTIONS}/epcot/soarin/`,
  'Mission: SPACE':                     `${DW_ATTRACTIONS}/epcot/mission-space/`,
  'Spaceship Earth':                    `${DW_ATTRACTIONS}/epcot/spaceship-earth/`,
  // Hollywood Studios
  'Star Wars: Rise of the Resistance':  `${DW_ATTRACTIONS}/hollywood-studios/star-wars-rise-of-the-resistance/`,
  'Millennium Falcon: Smugglers Run':   `${DW_ATTRACTIONS}/hollywood-studios/millennium-falcon-smugglers-run/`,
  'Slinky Dog Dash':                    `${DW_ATTRACTIONS}/hollywood-studios/slinky-dog-dash/`,
  'Tower of Terror':                    `${DW_ATTRACTIONS}/hollywood-studios/the-twilight-zone-tower-of-terror/`,
  "Rock 'n' Roller Coaster":              `${DW_ATTRACTIONS}/hollywood-studios/rock-n-roller-coaster-starring-aerosmith/`,
  "Mickey & Minnie's Runaway Railway": `${DW_ATTRACTIONS}/hollywood-studios/mickey-minnies-runaway-railway/`,
  'Toy Story Mania':                    `${DW_ATTRACTIONS}/hollywood-studios/toy-story-mania/`,
  // Animal Kingdom
  'Avatar Flight of Passage':           `${DW_ATTRACTIONS}/animal-kingdom/avatar-flight-of-passage/`,
  "Na'vi River Journey":                `${DW_ATTRACTIONS}/animal-kingdom/navi-river-journey/`,
  'Expedition Everest':                 `${DW_ATTRACTIONS}/animal-kingdom/expedition-everest-legend-of-the-forbidden-mountain/`,
  'Kilimanjaro Safaris':                `${DW_ATTRACTIONS}/animal-kingdom/kilimanjaro-safaris/`,
  'Kali River Rapids':                  `${DW_ATTRACTIONS}/animal-kingdom/kali-river-rapids/`,
  'DINOSAUR':                           `${DW_ATTRACTIONS}/animal-kingdom/dinosaur/`,
}

export const RIDE_TAGS = {
  // Magic Kingdom
  'TRON Lightcycle / Run':              ['thrill', 'roller coaster', 'indoor', 'fast', 'launch coaster', 'sci-fi', 'dark', 'tron', 'must do', 'intense', 'family', 'moderate thrill', 'high speed'],
  'Seven Dwarfs Mine Train':            ['family', 'roller coaster', 'mild thrill', 'snow white', 'dwarfs', 'children', 'family coaster', 'moderate thrill', 'outdoor', 'indoor', 'must do', 'queue'],
  'Space Mountain':                     ['thrill', 'roller coaster', 'indoor', 'dark', 'classic', 'space', 'must do', 'indoor coaster', 'dark ride', 'moderate thrill', 'futuristic', 'iconic'],
  'Big Thunder Mountain Railroad':      ['family', 'roller coaster', 'outdoor', 'mild thrill', 'wild west', 'mine train', 'children', 'classic', 'moderate thrill', 'fast', 'bumpy', 'iconic'],
  'Pirates of the Caribbean':           ['family', 'boat ride', 'dark ride', 'classic', 'pirates', 'adventure', 'indoor', 'calm', 'all ages', 'slow ride', 'iconic', 'water', 'must do'],
  'Haunted Mansion':                    ['family', 'dark ride', 'classic', 'ghosts', 'spooky', 'indoor', 'all ages', 'doom buggy', 'hitchhiking ghosts', 'must do', 'iconic', 'halloween'],
  "Peter Pan's Flight":            ['family', 'dark ride', 'classic', 'flying', 'children', 'peter pan', 'indoor', 'calm', 'all ages', 'slow ride', 'neverland', 'suspension'],
  "Tiana's Bayou Adventure":            ['family', 'log flume', 'water ride', 'bayou', 'tiana', 'princess', 'outdoor', 'mild thrill', 'moderate thrill', 'splash', 'wet', 'new'],
  'Jungle Cruise':                      ['family', 'boat ride', 'classic', 'animals', 'humour', 'outdoor', 'calm', 'all ages', 'safari', 'slow ride', 'puns', 'iconic'],
  // EPCOT
  'Guardians of the Galaxy: Cosmic Rewind': ['thrill', 'roller coaster', 'indoor', 'reverse launch', 'fast', 'must do', 'guardians', 'marvel', 'dark', 'immersive', 'intense', 'high thrill'],
  'Test Track':                         ['family', 'mild thrill', 'cars', 'design', 'futuristic', 'indoor', 'speed', 'chevrolet', 'moderate thrill', 'interactive', 'simulator', 'fast'],
  'Frozen Ever After':                  ['family', 'boat ride', 'frozen', 'anna', 'elsa', 'indoor', 'calm', 'children', 'all ages', 'dark ride', 'slow ride', 'princess'],
  "Remy's Ratatouille Adventure":        ['family', 'dark ride', 'remy', 'ratatouille', 'pixar', 'indoor', 'calm', 'children', 'all ages', 'trackless', 'slow ride', 'interactive'],
  'Soarin Around the World':            ['family', 'simulation', 'flying', 'scenic', 'indoor', 'mild thrill', 'all ages', 'must do', 'hang gliding', 'iconic', 'omnimax', 'wind'],
  'Mission: SPACE':                     ['thrill', 'simulation', 'astronaut', 'space', 'indoor', 'intense', 'centrifuge', 'moderate thrill', 'spin', 'family version', 'motion sickness', 'NASA'],
  'Spaceship Earth':                    ['family', 'slow ride', 'dark ride', 'epcot', 'classic', 'educational', 'calm', 'all ages', 'time travel', 'indoor', 'iconic', 'golf ball'],
  // Hollywood Studios
  'Star Wars: Rise of the Resistance':  ['thrill', 'dark ride', 'star wars', 'immersive', 'indoor', 'must do', 'trackless', 'intense', 'epic', 'action', 'stunning', 'high thrill'],
  'Millennium Falcon: Smugglers Run':   ['family', 'interactive', 'star wars', 'pilot', 'mild thrill', 'indoor', 'immersive', 'moderate thrill', 'action', 'cooperative', 'simulator'],
  'Slinky Dog Dash':                    ['family', 'roller coaster', 'toy story', 'outdoor', 'mild thrill', 'children', 'fun', 'family coaster', 'moderate thrill', 'pixar', 'spring'],
  'Tower of Terror':                    ['thrill', 'drop tower', 'scary', 'twilight zone', 'indoor', 'intense', 'must do', 'vertical drop', 'horror', 'high thrill', 'falling', 'haunted'],
  "Rock 'n' Roller Coaster":              ['thrill', 'roller coaster', 'indoor', 'fast', 'launch coaster', 'aerosmith', 'intense', 'dark', 'must do', 'inversions', 'high thrill', 'loops'],
  "Mickey & Minnie's Runaway Railway": ['family', 'dark ride', 'mickey', 'minnie', 'trackless', 'indoor', 'children', 'all ages', 'fun', 'slapstick', 'wacky', 'new'],
  'Toy Story Mania':                    ['family', 'interactive', 'shooting gallery', 'toy story', 'indoor', 'competitive', 'all ages', 'mild thrill', 'arcade', 'pixar', '4D', 'fun'],
  // Animal Kingdom
  'Avatar Flight of Passage':           ['thrill', 'simulation', 'avatar', 'pandora', 'intense', 'indoor', 'must do', '3D', 'flying', 'immersive', 'high thrill', 'breathtaking'],
  "Na'vi River Journey":                ['family', 'boat ride', 'avatar', 'pandora', 'calm', 'indoor', 'all ages', 'nature', 'bioluminescent', 'dark ride', 'slow ride', 'beautiful'],
  'Expedition Everest':                 ['thrill', 'roller coaster', 'outdoor', 'backward', 'yeti', 'moderate thrill', 'must do', 'fast', 'asia', 'mountain', 'reverse', 'iconic'],
  'Kilimanjaro Safaris':                ['family', 'safari', 'animals', 'outdoor', 'real animals', 'nature', 'wildlife', 'must do', 'slow ride', 'jeep', 'africa', 'educational'],
  'Kali River Rapids':                  ['family', 'water ride', 'outdoor', 'wet', 'moderate thrill', 'rafting', 'nature', 'asia', 'raft', 'splash', 'soaked', 'white water'],
  'DINOSAUR':                           ['thrill', 'dark ride', 'dinosaur', 'time travel', 'intense', 'indoor', 'bumpy', 'scary', 'moderate thrill', 'loud', 'action', 'jurassic'],
}

export function getRideUrl(ride) {
  return RIDE_URLS[ride] ?? null
}

export function getRideTags(ride) {
  return RIDE_TAGS[ride] ?? []
}

const IMG_BASE = `${import.meta.env.BASE_URL}images/`
const RIDES_IMG = `${IMG_BASE}rides/`

export const RIDES_BY_PARK = {
  'Magic Kingdom': [
    'TRON Lightcycle / Run',
    'Seven Dwarfs Mine Train',
    'Space Mountain',
    'Big Thunder Mountain Railroad',
    "Pirates of the Caribbean",
    'Haunted Mansion',
    "Peter Pan's Flight",
    "Tiana's Bayou Adventure",
    'Jungle Cruise'
  ],
  'EPCOT': [
    'Guardians of the Galaxy: Cosmic Rewind',
    'Test Track',
    'Frozen Ever After',
    "Remy's Ratatouille Adventure",
    'Soarin Around the World',
    'Mission: SPACE',
    'Spaceship Earth'
  ],
  "Disney's Hollywood Studios": [
    'Star Wars: Rise of the Resistance',
    'Millennium Falcon: Smugglers Run',
    'Slinky Dog Dash',
    'Tower of Terror',
    "Rock 'n' Roller Coaster",
    "Mickey & Minnie's Runaway Railway",
    'Toy Story Mania'
  ],
  "Disney's Animal Kingdom": [
    'Avatar Flight of Passage',
    "Na'vi River Journey",
    'Expedition Everest',
    'Kilimanjaro Safaris',
    "Kali River Rapids",
    "DINOSAUR"
  ],
  'Disney Springs': ['Aerophile - The World Leader in Balloon Flight']
}

export const RIDE_IMAGES = {
  // Magic Kingdom
  'TRON Lightcycle / Run':              `${RIDES_IMG}tron.jpg`,
  'Seven Dwarfs Mine Train':            `${RIDES_IMG}seven-dwarfs-mine-train.jpg`,
  'Space Mountain':                     `${RIDES_IMG}space-mountain.jpg`,
  'Big Thunder Mountain Railroad':      `${RIDES_IMG}big-thunder-mountain.jpg`,
  'Pirates of the Caribbean':           `${RIDES_IMG}pirates-of-the-caribbean.jpg`,
  'Haunted Mansion':                    `${RIDES_IMG}haunted-mansion.jpg`,
  "Peter Pan's Flight":            `${RIDES_IMG}peter-pans-flight.jpg`,
  "Tiana's Bayou Adventure":            `${RIDES_IMG}tianas-bayou-adventure.jpg`,
  'Jungle Cruise':                      `${RIDES_IMG}jungle-cruise.jpg`,
  // EPCOT
  'Guardians of the Galaxy: Cosmic Rewind': `${RIDES_IMG}guardians-cosmic-rewind.jpg`,
  'Test Track':                         `${RIDES_IMG}test-track.jpg`,
  'Frozen Ever After':                  `${RIDES_IMG}frozen-ever-after.jpg`,
  "Remy's Ratatouille Adventure":        `${RIDES_IMG}remys-ratatouille-adventure.jpg`,
  'Soarin Around the World':            `${RIDES_IMG}soarin.jpg`,
  'Mission: SPACE':                     `${RIDES_IMG}mission-space.jpg`,
  'Spaceship Earth':                    `${RIDES_IMG}spaceship-earth.jpg`,
  // Hollywood Studios
  'Star Wars: Rise of the Resistance':  `${RIDES_IMG}star-wars-rise-of-the-resistance.jpg`,
  'Millennium Falcon: Smugglers Run':   `${RIDES_IMG}millennium-falcon-smugglers-run.jpg`,
  'Slinky Dog Dash':                    `${RIDES_IMG}slinky-dog-dash.jpg`,
  'Tower of Terror':                    `${RIDES_IMG}tower-of-terror.jpg`,
  "Rock 'n' Roller Coaster":              `${RIDES_IMG}rock-n-roller-coaster.jpg`,
  "Mickey & Minnie's Runaway Railway": `${RIDES_IMG}mickey-minnies-runaway-railway.jpg`,
  'Toy Story Mania':                    `${RIDES_IMG}toy-story-mania.jpg`,
  // Animal Kingdom
  'Avatar Flight of Passage':           `${RIDES_IMG}avatar-flight-of-passage.jpg`,
  "Na'vi River Journey":                `${RIDES_IMG}navi-river-journey.jpg`,
  'Expedition Everest':                 `${RIDES_IMG}expedition-everest.jpg`,
  'Kilimanjaro Safaris':                `${RIDES_IMG}kilimanjaro-safaris.jpg`,
  'Kali River Rapids':                  `${RIDES_IMG}kali-river-rapids.jpg`,
  'DINOSAUR':                           `${RIDES_IMG}dinosaur.jpg`,
}

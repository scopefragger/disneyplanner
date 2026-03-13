import { inferTheme } from './planHelpers.js'
import { WDW_SUFFIX } from './constants.js'

const DW = 'https://disneyworld.disney.go.com'
const MAPS = 'https://www.google.com/maps?q='

// Static fallback suggestions (used when API is unavailable)
export const PARK_SUGGESTIONS = {
  'Magic Kingdom': [
    {
      id: 'mk-friendship-faire', label: "Mickey's Magical Friendship Faire",
      description: 'Live stage show at Cinderella Castle with Mickey, Minnie and friends',
      time: '10:30', type: 'Show', theme: 'character',
      tags: ['#character', '#castle', '#family'],
      infoUrl: `${DW}/entertainment/magic-kingdom/mickeys-magical-friendship-faire/`,
      mapUrl:  `${MAPS}Cinderella+Castle+Stage+Magic+Kingdom+Walt+Disney+World`,
    },
    {
      id: 'mk-festival-fantasy', label: 'Festival of Fantasy Parade',
      description: 'Spectacular afternoon parade with elaborate floats and beloved characters',
      time: '15:00', type: 'Parade', theme: 'default',
      tags: ['#parade', '#afternoon', '#mustdo'],
      infoUrl: `${DW}/entertainment/magic-kingdom/festival-of-fantasy-parade/`,
      mapUrl:  `${MAPS}Main+Street+USA+Magic+Kingdom+Walt+Disney+World`,
    },
    {
      id: 'mk-happily-ever-after', label: 'Happily Ever After Fireworks',
      description: "Magic Kingdom's signature fireworks spectacular over Cinderella Castle",
      time: '21:00', type: 'Fireworks', theme: 'fireworks',
      tags: ['#fireworks', '#nighttime', '#mustdo'],
      infoUrl: `${DW}/entertainment/magic-kingdom/happily-ever-after/`,
      mapUrl:  `${MAPS}Cinderella+Castle+Magic+Kingdom+Walt+Disney+World`,
    },
  ],
  'EPCOT': [
    {
      id: 'ep-luminous', label: 'Luminous: The Symphony of Us',
      description: 'Nighttime fireworks and light show on the World Showcase Lagoon',
      time: '21:00', type: 'Fireworks', theme: 'fireworks',
      tags: ['#fireworks', '#nighttime', '#worldshowcase'],
      infoUrl: `${DW}/entertainment/epcot/luminous-the-symphony-of-us/`,
      mapUrl:  `${MAPS}World+Showcase+Lagoon+EPCOT+Walt+Disney+World`,
    },
  ],
  "Disney's Hollywood Studios": [
    {
      id: 'hs-indy', label: 'Indiana Jones Epic Stunt Spectacular',
      description: 'Live stunt show recreating iconic scenes from the Indiana Jones films',
      time: '11:30', type: 'Show', theme: 'default',
      tags: ['#stunts', '#live', '#adventure'],
      infoUrl: `${DW}/entertainment/hollywood-studios/indiana-jones-epic-stunt-spectacular/`,
      mapUrl:  `${MAPS}Indiana+Jones+Epic+Stunt+Spectacular+Hollywood+Studios+Walt+Disney+World`,
    },
    {
      id: 'hs-fantasmic', label: 'Fantasmic!',
      description: 'Mickey battles Disney villains in an epic outdoor nighttime water spectacular',
      time: '21:00', type: 'Fireworks', theme: 'fireworks',
      tags: ['#nighttime', '#mustdo', '#spectacular'],
      infoUrl: `${DW}/entertainment/hollywood-studios/fantasmic/`,
      mapUrl:  `${MAPS}Hollywood+Hills+Amphitheater+Hollywood+Studios+Walt+Disney+World`,
    },
    {
      id: 'hs-galactic', label: 'Star Wars: A Galactic Spectacular',
      description: 'Star Wars nighttime fireworks and projection show on the Hollywood Studios skyline',
      time: '21:30', type: 'Fireworks', theme: 'fireworks',
      tags: ['#starwars', '#fireworks', '#nighttime'],
      infoUrl: `${DW}/entertainment/hollywood-studios/star-wars-a-galactic-spectacular/`,
      mapUrl:  `${MAPS}Hollywood+Studios+Walt+Disney+World`,
    },
  ],
  "Disney's Animal Kingdom": [
    {
      id: 'ak-harambe', label: 'Harambe Wildlife Parti',
      description: 'Lively interactive street party parade through Africa in Animal Kingdom',
      time: '17:00', type: 'Parade', theme: 'nature',
      tags: ['#parade', '#africa', '#interactive'],
      infoUrl: `${DW}/entertainment/animal-kingdom/harambe-wildlife-parti/`,
      mapUrl:  `${MAPS}Harambe+Africa+Animal+Kingdom+Walt+Disney+World`,
    },
    {
      id: 'ak-tree-awakening', label: 'Tree of Life Awakening',
      description: 'The Tree of Life comes alive with projected animal spirits at dusk',
      time: '20:00', type: 'Show', theme: 'nature',
      tags: ['#nature', '#evening', '#magical'],
      infoUrl: `${DW}/entertainment/animal-kingdom/tree-of-life-awakening/`,
      mapUrl:  `${MAPS}Tree+of+Life+Animal+Kingdom+Walt+Disney+World`,
    },
  ],
}

// themeparks.wiki entity IDs for Disney World parks
const PARK_ENTITY_IDS = {
  'Magic Kingdom':                   '75ea578a-adc8-4116-a54d-dccb60765ef9',
  'EPCOT':                           '47f90d2c-e191-4239-a466-5892ef59a88b',
  "Disney's Hollywood Studios":      '288747d1-8b4f-4a64-867e-ea7c9b27bad8',
  "Disney's Animal Kingdom":         '1c84a229-8862-4648-9c71-378ddd2c7693',
}

// Fallback map links for live-data shows (park-level Google Maps search)
const PARK_MAP_URLS = {
  'Magic Kingdom':              `${MAPS}Magic+Kingdom+Walt+Disney+World+Orlando`,
  'EPCOT':                      `${MAPS}EPCOT+Walt+Disney+World+Orlando`,
  "Disney's Hollywood Studios": `${MAPS}Hollywood+Studios+Walt+Disney+World+Orlando`,
  "Disney's Animal Kingdom":    `${MAPS}Animal+Kingdom+Walt+Disney+World+Orlando`,
}

// inferTheme is imported from planHelpers.js — see that file for the full implementation

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

// ── Declarative keyword tables for inferTags (TD-005) ───────────────────────
const FRANCHISE_KEYWORDS = {
  '#starwars':            ['star wars', 'galactic', 'jedi', 'stormtrooper'],
  '#frozen':              ['frozen', 'arendelle', 'sing-along'],
  '#indianajones':        ['indiana jones', 'indy', 'stunt spectacular'],
  '#lionking':            ['lion king', 'simba', 'timon', 'pumbaa', 'hakuna'],
  '#littlemermaid':       ['little mermaid', 'ursula', 'under the sea'],
  '#beautyandthebeast':   ['beauty and the beast', 'lumiere', 'cogsworth'],
  '#toystory':            ['toy story', 'woody', 'buzz lightyear', 'jessie', 'lotso'],
  '#findingnemo':         ['finding nemo', 'finding dory', 'big blue'],
  '#up':                  ['bird adventure', 'kevin', 'dug', 'russell'],
  '#bigherosix':          ['big hero', 'baymax', 'hiro'],
  '#tangled':             ['tangled', 'rapunzel', 'pascal', 'flynn'],
  '#moana':               ['moana', 'maui', 'motunui'],
  '#aladdin':             ['aladdin', 'genie', 'agrabah', 'abu'],
  '#cinderella':          ['cinderella', 'glass slipper', 'bibbidi'],
  '#sleepingbeauty':      ['sleeping beauty', 'maleficent', 'aurora', 'prince phillip'],
  '#snowwhite':           ['snow white', 'seven dwarfs', 'dwarfs mine'],
  '#brave':               ['brave', 'merida', 'dunbroch'],
  '#princessandthefrog':  ['princess and the frog', 'tiana', 'naveen', 'louis the alligator'],
  '#liloandstitch':       ['lilo', 'stitch', 'experiment 626'],
  '#pooh':                ['winnie', 'hundred acre', 'pooh', 'tigger', 'eeyore', 'piglet'],
  '#muppets':             ['muppet', 'kermit', 'miss piggy', 'gonzo'],
  '#figment':             ['figment', 'journey into imagination'],
  '#coco':                ['coco', 'miguel', 'día de'],
  '#encanto':             ['encanto', 'mirabel', 'isabela', 'luisa', 'madrigal'],
  '#ratatouille':         ['ratatouille', 'remy', 'gusteau'],
  '#cars':                ['lightning mcqueen', 'mater', 'radiator springs'],
  '#monsters':            ['monsters', 'sulley', 'boo', 'monstropolis'],
  '#insideout':           ['inside out', 'joy', 'sadness', 'bing bong'],
  '#incredibles':         ['incredibles', 'mr. incredible', 'elastigirl', 'dash'],
  '#guardiansofthegalaxy':['guardians', 'rocket raccoon', 'gamora', 'cosmic rewind'],
  '#spiderman':           ['spider-man', 'spiderman', 'peter parker', 'web-slinger'],
  '#blackpanther':        ['black panther', 'wakanda', "t'challa"],
  '#thor':                ['thor', 'asgard', 'loki'],
  '#captainamerica':      ['captain america', 'steve rogers', 'shield'],
  '#ironman':             ['iron man', 'tony stark', 'stark'],
  '#doctorstrange':       ['doctor strange', 'sanctum'],
  '#antman':              ['ant-man', 'antman', 'scott lang'],
  '#mulan':               ['mulan', 'mushu', 'shang'],
  '#junglecruise':        ['jungle cruise'],
}

const CHARACTER_KEYWORDS = {
  '#mickey':      ['mickey'],
  '#minnie':      ['minnie'],
  '#donald':      ['donald'],
  '#goofy':       ['goofy'],
  '#pluto':       ['pluto'],
  '#chipanddale': ['chip', 'dale'],
  '#elsa':        ['elsa'],
  '#olaf':        ['olaf'],
  '#ariel':       ['ariel'],
  '#belle':       ['belle'],
  '#rapunzel':    ['rapunzel'],
  '#tiana':       ['tiana'],
  '#jasmine':     ['jasmine'],
  '#aurora':      ['aurora'],
  '#merida':      ['merida'],
  '#woody':       ['woody'],
  '#buzz':        ['buzz lightyear'],
  '#nemo':        ['nemo'],
  '#simba':       ['simba'],
  '#stitch':      ['stitch'],
  '#baymax':      ['baymax'],
  '#groot':       ['groot'],
  '#tigger':      ['tigger'],
  '#pooh':        ['winnie', 'pooh'],
}

const ACTIVITY_KEYWORDS = {
  '#fireworks':   ['firework', 'luminous', 'galactic', 'happily ever', 'harmonious', 'fantasmic', 'illuminate'],
  '#parade':      ['parade', 'cavalcade'],
  '#meetandgreet':['meet', 'greet', 'encounter'],
  '#adventure':   ['stunt', 'adventure'],
  '#nature':      ['nature', 'wildlife', 'bird'],
  '#nighttime':   ['nighttime'],
}

const PRINCESS_NAMES  = ['cinderella','belle','ariel','rapunzel','moana','tiana','merida','aurora','jasmine','snow white','anna','elsa','mulan']
const PIXAR_IPS       = ['toy story','nemo','dory','bird adventure','big hero','inside out','coco','ratatouille','cars','monsters','brave','incredibles','turning red','lightyear']
const MARVEL_HEROES   = ['spider-man','spiderman','thor','iron man','captain america','black panther','guardians','groot','doctor strange','ant-man','hawkeye','avenger']

function matchKeywords(n, table) {
  return Object.entries(table)
    .filter(([, kws]) => kws.some(kw => n.includes(kw)))
    .map(([tag]) => tag)
}

const MAX_TAGS = 3

// Infer hashtags from show name and theme.
// Template: collect franchise → character → activity, assemble max 3.
export function inferTags(name, theme) {
  const nameLower = name.toLowerCase()

  const franchise  = matchKeywords(nameLower, FRANCHISE_KEYWORDS)
  const characters = Object.entries(CHARACTER_KEYWORDS)
    .filter(([, keywords]) => keywords.some(kw => nameLower.includes(kw)))
    .map(([tag]) => tag)

  const activity = matchKeywords(nameLower, ACTIVITY_KEYWORDS)
  if (theme === 'nature')    activity.push('#nature')
  if (theme === 'fireworks') activity.push('#nighttime')
  if (PRINCESS_NAMES.some(p => nameLower.includes(p))) activity.push('#princess')
  if (PIXAR_IPS.some(ip => nameLower.includes(ip)) || nameLower.includes('pixar')) activity.push('#pixar')
  if (MARVEL_HEROES.some(h => nameLower.includes(h)) || nameLower.includes('marvel')) activity.push('#marvel')

  // ── Assemble: franchise → character → activity (max MAX_TAGS, deduplicated) ───
  const result = []
  const push = tag => {
    if (tag && !result.includes(tag)) result.push(tag)
  }

  push(franchise[0])
  push(characters[0])

  for (const a of activity) {
    if (result.length >= MAX_TAGS) break
    push(a)
  }
  if (result.length < MAX_TAGS) {
    for (const c of characters.slice(1)) {
      if (result.length >= MAX_TAGS) break
      push(c)
    }
  }
  if (result.length < MAX_TAGS) {
    for (const f of franchise.slice(1)) {
      if (result.length >= MAX_TAGS) break
      push(f)
    }
  }

  if (result.length === 0) result.push('#liveshow')
  return result
}

// Parse ISO 8601 timestamp → "HH:MM" in local park time (EST/EDT)
export function parseShowTime(isoString) {
  if (!isoString) return null
  const match = isoString.match(/T(\d{2}):(\d{2})/)
  if (!match) return null
  return `${match[1]}:${match[2]}`
}

// Adapter: converts a single themeparks.wiki live-show entity to our internal shape (TD-008)
function adaptLiveShow(showEntity, parkName) {
  const firstTime = parseShowTime(showEntity.showtimes[0]?.startTime)
  if (!firstTime) return null
  const theme = inferTheme(showEntity.name)
  const encodedName = encodeURIComponent(showEntity.name + WDW_SUFFIX)
  return {
    id: `live-${showEntity.id}`,
    label: showEntity.name,
    time: firstTime,
    type: 'Show',
    theme,
    tags: inferTags(showEntity.name, theme),
    showtimes: showEntity.showtimes.map(s => parseShowTime(s.startTime)).filter(Boolean),
    infoUrl: `https://www.google.com/search?q=${encodedName}`,
    mapUrl: PARK_MAP_URLS[parkName] ?? `${MAPS}${encodedName}`,
  }
}

// Fetch live show data for a park from themeparks.wiki
// Returns array of { id, label, time, type, theme, tags, infoUrl, mapUrl } or null on failure
// Caches in sessionStorage for 30 minutes
export async function fetchLiveParkShows(parkName) {
  const entityId = PARK_ENTITY_IDS[parkName]
  if (!entityId) return null

  const cacheKey = `live-shows-${entityId}`
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) {
    const { data, ts } = JSON.parse(cached)
    if (Date.now() - ts < CACHE_TTL_MS) return data
  }

  try {
    const res = await fetch(`https://api.themeparks.wiki/v1/entity/${entityId}/live`)
    if (!res.ok) return null
    const json = await res.json()

    const shows = (json.liveData || [])
      .filter(e => e.entityType === 'SHOW' && e.showtimes?.length)
      .map(e => adaptLiveShow(e, parkName))
      .filter(Boolean)
      .sort((a, b) => a.time.localeCompare(b.time))

    sessionStorage.setItem(cacheKey, JSON.stringify({ data: shows, ts: Date.now() }))
    return shows
  } catch {
    return null
  }
}

// All static shows across every park, each decorated with a `park` field for display
export const ALL_SHOWS = Object.entries(PARK_SUGGESTIONS)
  .flatMap(([park, shows]) => shows.map(s => ({ ...s, park })))

export function getParkSuggestions(park, secondPark) {
  return [park, secondPark]
    .filter(Boolean)
    .flatMap(p => PARK_SUGGESTIONS[p] || [])
}

const DW = 'https://disneyworld.disney.go.com'
const MAPS = 'https://www.google.com/maps?q='

// Static fallback suggestions (used when API is unavailable)
export const PARK_SUGGESTIONS = {
  'Magic Kingdom': [
    {
      id: 'mk-friendship-faire', label: "Mickey's Magical Friendship Faire",
      time: '10:30', type: 'Show', theme: 'character',
      tags: ['#character', '#castle', '#family'],
      infoUrl: `${DW}/entertainment/magic-kingdom/mickeys-magical-friendship-faire/`,
      mapUrl:  `${MAPS}Cinderella+Castle+Stage+Magic+Kingdom+Walt+Disney+World`,
    },
    {
      id: 'mk-festival-fantasy', label: 'Festival of Fantasy Parade',
      time: '15:00', type: 'Parade', theme: 'default',
      tags: ['#parade', '#afternoon', '#mustdo'],
      infoUrl: `${DW}/entertainment/magic-kingdom/festival-of-fantasy-parade/`,
      mapUrl:  `${MAPS}Main+Street+USA+Magic+Kingdom+Walt+Disney+World`,
    },
    {
      id: 'mk-happily-ever-after', label: 'Happily Ever After Fireworks',
      time: '21:00', type: 'Fireworks', theme: 'fireworks',
      tags: ['#fireworks', '#nighttime', '#mustdo'],
      infoUrl: `${DW}/entertainment/magic-kingdom/happily-ever-after/`,
      mapUrl:  `${MAPS}Cinderella+Castle+Magic+Kingdom+Walt+Disney+World`,
    },
  ],
  'EPCOT': [
    {
      id: 'ep-luminous', label: 'Luminous: The Symphony of Us',
      time: '21:00', type: 'Fireworks', theme: 'fireworks',
      tags: ['#fireworks', '#nighttime', '#worldshowcase'],
      infoUrl: `${DW}/entertainment/epcot/luminous-the-symphony-of-us/`,
      mapUrl:  `${MAPS}World+Showcase+Lagoon+EPCOT+Walt+Disney+World`,
    },
  ],
  "Disney's Hollywood Studios": [
    {
      id: 'hs-indy', label: 'Indiana Jones Epic Stunt Spectacular',
      time: '11:30', type: 'Show', theme: 'default',
      tags: ['#stunts', '#live', '#adventure'],
      infoUrl: `${DW}/entertainment/hollywood-studios/indiana-jones-epic-stunt-spectacular/`,
      mapUrl:  `${MAPS}Indiana+Jones+Epic+Stunt+Spectacular+Hollywood+Studios+Walt+Disney+World`,
    },
    {
      id: 'hs-fantasmic', label: 'Fantasmic!',
      time: '21:00', type: 'Fireworks', theme: 'fireworks',
      tags: ['#nighttime', '#mustdo', '#spectacular'],
      infoUrl: `${DW}/entertainment/hollywood-studios/fantasmic/`,
      mapUrl:  `${MAPS}Hollywood+Hills+Amphitheater+Hollywood+Studios+Walt+Disney+World`,
    },
    {
      id: 'hs-galactic', label: 'Star Wars: A Galactic Spectacular',
      time: '21:30', type: 'Fireworks', theme: 'fireworks',
      tags: ['#starwars', '#fireworks', '#nighttime'],
      infoUrl: `${DW}/entertainment/hollywood-studios/star-wars-a-galactic-spectacular/`,
      mapUrl:  `${MAPS}Hollywood+Studios+Walt+Disney+World`,
    },
  ],
  "Disney's Animal Kingdom": [
    {
      id: 'ak-harambe', label: 'Harambe Wildlife Parti',
      time: '17:00', type: 'Parade', theme: 'nature',
      tags: ['#parade', '#africa', '#interactive'],
      infoUrl: `${DW}/entertainment/animal-kingdom/harambe-wildlife-parti/`,
      mapUrl:  `${MAPS}Harambe+Africa+Animal+Kingdom+Walt+Disney+World`,
    },
    {
      id: 'ak-tree-awakening', label: 'Tree of Life Awakening',
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

// Infer theme from show name
export function inferTheme(name) {
  const n = name.toLowerCase()
  if (n.includes('firework') || n.includes('illuminate') || n.includes('luminous') ||
      n.includes('fantasmic') || n.includes('galactic') || n.includes('harmonious') ||
      n.includes('happily ever') || n.includes('star wars')) return 'fireworks'
  if (n.includes('parade') || n.includes('festival of fantasy') || n.includes('cavalcade') ||
      n.includes('harambe')) return 'default'
  if (n.includes('character') || n.includes('mickey') || n.includes('friendship faire') ||
      n.includes('meet')) return 'character'
  if (n.includes('nature') || n.includes('animal') || n.includes('tree of life') ||
      n.includes('rivers of light')) return 'nature'
  return 'default'
}

// Infer hashtags from show name and theme
// Builds 3 tags: franchise/IP → main character → event type
export function inferTags(name, theme) {
  const n = name.toLowerCase()
  const franchise = []
  const characters = []
  const activity = []

  // ── Franchises / Films ──────────────────────────────────────────────────
  if (n.includes('star wars') || n.includes('galactic') || n.includes('jedi') || n.includes('stormtrooper')) franchise.push('#starwars')
  if (n.includes('frozen') || n.includes('arendelle') || n.includes('sing-along')) franchise.push('#frozen')
  if (n.includes('indiana jones') || n.includes('indy') || n.includes('stunt spectacular')) franchise.push('#indianajones')
  if (n.includes('lion king') || n.includes('simba') || n.includes('timon') || n.includes('pumbaa') || n.includes('hakuna')) franchise.push('#lionking')
  if (n.includes('little mermaid') || n.includes('ursula') || n.includes('under the sea')) franchise.push('#littlemermaid')
  if (n.includes('beauty and the beast') || n.includes('lumiere') || n.includes('cogsworth')) franchise.push('#beautyandthebeast')
  if (n.includes('toy story') || n.includes('woody') || n.includes('buzz lightyear') || n.includes('jessie') || n.includes('lotso')) franchise.push('#toystory')
  if (n.includes('finding nemo') || n.includes('finding dory') || n.includes('big blue')) franchise.push('#findingnemo')
  if (n.includes('bird adventure') || n.includes('kevin') || n.includes('dug') || n.includes('russell')) franchise.push('#up')
  if (n.includes('big hero') || n.includes('baymax') || n.includes('hiro')) franchise.push('#bigherosix')
  if (n.includes('tangled') || n.includes('rapunzel') || n.includes('pascal') || n.includes('flynn')) franchise.push('#tangled')
  if (n.includes('moana') || n.includes('maui') || n.includes('motunui')) franchise.push('#moana')
  if (n.includes('aladdin') || n.includes('genie') || n.includes('agrabah') || n.includes('abu')) franchise.push('#aladdin')
  if (n.includes('cinderella') || n.includes('glass slipper') || n.includes('bibbidi')) franchise.push('#cinderella')
  if (n.includes('sleeping beauty') || n.includes('maleficent') || n.includes('aurora') || n.includes('prince phillip')) franchise.push('#sleepingbeauty')
  if (n.includes('snow white') || n.includes('seven dwarfs') || n.includes('dwarfs mine')) franchise.push('#snowwhite')
  if (n.includes('brave') || n.includes('merida') || n.includes('dunbroch')) franchise.push('#brave')
  if (n.includes('princess and the frog') || n.includes('tiana') || n.includes('naveen') || n.includes('louis the alligator')) franchise.push('#princessandthefrog')
  if (n.includes('lilo') || n.includes('stitch') || n.includes('experiment 626')) franchise.push('#liloandstitch')
  if (n.includes('winnie') || n.includes('hundred acre') || n.includes('pooh') || n.includes('tigger') || n.includes('eeyore') || n.includes('piglet')) franchise.push('#pooh')
  if (n.includes('muppet') || n.includes('kermit') || n.includes('miss piggy') || n.includes('gonzo')) franchise.push('#muppets')
  if (n.includes('figment') || n.includes('journey into imagination')) franchise.push('#figment')
  if (n.includes('coco') || n.includes('miguel') || n.includes('día de')) franchise.push('#coco')
  if (n.includes('encanto') || n.includes('mirabel') || n.includes('isabela') || n.includes('luisa') || n.includes('madrigal')) franchise.push('#encanto')
  if (n.includes('ratatouille') || n.includes('remy') || n.includes('gusteau')) franchise.push('#ratatouille')
  if (n.includes('cars') || n.includes('lightning mcqueen') || n.includes('mater') || n.includes('radiator springs')) franchise.push('#cars')
  if (n.includes('monsters') || n.includes('sulley') || n.includes('boo') || n.includes('monstropolis')) franchise.push('#monsters')
  if (n.includes('inside out') || n.includes('joy') || n.includes('sadness') || n.includes('bing bong')) franchise.push('#insideout')
  if (n.includes('incredibles') || n.includes('mr. incredible') || n.includes('elastigirl') || n.includes('dash')) franchise.push('#incredibles')
  if (n.includes('guardians') || n.includes('rocket raccoon') || n.includes('gamora') || n.includes('cosmic rewind')) franchise.push('#guardiansofthegalaxy')
  if (n.includes('spider-man') || n.includes('spiderman') || n.includes('peter parker') || n.includes('web-slinger')) franchise.push('#spiderman')
  if (n.includes('black panther') || n.includes('wakanda') || n.includes("t'challa")) franchise.push('#blackpanther')
  if (n.includes('thor') || n.includes('asgard') || n.includes('loki')) franchise.push('#thor')
  if (n.includes('captain america') || n.includes('steve rogers') || n.includes('shield')) franchise.push('#captainamerica')
  if (n.includes('iron man') || n.includes('tony stark') || n.includes('stark')) franchise.push('#ironman')
  if (n.includes('doctor strange') || n.includes('sanctum')) franchise.push('#doctorstrange')
  if (n.includes('ant-man') || n.includes('antman') || n.includes('scott lang')) franchise.push('#antman')
  if (n.includes('mulan') || n.includes('mushu') || n.includes('shang')) franchise.push('#mulan')
  if (n.includes('jungle cruise') || n.includes('jungle') && n.includes('skipper')) franchise.push('#junglecruise')

  // ── Characters ──────────────────────────────────────────────────────────
  if (n.includes('mickey')) characters.push('#mickey')
  if (n.includes('minnie')) characters.push('#minnie')
  if (n.includes('donald')) characters.push('#donald')
  if (n.includes('goofy')) characters.push('#goofy')
  if (n.includes('pluto')) characters.push('#pluto')
  if (n.includes('chip') || (n.includes('chip') && n.includes('dale'))) characters.push('#chipanddale')
  if (n.includes('elsa')) characters.push('#elsa')
  if (n.includes('anna') && !n.includes('savanna') && !n.includes('banana')) characters.push('#anna')
  if (n.includes('olaf')) characters.push('#olaf')
  if (n.includes('ariel')) characters.push('#ariel')
  if (n.includes('belle')) characters.push('#belle')
  if (n.includes('rapunzel')) characters.push('#rapunzel')
  if (n.includes('moana')) characters.push('#moana')
  if (n.includes('tiana')) characters.push('#tiana')
  if (n.includes('jasmine')) characters.push('#jasmine')
  if (n.includes('aurora')) characters.push('#aurora')
  if (n.includes('merida')) characters.push('#merida')
  if (n.includes('snow white')) characters.push('#snowwhite')
  if (n.includes('mulan')) characters.push('#mulan')
  if (n.includes('woody')) characters.push('#woody')
  if (n.includes('buzz')) characters.push('#buzz')
  if (n.includes('jessie')) characters.push('#jessie')
  if (n.includes('nemo')) characters.push('#nemo')
  if (n.includes('dory')) characters.push('#dory')
  if (n.includes('simba')) characters.push('#simba')
  if (n.includes('stitch')) characters.push('#stitch')
  if (n.includes('baymax')) characters.push('#baymax')
  if (n.includes('groot')) characters.push('#groot')
  if (n.includes('figment')) characters.push('#figment')
  if (n.includes('tigger')) characters.push('#tigger')
  if (n.includes('pooh')) characters.push('#pooh')
  if (n.includes('winnie')) characters.push('#winnie')

  // ── Event type / activity ───────────────────────────────────────────────
  if (n.includes('firework') || n.includes('luminous') || n.includes('galactic') ||
      n.includes('happily ever') || n.includes('harmonious') || n.includes('fantasmic') ||
      n.includes('illuminate')) activity.push('#fireworks')
  if (n.includes('parade') || n.includes('cavalcade')) activity.push('#parade')
  if (n.includes('meet') || n.includes('greet') || n.includes('encounter')) activity.push('#meetandgreet')
  if (n.includes('stunt') || n.includes('adventure')) activity.push('#adventure')
  if (n.includes('nature') || n.includes('wildlife') || n.includes('bird') || theme === 'nature') activity.push('#nature')
  if (n.includes('nighttime') || theme === 'fireworks') activity.push('#nighttime')
  // Category catches
  const PRINCESS_NAMES = ['cinderella','belle','ariel','rapunzel','moana','tiana','merida','aurora','jasmine','snow white','anna','elsa','mulan']
  if (PRINCESS_NAMES.some(p => n.includes(p))) activity.push('#princess')
  const PIXAR_IPS = ['toy story','nemo','dory','bird adventure','big hero','inside out','coco','ratatouille','cars','monsters','brave','incredibles','turning red','lightyear']
  if (PIXAR_IPS.some(ip => n.includes(ip)) || n.includes('pixar')) activity.push('#pixar')
  const MARVEL_HEROES = ['spider-man','spiderman','thor','iron man','captain america','black panther','guardians','groot','doctor strange','ant-man','hawkeye','avenger']
  if (MARVEL_HEROES.some(h => n.includes(h)) || n.includes('marvel')) activity.push('#marvel')

  // ── Assemble: franchise → character → activity (max 3, deduplicated) ───
  const result = []
  const push = tag => { if (tag && !result.includes(tag)) result.push(tag) }
  push(franchise[0])
  push(characters[0])
  for (const a of activity) { if (result.length >= 3) break; push(a) }
  // Fill remaining slots from overflow
  if (result.length < 3) { for (const c of characters.slice(1)) { if (result.length >= 3) break; push(c) } }
  if (result.length < 3) { for (const f of franchise.slice(1)) { if (result.length >= 3) break; push(f) } }
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
    if (Date.now() - ts < 30 * 60 * 1000) return data
  }

  try {
    const res = await fetch(`https://api.themeparks.wiki/v1/entity/${entityId}/live`)
    if (!res.ok) return null
    const json = await res.json()

    const shows = (json.liveData || [])
      .filter(e => e.entityType === 'SHOW' && e.showtimes?.length)
      .map(e => {
        const firstTime = parseShowTime(e.showtimes[0]?.startTime)
        if (!firstTime) return null
        const theme = inferTheme(e.name)
        const encodedName = encodeURIComponent(e.name + ' Walt Disney World')
        return {
          id: `live-${e.id}`,
          label: e.name,
          time: firstTime,
          type: 'Show',
          theme,
          tags: inferTags(e.name, theme),
          showtimes: e.showtimes.map(s => parseShowTime(s.startTime)).filter(Boolean),
          infoUrl: `https://www.google.com/search?q=${encodedName}`,
          mapUrl:  PARK_MAP_URLS[parkName] ?? `${MAPS}${encodedName}`,
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.time.localeCompare(b.time))

    sessionStorage.setItem(cacheKey, JSON.stringify({ data: shows, ts: Date.now() }))
    return shows
  } catch {
    return null
  }
}

export function getParkSuggestions(park, secondPark) {
  return [park, secondPark]
    .filter(Boolean)
    .flatMap(p => PARK_SUGGESTIONS[p] || [])
}

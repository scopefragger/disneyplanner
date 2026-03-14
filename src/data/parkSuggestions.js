import { inferTheme } from './planHelpers.js'
import { WDW_SUFFIX } from './constants.js'
import parkShowsRaw from './yaml/park-shows.yaml'
import parkConfigRaw from './yaml/park-config.yaml'
import keywordsRaw from './yaml/keywords.yaml'

const MAPS = 'https://www.google.com/maps?q='

// Static fallback suggestions (used when API is unavailable) — edit park-shows.yaml
export const PARK_SUGGESTIONS = parkShowsRaw

// themeparks.wiki entity IDs and fallback map URLs — edit park-config.yaml
const PARK_ENTITY_IDS = parkConfigRaw.entityIds
const PARK_MAP_URLS   = parkConfigRaw.mapUrls

// Declarative keyword tables for inferTags — edit keywords.yaml
const FRANCHISE_KEYWORDS = keywordsRaw.franchiseKeywords
const CHARACTER_KEYWORDS = keywordsRaw.characterKeywords
const ACTIVITY_KEYWORDS  = keywordsRaw.activityKeywords
const PRINCESS_NAMES     = keywordsRaw.princessNames
const PIXAR_IPS          = keywordsRaw.pixarIps
const MARVEL_HEROES      = keywordsRaw.marvelHeroes

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

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

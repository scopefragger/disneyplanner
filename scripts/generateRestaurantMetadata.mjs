import fs from 'node:fs/promises'

const APP_FILE = new URL('../src/App.jsx', import.meta.url)
const OUT_FILE = new URL('../src/data/restaurantMetadata.js', import.meta.url)
const BASE = 'https://www.disneyworld.co.uk'

const DETAIL_URL_ALIASES = {
  'Regal Eagle Smokehouse': '/dining/epcot/regal-eagle-smokehouse/',
  'Restaurantosaurus': '/dining/animal-kingdom/restaurantosaurus/',
  'The BOATHOUSE': '/dining/disney-springs/the-boathouse/',
  'Wine Bar George': '/dining/disney-springs/wine-bar-george/',
  'Jaleo by Jose Andres': '/dining/disney-springs/jaleo/',
  'STK Orlando': '/dining/disney-springs/stk-orlando/',
  'Victoria and Alberts': '/dining/grand-floridian-resort-and-spa/victoria-and-alberts/'
}

function extractRestaurantNames(source) {
  const sectionMatch = source.match(/const RESTAURANT_GROUPS = \{([\s\S]*?)\n\}\n\nconst DISNEY_WORLD_BASE_URL/)
  if (!sectionMatch) {
    throw new Error('Could not find RESTAURANT_GROUPS block in App.jsx')
  }

  const lines = sectionMatch[1].split('\n')
  const names = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (/^'[^']+':\s*\[$/.test(trimmed)) continue
    const valueMatch = trimmed.match(/^'([^']+)'[,]?$/)
    if (valueMatch) names.push(valueMatch[1])
  }

  return [...new Set(names)]
}

function absolute(urlOrPath) {
  if (!urlOrPath) return ''
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) return urlOrPath
  if (urlOrPath.startsWith('/')) return `${BASE}${urlOrPath}`
  return `${BASE}/${urlOrPath}`
}

function normalizeName(value) {
  return value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(value) {
  return new Set(normalizeName(value).split(' ').filter(Boolean))
}

function similarityScore(a, b) {
  const aSet = tokenize(a)
  const bSet = tokenize(b)
  if (!aSet.size || !bSet.size) return 0
  let overlap = 0
  for (const token of aSet) {
    if (bSet.has(token)) overlap += 1
  }
  return overlap / Math.max(aSet.size, bSet.size)
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

function extractNgStateJson(html) {
  const marker = '<script id="ng-state" type="application/json">'
  const start = html.indexOf(marker)
  if (start < 0) return null
  const jsonStart = start + marker.length
  const end = html.indexOf('</script>', jsonStart)
  if (end < 0) return null
  return html.slice(jsonStart, end)
}

function extractDiningIndexResults(ngState) {
  const entries = Object.values(ngState || {})
  for (const entry of entries) {
    const results = entry?.b?.results
    if (Array.isArray(results) && results.length > 0) {
      return results
    }
  }
  return []
}

async function loadDiningDirectory() {
  const html = await fetchHtml(`${BASE}/dining/`)
  const jsonText = extractNgStateJson(html)
  if (!jsonText) throw new Error('Could not locate ng-state JSON in dining page')
  const ngState = JSON.parse(jsonText)
  const results = extractDiningIndexResults(ngState)

  const directory = new Map()
  for (const result of results) {
    const name = result?.name
    const url = result?.url
    if (!name || !url) continue

    const normalized = normalizeName(name)
    const image = result?.media?.finderStandardThumb?.url || ''

    directory.set(normalized, {
      name,
      detailUrl: absolute(url),
      listImage: absolute(image)
    })
  }

  return directory
}

function resolveDirectoryEntry(name, directory) {
  const normalized = normalizeName(name)
  if (directory.has(normalized)) return directory.get(normalized)

  let best = null
  let bestScore = 0

  for (const entry of directory.values()) {
    const score = similarityScore(name, entry.name)
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }

  return bestScore >= 0.55 ? best : null
}

function extractMenuUrl(html, detailUrl) {
  const menuMatch = html.match(/href=\"([^\"]*\/dining\/[^\"]*\/menus\/[^\"]*)\"/i)
  return absolute(menuMatch?.[1] || `${new URL(detailUrl).pathname.replace(/\/$/, '')}/menus/`)
}

function extractBookingUrl(html, restaurantDetailUrl) {
  const bookingMatch = html.match(/href=\"([^\"]*\/dine-res\/restaurant\/[^\"]+)\"/i)
  if (bookingMatch?.[1]) return absolute(bookingMatch[1])

  const detailPath = new URL(restaurantDetailUrl).pathname
  const slug = detailPath.split('/').filter(Boolean).at(-1)
  return slug ? `${BASE}/dine-res/restaurant/${slug}/` : ''
}

function extractHeroImage(html) {
  const preferred = [...html.matchAll(/https:\/\/cdn1\.parksmedia\.wdprapps\.disney\.com\/resize\/mwImage\/1\/1600\/900\/75\/[^"]+/g)].map((m) => m[0])
  if (preferred.length) return preferred[0]

  const og = html.match(/property=\"og:image\"\s+content=\"([^\"]+)\"/i)
  if (og?.[1]) return og[1]

  const genericCdn = html.match(/https:\/\/cdn1\.parksmedia\.wdprapps\.disney\.com\/resize\/mwImage\/1\/[0-9]+\/[0-9]+\/75\/[^"]+/i)
  if (genericCdn?.[0]) return genericCdn[0]

  return ''
}

function makeFallback(name) {
  const query = encodeURIComponent(name)
  const searchUrl = `${BASE}/search/?q=${query}`
  return {
    menuUrl: searchUrl,
    bookingUrl: searchUrl,
    heroImage: ''
  }
}

async function buildMetadata(name, directory) {
  const aliasUrl = DETAIL_URL_ALIASES[name] ? absolute(DETAIL_URL_ALIASES[name]) : ''
  const entry = resolveDirectoryEntry(name, directory)
  const detailUrl = aliasUrl || entry?.detailUrl || ''

  if (!detailUrl) return makeFallback(name)

  try {
    const detailHtml = await fetchHtml(detailUrl)
    return {
      menuUrl: extractMenuUrl(detailHtml, detailUrl),
      bookingUrl: extractBookingUrl(detailHtml, detailUrl),
      heroImage: extractHeroImage(detailHtml) || entry?.listImage || ''
    }
  } catch {
    const fallback = makeFallback(name)
    return {
      ...fallback,
      heroImage: entry?.listImage || ''
    }
  }
}

function toJsModule(metadata) {
  const entries = Object.entries(metadata)
    .map(([name, value]) => {
      const menuUrl = value.menuUrl || ''
      const bookingUrl = value.bookingUrl || ''
      const heroImage = value.heroImage || ''
      return `  ${JSON.stringify(name)}: {\n    menuUrl: ${JSON.stringify(menuUrl)},\n    bookingUrl: ${JSON.stringify(bookingUrl)},\n    heroImage: ${JSON.stringify(heroImage)}\n  }`
    })
    .join(',\n')

  return `export const RESTAURANT_METADATA = {\n${entries}\n}\n`
}

async function main() {
  const source = await fs.readFile(APP_FILE, 'utf8')
  const names = extractRestaurantNames(source)
  const directory = await loadDiningDirectory()
  const metadata = {}

  for (const [index, name] of names.entries()) {
    const data = await buildMetadata(name, directory)
    metadata[name] = data
    const status = `${index + 1}/${names.length}`
    const coverage = data.heroImage ? 'image' : 'no-image'
    console.log(`${status} ${name} -> ${coverage}`)
  }

  await fs.writeFile(OUT_FILE, toJsModule(metadata), 'utf8')
  console.log(`Wrote ${OUT_FILE.pathname}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

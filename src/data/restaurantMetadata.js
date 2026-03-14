// Restaurant reference data — sourced from ./yaml/restaurants.yaml
import raw from './yaml/restaurants.yaml'

export const RESTAURANT_METADATA = Object.fromEntries(
  Object.entries(raw).map(([name, r]) => [name, {
    menuUrl:    r.menuUrl    ?? '',
    bookingUrl: r.bookingUrl ?? '',
    heroImage:  r.heroImage  ?? '',
  }])
)

export const RESTAURANT_TAGS = Object.fromEntries(
  Object.entries(raw).map(([name, r]) => [name, r.tags ?? []])
)

export const RESTAURANT_GROUPS = (() => {
  const groups = {}
  for (const [name, r] of Object.entries(raw)) {
    const park = r.park ?? 'Unknown'
    if (!groups[park]) groups[park] = []
    groups[park].push(name)
  }
  return groups
})()

export const RESTAURANT_DESCRIPTIONS = Object.fromEntries(
  Object.entries(raw).map(([name, r]) => [name, r.description ?? null]).filter(([, d]) => d)
)

export const ALL_RESTAURANTS = Object.keys(raw)

export function getRestaurantDescription(restaurant) {
  return RESTAURANT_DESCRIPTIONS[restaurant] ?? null
}

const DISNEY_WORLD_BASE_URL = 'https://www.disneyworld.co.uk'

export function getRestaurantResources(restaurantName) {
  const metadata = RESTAURANT_METADATA[restaurantName]
  if (metadata) return metadata

  const query = encodeURIComponent(restaurantName)
  const searchUrl = `${DISNEY_WORLD_BASE_URL}/search/?q=${query}`
  return {
    menuUrl:    searchUrl,
    bookingUrl: searchUrl,
    heroImage:  ''
  }
}

// Ride reference data — sourced from ./yaml/rides.yaml
import { IMG_BASE } from './constants.js'
import raw from './yaml/rides.yaml'

const BASE_URL = 'https://disneyworld.disney.go.com/attractions/'

const ALL_RIDES = Object.values(raw.parks).flat()

export const RIDES_BY_PARK    = Object.fromEntries(
  Object.entries(raw.parks).map(([park, rides]) => [park, rides.map(r => r.name)])
)
export const RIDE_URLS         = Object.fromEntries(ALL_RIDES.map(r => [r.name, `${BASE_URL}${r.urlSlug}`]))
export const RIDE_TAGS         = Object.fromEntries(ALL_RIDES.map(r => [r.name, r.tags]))
export const RIDE_DESCRIPTIONS = Object.fromEntries(ALL_RIDES.map(r => [r.name, r.description]))
export const RIDE_IMAGES       = Object.fromEntries(ALL_RIDES.map(r => [r.name, `${IMG_BASE}${r.image}`]))

export function getRideUrl(ride)         { return RIDE_URLS[ride] ?? null }
export function getRideTags(ride)        { return RIDE_TAGS[ride] ?? [] }
export function getRideDescription(ride) { return RIDE_DESCRIPTIONS[ride] ?? null }

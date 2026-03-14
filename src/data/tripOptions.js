// Trip planning option arrays — data sourced from ./yaml/trip-options.yaml
import { IMG_BASE } from './constants.js'
import raw from './yaml/trip-options.yaml'

export const PARK_OPTIONS        = raw.parkOptions
export const DINING_OPTIONS      = raw.diningOptions
export const ENTERTAINMENT_TYPES = raw.entertainmentTypes
export const FRANCHISE_OPTIONS   = raw.franchiseOptions
export const DAY_TYPES           = raw.dayTypes.map(d => ({ ...d, icon: `${IMG_BASE}${d.icon}` }))
export const SWIM_OPTIONS        = raw.swimOptions.map(s => ({ ...s, icon: `${IMG_BASE}${s.icon}` }))
export const DISNEY_HOTELS       = raw.disneyHotels
export const EVENT_TYPES         = raw.eventTypes

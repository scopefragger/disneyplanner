// Queue time advisory helpers — TD-free pure functions, fully testable
import raw from './yaml/wait-config.yaml'

const BASE_TIMES        = raw.baseTimes
const SEASON_MULTIPLIERS = raw.seasonMultipliers
const MONTH_SEASONS     = raw.monthSeasons

/**
 * Returns the season key for a date string (YYYY-MM-DD).
 * Falls back to 'moderate' for invalid input.
 */
export function getSeasonFromDate(dateString) {
  if (!dateString) return 'moderate'
  const month = parseInt(dateString.split('-')[1], 10)
  if (!month || month < 1 || month > 12) return 'moderate'
  return MONTH_SEASONS[month] ?? 'moderate'
}

/**
 * Returns the time slot key for a "HH:MM" string.
 * Falls back to 'midday' for invalid input.
 */
export function getTimeSlotFromTime(timeStr) {
  if (!timeStr) return 'midday'
  const [h, m] = timeStr.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return 'midday'
  const total = h * 60 + m
  if (total < 600)  return 'opening'   // < 10:00
  if (total < 720)  return 'morning'   // < 12:00
  if (total < 900)  return 'midday'    // < 15:00
  if (total < 1080) return 'afternoon' // < 18:00
  return 'evening'
}

/**
 * Returns the typical wait time in minutes for a ride at a given date/time,
 * rounded to the nearest 5 minutes (minimum 5).
 *
 * @param {string} demand - 'low' | 'medium' | 'high' | 'very_high'
 * @param {string} dateString - 'YYYY-MM-DD' (used to determine season)
 * @param {string} timeStr - 'HH:MM' (used to determine time slot)
 * @returns {number|null} typical wait in minutes, or null if demand unknown
 */
export function getTypicalWait(demand, dateString, timeStr) {
  const base = BASE_TIMES[demand]
  if (!base) return null

  const slot       = getTimeSlotFromTime(timeStr)
  const season     = getSeasonFromDate(dateString)
  const multiplier = SEASON_MULTIPLIERS[season] ?? 1.0
  const raw        = base[slot] * multiplier

  // Round to nearest 5, minimum 5
  return Math.max(5, Math.round(raw / 5) * 5)
}

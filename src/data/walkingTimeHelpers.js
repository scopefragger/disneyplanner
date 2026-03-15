import raw from './yaml/park-areas.yaml'

const SAME_AREA_MINUTES = 3
const FALLBACK_MINUTES = 5

/**
 * Returns walking time in minutes between two park areas.
 * Symmetric lookup — checks both (from→to) and (to→from) in the matrix.
 * Falls back to FALLBACK_MINUTES if areas unknown or park not found.
 */
export function getWalkingTime(fromArea, toArea, park) {
  if (!fromArea || !toArea || !park) return FALLBACK_MINUTES
  if (fromArea === toArea) return SAME_AREA_MINUTES

  const parkData = raw[park]
  if (!parkData) return FALLBACK_MINUTES

  const matrix = parkData.matrix
  const fromRow = matrix[fromArea]
  if (fromRow && fromRow[toArea] != null) return fromRow[toArea]

  // symmetric: try the reverse
  const toRow = matrix[toArea]
  if (toRow && toRow[fromArea] != null) return toRow[fromArea]

  return FALLBACK_MINUTES
}

/**
 * Returns a status string describing how comfortable the gap is vs the walk time.
 * ok         — gap is at least walk + 15 min (comfortable)
 * tight      — gap is at least walk time (possible but hurry)
 * impossible — gap is less than walk time
 */
export function getWalkGapStatus(walkMins, gapMins) {
  if (gapMins >= walkMins + 15) return 'ok'
  if (gapMins >= walkMins) return 'tight'
  return 'impossible'
}

/**
 * Converts 'HH:MM' time string to total minutes since midnight.
 * Returns null for invalid input.
 */
export function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null
  const parts = timeStr.split(':')
  if (parts.length < 2) return null
  const h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  if (isNaN(h) || isNaN(m)) return null
  return h * 60 + m
}

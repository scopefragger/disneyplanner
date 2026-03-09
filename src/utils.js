// Date / time formatters (TD-033)

export function getDateRange(startDate, endDate) {
  if (!startDate || !endDate) return []
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return []

  const dates = []
  const cursor = new Date(start)
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

export function formatPrettyDate(dateString) {
  if (!dateString) return ''
  const d = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatShortDate(dateStr) {
  if (!dateStr) return ''
  const [, month, day] = dateStr.split('-')
  return `${parseInt(month, 10)}/${parseInt(day, 10)}`
}

export function formatTime(time) {
  if (!time) return ''
  const [hours, minutes] = time.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes)) return time
  const period = hours >= 12 ? 'pm' : 'am'
  const hour = hours % 12 || 12
  return `${hour}:${minutes.toString().padStart(2, '0')}${period}`
}

/**
 * Fuzzy string matcher — returns true if all characters of query
 * appear in order within text (fast path: substring match first).
 */
export function fuzzyMatch(query, text) {
  if (!query) return true
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  if (textLower.includes(queryLower)) return true
  let qi = 0
  for (let i = 0; i < textLower.length && qi < queryLower.length; i++) {
    if (textLower[i] === queryLower[qi]) qi++
  }
  return qi === queryLower.length
}

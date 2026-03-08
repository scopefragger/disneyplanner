import { formatPrettyDate, formatShortDate, formatTime } from '../utils.js'
import { PARK_OPTIONS, DAY_TYPES, SWIM_OPTIONS, DISNEY_HOTELS } from '../data/tripOptions.js'
import { getParkSuggestions } from '../data/parkSuggestions.js'
import { getRideUrl, RIDE_IMAGES } from '../data/rideData.js'
import { normalizeEventItem, buildEventLabel } from '../data/planHelpers.js'
import { getDayTypeChipColor, hashtagLabel, getDayCardStyle, getDayTypeIcon, getSecondParkOptions, getItemSlot, getTimeSlots, getLocationDisplay } from '../data/displayHelpers.js'

export default function DayPlanSection({ plan, tripDates, activeDay, setActiveDay, liveShowData, editingDayItem, setEditingDayItem, updateDayPlan, updateDayItem, removeDayItem, acceptSuggestion, dismissSuggestion, clearDayType, clearPark, clearSwimSpot, clearStaySpot, resetDay, toggleParkHop, setDayType, setPark }) {
  const date = tripDates[activeDay]
  const index = activeDay
  const dayPlan = plan.dayPlans?.[date] || {
    dayType: '', park: '', secondPark: '', parkHop: false, swimSpot: '', staySpot: '', items: []
  }
  const hotelShoppingOptions = [
    ...(plan.myHotel.trim()
      ? [{ value: plan.myHotel.trim(), label: `My hotel: ${plan.myHotel.trim()}` }]
      : []),
    { value: 'Disney Springs', label: 'Disney Springs' },
    ...DISNEY_HOTELS
      .filter((hotel) => hotel !== plan.myHotel.trim())
      .map((hotel) => ({ value: hotel, label: hotel }))
  ]
  const locationDisplay = getLocationDisplay(dayPlan, plan.myHotel.trim())
  const dayTypeChipColor = getDayTypeChipColor(dayPlan.dayType)
  const secondParkOptions = getSecondParkOptions(dayPlan.park)
  const itemsWithIndex = (dayPlan.items || []).map((item, idx) => ({ ...item, _idx: idx }))
  const timeSlots = getTimeSlots(dayPlan.dayType)
  const dismissed = dayPlan.dismissedSuggestions || []
  const ghostSuggestions = (() => {
    if (dayPlan.dayType !== 'Park') return []
    const parks = [dayPlan.park, dayPlan.secondPark].filter(Boolean)
    const fromLive = parks.flatMap(park => liveShowData[park] || [])
    const fromStatic = getParkSuggestions(dayPlan.park, dayPlan.secondPark)
    const base = fromLive.length ? fromLive : fromStatic
    const favSet = new Set(plan.favoriteTags || [])
    return base.filter(s => {
      if (dismissed.includes(s.id)) return false
      if (!favSet.size) return true
      return s.tags?.some(t => favSet.has(t))
    })
  })()

  return (
    <section className="card card-wide">
      <div className="card-title-row day-header">
        <h2>Daily Plan by Date</h2>
        <div className="day-nav-arrows">
          <button disabled={activeDay === 0} onClick={() => setActiveDay(d => d - 1)}>←</button>
          <span>Day {activeDay + 1} of {tripDates.length || 0}</span>
          <button disabled={activeDay >= tripDates.length - 1} onClick={() => setActiveDay(d => d + 1)}>→</button>
        </div>
      </div>

      {!tripDates.length && (
        <p className="section-hint">Set your start and end date to unlock daily planning cards.</p>
      )}

      <div className="date-plan-grid">
        <div className="day-nav-strip">
          {tripDates.map((d, i) => {
            const dp = plan.dayPlans?.[d]
            const isPlanned = !!(dp?.dayType || dp?.items?.length)
            return (
              <button
                key={d}
                type="button"
                className={['day-nav-btn', i === activeDay ? 'active' : '', isPlanned ? 'has-plan' : ''].filter(Boolean).join(' ')}
                onClick={() => setActiveDay(i)}
              >
                <span className="day-nav-num">{i + 1}</span>
                <span className="day-nav-date">{formatShortDate(d)}</span>
              </button>
            )
          })}
        </div>

        {tripDates.length > 0 && <>
        <article key={date} className="date-card" style={getDayCardStyle(dayPlan)}>
          <div className="card-badges">
            {dayPlan.dayType && (
              <button
                type="button"
                className="day-type-badge"
                onClick={() => clearDayType(date)}
                title="Remove day type"
              >
                <img src={getDayTypeIcon(dayPlan.dayType)} alt={dayPlan.dayType} />
              </button>
            )}
            {locationDisplay && (
              <button
                type="button"
                className="day-type-badge"
                onClick={() => {
                  if (dayPlan.dayType === 'Park') clearPark(date)
                  if (dayPlan.dayType === 'Swimming') clearSwimSpot(date)
                  if (dayPlan.dayType === 'Hotel/Shopping') clearStaySpot(date)
                }}
                title={`Remove ${locationDisplay.label}`}
              >
                <img src={locationDisplay.icon} alt={locationDisplay.label} />
              </button>
            )}
          </div>

          <div className="date-card-head">
            <div className="date-title-row">
              <h3>Day {index + 1}</h3>
            </div>
            <p>{formatPrettyDate(date)}</p>
            {dayPlan.dayType && (
              <div className="day-summary-group">
                <span
                  className="day-summary-pill day-summary-type"
                  style={{ '--chip-color': dayTypeChipColor }}
                >
                  {hashtagLabel(dayPlan.dayType)}
                </span>
                {dayPlan.dayType === 'Park' && dayPlan.parkHop && (
                  <span
                    className="day-summary-pill day-summary-type"
                    style={{ '--chip-color': dayTypeChipColor }}
                  >
                    {hashtagLabel('ParkHop')}
                  </span>
                )}
                <span
                  className="day-summary-pill day-summary-location"
                  style={{ '--chip-color': dayTypeChipColor }}
                >
                  {hashtagLabel(dayPlan.parkHop && dayPlan.dayType === 'Park'
                    ? dayPlan.park || 'Choose first park'
                    : locationDisplay
                      ? locationDisplay.label.replace(/^My hotel:\s*/i, '')
                      : 'Choose location')}
                </span>
                {dayPlan.dayType === 'Park' && dayPlan.parkHop && (
                  <span
                    className="day-summary-pill day-summary-location"
                    style={{ '--chip-color': dayTypeChipColor }}
                  >
                    {hashtagLabel(dayPlan.secondPark || 'Choose second park')}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="day-form-stack">
            <div className="day-meta-row">
              {!dayPlan.dayType && (
                <label className="field-compact">
                  Day type
                  <select
                    value={dayPlan.dayType}
                    onChange={(event) => setDayType(date, event.target.value)}
                  >
                    <option value="">Select day type</option>
                    {DAY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.value}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {dayPlan.dayType === 'Park' && !dayPlan.park && (
                <label className="field-compact">
                  Park
                  <select
                    value={dayPlan.park}
                    onChange={(event) => setPark(date, event.target.value)}
                  >
                    <option value="">Select park</option>
                    {PARK_OPTIONS.map((park) => (
                      <option key={park} value={park}>
                        {park}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {dayPlan.dayType === 'Park' && dayPlan.park && dayPlan.parkHop && (
                <label className="field-compact">
                  Hop to
                  <select
                    value={dayPlan.secondPark}
                    onChange={(event) => updateDayPlan(date, 'secondPark', event.target.value)}
                  >
                    <option value="">Select second park</option>
                    {secondParkOptions.map((park) => (
                      <option key={park} value={park}>
                        {park}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {dayPlan.dayType === 'Swimming' && !dayPlan.swimSpot && (
                <label className="field-compact">
                  Swim park
                  <select
                    value={dayPlan.swimSpot}
                    onChange={(event) => updateDayPlan(date, 'swimSpot', event.target.value)}
                  >
                    <option value="">Select water park</option>
                    {SWIM_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {dayPlan.dayType === 'Hotel/Shopping' && !dayPlan.staySpot && (
                <label className="field-compact">
                  Hotel / shopping location
                  <select
                    value={dayPlan.staySpot}
                    onChange={(event) => updateDayPlan(date, 'staySpot', event.target.value)}
                  >
                    <option value="">Select location</option>
                    {hotelShoppingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          </div>

          <div className="park-hop-dock">
            <button
              type="button"
              className={dayPlan.dayType === 'Park' ? 'park-hop-btn' : 'park-hop-btn disabled'}
              onClick={() => toggleParkHop(date)}
            >
              {dayPlan.parkHop ? 'Remove park hop' : 'Park hop'}
            </button>
            <button
              type="button"
              className="park-hop-btn reset-day-btn"
              onClick={() => resetDay(date)}
            >
              Reset day
            </button>
          </div>
        </article>

        <div className="day-timeline-card card">
          <div className="day-timeline">
            {timeSlots.flatMap(slot => {
              const slotItems = itemsWithIndex.filter(item => getItemSlot(item) === slot.slot)
              const slotGhosts = ghostSuggestions.filter(s => getItemSlot(s) === slot.slot)
              if (!slotItems.length && !slotGhosts.length) return []
              return [(
                <div key={`slot-${slot.slot}`} className="timeline-slot">
                  <div className="timeline-anchor">
                    <span className="timeline-anchor-time">{slot.time}</span>
                    <span className="timeline-anchor-label">{slot.label}</span>
                  </div>
                  <div className="timeline-node" />
                  <div className="timeline-slot-events">
                    {slotItems.map(item => {
                      const normalizedItem = normalizeEventItem(item)
                      const label = buildEventLabel(normalizedItem)
                      const menuUrl = normalizedItem.menuUrl
                      const bookingUrl = normalizedItem.bookingUrl
                      const hasRestaurantLinks = Boolean(normalizedItem.type !== 'Ride' && normalizedItem.restaurant && (menuUrl || bookingUrl))
                      const rideName = normalizedItem.ride ? normalizedItem.ride.split('::').pop() : ''
                      const rideUrl = getRideUrl(rideName) || ''
                      const rideImage = RIDE_IMAGES[rideName] || ''
                      const mapSearchTerm = rideName || normalizedItem.restaurant || normalizedItem.note || dayPlan.park || 'Walt Disney World'
                      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapSearchTerm + ' Walt Disney World')}`
                      const viewInfoUrl = !menuUrl
                        ? (rideUrl || `https://www.google.com/search?q=${encodeURIComponent(mapSearchTerm + ' Walt Disney World')}`)
                        : ''
                      const isEditing = editingDayItem?.date === date && editingDayItem?.index === item._idx
                      return (
                        <div key={`event-${item._idx}`} className="timeline-event">
                          {isEditing ? (
                            <div className="timeline-event-edit" data-theme={normalizedItem.theme}>
                              <div className="event-edit-fields">
                                <label className="event-edit-label">
                                  Time
                                  <input
                                    type="time"
                                    value={editingDayItem.draft.time || ''}
                                    onChange={(e) => setEditingDayItem(prev => ({ ...prev, draft: { ...prev.draft, time: e.target.value } }))}
                                  />
                                </label>
                                <label className="event-edit-label">
                                  Note
                                  <input
                                    type="text"
                                    placeholder="Optional note"
                                    value={editingDayItem.draft.note || ''}
                                    onChange={(e) => setEditingDayItem(prev => ({ ...prev, draft: { ...prev.draft, note: e.target.value } }))}
                                  />
                                </label>
                              </div>
                              <div className="event-edit-actions">
                                <button
                                  type="button"
                                  className="event-edit-save"
                                  onClick={() => {
                                    updateDayItem(date, item._idx, editingDayItem.draft)
                                    setEditingDayItem(null)
                                  }}
                                >Save</button>
                                <button
                                  type="button"
                                  className="event-edit-cancel"
                                  onClick={() => setEditingDayItem(null)}
                                >Cancel</button>
                                <button
                                  type="button"
                                  className="event-edit-delete"
                                  onClick={() => { removeDayItem(date, item._idx); setEditingDayItem(null) }}
                                >Delete</button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="timeline-event-content"
                              data-theme={normalizedItem.theme}
                              style={rideImage ? { backgroundImage: `linear-gradient(to bottom right, rgba(255,255,255,1) 30%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0) 100%), url(${rideImage})`, backgroundSize: 'cover', backgroundPosition: 'center right' } : undefined}
                            >
                              <div className="event-text">
                                {normalizedItem.time && (
                                  <span className="event-time">{formatTime(normalizedItem.time)}</span>
                                )}
                                <p>{label}</p>
                                <div className="event-links">
                                  {hasRestaurantLinks && menuUrl && (
                                    <a href={menuUrl} target="_blank" rel="noreferrer noopener">View menu</a>
                                  )}
                                  {hasRestaurantLinks && bookingUrl && (
                                    <a href={bookingUrl} target="_blank" rel="noreferrer noopener">Book</a>
                                  )}
                                  {viewInfoUrl && (
                                    <a href={viewInfoUrl} target="_blank" rel="noreferrer noopener">View info</a>
                                  )}
                                  <a href={mapUrl} target="_blank" rel="noreferrer noopener">View on map</a>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="event-edit-btn"
                                title="Edit"
                                onClick={() => setEditingDayItem({ date, index: item._idx, draft: { time: normalizedItem.time || '', note: normalizedItem.note || '' } })}
                              >✏</button>
                              <button type="button" className="event-delete-btn" onClick={() => removeDayItem(date, item._idx)}>×</button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {slotGhosts.map(suggestion => (
                      <div key={suggestion.id} className="timeline-event">
                        <div className="ghost-event-content" data-theme={suggestion.theme}>
                          <div className="event-text">
                            <span className="event-time">{formatTime(suggestion.time)}</span>
                            <p>{suggestion.label}</p>
                            {suggestion.tags?.length > 0 && (
                              <div className="ghost-tags">
                                {suggestion.tags.map(tag => (
                                  <span key={tag} className="ghost-tag">{tag}</span>
                                ))}
                              </div>
                            )}
                            <div className="ghost-links">
                              {suggestion.infoUrl && (
                                <a href={suggestion.infoUrl} target="_blank" rel="noreferrer noopener"
                                  className="ghost-link" title="About this show">ℹ Info</a>
                              )}
                              {suggestion.mapUrl && (
                                <a href={suggestion.mapUrl} target="_blank" rel="noreferrer noopener"
                                  className="ghost-link" title="View on map">📍 Map</a>
                              )}
                            </div>
                          </div>
                          <div className="ghost-actions">
                            <button type="button" className="ghost-accept-btn" title="Add to my plan"
                              onClick={() => acceptSuggestion(date, suggestion)}>✓</button>
                            <button type="button" className="ghost-dismiss-btn" title="Not for me"
                              onClick={() => dismissSuggestion(date, suggestion.id)}>✕</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )]
            })}
            {!dayPlan.items?.length && (
              <p className="timeline-empty">Search above to add your first event</p>
            )}
          </div>
        </div>
        </>}
      </div>
    </section>
  )
}

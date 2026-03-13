import { formatPrettyDate, formatShortDate } from '../utils.js'
import { PARK_OPTIONS, DAY_TYPES, SWIM_OPTIONS, DISNEY_HOTELS } from '../data/tripOptions.js'
import { getParkSuggestions } from '../data/parkSuggestions.js'
import { getRideUrl, RIDE_IMAGES } from '../data/rideData.js'
import { normalizeEventItem, buildEventLabel } from '../data/planHelpers.js'
import { WDW_SUFFIX } from '../data/constants.js'
import { getDayTypeChipColor, hashtagLabel, getDayCardStyle, getDayTypeIcon, getSecondParkOptions, getItemSlot, getTimeSlots, getLocationDisplay, getEventDescription } from '../data/displayHelpers.js'
import TimelineEventCard from './TimelineEventCard.jsx'

const GOOGLE_MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1&query='
const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q='

// ── Pre-component helpers ─────────────────────────────────────────────────────

function buildHotelShoppingOptions(myHotel) {
  return [
    ...(myHotel ? [{ value: myHotel, label: `My hotel: ${myHotel}` }] : []),
    { value: 'Disney Springs', label: 'Disney Springs' },
    ...DISNEY_HOTELS
      .filter((hotel) => hotel !== myHotel)
      .map((hotel) => ({ value: hotel, label: hotel }))
  ]
}

function computeGhostSuggestions(dayPlan, liveShowData, favoriteTags, dismissed) {
  if (dayPlan.dayType !== 'Park') return []
  const parks = [dayPlan.park, dayPlan.secondPark].filter(Boolean)
  const fromLive = parks.flatMap(park => liveShowData[park] || [])
  const fromStatic = getParkSuggestions(dayPlan.park, dayPlan.secondPark)
  const base = fromLive.length ? fromLive : fromStatic
  const favSet = new Set(favoriteTags || [])
  return base.filter(s => {
    if (dismissed.includes(s.id)) return false
    if (!favSet.size) return true
    return s.tags?.some(t => favSet.has(t))
  })
}

function buildItemUrls(normalizedItem, dayPlan) {
  const rideName = normalizedItem.ride ? normalizedItem.ride.split('::').pop() : ''
  const rideUrl = getRideUrl(rideName) || ''
  const menuUrl = normalizedItem.menuUrl
  const bookingUrl = normalizedItem.bookingUrl
  const mapSearchTerm = rideName || normalizedItem.restaurant || normalizedItem.note || dayPlan.park || 'Walt Disney World'
  const mapUrl = `${GOOGLE_MAPS_SEARCH_URL}${encodeURIComponent(mapSearchTerm + WDW_SUFFIX)}`
  const viewInfoUrl = !menuUrl
    ? (rideUrl || `${GOOGLE_SEARCH_URL}${encodeURIComponent(mapSearchTerm + WDW_SUFFIX)}`)
    : ''
  return { rideName, rideUrl, menuUrl, bookingUrl, mapUrl, viewInfoUrl }
}

function renderEditForm({ editingDayItem, setEditingDayItem, updateDayItem, removeDayItem, date, itemIdx, normalizedItem }) {
  const updateEditDraft = (field, value) => setEditingDayItem(prev => ({
    ...prev,
    draft: { ...prev.draft, [field]: value }
  }))
  return (
    <div className="timeline-event-edit" data-theme={normalizedItem.theme}>
      <div className="event-edit-fields">
        <label className="event-edit-label">
          Time
          <input
            type="time"
            value={editingDayItem.draft.time || ''}
            onChange={(e) => updateEditDraft('time', e.target.value)}
          />
        </label>
        <label className="event-edit-label">
          Note
          <input
            type="text"
            placeholder="Optional note"
            value={editingDayItem.draft.note || ''}
            onChange={(e) => updateEditDraft('note', e.target.value)}
          />
        </label>
      </div>
      <div className="event-edit-actions">
        <button
          type="button"
          className="event-edit-save"
          onClick={() => {
            updateDayItem(date, itemIdx, editingDayItem.draft)
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
          onClick={() => { removeDayItem(date, itemIdx); setEditingDayItem(null) }}
        >Delete</button>
      </div>
    </div>
  )
}

function renderTimelineEvent({ item, date, editingDayItem, setEditingDayItem, updateDayItem, removeDayItem, dayPlan }) {
  const normalizedItem = normalizeEventItem(item)
  const label = buildEventLabel(normalizedItem)
  const { rideName, menuUrl, bookingUrl, mapUrl, viewInfoUrl } = buildItemUrls(normalizedItem, dayPlan)
  const rideImage = RIDE_IMAGES[rideName] || ''
  const hasRestaurantLinks = Boolean(normalizedItem.type !== 'Ride' && normalizedItem.restaurant && (menuUrl || bookingUrl))
  const backgroundStyle = rideImage
    ? { backgroundImage: `linear-gradient(to bottom right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.72) 45%, rgba(255,255,255,0.15) 100%), url(${rideImage})`, backgroundSize: 'cover', backgroundPosition: 'center right' }
    : undefined
  const isEditing = editingDayItem?.date === date && editingDayItem?.index === item._idx
  if (isEditing) {
    return (
      <div key={`event-${item._idx}`} className="timeline-event">
        {renderEditForm({ editingDayItem, setEditingDayItem, updateDayItem, removeDayItem, date, itemIdx: item._idx, normalizedItem })}
      </div>
    )
  }
  return (
    <TimelineEventCard
      key={`event-${item._idx}`}
      theme={normalizedItem.theme}
      time={normalizedItem.time}
      label={label}
      description={getEventDescription(normalizedItem)}
      eventType={normalizedItem.type}
      backgroundStyle={backgroundStyle}
      menuUrl={menuUrl}
      bookingUrl={bookingUrl}
      viewInfoUrl={viewInfoUrl}
      mapUrl={mapUrl}
      hasRestaurantLinks={hasRestaurantLinks}
      onEdit={() => setEditingDayItem({ date, index: item._idx, draft: { time: normalizedItem.time || '', note: normalizedItem.note || '' } })}
      onDelete={() => removeDayItem(date, item._idx)}
    />
  )
}

function renderGhostEvent({ suggestion, date, acceptSuggestion, dismissSuggestion }) {
  return (
    <TimelineEventCard
      key={suggestion.id}
      ghost
      theme={suggestion.theme}
      time={suggestion.time}
      label={suggestion.label}
      description={suggestion.description}
      eventType={suggestion.type}
      tags={suggestion.tags}
      infoUrl={suggestion.infoUrl}
      mapUrl={suggestion.mapUrl}
      onAccept={() => acceptSuggestion(date, suggestion)}
      onDismiss={() => dismissSuggestion(date, suggestion.id)}
    />
  )
}

function renderDayBadges({ dayPlan, date, clearDayType, clearPark, clearSwimSpot, clearStaySpot, locationDisplay }) {
  const clearLocation = () => {
    if (dayPlan.dayType === 'Park') clearPark(date)
    if (dayPlan.dayType === 'Swimming') clearSwimSpot(date)
    if (dayPlan.dayType === 'Hotel/Shopping') clearStaySpot(date)
  }
  return (
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
          onClick={clearLocation}
          title={`Remove ${locationDisplay.label}`}
        >
          <img src={locationDisplay.icon} alt={locationDisplay.label} />
        </button>
      )}
    </div>
  )
}

function renderDaySummaryPills({ dayPlan, dayTypeChipColor, locationDisplay }) {
  if (!dayPlan.dayType) return null
  const locationText = dayPlan.parkHop && dayPlan.dayType === 'Park'
    ? dayPlan.park || 'Choose first park'
    : locationDisplay
      ? locationDisplay.label.replace(/^My hotel:\s*/i, '')
      : 'Choose location'
  return (
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
        {hashtagLabel(locationText)}
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
  )
}

function renderDayFormSelector({ dayPlan, date, secondParkOptions, hotelShoppingOptions, handlers }) {
  const { setDayType, setPark, updateDayPlan } = handlers
  return (
    <div className="day-meta-row">
      {!dayPlan.dayType && (
        <label className="field-compact">
          Day type
          <select value={dayPlan.dayType} onChange={(event) => setDayType(date, event.target.value)}>
            <option value="">Select day type</option>
            {DAY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.value}</option>
            ))}
          </select>
        </label>
      )}
      {dayPlan.dayType === 'Park' && !dayPlan.park && (
        <label className="field-compact">
          Park
          <select value={dayPlan.park} onChange={(event) => setPark(date, event.target.value)}>
            <option value="">Select park</option>
            {PARK_OPTIONS.map((park) => (
              <option key={park} value={park}>{park}</option>
            ))}
          </select>
        </label>
      )}
      {dayPlan.dayType === 'Park' && dayPlan.park && dayPlan.parkHop && (
        <label className="field-compact">
          Hop to
          <select value={dayPlan.secondPark} onChange={(event) => updateDayPlan(date, 'secondPark', event.target.value)}>
            <option value="">Select second park</option>
            {secondParkOptions.map((park) => (
              <option key={park} value={park}>{park}</option>
            ))}
          </select>
        </label>
      )}
      {dayPlan.dayType === 'Swimming' && !dayPlan.swimSpot && (
        <label className="field-compact">
          Swim park
          <select value={dayPlan.swimSpot} onChange={(event) => updateDayPlan(date, 'swimSpot', event.target.value)}>
            <option value="">Select water park</option>
            {SWIM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.value}</option>
            ))}
          </select>
        </label>
      )}
      {dayPlan.dayType === 'Hotel/Shopping' && !dayPlan.staySpot && (
        <label className="field-compact">
          Hotel / shopping location
          <select value={dayPlan.staySpot} onChange={(event) => updateDayPlan(date, 'staySpot', event.target.value)}>
            <option value="">Select location</option>
            {hotelShoppingOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      )}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DayPlanSection({
  plan, tripDates, activeDay, setActiveDay,
  liveShowData, editingDayItem, setEditingDayItem,
  updateDayPlan, updateDayItem, removeDayItem,
  acceptSuggestion, dismissSuggestion,
  clearDayType, clearPark, clearSwimSpot, clearStaySpot,
  resetDay, toggleParkHop, setDayType, setPark
}) {
  // ── Derived state ──
  const date = tripDates[activeDay]
  const index = activeDay
  const dayPlan = plan.dayPlans?.[date] || {
    dayType: '', park: '', secondPark: '', parkHop: false, swimSpot: '', staySpot: '', items: []
  }
  const myHotel = plan.myHotel.trim()
  const hotelShoppingOptions = buildHotelShoppingOptions(myHotel)
  const locationDisplay = getLocationDisplay(dayPlan, myHotel)
  const dayTypeChipColor = getDayTypeChipColor(dayPlan.dayType)
  const secondParkOptions = getSecondParkOptions(dayPlan.park)
  const itemsWithIndex = (dayPlan.items || []).map((item, idx) => ({ ...item, _idx: idx }))
  const timeSlots = getTimeSlots(dayPlan.dayType)
  const dismissed = dayPlan.dismissedSuggestions || []
  const ghostSuggestions = computeGhostSuggestions(dayPlan, liveShowData, plan.favoriteTags, dismissed)

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
          {tripDates.map((dateStr, i) => {
            const navDayPlan = plan.dayPlans?.[dateStr]
            const isPlanned = !!(navDayPlan?.dayType || navDayPlan?.items?.length)
            const navBtnClass = ['day-nav-btn', i === activeDay ? 'active' : '', isPlanned ? 'has-plan' : ''].filter(Boolean).join(' ')
            return (
              <button
                key={dateStr}
                type="button"
                className={navBtnClass}
                onClick={() => setActiveDay(i)}
              >
                <span className="day-nav-num">{i + 1}</span>
                <span className="day-nav-date">{formatShortDate(dateStr)}</span>
              </button>
            )
          })}
        </div>

        {tripDates.length > 0 && <>
        <article key={date} className="date-card" style={getDayCardStyle(dayPlan)}>
          {renderDayBadges({ dayPlan, date, clearDayType, clearPark, clearSwimSpot, clearStaySpot, locationDisplay })}

          <div className="date-card-head">
            <div className="date-title-row">
              <h3>Day {index + 1}</h3>
            </div>
            <p>{formatPrettyDate(date)}</p>
            {renderDaySummaryPills({ dayPlan, dayTypeChipColor, locationDisplay })}
          </div>

          <div className="day-form-stack">
            {renderDayFormSelector({
              dayPlan, date, secondParkOptions, hotelShoppingOptions,
              handlers: { setDayType, setPark, updateDayPlan }
            })}
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
            {timeSlots.map(slot => {
              const slotItems = itemsWithIndex.filter(item => getItemSlot(item) === slot.slot)
              const slotGhosts = ghostSuggestions.filter(s => getItemSlot(s) === slot.slot)
              if (!slotItems.length && !slotGhosts.length) return null
              return (
                <div key={`slot-${slot.slot}`} className="timeline-slot">
                  <div className="timeline-anchor">
                    <span className="timeline-anchor-time">{slot.time}</span>
                    <span className="timeline-anchor-label">{slot.label}</span>
                  </div>
                  <div className="timeline-node" />
                  <div className="timeline-slot-events">
                    {slotItems.map(item => renderTimelineEvent({
                      item, date, editingDayItem, setEditingDayItem, updateDayItem, removeDayItem, dayPlan
                    }))}
                    {slotGhosts.map(suggestion => renderGhostEvent({
                      suggestion, date, acceptSuggestion, dismissSuggestion
                    }))}
                  </div>
                </div>
              )
            }).filter(Boolean)}
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

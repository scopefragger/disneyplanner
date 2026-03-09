import { EVENT_TYPES } from '../data/tripOptions.js'
import { RESTAURANT_GROUPS } from '../data/restaurantMetadata.js'
import { resetDraftForType } from '../data/planHelpers.js'

export default function SearchBar({
  activeDay, activeDate, activeDayPlan,
  eventSearch, setEventSearch,
  addEventOpen, setAddEventOpen,
  hasTopSearchResults, topSearchResults,
  activeDraft, activeSelectedEventType, activeRideOptions,
  setDraftDayItems, quickAddToDay, addDayItem
}) {
  const handleSearchChange = e => {
    setEventSearch(e.target.value)
    if (addEventOpen) setAddEventOpen(false)
  }
  const toggleAdvancedSearch = () => {
    setAddEventOpen(open => !open)
    setEventSearch('')
  }

  // Shared updater for draft fields — avoids repeating the full setState pattern
  const updateDraft = (field, value) => {
    setDraftDayItems(current => ({
      ...current,
      [activeDate]: { ...activeDraft, [field]: value }
    }))
  }

  return (
    <div className="top-searchbar-card card card-wide">
      <div className="top-searchbar-wrap">
        <span className="top-searchbar-icon">🔍</span>
        <input
          className="top-searchbar-input"
          type="search"
          placeholder={activeDayPlan.dayType === 'Park'
            ? `Search rides, shows & restaurants for Day ${activeDay + 1}…`
            : `Search restaurants & shows for Day ${activeDay + 1}…`}
          value={eventSearch}
          onChange={handleSearchChange}
        />
        {eventSearch && (
          <button type="button" className="top-searchbar-clear" onClick={() => setEventSearch('')}>×</button>
        )}
        <button
          type="button"
          className={`searchbar-advanced-btn${addEventOpen ? ' active' : ''}`}
          onClick={toggleAdvancedSearch}
        >
          {addEventOpen ? '✕' : 'Advanced search'}
        </button>
      </div>

      {hasTopSearchResults && (
        <div className="top-search-results">
          {topSearchResults.shows.length > 0 && <>
            <div className="esr-group-label">Shows &amp; Events</div>
            {topSearchResults.shows.map(s => (
              <button key={s.id} type="button" className="esr-item" onClick={() => quickAddToDay(activeDate, 'show', s)}>
                <span className="esr-name">{s.label}</span>
                <span className="esr-meta">{s.matchingTags.length > 0 ? s.matchingTags.join(' · ') : `${s.park.replace("Disney's ", '')} · ${s.time}`}</span>
              </button>
            ))}
          </>}
          {topSearchResults.restaurants.length > 0 && <>
            <div className="esr-group-label">Restaurants</div>
            {topSearchResults.restaurants.map(r => (
              <button key={r.name} type="button" className="esr-item" onClick={() => quickAddToDay(activeDate, 'restaurant', r.name)}>
                <span className="esr-name">{r.name}</span>
                {r.matchingTags.length > 0 && <span className="esr-meta">{r.matchingTags.join(' · ')}</span>}
              </button>
            ))}
          </>}
          {topSearchResults.rides.length > 0 && <>
            <div className="esr-group-label">Rides</div>
            {topSearchResults.rides.map(r => (
              <button key={r.value} type="button" className="esr-item" onClick={() => quickAddToDay(activeDate, 'ride', r)}>
                <span className="esr-name">{r.label}</span>
                {r.matchingTags.length > 0 && <span className="esr-meta">{r.matchingTags.join(' · ')}</span>}
              </button>
            ))}
          </>}
        </div>
      )}

      {addEventOpen && (
        <div className="event-builder-panel">
          <div className="event-builder-header">
            <span>Add event — Day {activeDay + 1}</span>
          </div>
          <div className="day-meta-row">
            <label className="field-compact">
              Event type
              <select
                value={activeDraft.type}
                onChange={(e) =>
                  setDraftDayItems(current => ({
                    ...current,
                    [activeDate]: resetDraftForType(current[activeDate], e.target.value)
                  }))
                }
              >
                {EVENT_TYPES.map((eventType) => (
                  <option key={eventType.value} value={eventType.value}>{eventType.value}</option>
                ))}
              </select>
            </label>

            {activeSelectedEventType.requiresRestaurant ? (
              <label className="field-compact">
                Restaurant
                <select
                  value={activeDraft.restaurant}
                  onChange={(e) =>
                    setDraftDayItems((current) => ({
                      ...current,
                      [activeDate]: {
                        ...activeDraft,
                        restaurant: e.target.value,
                        customRestaurant: e.target.value === '__custom__'
                          ? current[activeDate]?.customRestaurant || ''
                          : ''
                      }
                    }))
                  }
                >
                  <option value="">Choose restaurant</option>
                  {Object.entries(RESTAURANT_GROUPS).map(([group, restaurants]) => (
                    <optgroup key={group} label={group}>
                      {restaurants.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="__custom__">Other (type manually)</option>
                </select>
              </label>
            ) : activeDraft.type === 'Ride' ? (
              <label className="field-compact">
                Ride
                <select
                  value={activeDraft.ride}
                  onChange={(e) => updateDraft('ride', e.target.value)}
                  disabled={!activeRideOptions.length}
                >
                  <option value="">
                    {activeRideOptions.length ? 'Choose ride' : 'Select park(s) for this day first'}
                  </option>
                  {activeRideOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="field-compact">
                Notes
                <input
                  value={activeDraft.note}
                  onChange={(e) => updateDraft('note', e.target.value)}
                  placeholder="Optional details"
                />
              </label>
            )}
          </div>

          {activeSelectedEventType.requiresRestaurant && activeDraft.restaurant === '__custom__' && (
            <label className="field-compact">
              Custom restaurant
              <input
                value={activeDraft.customRestaurant}
                onChange={(e) => updateDraft('customRestaurant', e.target.value)}
                placeholder="Type restaurant name"
              />
            </label>
          )}

          <div className="event-action-row">
            <label className="field-compact field-time">
              Time
              <input
                type="time"
                value={activeDraft.time || ''}
                onChange={(e) => updateDraft('time', e.target.value)}
              />
            </label>
            <button type="button" className="action action-compact" onClick={() => { addDayItem(activeDate); setAddEventOpen(false) }}>
              Add event
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

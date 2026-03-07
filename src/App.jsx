import { useEffect, useMemo, useState } from 'react'
import { RESTAURANT_TAGS, RESTAURANT_GROUPS, ALL_RESTAURANTS, getRestaurantResources } from './data/restaurantMetadata'
import { getParkSuggestions, fetchLiveParkShows, ALL_SHOWS } from './data/parkSuggestions.js'
import { RIDE_TAGS, getRideUrl, RIDES_BY_PARK, RIDE_IMAGES } from './data/rideData.js'
import { fuzzyMatch, getDateRange, formatPrettyDate, formatShortDate, formatTime } from './utils.js'
import { PARK_OPTIONS, DINING_OPTIONS, DAY_TYPES, SWIM_OPTIONS, DISNEY_HOTELS, ENTERTAINMENT_TYPES, FRANCHISE_OPTIONS, EVENT_TYPES } from './data/tripOptions.js'
import { DEFAULT_PLAN, DEFAULT_DRAFT, SHOW_TYPE_MAP, normalizePlan, detectTheme, getEventTypeConfig, buildEventLabel, createBlankDayPlan, createEventItem, parseRideSelection, patchDayPlan, normalizeEventItem, resetDraftForType } from './data/planHelpers.js'
import { STORAGE_KEY, PROJECTS_KEY, generateId, loadAllProjects } from './data/storage.js'
import { DAY_CHIP_COLORS, getDayTypeChipColor, hashtagLabel, getDayCardStyle, getDayTypeIcon, getSecondParkOptions, getRideOptionsForDay, getItemSlot, getTimeSlots, getLocationDisplay } from './data/displayHelpers.js'

// ── HomeScreen ────────────────────────────────────────────────────────────────
function HomeScreen({ projects, openProject, deleteProject, createProject }) {
  return (
    <>
      <header className="hero">
        <p className="eyebrow">Disney World Holiday Planner</p>
        <h1>My Holidays</h1>
        <p className="subtitle">Plan and manage all your Disney World adventures.</p>
      </header>

      <main className="home-grid">
        {Object.keys(projects).length > 0 && (
          <section className="card card-wide">
            <h2 className="home-section-title">Your holidays</h2>
            <div className="project-list">
              {Object.values(projects)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map(project => {
                  const p = project.plan
                  const len = getDateRange(p.startDate, p.endDate).length
                  return (
                    <div key={project.id} className="project-row" onClick={() => openProject(project.id)}>
                      <div className="project-row-info">
                        <strong>{p.tripName || 'Untitled Holiday'}</strong>
                        <span>
                          {p.startDate
                            ? `${formatPrettyDate(p.startDate)} – ${formatPrettyDate(p.endDate)} · ${len} day${len !== 1 ? 's' : ''}`
                            : 'Dates not set'}
                          {p.myHotel ? ` · ${p.myHotel}` : ''}
                        </span>
                      </div>
                      <button
                        className="chip"
                        onClick={(e) => { e.stopPropagation(); deleteProject(project.id) }}
                      >
                        Delete
                      </button>
                    </div>
                  )
                })}
            </div>
          </section>
        )}

        <button className="new-project-btn" onClick={createProject}>
          + New holiday
        </button>

        {Object.keys(projects).length === 0 && (
          <p className="home-empty">No holidays yet. Start planning your first Disney trip!</p>
        )}
      </main>
    </>
  )
}

// ── SetupWizard ───────────────────────────────────────────────────────────────
function SetupWizard({ plan, currentStep, tripLength, prefSearch, setPrefSearch, updateField, nextStep, prevStep, setSetupDone, toggleFavoriteTag }) {
  return (
    <section key={currentStep} className="card card-wide setup-step">
      <p className="step-label">Step {currentStep} of 5</p>

      {currentStep === 1 && <>
        <h2 className="step-question">Name your holiday</h2>
        <p className="step-sub">Every great adventure deserves a great name.</p>
        <input
          className="step-input"
          value={plan.tripName}
          onChange={(event) => updateField('tripName', event.target.value)}
          placeholder="e.g. Magical Family Getaway"
          autoFocus
        />
      </>}

      {currentStep === 2 && <>
        <h2 className="step-question">When are you going?</h2>
        <p className="step-sub">Pick your dates and we'll build your day-by-day planner automatically.</p>
        <div className="step-date-row">
          <label>
            From
            <input
              type="date"
              value={plan.startDate}
              onChange={(event) => updateField('startDate', event.target.value)}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={plan.endDate}
              onChange={(event) => updateField('endDate', event.target.value)}
            />
          </label>
          {tripLength > 0 && (
            <span className="step-length-pill">{tripLength} day{tripLength !== 1 ? 's' : ''}</span>
          )}
        </div>
      </>}

      {currentStep === 3 && <>
        <h2 className="step-question">Where are you staying?</h2>
        <p className="step-sub">Your resort sets the tone — from castle views to savannah sunrises.</p>
        <input
          className="step-input"
          list="hotel-list"
          value={plan.myHotel}
          onChange={(event) => updateField('myHotel', event.target.value)}
          placeholder="Type or pick a Disney hotel"
          autoFocus
        />
        <datalist id="hotel-list">
          {DISNEY_HOTELS.map((hotel) => (
            <option key={hotel} value={hotel} />
          ))}
        </datalist>
      </>}

      {currentStep === 4 && <>
        <h2 className="step-question">Who's going?</h2>
        <p className="step-sub">The more the merrier — every party size gets the magic treatment.</p>
        <div className="inline-fields">
          <label>
            Adults
            <input
              type="number"
              min="1"
              value={plan.adults}
              onChange={(event) => updateField('adults', Number(event.target.value))}
            />
          </label>
          <label>
            Children
            <input
              type="number"
              min="0"
              value={plan.children}
              onChange={(event) => updateField('children', Number(event.target.value))}
            />
          </label>
        </div>
      </>}

      {currentStep === 5 && <>
        <h2 className="step-question">How do you like to dine?</h2>
        <p className="step-sub">Disney dining is half the fun — let's make sure you've got a plan.</p>
        <div className="step-dining-grid">
          {DINING_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={plan.diningStyle === option ? 'dining-chip selected' : 'dining-chip'}
              onClick={() => updateField('diningStyle', option)}
            >
              {option}
            </button>
          ))}
        </div>
      </>}

      {currentStep === 6 && <>
        <h2 className="step-question">What do you love most?</h2>
        <p className="step-sub">We'll use this to surface the shows, parades and meet &amp; greets that matter to you.</p>

        <input
          className="pref-search"
          type="search"
          placeholder="Search entertainment, franchises, characters…"
          value={prefSearch}
          onChange={e => setPrefSearch(e.target.value)}
        />

        {(() => {
          const filteredEntertainment = ENTERTAINMENT_TYPES.filter(({ label }) => fuzzyMatch(prefSearch, label))
          const filteredFranchises    = FRANCHISE_OPTIONS.filter(({ label }) => fuzzyMatch(prefSearch, label))
          const noResults = !filteredEntertainment.length && !filteredFranchises.length
          return noResults ? (
            <p className="pref-no-results">No matches for "{prefSearch}"</p>
          ) : <>
            {filteredEntertainment.length > 0 && <>
              <p className="pref-section-label">Entertainment style</p>
              <div className="pref-chip-grid">
                {filteredEntertainment.map(({ tag, label }) => (
                  <button key={tag} type="button"
                    className={plan.favoriteTags?.includes(tag) ? 'pref-chip selected' : 'pref-chip'}
                    onClick={() => toggleFavoriteTag(tag)}
                  >{label}</button>
                ))}
              </div>
            </>}
            {filteredFranchises.length > 0 && <>
              <p className="pref-section-label">Favourite worlds &amp; franchises</p>
              <div className="pref-chip-grid">
                {filteredFranchises.map(({ tag, label }) => (
                  <button key={tag} type="button"
                    className={plan.favoriteTags?.includes(tag) ? 'pref-chip selected' : 'pref-chip'}
                    onClick={() => toggleFavoriteTag(tag)}
                  >{label}</button>
                ))}
              </div>
            </>}
          </>
        })()}
      </>}

      <div className="step-nav">
        {currentStep > 1 && (
          <button className="step-back-btn" onClick={prevStep}>← Back</button>
        )}
        {currentStep < 6 ? (
          <button className="setup-continue-btn" onClick={nextStep}>Next →</button>
        ) : (
          <>
            <button
              className="setup-continue-btn"
              disabled={!plan.startDate || !plan.endDate}
              onClick={() => setSetupDone(true)}
            >
              Start Planning →
            </button>
            {(!plan.startDate || !plan.endDate) && (
              <span className="setup-hint">Set your dates in Step 2 to continue</span>
            )}
          </>
        )}
      </div>
    </section>
  )
}

// ── SetupSummary ──────────────────────────────────────────────────────────────
function SetupSummary({ plan, tripLength, setSetupDone, setCurrentStep, setPrefSearch, setSettingsOpen, setResetConfirm }) {
  return (
    <div className="setup-summary card card-wide">
      <div className="setup-summary-inner">
        <div className="setup-summary-info">
          <strong>{plan.tripName}</strong>
          <span>{formatPrettyDate(plan.startDate)} – {formatPrettyDate(plan.endDate)} · {tripLength} day{tripLength !== 1 ? 's' : ''}</span>
          <span>{plan.adults} adult{plan.adults !== 1 ? 's' : ''}{plan.children > 0 ? `, ${plan.children} child${plan.children !== 1 ? 'ren' : ''}` : ''} · £{Number(plan.budget).toLocaleString()} · {plan.diningStyle}</span>
        </div>
        <div className="setup-summary-actions">
          <button className="chip" onClick={() => { setSetupDone(false); setCurrentStep(1) }}>Edit setup</button>
          <button className="chip" onClick={() => { setPrefSearch(''); setSetupDone(false); setCurrentStep(6) }}>✦ My preferences</button>
          <button className="chip" onClick={() => { setSettingsOpen(true); setResetConfirm(false) }}>⚙ Settings</button>
        </div>
      </div>
    </div>
  )
}

// ── SearchBar ─────────────────────────────────────────────────────────────────
function SearchBar({ activeDay, activeDate, activeDayPlan, eventSearch, setEventSearch, addEventOpen, setAddEventOpen, hasTopSearchResults, topSearchResults, activeDraft, activeSelectedEventType, activeRideOptions, setDraftDayItems, quickAddToDay, addDayItem }) {
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
          onChange={e => { setEventSearch(e.target.value); if (addEventOpen) setAddEventOpen(false) }}
        />
        {eventSearch && (
          <button type="button" className="top-searchbar-clear" onClick={() => setEventSearch('')}>×</button>
        )}
        <button
          type="button"
          className={`searchbar-advanced-btn${addEventOpen ? ' active' : ''}`}
          onClick={() => { setAddEventOpen(o => !o); setEventSearch('') }}
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
                {EVENT_TYPES.map((et) => (
                  <option key={et.value} value={et.value}>{et.value}</option>
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
                  onChange={(e) =>
                    setDraftDayItems((current) => ({
                      ...current,
                      [activeDate]: { ...activeDraft, ride: e.target.value }
                    }))
                  }
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
                  onChange={(e) =>
                    setDraftDayItems((current) => ({
                      ...current,
                      [activeDate]: { ...activeDraft, note: e.target.value }
                    }))
                  }
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
                onChange={(e) =>
                  setDraftDayItems((current) => ({
                    ...current,
                    [activeDate]: { ...activeDraft, customRestaurant: e.target.value }
                  }))
                }
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
                onChange={(e) =>
                  setDraftDayItems((current) => ({
                    ...current,
                    [activeDate]: { ...activeDraft, time: e.target.value }
                  }))
                }
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

// ── DayPlanSection ────────────────────────────────────────────────────────────
function DayPlanSection({ plan, tripDates, activeDay, setActiveDay, liveShowData, editingDayItem, setEditingDayItem, updateDayPlan, updateDayItem, removeDayItem, acceptSuggestion, dismissSuggestion, clearDayType, clearPark, clearSwimSpot, clearStaySpot, resetDay, toggleParkHop, setDayType, setPark }) {
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

// ── WhatsNext ─────────────────────────────────────────────────────────────────
function WhatsNext({ activeDay, activeDate, plan }) {
  return (
    <div className="whats-next-card card card-wide">
      <h3 className="whats-next-title">What's next</h3>
      <div className="whats-next-actions">
        <button
          type="button"
          className="whats-next-btn"
          onClick={() => {
            const dayPlan = plan.dayPlans?.[activeDate]
            const items = dayPlan?.items || []
            const stops = [
              dayPlan?.park,
              ...items.map(item => {
                const n = normalizeEventItem(item)
                return n.ride ? n.ride.split('::').pop() : (n.restaurant || n.note || null)
              })
            ].filter(Boolean).map(s => encodeURIComponent(s + ' Walt Disney World'))
            const url = stops.length
              ? `https://www.google.com/maps/dir/${stops.join('/')}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((dayPlan?.park || 'Walt Disney World') + ' Walt Disney World')}`
            window.open(url, '_blank', 'noreferrer')
          }}
        >
          <span className="whats-next-btn-icon">🗺</span>
          <span>View Day {activeDay + 1} on map</span>
        </button>
      </div>
    </div>
  )
}

// ── SettingsPanel ─────────────────────────────────────────────────────────────
function SettingsPanel({ setSettingsOpen, resetPlan, resetConfirm, setResetConfirm }) {
  return (
    <div className="settings-overlay" onClick={() => setSettingsOpen(false)}>
      <div className="settings-panel card" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Trip settings</h3>
          <button type="button" className="close-panel-btn" onClick={() => setSettingsOpen(false)}>✕</button>
        </div>
        <p className="settings-note">Your plan is saved automatically in your browser.</p>
        <hr className="settings-divider" />
        <div className="settings-section">
          <strong>Danger zone</strong>
          {resetConfirm ? (
            <div className="settings-confirm-row">
              <span>This will erase everything. Are you sure?</span>
              <button type="button" className="danger" onClick={() => { resetPlan(); setSettingsOpen(false) }}>Yes, reset</button>
              <button type="button" className="chip" onClick={() => setResetConfirm(false)}>Cancel</button>
            </div>
          ) : (
            <button type="button" className="danger" onClick={() => setResetConfirm(true)}>Reset planner</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [projects, setProjects] = useState(() => loadAllProjects())
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [plan, setPlan] = useState(DEFAULT_PLAN)
  const [draftDayItems, setDraftDayItems] = useState({})
  const [setupDone, setSetupDone] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [activeDay, setActiveDay] = useState(0)
  const [editingDayItem, setEditingDayItem] = useState(null) // { date, index, draft }
  const [addEventOpen, setAddEventOpen] = useState(false)
  const [eventSearch, setEventSearch] = useState('')
  const [liveShowData, setLiveShowData] = useState({}) // keyed by park name
  const [prefSearch, setPrefSearch] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, 6))
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1))

  const toggleFavoriteTag = tag => {
    setPlan(p => ({
      ...p,
      favoriteTags: p.favoriteTags?.includes(tag)
        ? p.favoriteTags.filter(t => t !== tag)
        : [...(p.favoriteTags || []), tag]
    }))
  }

  useEffect(() => {
    if (!activeProjectId) return
    setProjects(prev => {
      const updated = {
        ...prev,
        [activeProjectId]: { ...prev[activeProjectId], updatedAt: new Date().toISOString(), plan }
      }
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [plan, activeProjectId])

  const tripDates = useMemo(() => {
    return getDateRange(plan.startDate, plan.endDate)
  }, [plan.startDate, plan.endDate])

  const tripLength = tripDates.length || null

  useEffect(() => {
    setActiveDay(prev => Math.min(prev, Math.max(tripDates.length - 1, 0)))
    setPlan((current) => {
      const currentPlans = current.dayPlans || {}
      const nextDayPlans = {}
      let hasChanges = Object.keys(currentPlans).length !== tripDates.length

      tripDates.forEach((date) => {
        if (currentPlans[date]) {
          // TD-017: use factory to ensure all fields present, including dismissedSuggestions (was missing — bug fix)
          nextDayPlans[date] = createBlankDayPlan({
            dayType: currentPlans[date].dayType || '',
            park: currentPlans[date].park || '',
            secondPark: currentPlans[date].secondPark || '',
            parkHop: Boolean(currentPlans[date].parkHop),
            swimSpot: currentPlans[date].swimSpot || '',
            staySpot: currentPlans[date].staySpot || '',
            items: currentPlans[date].items || [],
            dismissedSuggestions: currentPlans[date].dismissedSuggestions || []
          })
        } else {
          hasChanges = true
          nextDayPlans[date] = createBlankDayPlan()
        }
      })

      if (!hasChanges) return current
      return { ...current, dayPlans: nextDayPlans }
    })
  }, [tripDates])

  // Fetch live show data for any park that appears in the trip plan
  useEffect(() => {
    const parks = [...new Set(
      Object.values(plan.dayPlans)
        .filter(dp => dp.dayType === 'Park')
        .flatMap(dp => [dp.park, dp.secondPark].filter(Boolean))
    )]
    parks.forEach(park => {
      if (liveShowData[park] !== undefined) return // already fetched or in-flight
      setLiveShowData(prev => ({ ...prev, [park]: null })) // mark in-flight
      fetchLiveParkShows(park).then(shows => {
        if (shows) setLiveShowData(prev => ({ ...prev, [park]: shows }))
      })
    })
  }, [plan.dayPlans]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateField = (field, value) => {
    setPlan((current) => ({ ...current, [field]: value }))
  }

  const updateDayPlan = (date, key, value) => {
    setPlan((current) => {
      if (!current.dayPlans?.[date]) return current
      return patchDayPlan(current, date, { [key]: value })
    })
  }

  const addDayItem = (date) => {
    const draft = draftDayItems[date] || DEFAULT_DRAFT
    const eventType = getEventTypeConfig(draft.type)
    const restaurant =
      draft.restaurant === '__custom__'
        ? (draft.customRestaurant || '').trim()
        : (draft.restaurant || '').trim()
    const rideSelection = draft.ride || ''
    const { ridePark, ride } = parseRideSelection(rideSelection)
    const note = (draft.note || '').trim()
    const restaurantResources = restaurant ? getRestaurantResources(restaurant) : null

    if (eventType.requiresRestaurant && !restaurant) return
    if (draft.type === 'Ride' && !rideSelection) return
    if (!eventType.requiresRestaurant && !note && !draft.type) return

    const newItem = createEventItem({
      type: draft.type,
      restaurant,
      customRestaurant: draft.restaurant === '__custom__' ? restaurant : '',
      menuUrl: restaurantResources?.menuUrl || '',
      bookingUrl: restaurantResources?.bookingUrl || '',
      heroImage: restaurantResources?.heroImage || '',
      ride, ridePark, note,
      time: draft.time || '',
      theme: eventType.theme
    })

    setPlan(current => patchDayPlan(current, date, {
      items: [...(current.dayPlans[date]?.items || []), newItem]
    }))
    setDraftDayItems(current => ({ ...current, [date]: { ...DEFAULT_DRAFT, type: draft.type } }))
  }

  const updateDayItem = (date, itemIndex, updates) => {
    setPlan(current => patchDayPlan(current, date, {
      items: current.dayPlans[date].items.map((item, idx) =>
        idx === itemIndex ? { ...item, ...updates } : item
      )
    }))
  }

  const removeDayItem = (date, itemIndex) => {
    setPlan(current => patchDayPlan(current, date, {
      items: (current.dayPlans[date]?.items || []).filter((_, idx) => idx !== itemIndex)
    }))
  }

  const acceptSuggestion = (date, suggestion) => {
    const newItem = createEventItem({
      type: suggestion.type, note: suggestion.label,
      time: suggestion.time, theme: suggestion.theme
    })
    setPlan(current => patchDayPlan(current, date, {
      items: [...(current.dayPlans[date]?.items || []), newItem],
      dismissedSuggestions: [...(current.dayPlans[date]?.dismissedSuggestions || []), suggestion.id]
    }))
  }

  const dismissSuggestion = (date, suggestionId) => {
    setPlan(current => patchDayPlan(current, date, {
      dismissedSuggestions: [...(current.dayPlans[date]?.dismissedSuggestions || []), suggestionId]
    }))
  }

  const quickAddToDay = (date, kind, item) => {
    let newItem
    if (kind === 'show') {
      newItem = createEventItem({
        type: SHOW_TYPE_MAP[item.type] || 'Fireworks',
        note: item.label, time: item.time, theme: item.theme
      })
    } else if (kind === 'restaurant') {
      const res = getRestaurantResources(item)
      newItem = createEventItem({
        type: 'Dinner', restaurant: item,
        menuUrl: res?.menuUrl || '', bookingUrl: res?.bookingUrl || '', heroImage: res?.heroImage || '',
        theme: getEventTypeConfig('Dinner').theme
      })
    } else if (kind === 'ride') {
      const { ridePark, ride } = parseRideSelection(item.value)
      newItem = createEventItem({ type: 'Ride', ride, ridePark, theme: getEventTypeConfig('Ride').theme })
    }
    if (!newItem) return
    setPlan(current => patchDayPlan(current, date, {
      items: [...(current.dayPlans[date]?.items || []), newItem]
    }))
    setEventSearch('')
  }

  const clearDayType = (date) => {
    updateDayPlan(date, 'dayType', '')
  }

  const clearPark = (date) => {
    setPlan(current => patchDayPlan(current, date, { park: '', secondPark: '', parkHop: false }))
  }

  const clearSwimSpot = (date) => {
    updateDayPlan(date, 'swimSpot', '')
  }

  const clearStaySpot = (date) => {
    updateDayPlan(date, 'staySpot', '')
  }

  const resetDay = (date) => {
    setPlan((current) => {
      if (!current.dayPlans?.[date]) return current
      return patchDayPlan(current, date, {
        dayType: '', park: '', secondPark: '', parkHop: false, swimSpot: '', staySpot: '', items: []
      })
    })
    setDraftDayItems(current => ({ ...current, [date]: DEFAULT_DRAFT }))
  }

  const toggleParkHop = (date) => {
    setPlan((current) => {
      if (!current.dayPlans?.[date]) return current
      const nextHop = !current.dayPlans[date].parkHop
      return patchDayPlan(current, date, {
        parkHop: nextHop,
        secondPark: nextHop ? current.dayPlans[date].secondPark : ''
      })
    })
  }

  const setDayType = (date, dayType) => {
    setPlan((current) => {
      if (!current.dayPlans?.[date]) return current
      return patchDayPlan(current, date, {
        dayType, park: '', secondPark: '', parkHop: false, swimSpot: '', staySpot: ''
      })
    })
  }

  const setPark = (date, selectedPark) => {
    setPlan((current) => {
      if (!current.dayPlans?.[date]) return current
      const nextSecondPark =
        current.dayPlans[date].secondPark === selectedPark ? '' : current.dayPlans[date].secondPark
      return patchDayPlan(current, date, { park: selectedPark, secondPark: nextSecondPark })
    })
  }

  const resetPlan = () => {
    setPlan(DEFAULT_PLAN)
    setSetupDone(false)
    setDraftDayItems({})
  }

  const createProject = () => {
    const id = generateId()
    const newProject = { id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), plan: DEFAULT_PLAN }
    setProjects(prev => {
      const updated = { ...prev, [id]: newProject }
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated))
      return updated
    })
    setPlan(DEFAULT_PLAN)
    setSetupDone(false)
    setDraftDayItems({})
    setActiveProjectId(id)
  }

  const openProject = (id) => {
    const project = projects[id]
    setPlan(project.plan)
    setSetupDone(!!(project.plan.startDate && project.plan.endDate))
    setCurrentStep(1)
    setDraftDayItems({})
    setActiveProjectId(id)
  }

  const deleteProject = (id) => {
    setProjects(prev => {
      const next = { ...prev }
      delete next[id]
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(next))
      return next
    })
  }

  const goHome = () => {
    setActiveProjectId(null)
  }

  const activeDate = tripDates[activeDay]
  const activeDayPlan = plan.dayPlans?.[activeDate] || {}
  const activeRideOptions = getRideOptionsForDay(activeDayPlan)
  const activeDraft = draftDayItems[activeDate] || DEFAULT_DRAFT
  const activeSelectedEventType = getEventTypeConfig(activeDraft.type)
  const topSearchQ = eventSearch.trim()
  // TD-016: wrap in useMemo — only recalculates when query, park, or ride options change
  const topSearchResults = useMemo(() => {
    if (!setupDone || !topSearchQ) return null
    return {
      shows: ALL_SHOWS
        .map(s => {
          const cleanTags = (s.tags || []).map(t => t.replace(/^#/, ''))
          const matchingTags = cleanTags.filter(t => fuzzyMatch(topSearchQ, t))
          return (fuzzyMatch(topSearchQ, s.label) || matchingTags.length) ? { ...s, matchingTags } : null
        }).filter(Boolean).slice(0, 6),
      restaurants: ALL_RESTAURANTS.map(r => {
        const tags = RESTAURANT_TAGS[r] || []
        const matchingTags = tags.filter(t => fuzzyMatch(topSearchQ, t))
        return (fuzzyMatch(topSearchQ, r) || matchingTags.length) ? { name: r, matchingTags } : null
      }).filter(Boolean).slice(0, 6),
      rides: activeRideOptions.map(r => {
        const tags = RIDE_TAGS[r.label] || []
        const matchingTags = tags.filter(t => fuzzyMatch(topSearchQ, t))
        return (fuzzyMatch(topSearchQ, r.label) || matchingTags.length) ? { ...r, matchingTags } : null
      }).filter(Boolean).slice(0, 5),
    }
  }, [setupDone, topSearchQ, activeRideOptions])
  const hasTopSearchResults = topSearchResults &&
    (topSearchResults.shows.length || topSearchResults.restaurants.length || topSearchResults.rides.length)

  return (
    <div className="page-shell">
      {activeProjectId === null ? (
        <HomeScreen
          projects={projects}
          openProject={openProject}
          deleteProject={deleteProject}
          createProject={createProject}
        />
      ) : (
        <>
          <header className="hero">
            <button className="back-btn" onClick={goHome}>← My Holidays</button>
            <h1>{plan.tripName}</h1>
            <p className="subtitle">
              Build your park days, spending target, and must-do list in one place.
            </p>
          </header>

          <main className="planner-grid">
            {!setupDone && (
              <SetupWizard
                plan={plan}
                currentStep={currentStep}
                tripLength={tripLength}
                prefSearch={prefSearch}
                setPrefSearch={setPrefSearch}
                updateField={updateField}
                nextStep={nextStep}
                prevStep={prevStep}
                setSetupDone={setSetupDone}
                toggleFavoriteTag={toggleFavoriteTag}
              />
            )}
            {setupDone && (
              <SetupSummary
                plan={plan}
                tripLength={tripLength}
                setSetupDone={setSetupDone}
                setCurrentStep={setCurrentStep}
                setPrefSearch={setPrefSearch}
                setSettingsOpen={setSettingsOpen}
                setResetConfirm={setResetConfirm}
              />
            )}
            {setupDone && (
              <SearchBar
                activeDay={activeDay}
                activeDate={activeDate}
                activeDayPlan={activeDayPlan}
                eventSearch={eventSearch}
                setEventSearch={setEventSearch}
                addEventOpen={addEventOpen}
                setAddEventOpen={setAddEventOpen}
                hasTopSearchResults={hasTopSearchResults}
                topSearchResults={topSearchResults}
                activeDraft={activeDraft}
                activeSelectedEventType={activeSelectedEventType}
                activeRideOptions={activeRideOptions}
                setDraftDayItems={setDraftDayItems}
                quickAddToDay={quickAddToDay}
                addDayItem={addDayItem}
              />
            )}
            {setupDone && (
              <DayPlanSection
                plan={plan}
                tripDates={tripDates}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                liveShowData={liveShowData}
                editingDayItem={editingDayItem}
                setEditingDayItem={setEditingDayItem}
                updateDayPlan={updateDayPlan}
                updateDayItem={updateDayItem}
                removeDayItem={removeDayItem}
                acceptSuggestion={acceptSuggestion}
                dismissSuggestion={dismissSuggestion}
                clearDayType={clearDayType}
                clearPark={clearPark}
                clearSwimSpot={clearSwimSpot}
                clearStaySpot={clearStaySpot}
                resetDay={resetDay}
                toggleParkHop={toggleParkHop}
                setDayType={setDayType}
                setPark={setPark}
              />
            )}
            {setupDone && (
              <WhatsNext
                activeDay={activeDay}
                activeDate={activeDate}
                plan={plan}
              />
            )}
          </main>

          {settingsOpen && (
            <SettingsPanel
              setSettingsOpen={setSettingsOpen}
              resetPlan={resetPlan}
              resetConfirm={resetConfirm}
              setResetConfirm={setResetConfirm}
            />
          )}
        </>
      )}
    </div>
  )
}

export default App
export { createEventItem, createBlankDayPlan, parseRideSelection, patchDayPlan, DEFAULT_DRAFT, resetDraftForType, normalizeEventItem, formatTime, buildEventLabel, detectTheme, getDayTypeChipColor, DAY_CHIP_COLORS, SHOW_TYPE_MAP, getDateRange, formatPrettyDate, formatShortDate, getItemSlot, getEventTypeConfig, getSecondParkOptions, hashtagLabel, getDayTypeIcon, normalizePlan, getRideOptionsForDay, getTimeSlots, getLocationDisplay, generateId, getRestaurantResources, getDayCardStyle }

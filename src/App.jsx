import { useEffect, useMemo, useState } from 'react'
import { RESTAURANT_TAGS, ALL_RESTAURANTS, getRestaurantResources } from './data/restaurantMetadata'
import { fetchLiveParkShows, ALL_SHOWS } from './data/parkSuggestions.js'
import { RIDE_TAGS } from './data/rideData.js'
import { fuzzyMatch, getDateRange } from './utils.js'
import { DEFAULT_PLAN, DEFAULT_DRAFT, SHOW_TYPE_MAP, WIZARD_STEPS, getEventTypeConfig, createBlankDayPlan, createEventItem, parseRideSelection, patchDayPlan } from './data/planHelpers.js'
import { PROJECTS_KEY, generateId, loadAllProjects } from './data/storage.js'
import { getRideOptionsForDay } from './data/displayHelpers.js'
import HomeScreen from './components/HomeScreen.jsx'
import SetupWizard from './components/SetupWizard.jsx'
import SetupSummary from './components/SetupSummary.jsx'
import SearchBar from './components/SearchBar.jsx'
import DayPlanSection from './components/DayPlanSection.jsx'
import WhatsNext from './components/WhatsNext.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'

const MAX_SHOW_RESULTS = 6
const MAX_RESTAURANT_RESULTS = 6
const MAX_RIDE_RESULTS = 5

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  // ── Project state ──
  const [projects, setProjects] = useState(() => loadAllProjects())
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [plan, setPlan] = useState(DEFAULT_PLAN)
  const [draftDayItems, setDraftDayItems] = useState({})

  // ── Setup wizard state ──
  const [setupDone, setSetupDone] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [prefSearch, setPrefSearch] = useState('')

  // ── Day editing state ──
  const [activeDay, setActiveDay] = useState(0)
  const [editingDayItem, setEditingDayItem] = useState(null) // { date, index, draft }
  const [liveShowData, setLiveShowData] = useState({}) // keyed by park name

  // ── Search / UI state ──
  const [addEventOpen, setAddEventOpen] = useState(false)
  const [eventSearch, setEventSearch] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  // ── Navigation ──
  const nextStep = () => setCurrentStep(s => Math.min(s + 1, WIZARD_STEPS))
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1))

  const toggleFavoriteTag = tag => {
    setPlan(p => ({
      ...p,
      favoriteTags: p.favoriteTags?.includes(tag)
        ? p.favoriteTags.filter(existingTag => existingTag !== tag)
        : [...(p.favoriteTags || []), tag]
    }))
  }

  useEffect(() => {
    if (!activeProjectId) return
    setProjects(currentProjects => {
      const updated = {
        ...currentProjects,
        [activeProjectId]: { ...currentProjects[activeProjectId], updatedAt: new Date().toISOString(), plan }
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

  // ── Setup handlers ──
  const updateField = (field, value) => {
    setPlan((current) => ({ ...current, [field]: value }))
  }

  // ── Day plan handlers ──
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
    setPlan(current => {
      if (!current.dayPlans?.[date]) return current
      return patchDayPlan(current, date, {
        items: current.dayPlans[date].items.map((item, idx) =>
          idx === itemIndex ? { ...item, ...updates } : item
        )
      })
    })
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
      const resources = getRestaurantResources(item)
      newItem = createEventItem({
        type: 'Dinner', restaurant: item,
        menuUrl: resources?.menuUrl || '', bookingUrl: resources?.bookingUrl || '', heroImage: resources?.heroImage || '',
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

  // ── Project handlers ──
  const createProject = () => {
    const id = generateId()
    const now = new Date().toISOString()
    const newProject = { id, createdAt: now, updatedAt: now, plan: DEFAULT_PLAN }
    setProjects(currentProjects => {
      const updated = { ...currentProjects, [id]: newProject }
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
    setProjects(currentProjects => {
      const remainingProjects = { ...currentProjects }
      delete remainingProjects[id]
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(remainingProjects))
      return remainingProjects
    })
  }

  const goHome = () => {
    setActiveProjectId(null)
  }

  const activeDate = tripDates[activeDay]
  const activeDayPlan = plan.dayPlans?.[activeDate] || {}
  const activeRideOptions = useMemo(() => getRideOptionsForDay(activeDayPlan), [activeDayPlan])
  const activeDraft = draftDayItems[activeDate] || DEFAULT_DRAFT
  const activeSelectedEventType = getEventTypeConfig(activeDraft.type)
  const topSearchQ = eventSearch.trim()
  // TD-016: wrap in useMemo — only recalculates when query, park, or ride options change
  const topSearchResults = useMemo(() => {
    if (!setupDone || !topSearchQ) return null
    return {
      shows: ALL_SHOWS
        .map(show => {
          const cleanTags = (show.tags || []).map(tag => tag.replace(/^#/, ''))
          const matchingTags = cleanTags.filter(tag => fuzzyMatch(topSearchQ, tag))
          return (fuzzyMatch(topSearchQ, show.label) || matchingTags.length) ? { ...show, matchingTags } : null
        }).filter(Boolean).slice(0, MAX_SHOW_RESULTS),
      restaurants: ALL_RESTAURANTS.map(restaurant => {
        const tags = RESTAURANT_TAGS[restaurant] || []
        const matchingTags = tags.filter(tag => fuzzyMatch(topSearchQ, tag))
        return (fuzzyMatch(topSearchQ, restaurant) || matchingTags.length) ? { name: restaurant, matchingTags } : null
      }).filter(Boolean).slice(0, MAX_RESTAURANT_RESULTS),
      rides: activeRideOptions.map(ride => {
        const tags = RIDE_TAGS[ride.label] || []
        const matchingTags = tags.filter(tag => fuzzyMatch(topSearchQ, tag))
        return (fuzzyMatch(topSearchQ, ride.label) || matchingTags.length) ? { ...ride, matchingTags } : null
      }).filter(Boolean).slice(0, MAX_RIDE_RESULTS),
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

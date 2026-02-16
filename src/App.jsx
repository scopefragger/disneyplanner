import { useEffect, useMemo, useState } from 'react'

const PARK_OPTIONS = [
  'Magic Kingdom',
  'EPCOT',
  'Disney\'s Hollywood Studios',
  'Disney\'s Animal Kingdom',
  'Disney Springs'
]

const DINING_OPTIONS = [
  'Character Dining',
  'Quick Service',
  'Signature Dining',
  'Snack Crawl',
  'No Set Plan'
]

const DEFAULT_PLAN = {
  tripName: 'Our Disney Holiday',
  startDate: '',
  endDate: '',
  adults: 2,
  children: 0,
  budget: 3500,
  priorities: ['Magic Kingdom'],
  diningStyle: 'Quick Service',
  notes: '',
  dayPlans: {},
  checklist: ['Park tickets', 'Resort booking', 'Genie+ plan']
}

const STORAGE_KEY = 'disney-holiday-planner'
const EVENT_BACKGROUNDS = {
  fireworks: '/images/fireworks.svg',
  dining: '/images/dining.svg',
  ride: '/images/rides.svg',
  character: '/images/characters.svg',
  nature: '/images/nature.svg',
  default: '/images/magic.svg'
}

function normalizePlan(rawPlan) {
  return {
    ...DEFAULT_PLAN,
    ...rawPlan,
    priorities: rawPlan.priorities?.length ? rawPlan.priorities : DEFAULT_PLAN.priorities,
    checklist: rawPlan.checklist?.length ? rawPlan.checklist : DEFAULT_PLAN.checklist,
    dayPlans: rawPlan.dayPlans || {}
  }
}

function getDateRange(startDate, endDate) {
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

function formatPrettyDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

function detectTheme(text) {
  const value = text.toLowerCase()

  if (
    value.includes('firework') ||
    value.includes('night show') ||
    value.includes('parade')
  ) {
    return 'fireworks'
  }
  if (value.includes('dining') || value.includes('restaurant') || value.includes('breakfast')) {
    return 'dining'
  }
  if (value.includes('ride') || value.includes('coaster') || value.includes('genie+')) {
    return 'ride'
  }
  if (value.includes('character') || value.includes('princess') || value.includes('meet')) {
    return 'character'
  }
  if (value.includes('trail') || value.includes('safari') || value.includes('animal')) {
    return 'nature'
  }

  return 'default'
}

function App() {
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_PLAN

    try {
      return normalizePlan(JSON.parse(saved))
    } catch {
      return DEFAULT_PLAN
    }
  })

  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [draftDayItems, setDraftDayItems] = useState({})

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
  }, [plan])

  const tripDates = useMemo(() => {
    return getDateRange(plan.startDate, plan.endDate)
  }, [plan.startDate, plan.endDate])

  const tripLength = tripDates.length || null

  useEffect(() => {
    setPlan((current) => {
      const currentPlans = current.dayPlans || {}
      const nextDayPlans = {}
      let hasChanges = Object.keys(currentPlans).length !== tripDates.length

      tripDates.forEach((date) => {
        if (currentPlans[date]) {
          nextDayPlans[date] = currentPlans[date]
        } else {
          hasChanges = true
          nextDayPlans[date] = {
            park: current.priorities[0] || 'Magic Kingdom',
            focus: '',
            items: []
          }
        }
      })

      if (!hasChanges) return current
      return { ...current, dayPlans: nextDayPlans }
    })
  }, [tripDates, plan.priorities])

  const updateField = (field, value) => {
    setPlan((current) => ({ ...current, [field]: value }))
  }

  const togglePriority = (park) => {
    setPlan((current) => {
      const exists = current.priorities.includes(park)
      const priorities = exists
        ? current.priorities.filter((item) => item !== park)
        : [...current.priorities, park]

      return { ...current, priorities }
    })
  }

  const updateDayPlan = (date, key, value) => {
    setPlan((current) => {
      const currentDay = current.dayPlans?.[date]
      if (!currentDay) return current

      return {
        ...current,
        dayPlans: {
          ...current.dayPlans,
          [date]: {
            ...currentDay,
            [key]: value
          }
        }
      }
    })
  }

  const addDayItem = (date) => {
    const item = (draftDayItems[date] || '').trim()
    if (!item) return

    const theme = detectTheme(item)

    setPlan((current) => ({
      ...current,
      dayPlans: {
        ...current.dayPlans,
        [date]: {
          ...current.dayPlans[date],
          items: [...(current.dayPlans[date]?.items || []), { text: item, theme }]
        }
      }
    }))
    setDraftDayItems((current) => ({ ...current, [date]: '' }))
  }

  const removeDayItem = (date, itemIndex) => {
    setPlan((current) => ({
      ...current,
      dayPlans: {
        ...current.dayPlans,
        [date]: {
          ...current.dayPlans[date],
          items: (current.dayPlans[date]?.items || []).filter((_, idx) => idx !== itemIndex)
        }
      }
    }))
  }

  const addChecklistItem = () => {
    const item = newChecklistItem.trim()
    if (!item) return

    setPlan((current) => ({
      ...current,
      checklist: [...current.checklist, item]
    }))
    setNewChecklistItem('')
  }

  const removeChecklistItem = (index) => {
    setPlan((current) => ({
      ...current,
      checklist: current.checklist.filter((_, itemIndex) => itemIndex !== index)
    }))
  }

  const resetPlan = () => {
    setPlan(DEFAULT_PLAN)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <p className="eyebrow">Disney World-Inspired Holiday Tool</p>
        <h1>{plan.tripName}</h1>
        <p className="subtitle">
          Build your park days, spending target, and must-do list in one place.
        </p>
      </header>

      <main className="planner-grid">
        <section className="card">
          <h2>Trip Basics</h2>
          <label>
            Trip name
            <input
              value={plan.tripName}
              onChange={(event) => updateField('tripName', event.target.value)}
              placeholder="Magical Family Getaway"
            />
          </label>

          <div className="inline-fields">
            <label>
              Start
              <input
                type="date"
                value={plan.startDate}
                onChange={(event) => updateField('startDate', event.target.value)}
              />
            </label>
            <label>
              End
              <input
                type="date"
                value={plan.endDate}
                onChange={(event) => updateField('endDate', event.target.value)}
              />
            </label>
          </div>

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

          <label>
            Holiday budget (GBP)
            <input
              type="number"
              min="0"
              step="50"
              value={plan.budget}
              onChange={(event) => updateField('budget', Number(event.target.value))}
            />
          </label>

          <div className="summary-row">
            <span>Length</span>
            <strong>{tripLength ? `${tripLength} day${tripLength > 1 ? 's' : ''}` : 'Pick dates'}</strong>
          </div>
        </section>

        <section className="card">
          <h2>Parks and Dining</h2>
          <p className="section-hint">Tap your top parks.</p>
          <div className="chip-row">
            {PARK_OPTIONS.map((park) => (
              <button
                key={park}
                type="button"
                className={plan.priorities.includes(park) ? 'chip selected' : 'chip'}
                onClick={() => togglePriority(park)}
              >
                {park}
              </button>
            ))}
          </div>

          <label>
            Dining style
            <select
              value={plan.diningStyle}
              onChange={(event) => updateField('diningStyle', event.target.value)}
            >
              {DINING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            Extra notes
            <textarea
              rows="4"
              value={plan.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Parades, fireworks, room requests, transport ideas..."
            />
          </label>
        </section>

        <section className="card card-wide">
          <div className="card-title-row day-header">
            <h2>Daily Plan by Date</h2>
            <span className="section-hint">Date range auto-builds each day section.</span>
          </div>

          {!tripDates.length && (
            <p className="section-hint">Set your start and end date to unlock daily planning cards.</p>
          )}

          <div className="date-plan-grid">
            {tripDates.map((date, index) => {
              const dayPlan = plan.dayPlans?.[date] || { park: 'Magic Kingdom', focus: '', items: [] }

              return (
                <article key={date} className="date-card">
                  <div className="date-card-head">
                    <h3>Day {index + 1}</h3>
                    <p>{formatPrettyDate(date)}</p>
                  </div>

                  <div className="day-form-stack">
                    <label className="field-compact">
                      Park
                      <select
                        value={dayPlan.park}
                        onChange={(event) => updateDayPlan(date, 'park', event.target.value)}
                      >
                        {PARK_OPTIONS.map((park) => (
                          <option key={park} value={park}>
                            {park}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="field-compact">
                      Focus
                      <input
                        value={dayPlan.focus}
                        onChange={(event) => updateDayPlan(date, 'focus', event.target.value)}
                        placeholder="Top priority for this day"
                      />
                    </label>
                  </div>

                  <div className="event-input-row">
                    <input
                      value={draftDayItems[date] || ''}
                      onChange={(event) =>
                        setDraftDayItems((current) => ({ ...current, [date]: event.target.value }))
                      }
                      placeholder="Add event (e.g. fireworks, character breakfast)"
                    />
                    <button type="button" className="action action-compact" onClick={() => addDayItem(date)}>
                      Add event
                    </button>
                  </div>

                  <div className="event-list">
                    {!dayPlan.items?.length && (
                      <p className="event-empty">No events yet for this day.</p>
                    )}
                    {dayPlan.items?.map((item, itemIndex) => (
                      <div
                        key={`${item.text}-${itemIndex}`}
                        className="event-tile"
                        style={{
                          '--event-image': `url(${EVENT_BACKGROUNDS[item.theme] || EVENT_BACKGROUNDS.default})`
                        }}
                      >
                        <div className="event-content">
                          <p>{item.text}</p>
                          <button type="button" onClick={() => removeDayItem(date, itemIndex)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="card">
          <h2>Checklist</h2>
          <div className="inline-fields">
            <input
              value={newChecklistItem}
              onChange={(event) => setNewChecklistItem(event.target.value)}
              placeholder="Add task"
            />
            <button type="button" className="action" onClick={addChecklistItem}>
              Add
            </button>
          </div>

          <ul className="checklist">
            {plan.checklist.map((item, index) => (
              <li key={`${item}-${index}`}>
                <span>{item}</span>
                <button type="button" onClick={() => removeChecklistItem(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer-bar">
        <p>Saved automatically in your browser.</p>
        <button type="button" className="danger" onClick={resetPlan}>
          Reset planner
        </button>
      </footer>
    </div>
  )
}

export default App

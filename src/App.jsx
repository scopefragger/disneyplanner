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
  days: [
    { day: 'Day 1', park: 'Magic Kingdom', focus: '' },
    { day: 'Day 2', park: 'EPCOT', focus: '' }
  ],
  checklist: ['Park tickets', 'Resort booking', 'Genie+ plan']
}

const STORAGE_KEY = 'disney-holiday-planner'

function App() {
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_PLAN

    try {
      return JSON.parse(saved)
    } catch {
      return DEFAULT_PLAN
    }
  })

  const [newChecklistItem, setNewChecklistItem] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
  }, [plan])

  const tripLength = useMemo(() => {
    if (!plan.startDate || !plan.endDate) return null

    const start = new Date(plan.startDate)
    const end = new Date(plan.endDate)
    const msPerDay = 1000 * 60 * 60 * 24
    const days = Math.floor((end - start) / msPerDay) + 1

    return days > 0 ? days : null
  }, [plan.startDate, plan.endDate])

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

  const updateDay = (index, key, value) => {
    setPlan((current) => {
      const updated = [...current.days]
      updated[index] = { ...updated[index], [key]: value }
      return { ...current, days: updated }
    })
  }

  const addDay = () => {
    setPlan((current) => ({
      ...current,
      days: [
        ...current.days,
        { day: `Day ${current.days.length + 1}`, park: 'Magic Kingdom', focus: '' }
      ]
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
          <div className="card-title-row">
            <h2>Daily Plan</h2>
            <button type="button" className="action" onClick={addDay}>
              Add day
            </button>
          </div>

          <div className="day-list">
            {plan.days.map((day, index) => (
              <div key={`${day.day}-${index}`} className="day-row">
                <input
                  value={day.day}
                  onChange={(event) => updateDay(index, 'day', event.target.value)}
                />
                <select
                  value={day.park}
                  onChange={(event) => updateDay(index, 'park', event.target.value)}
                >
                  {PARK_OPTIONS.map((park) => (
                    <option key={park} value={park}>
                      {park}
                    </option>
                  ))}
                </select>
                <input
                  value={day.focus}
                  onChange={(event) => updateDay(index, 'focus', event.target.value)}
                  placeholder="Top rides / dining / shows"
                />
              </div>
            ))}
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

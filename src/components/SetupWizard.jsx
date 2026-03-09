import { fuzzyMatch, pluralize } from '../utils.js'
import { DISNEY_HOTELS, DINING_OPTIONS, ENTERTAINMENT_TYPES, FRANCHISE_OPTIONS } from '../data/tripOptions.js'
import { WIZARD_STEPS } from '../data/planHelpers.js'

export default function SetupWizard({
  plan, currentStep, tripLength,
  prefSearch, setPrefSearch,
  updateField, nextStep, prevStep,
  setSetupDone, toggleFavoriteTag
}) {
  const filteredEntertainment = ENTERTAINMENT_TYPES.filter(({ label }) => fuzzyMatch(prefSearch, label))
  const filteredFranchises    = FRANCHISE_OPTIONS.filter(({ label }) => fuzzyMatch(prefSearch, label))
  const noResults = !filteredEntertainment.length && !filteredFranchises.length

  return (
    <section key={currentStep} className="card card-wide setup-step">
      <p className="step-label">Step {currentStep} of {WIZARD_STEPS}</p>

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
            <span className="step-length-pill">{pluralize(tripLength, 'day', 'days')}</span>
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

      {currentStep === WIZARD_STEPS && <>
        <h2 className="step-question">What do you love most?</h2>
        <p className="step-sub">We'll use this to surface the shows, parades and meet &amp; greets that matter to you.</p>

        <input
          className="pref-search"
          type="search"
          placeholder="Search entertainment, franchises, characters…"
          value={prefSearch}
          onChange={e => setPrefSearch(e.target.value)}
        />

        {noResults ? (
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
        </>}
      </>}

      <div className="step-nav">
        {currentStep > 1 && (
          <button className="step-back-btn" onClick={prevStep}>← Back</button>
        )}
        {currentStep < WIZARD_STEPS ? (
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

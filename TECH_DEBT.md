# Tech Debt Register — Disney Holiday Planner

Each item is recorded when the debt is accrued.
It is removed from this file once fixed and verified by a passing build + test run.

---

## Readability refactor — App.jsx (1 973 lines)

App.jsx currently owns five distinct concerns in one file:
static data constants, pure utility functions, persistence/storage helpers,
display-formatting helpers, and the React component itself.
The goal is to reduce App.jsx to ~600 lines of state + handlers + JSX,
and give every other concern its own clearly-named home.

Suggested execution order — three batches of three:

---

### TD-029 — Move `RIDES_BY_PARK` and `RIDE_IMAGES` into `rideData.js`

**Problem:** `rideData.js` already owns `RIDE_URLS` and `RIDE_TAGS`.
`RIDES_BY_PARK` (~40 lines) and `RIDE_IMAGES` (~40 lines) live in App.jsx
and violate the rule that all ride reference data lives together.
`RIDE_IMAGES` needs its own `const RIDES_IMG` using `import.meta.env.BASE_URL`
at the top of `rideData.js` — `import.meta.env` is available in any Vite module.

**Fix:** Move both constants to `rideData.js`; export them.
Update App.jsx import: `import { RIDE_TAGS, getRideUrl, RIDES_BY_PARK, RIDE_IMAGES } from './data/rideData.js'`.
Remove the two blocks from App.jsx (~80 lines freed).

---

### TD-030 — Move `RESTAURANT_GROUPS` and `ALL_RESTAURANTS` into `restaurantMetadata.js`

**Problem:** `restaurantMetadata.js` already owns `RESTAURANT_METADATA` and `RESTAURANT_TAGS`.
`RESTAURANT_GROUPS` (~100 lines) and `ALL_RESTAURANTS` (1 line) live in App.jsx
and belong with the rest of the restaurant reference data.

**Fix:** Move both to `restaurantMetadata.js`; export them.
Update App.jsx import line; remove both blocks (~110 lines freed).

---

### TD-031 — Create `src/data/tripOptions.js` for static UI option arrays

**Problem:** Eight static arrays live at the top of App.jsx with no dependencies on React or Vite env:
`PARK_OPTIONS`, `DINING_OPTIONS`, `DAY_TYPES` (references `IMG_BASE` — move `IMG_BASE` locally),
`SWIM_OPTIONS`, `DISNEY_HOTELS`, `ENTERTAINMENT_TYPES`, `FRANCHISE_OPTIONS`, `EVENT_TYPES`.
They are pure data with no reason to live in the component file.

**Fix:** Create `src/data/tripOptions.js`; move and export all eight constants
(define a local `IMG_BASE` using `import.meta.env.BASE_URL`).
Update App.jsx to import them; remove ~210 lines from App.jsx.

---

### TD-032 — Create `src/data/storage.js` for persistence helpers

**Problem:** `STORAGE_KEY`, `PROJECTS_KEY`, `DEFAULT_PLAN`, `generateId`, and `loadAllProjects`
are pure data/IO helpers at lines 317–357 of App.jsx.
They have zero React dependencies and belong in a dedicated module.

**Fix:** Create `src/data/storage.js`; move and export all five.
App.jsx imports the ones it needs; removes ~80 lines from App.jsx.

---

### TD-033 — Move date/time formatters into `src/utils.js`

**Problem:** `getDateRange`, `formatPrettyDate`, `formatShortDate`, and `formatTime`
are pure string/date functions defined in App.jsx.
`src/utils.js` already exists for exactly this kind of utility (`fuzzyMatch` lives there).

**Fix:** Add the four functions to `utils.js`; export them.
Update App.jsx import; remove ~50 lines from App.jsx.
Add coverage to `utils.test.js` for all four.

---

### TD-034 — Create `src/data/planHelpers.js` for plan-shape factories and state helpers

**Problem:** `DEFAULT_DRAFT`, `SHOW_TYPE_MAP`, `createBlankDayPlan`, `createEventItem`,
`parseRideSelection`, `patchDayPlan`, `normalizeEventItem`, `resetDraftForType`, `normalizePlan`,
`buildEventLabel`, `detectTheme`, and `getEventTypeConfig` are ~180 lines of pure functions
with no React or DOM dependencies — they implement the plan data model.

**Fix:** Create `src/data/planHelpers.js`; move and export all twelve.
App.jsx imports them; removes ~180 lines from App.jsx.
The existing appHelpers test suite covers most of these — update imports in the test file.

---

### TD-035 — Create `src/data/displayHelpers.js` for pure display/style helpers

**Problem:** `DAY_CHIP_COLORS`, `getDayTypeChipColor`, `getDayTypeIcon`, `getLocationDisplay`,
`hashtagLabel`, `getSecondParkOptions`, `getRideOptionsForDay`, `getRestaurantResources`,
`getDayCardStyle`, `DEFAULT_SLOT`, `getItemSlot`, and `getTimeSlots` are ~180 lines
of pure display/style functions with no React dependencies living in App.jsx.

**Fix:** Create `src/data/displayHelpers.js`; move and export all twelve.
App.jsx imports them; removes ~180 lines from App.jsx.
Update test file imports.

---

### TD-036 — Extract large JSX sections into named render functions inside `App.jsx`

**Problem:** The main `return()` block is ~920 lines of deeply-nested JSX.
Four sections are large enough to obscure the overall page structure:
- Setup wizard (steps 1–6, ~165 lines)
- Search bar card + advanced form (~160 lines)
- Day card article (badges, park form, park-hop dock, ~190 lines)
- Day timeline (slot loop, event cards, ghost suggestions, ~145 lines)

**Fix:** Extract each section into a named function defined above `App()` in the same file,
accepting explicit props. The main `return()` then reads as a clear table of contents:

```jsx
return (
  <div className="page-shell">
    {activeProjectId === null
      ? <HomeScreen ... />
      : <>
          <header>...</header>
          <main className="planner-grid">
            {!setupDone && <SetupWizard ... />}
            {setupDone && <SetupSummary ... />}
            {setupDone && <SearchBar ... />}
            {setupDone && <DayPlanSection ... />}
            {setupDone && <WhatsNext ... />}
          </main>
          {settingsOpen && <SettingsPanel ... />}
        </>
    }
  </div>
)
```

These are **render functions in App.jsx**, not new `.jsx` files.
No new component files are created.

---

### TD-037 — Extract the park-hop toggle inline `onClick` into a named handler

**Problem:** The park-hop toggle button has a 10-line inline `onClick` lambda
that updates three fields atomically. It is the only complex day-level mutation
that is not a named handler — inconsistent with `resetDay`, `setDayType`, etc.

**Fix:** Extract to `const toggleParkHop = (date) => { ... }` next to the other
named handlers in App.jsx. Replace the inline lambda with `onClick={() => toggleParkHop(date)}`.
Small change but completes the named-handler pattern and makes the button testable.

---

*All nine items are sequenced so that TD-029–031 (data file consolidation) can be one batch,
TD-032–034 (logic modules) a second batch, and TD-035–037 (display helpers + JSX cleanup) a third.
Each batch must pass build + coverage check before moving on.*

*Expected outcome: App.jsx shrinks from ~1 973 lines to ~600 lines,
every concern has a named home, and the main return() is a readable outline of the page.*

# Tech Debt Register — Disney Holiday Planner

Each item is recorded when the debt is accrued.
It is removed from this file once fixed and verified by a passing build + test run.

---

## TD-001 · Repeated `dayPlans` state-update spread pattern

**Severity:** High
**File:** `src/App.jsx`
**Violation:** DRY — logic used 12+ times without extraction

**Problem:**
The pattern below appears in every function that touches `dayPlans`:

```js
setPlan(current => ({
  ...current,
  dayPlans: {
    ...current.dayPlans,
    [date]: {
      ...current.dayPlans[date],
      /* specific change */
    }
  }
}))
```

Functions affected: `updateDayPlan`, `addDayItem`, `updateDayItem`, `removeDayItem`,
`acceptSuggestion`, `dismissSuggestion`, `quickAddToDay`, `clearPark`, `resetDay`,
`setDayType`, and two inline JSX handlers.

**Fix:**
Extract a single helper:

```js
function patchDayPlan(current, date, patch) {
  return {
    ...current,
    dayPlans: {
      ...current.dayPlans,
      [date]: { ...current.dayPlans[date], ...patch }
    }
  }
}
```

All `setPlan(current => ...)` calls become:
```js
setPlan(current => patchDayPlan(current, date, { items: [...] }))
```

**Pattern:** Factory Method / Builder
**Effort:** Medium — mechanical search-and-replace across ~12 call sites

---

## TD-002 · Event item object literal created in 6+ places (missing Factory Method)

**Severity:** High
**File:** `src/App.jsx`
**Violation:** DRY — same object shape constructed ad-hoc each time

**Problem:**
The 11-field event item shape `{ type, restaurant, customRestaurant, menuUrl, bookingUrl, heroImage, ride, ridePark, note, time, theme }` is constructed from scratch in:

1. `addDayItem()` — from draft state
2. `acceptSuggestion()` — from a suggestion object
3. `quickAddToDay()` show branch
4. `quickAddToDay()` restaurant branch
5. `quickAddToDay()` ride branch
6. `normalizeEventItem()` — two return paths

If the shape ever gains a new field it must be updated in 6 places.

**Fix:**
Create a single factory with sensible defaults:

```js
function createEventItem(overrides) {
  return {
    type: '',
    restaurant: '',
    customRestaurant: '',
    menuUrl: '',
    bookingUrl: '',
    heroImage: '',
    ride: '',
    ridePark: '',
    note: '',
    time: '',
    theme: '',
    ...overrides
  }
}
```

**Pattern:** Factory Method
**Effort:** Medium — update all 6 construction sites

---

## TD-003 · Draft item default object defined in 3 different places

**Severity:** Medium
**File:** `src/App.jsx`
**Violation:** DRY — same default object repeated with slight inconsistencies

**Problem:**
A "blank draft" object is created three times:
- In `addDayItem()` — omits `time`
- In the JSX `const draft = draftDayItems[date] || { ... }` — includes `time`
- In `resetDay()` — omits `time`

This inconsistency means code that reads `draft.time` may get `undefined` in some paths.

**Fix:**
Export a single `DEFAULT_DRAFT` constant and reference it everywhere:

```js
const DEFAULT_DRAFT = {
  type: 'Fireworks', restaurant: '', customRestaurant: '',
  ride: '', note: '', time: ''
}
```

**Pattern:** Prototype (shared template object)
**Effort:** Low — one constant, three call site updates

---

## TD-004 · Ride selection parsing duplicated

**Severity:** Low
**File:** `src/App.jsx`
**Violation:** DRY — same destructuring at lines ~1010 and ~1127

**Problem:**
```js
const [ridePark = '', ride = ''] = rideSelection.split('::')
```
appears twice. If the separator ever changes, two places need updating.

**Fix:**
```js
function parseRideSelection(value) {
  const [ridePark = '', ride = ''] = (value || '').split('::')
  return { ridePark, ride }
}
```

**Pattern:** DRY utility extraction
**Effort:** Trivial

---

## TD-005 · `inferTags()` uses 70+ imperative `if` statements instead of data tables

**Severity:** Medium
**File:** `src/data/parkSuggestions.js`
**Violation:** Readability / Template Method pattern not fully applied

**Problem:**
`inferTags()` (~109 lines) has:
- 38 `if` blocks for franchise detection
- 32 `if` blocks for character detection
- 8 `if` blocks for activity detection

Adding a new franchise or character requires writing a new `if` block buried in a wall of code.

**Fix:**
Replace imperative chains with declarative lookup tables:

```js
const FRANCHISE_KEYWORDS = {
  '#frozen':    ['frozen', 'elsa', 'anna', 'olaf'],
  '#starwars':  ['star wars', 'galaxy', 'grogu', 'lightsaber'],
  // ...
}

function inferFranchiseTags(text) {
  const lower = text.toLowerCase()
  return Object.entries(FRANCHISE_KEYWORDS)
    .filter(([, keywords]) => keywords.some(k => lower.includes(k)))
    .map(([tag]) => tag)
}
```

This keeps the Template Method skeleton (`collect → assemble → truncate`) while making each stage purely data-driven.

**Pattern:** Template Method + Chain of Responsibility
**Effort:** Medium — data extraction is mechanical, needs tests updated

---

## TD-006 · `normalizeEventItem()` duplicates its own return shape twice

**Severity:** Medium
**File:** `src/App.jsx`
**Violation:** DRY — the 11-field shape is fully listed in both return branches

**Problem:**
`normalizeEventItem()` has two `return` paths, each listing all 11 fields. The second path is the fallback for legacy/plain-text items. If TD-002 (factory) is fixed first, this can simply call `createEventItem()` in both branches.

**Fix:**
After TD-002 is done, both returns become:
```js
// structured item
return createEventItem({ type: item.type, ... })
// legacy item
return createEventItem({ note: item?.text || '', time: item?.time || '' })
```

**Depends on:** TD-002
**Pattern:** Factory Method
**Effort:** Trivial once TD-002 is done

---

## TD-007 · Event type dropdown change handler has inline business logic in JSX

**Severity:** Low
**File:** `src/App.jsx`
**Violation:** Business logic buried inside a JSX `onChange` handler

**Problem:**
When the user changes the event type dropdown, the handler resets restaurant/ride/note fields with an inline object literal. This logic cannot be tested and is hard to find.

**Fix:**
Extract to a named function:
```js
function resetDraftForType(draft, newType) {
  return { type: newType, restaurant: '', customRestaurant: '', ride: '', note: draft.note || '' }
}
```
Then the handler is simply:
```js
onChange={e => setDraftDayItems(cur => ({ ...cur, [date]: resetDraftForType(cur[date], e.target.value) }))}
```

**Pattern:** Command
**Effort:** Low

---

## TD-008 · `fetchLiveParkShows` adapter mapping is anonymous — Adapter pattern not explicit

**Severity:** Low
**File:** `src/data/parkSuggestions.js`
**Violation:** Adapter pattern exists but boundary is not cleanly named

**Problem:**
The API response → internal suggestion shape mapping is done inline inside `fetchLiveParkShows()`. If the themeparks.wiki API shape changes, the adaptation logic must be found inside a large async function.

**Fix:**
Extract the mapping to a named adapter:
```js
function adaptLiveShow(rawShow, parkName) {
  return createSuggestion({
    id: `live-${rawShow.id}`,
    label: rawShow.name,
    time: parseShowTime(rawShow.schedule?.[0]?.openingTime || ''),
    // ...
  })
}
```

**Pattern:** Adapter
**Effort:** Low

---

## TD-009 · Pure functions in `App.jsx` have no test coverage

**Severity:** Medium
**File:** `src/App.jsx` / `src/__tests__/`
**Violation:** Coverage minimum could be broken by future changes

**Problem:**
The following pure functions have zero test coverage and contain non-trivial logic:
- `detectTheme(text)` — regex-based theme inference
- `buildEventLabel(item)` — label construction from item fields
- `formatTime(timeStr)` — 12h/24h time formatting
- `normalizeEventItem(item)` — dual-path normalization
- `getLocationDisplay(dayPlan, myHotel)` — location icon/label logic
- `getDayCardStyle(dayPlan)` — complex multi-layer CSS variable builder
- `parseRideSelection(value)` — after TD-004 is extracted

If any of these regress, the test suite will not catch it.

**Fix:**
Add a `src/__tests__/appHelpers.test.js` file with unit tests for each pure function, pushing coverage from ~62% to 75%+.

**Effort:** Medium — requires exporting helpers or testing via `src/utils.js` re-exports

---

## TD-010 · `RIDES_BY_PARK` object has unquoted `EPCOT` key

**Severity:** Trivial
**File:** `src/App.jsx`
**Violation:** Minor style inconsistency with other park name keys (all others are quoted strings)

**Fix:** Change `EPCOT:` to `'EPCOT':` for consistency.
**Effort:** Trivial

---

## Recommended Fix Order

| Priority | ID | Reason |
|----------|----|--------|
| 1 | TD-001 | Highest duplication count; unlocks all other state updates |
| 2 | TD-002 | Factory needed before TD-006 can be fixed |
| 3 | TD-003 | Fixes subtle `time` inconsistency bug |
| 4 | TD-005 | Biggest readability/maintainability win in data layer |
| 5 | TD-006 | Depends on TD-002; trivial once done |
| 6 | TD-009 | Coverage safety net; do alongside TD-004/TD-007 |
| 7 | TD-004 | Trivial DRY fix |
| 8 | TD-007 | Low effort, improves testability |
| 9 | TD-008 | Low effort, makes adapter boundary explicit |
| 10 | TD-010 | Trivial style fix |

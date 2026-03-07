# Tech Debt Register — Disney Holiday Planner

Each item is recorded when the debt is accrued.
It is removed from this file once fixed and verified by a passing build + test run.

---

*TD-029 through TD-037 completed 2026-03-07. App.jsx reduced from 1 973 → ~1 360 lines;
all static data, utilities, plan helpers, display helpers and persistence logic extracted
to named modules; JSX extracted to named render functions.*

---

### TD-038 — Move `getRestaurantResources` from App.jsx into `restaurantMetadata.js`

**Problem:** `getRestaurantResources` is a pure lookup/URL-building function that depends only
on `RESTAURANT_METADATA`. It lives in App.jsx above the render functions, which is the wrong home —
all restaurant reference logic should live in `restaurantMetadata.js`.

**Fix:** Move the function to `restaurantMetadata.js`; export it.
Update App.jsx import line; remove the function body from App.jsx (~12 lines freed).
Add `getRestaurantResources` to the App.jsx re-export list at the bottom so the test
backward-compat export still works.

---

### TD-039 — Add tests for `storage.js` (`loadAllProjects`, `generateId`)

**Problem:** `storage.js` has 15.78% statement coverage and 0% branch coverage.
`loadAllProjects` is untested — it handles three cases:
- No saved data → returns `{}`
- Existing `disney-holiday-projects` key → parses and returns projects
- Old single-plan format in `disney-holiday-planner` key → migrates, saves under new key, removes old key

**Fix:** Add a `storage.test.js` in `src/__tests__/` covering all three paths.
Mock `localStorage` (already done in `appHelpers.test.js` via jsdom).
Expected coverage gain: 15% → ≥ 80%.

---

### TD-040 — Add tests for `getRideUrl` and `getRideTags` in `rideData.js`

**Problem:** `rideData.js` has 0% function coverage and 0% branch coverage for the two
exported functions `getRideUrl` (line 78) and `getRideTags` (line 82).
They are trivial lookups but completely untested.

**Fix:** Add cases to `appHelpers.test.js` (or a new `rideData.test.js`):
- known ride → returns URL / tags array
- unknown ride → `getRideUrl` returns `null`; `getRideTags` returns `[]`
Expected coverage gain: rideData.js functions 0% → 100%.

---

### TD-041 — Increase coverage for `displayHelpers.js` uncovered branches

**Problem:** `displayHelpers.js` is at 82.5% branch coverage.
Uncovered lines: 132–134 (Disney Springs tint/logo in `getDayCardStyle`), 200 (`DEFAULT_SLOT` fallback in `getItemSlot`).

**Fix:** Add targeted test cases:
- `getDayCardStyle` with `staySpot: 'Disney Springs'` → verify correct tint CSS var
- `getItemSlot` with item that has no `time` and a type not in `DEFAULT_SLOT` → returns `'midday'`

---

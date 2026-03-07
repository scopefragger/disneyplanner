# Tech Debt Register — Disney Holiday Planner

Each item is recorded when the debt is accrued.
It is removed from this file once fixed and verified by a passing build + test run.

---

## TD-014 — `RESTAURANT_TAGS` is stranded in App.jsx
`RESTAURANT_TAGS` (lines 372–465) belongs with the other restaurant data in
`src/data/restaurantMetadata.js`. Add a `tags` array field to each entry in that file and remove
the standalone constant from App.jsx.

## TD-015 — `RIDE_TAGS` and `RIDE_URLS` are parallel flat lookups in App.jsx
Both constants use the same ride-name keys and belong together. Extract both to
`src/data/rideData.js`, exporting `getRideTags(ride)` and `getRideUrl(ride)` helpers. Keep
`RIDES_BY_PARK` and `RIDE_IMAGES` (which depends on `IMG_BASE`) in App.jsx.

## TD-016 — `topSearchResults` is an inline computation in the render body
`topSearchResults` (lines 1196–1213) is a pure transform of `eventSearch + plan` state computed
directly in the render body. Wrap in `useMemo` so it only recalculates when its inputs change.

## TD-017 — Blank day plan object constructed in three places
The blank day plan shape `{ dayType:'', park:'', secondPark:'', parkHop:false, swimSpot:'',
staySpot:'', items:[], dismissedSuggestions:[] }` appears in `normalizePlan`, in the tripDates
`useEffect` (existing entry branch and else branch). Extract `createBlankDayPlan()` factory as
SSOT. Also fixes a bug: the `useEffect` existing-entry branch drops `dismissedSuggestions`.

## TD-018 — `getDateRange`, `formatPrettyDate`, `formatShortDate` have no tests
These pure functions are untested. Export them from App.jsx and add tests in
`src/__tests__/appHelpers.test.js`.

## TD-019 — `getItemSlot`, `getEventTypeConfig`, `getSecondParkOptions` have no tests
Pure functions with no test coverage. Export and test.

## TD-020 — `hashtagLabel`, `getDayTypeChipColor`, `getDayTypeIcon` have no tests
Pure functions with no test coverage. Export and test.

## TD-021 — `normalizePlan` has no tests
Critical data-recovery function with no coverage. Export and add tests covering default values,
partial input, and the `dayPlans` normalisation path.

## TD-022 — `getRideOptionsForDay` and `getTimeSlots` have no tests
Pure functions with no test coverage. Export and test both.

## TD-023 — `getLocationDisplay` has no tests
Pure function used to compute the location chip label and icon. Export and add tests for each
day-type branch (Park, Park-hop, Swimming, Hotel/Shopping, Travel, null).

## TD-024 — Ride data integrity is not verified by any test
`RIDES_BY_PARK` drives the ride selector. There is no test confirming that every ride name listed
in `RIDES_BY_PARK` has a matching entry in `RIDE_URLS` and `RIDE_IMAGES`. A missing entry silently
produces no link/image. Add data-integrity tests.

## TD-025 — `getRestaurantResources` and `generateId` have no tests
`getRestaurantResources` has two code paths (metadata hit / fallback search URL). `generateId`
should produce unique, stable-format IDs. Export and test both.

## TD-026 — `getDayCardStyle` return shape is untested
`getDayCardStyle` returns CSS custom-property objects that drive card styling. No test verifies
the shape or that the correct values are returned for park-hop vs single-park vs swim vs hotel
days. Export and add tests.

## TD-027 — Additional `normalizePlan` edge cases needed
Supplement TD-021 tests with: missing `favoriteTags`, missing `checklist`, malformed `dayPlans`
entry (null items, missing keys), and a plan with zero days.

## TD-028 — Additional `buildEventLabel` and `detectTheme` branch coverage
`buildEventLabel`: the `item.text` legacy fallback path and the "Event" fallback lack edge-case
tests (e.g. type set but both ride and restaurant empty). `detectTheme`: the dining/ride/character
branches currently have no tests. Add targeted tests to raise branch coverage.

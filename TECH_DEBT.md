# Tech Debt Register — Disney Holiday Planner

Each item is recorded when the debt is accrued.
It is removed from this file once fixed and verified by a passing build + test run.

---

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

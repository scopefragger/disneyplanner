# Tech Debt Register — Disney Holiday Planner

Each item is recorded when the debt is accrued.
It is removed from this file once fixed and verified by a passing build + test run.

---

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

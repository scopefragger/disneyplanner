# Intent Log

Timestamped record of changes made to this project — what was done and why.
Each entry is appended after every prompt.

---

## 2026-03-06T19:35:52Z — Fuzzy search in add-event panel

**What:**
- Added `ALL_RESTAURANTS` module-level const (flattened from `RESTAURANT_GROUPS`)
- Added `eventSearch` state; resets when the panel opens, closes, or an item is added
- Inside each day render: computes `eventSearchResults` (shows, restaurants, rides filtered by `fuzzyMatch`) and `applySearchResult` handler
- Added search input at top of the add-event panel; shows a grouped dropdown while typing
- Selecting a show pre-fills type + note + time; selecting a restaurant pre-fills type (defaults to Dinner) + restaurant; selecting a ride pre-fills type + ride
- Added CSS: `.event-search-wrap`, `.event-search-input`, `.event-search-results`, `.esr-group-label`, `.esr-item`, `.esr-name`, `.esr-meta`

**Why:**
- The old add-event flow required 2–3 dropdown interactions to add a common item (pick type → pick restaurant/ride)
- A single fuzzy search input lets the user type the name of what they want and select it in one tap, which is faster and more natural on mobile

---

## 2026-03-06T19:09:07Z — Test infrastructure + intent log

**What:**
- Installed `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`
- Configured `vite.config.js` with jsdom test environment and 60% coverage thresholds
- Added `test`, `test:watch`, `test:coverage` scripts to `package.json`
- Created `src/__tests__/setup.js`, `src/__tests__/utils.test.js`, `src/__tests__/parkSuggestions.test.js`
- Extracted `fuzzyMatch` into `src/utils.js` so it could be independently imported and tested
- Exported `inferTheme`, `inferTags`, `parseShowTime` from `parkSuggestions.js` for testability
- Fixed a wrong test assertion (`#frozen` was expected for a show title that doesn't contain the word "Frozen")
- Created this `INTENT.md` file

**Why:**
- CLAUDE.md rule requires ≥60% code coverage before every commit — needed the test runner first
- Pure utilities (`fuzzyMatch`, park suggestion helpers) are easiest to cover with unit tests before tackling component-level tests
- The intent log gives both human and AI a durable record of *why* each change was made, making future debugging and onboarding easier

---

## 2026-03-06 — Ghost event suggestion system (earlier session, reconstructed)

**What:**
- Created `src/data/parkSuggestions.js` with static `PARK_SUGGESTIONS` map, `inferTheme()`, `inferTags()`, `parseShowTime()`, `getParkSuggestions()`, `fetchLiveParkShows()`
- Added `dismissedSuggestions` to day plan normalisation
- Added `acceptSuggestion` and `dismissSuggestion` handlers in App
- Rendered ghost cards (dashed-border, semi-transparent) in timeline for Park days
- Fixed ghost tag colour (was too light/invisible on character theme)
- Enriched `inferTags()` with franchise + character + activity priority pipeline (max 3 tags)
- Added `infoUrl` and `mapUrl` to every static suggestion entry

**Why:**
- WDW has predictable recurring shows/fireworks/parades — surfacing them automatically saves users from manual lookup
- Ghost pattern (suggest → accept or dismiss) keeps the planner non-intrusive while still being helpful
- Tags let suggestions be filtered by user preferences set in Step 6

---

## 2026-03-06 — User preferences step (earlier session, reconstructed)

**What:**
- Added Step 6 to setup flow: chip grids for entertainment types (6 options) and franchise/IP favourites (29 chips)
- Added fuzzy search bar inside Step 6 to filter chips
- Added `favoriteTags` to plan state
- Filtered ghost suggestions: if `favoriteTags` is non-empty, only show suggestions whose tags intersect with favourites
- Added "✦ My preferences" button to setup summary bar so users with a loaded plan can re-open Step 6

**Why:**
- Generic suggestions (all shows for a park) are noisy — personalising to user taste reduces clutter
- The preferences step needed to be reachable after setup was already complete (hence the summary bar shortcut)

---

## 2026-03-06 — CLAUDE.md agent rules (earlier session, reconstructed)

**What:**
- Created `CLAUDE.md` with project overview, stack, key file paths, build/test commands, workflow rules, design patterns, architecture rules, "what not to do" list

**Why:**
- Provides persistent context so the AI assistant doesn't need to re-discover conventions each session
- Encodes decisions (tag format, suggestion object shape, park name keys) so they stay consistent across prompts
- References refactoring.guru design patterns to guide future architectural choices

---

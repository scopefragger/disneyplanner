# Intent Log

Timestamped record of changes made to this project — what was done and why.
Each entry is appended after every prompt.

---

## 2026-03-07T09:25:00Z — Resolve all 10 tech debt items (TD-001 through TD-010)

**What:**
- **TD-001** — Extracted `patchDayPlan(current, date, patch)` helper; replaced 12 identical dayPlans spread-patterns across all state handlers and two inline JSX callbacks
- **TD-002** — Extracted `createEventItem(overrides)` factory; all 6 event-item object literals now delegate to it
- **TD-003** — Added `DEFAULT_DRAFT` constant; all three draft-default objects now reference it, fixing the silent `time` field inconsistency
- **TD-004** — Extracted `parseRideSelection(value)` utility; removed the two duplicated destructuring lines
- **TD-005** — Replaced 70+ imperative `if` blocks in `inferTags` with three declarative lookup tables (`FRANCHISE_KEYWORDS`, `CHARACTER_KEYWORDS`, `ACTIVITY_KEYWORDS`) and a shared `matchKeywords` helper
- **TD-006** — `normalizeEventItem` both return paths now call `createEventItem`
- **TD-007** — Extracted `resetDraftForType(draft, newType)` command; event-type dropdown `onChange` now calls it
- **TD-008** — Extracted `adaptLiveShow(e, parkName)` adapter; `fetchLiveParkShows` `.map()` delegates to it
- **TD-009** — Added `src/__tests__/appHelpers.test.js` with 30 tests covering all new pure helpers; coverage 62% → 68–73%
- **TD-010** — Quoted `'EPCOT'` key in `RIDES_BY_PARK` for consistency
- Exported all new pure helpers from App.jsx for testability
- Cleared TECH_DEBT.md (all items resolved)

**Why:** Full tech debt paydown — eliminates DRY violations, applies Factory Method, Command, Adapter, and Template Method patterns, raises test coverage.

---

## 2026-03-07T09:20:00Z — Establish tech debt register

**What:**
- Created `TECH_DEBT.md` with 10 identified issues (TD-001 through TD-010) from a full codebase audit against CLAUDE.md quality standards
- Updated `CLAUDE.md`: added `TECH_DEBT.md` to the key files table; added "Tech Debt Tracking" section with format and removal rules

**Why:** Codebase has grown organically and accumulated quality debt (DRY violations, missing factory patterns, untested pure functions). Formalising the register ensures debt is tracked, prioritised, and removed rather than silently accumulating.

---

## 2026-03-07T09:08:00Z — Google-style search bar + What's next section

**What:**
- Moved event search from the floating panel to a prominent pill-shaped search bar between the setup summary and the daily planner
- Clicking a search result immediately adds the event to the active day via `quickAddToDay` (no draft step)
- Removed the green + FAB and 🗺 map FAB entirely
- Added an inline "Add manually" chip at the bottom of the timeline card to access the form-based event builder
- Added a "What's next" card below the daily planner with a "View Day on map" button
- Restyled the event-builder-panel as an inline card (was a fixed floating panel anchored to the FAB)
- Removed now-unused `.event-search-wrap`, `.event-search-input`, `.event-search-results`, `.fab-group`, `.fab-add-event`, `.fab-day-map` CSS
- Updated empty-state timeline hint copy

**Why:** User requested the search bar move to a more prominent top-level position similar to a Google search bar, and wanted a cleaner home for the map action rather than a floating button.

---

## 2026-03-06T20:06:00Z — Download ride images locally

**What:**
- Downloaded all 29 ride photos from Wikipedia Commons into `public/images/rides/` (JPEG, 79–424KB each)
- Updated `RIDE_IMAGES` const to use local paths via `${RIDES_IMG}filename.jpg` instead of Disney CDN URLs
- Removed the old `CDN`/`DAM` URL constants; added `RIDES_IMG = \`${IMG_BASE}rides/\``

**Why:**
- Disney Parks CDN uses IP-based hotlink protection — all direct download attempts returned 403 regardless of headers
- Local images load faster, work offline, and don't risk future CDN URL changes or breakage
- Wikipedia Commons images are freely licensed (CC / public domain) and usable with proper attribution

---

## 2026-03-06T19:58:00Z — Ride background images on timeline cards

**What:**
- Added `RIDE_IMAGES` const mapping all 30 rides to Disney Parks CDN photo URLs
- In the timeline render, look up `RIDE_IMAGES[rideName]` for each ride card
- Applied as a layered `backgroundImage` inline style: white semi-transparent gradient over the photo so text remains readable

**Why:**
- Gives ride cards a visual identity so users can instantly recognise which ride an entry is for
- Uses the same Disney Parks CDN already used for restaurant hero images; if a URL 404s the card falls back to the theme-colour background with no visible breakage

---

## 2026-03-06T19:50:00Z — Fix: rides incorrectly showing dining links

**What:**
- Added `normalizedItem.type !== 'Ride'` guard to the `hasRestaurantLinks` condition

**Why:**
- `getRestaurantResources` always returns a URL (falls back to a Disney search URL for unknown names), so if `draft.restaurant` was non-empty when a ride was saved, the item stored with `menuUrl`/`bookingUrl` — causing "View menu" and "Book" to appear on ride cards
- Checking `type !== 'Ride'` ensures dining links are never shown for ride-type items regardless of stored data

---

## 2026-03-06T19:41:10Z — Ride official page links on timeline cards

**What:**
- Added `RIDE_URLS` const mapping every ride name to its `disneyworld.disney.go.com/attractions/` URL
- In the timeline render, extract the ride name from `item.ride` (split on `::`) and look up `RIDE_URLS`
- Show an "Official page" link on ride event cards (separate from the dining menu/book links)

**Why:**
- Ride cards previously showed no links, while dining cards had menu and booking links
- An official page link lets users quickly check height requirements, accessibility info, and Lightning Lane availability

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

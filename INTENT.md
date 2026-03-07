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

## 2026-03-07T09:35:00Z — Tech debt batch 1 (TD-011, TD-012, TD-013)

**What:**
- TD-011: Moved `SHOW_TYPE_MAP` from inside `App()` to module level — was recreated on every render
- TD-012: Simplified `updateDayPlan` to delegate to `patchDayPlan` — eliminated manual spread duplicate
- TD-013: Replaced `getDayTypeChipColor` if-chain with `DAY_CHIP_COLORS` declarative lookup object

**Why:** Remove render-time waste, eliminate duplicated spread logic, and apply the declarative keyword-table pattern consistently (matching TD-005 approach from prior session).

---

## 2026-03-07T10:05:00Z — Tech debt batch 2 (TD-014, TD-015, TD-016)

**What:**
- TD-014: Moved `RESTAURANT_TAGS` from App.jsx to `src/data/restaurantMetadata.js` as a named export — all restaurant data now co-located
- TD-015: Extracted `RIDE_TAGS` and `RIDE_URLS` to `src/data/rideData.js`; added `getRideTags()` and `getRideUrl()` helpers; App.jsx now imports from data layer
- TD-016: Wrapped `topSearchResults` computation in `useMemo` — recalculates only when query, park, or ride options change

**Why:** Co-locate data with its logical home (same file = one place to update). `useMemo` eliminates search recalculation on unrelated re-renders.

---

## 2026-03-07T13:45:00Z — Tech debt batch 3 (TD-017, TD-018, TD-019)

**What:**
- TD-017: Extracted `createBlankDayPlan()` factory; used in `normalizePlan` and tripDates `useEffect`; fixed bug where `dismissedSuggestions` was silently dropped on date-range changes
- TD-018: Exported `getDateRange`, `formatPrettyDate`, `formatShortDate`; added 10 tests covering date range generation, edge cases, and formatting
- TD-019: Exported `getItemSlot`, `getEventTypeConfig`, `getSecondParkOptions`; added 12 tests covering slot inference, event config lookup, and park filtering

**Why:** Single source of truth for day plan shape prevents field drift. Tests on date and slot helpers catch regressions in critical scheduling logic.

---

## 2026-03-07T13:47:00Z — Tech debt batch 4 (TD-020, TD-021, TD-022)

**What:**
- TD-020: Exported `hashtagLabel`, `getDayTypeChipColor`, `getDayTypeIcon`; added 11 tests
- TD-021: Exported `normalizePlan`; added 6 tests covering default fill, dayPlans normalisation, edge cases
- TD-022: Exported `getRideOptionsForDay`, `getTimeSlots`; added 8 tests covering park-hop, slot labels

**Why:** normalizePlan is the critical localStorage recovery path — any regression there corrupts saved plans. Tests on ride options and slot helpers guard against scheduling bugs.

---

## 2026-03-07T13:48:00Z — Tech debt batch 5 (TD-023, TD-024, TD-025)

**What:**
- TD-023: Exported `getLocationDisplay`; added 7 tests covering all day-type branches including park-hop, "My hotel" prefix, and Disney Springs icon
- TD-024: Added ride data integrity tests — verify every ride in RIDES_BY_PARK has a matching RIDE_URLS, RIDE_IMAGES, and RIDE_TAGS entry; catches silent missing-data bugs
- TD-025: Added tests for `getRestaurantResources` (metadata hit + search URL fallback) and `generateId` (format + uniqueness)

**Why:** Data integrity tests make it impossible to add a ride to the selector without also providing its URL, image, and tags. generateId uniqueness prevents duplicate project IDs corrupting the project list.

---

## 2026-03-07T14:10:00Z — Tech debt batch 6 (TD-026, TD-027, TD-028)

**What:**
- TD-026: Exported `getDayCardStyle`; added 5 tests covering Park (solid), Swimming (gradient), Hotel/Shopping, Travel, and default case
- TD-027: Added 6 normalizePlan edge-case tests — favoriteTags preservation, checklist item normalisation, null/missing items, parkHop truthy coercion
- TD-028: Added 2 buildEventLabel branch tests (restaurant note fallback, ride+note combo) and 8 detectTheme branch tests (dining, ride, character, nature keywords)

**Why:** getDayCardStyle drives the visual identity of every day card — regression there would silently break all card backgrounds. Edge-case normalizePlan tests guard the localStorage recovery path against corrupted or partially-migrated data.

---

## 2026-03-07T13:53:00Z — Search all WDW shows regardless of active day's park

**What:**
- Added `ALL_SHOWS` export to `parkSuggestions.js` — flat list of every static show decorated with its `park` field
- Changed `topSearchResults.shows` in App.jsx from `getParkSuggestions(activeDayPlan.park, ...)` to `ALL_SHOWS` so all 9 WDW shows are always searchable
- Updated search result meta to show park name + time (e.g. "Magic Kingdom · 21:00") instead of show type
- Removed `activeDayPlan.park`/`activeDayPlan.secondPark` from `useMemo` deps (no longer referenced inside memo); increased show slice cap from 4 → 6

**Why:** Previously you could only find shows for the active day's park — if the day had no park set, or you were looking for a show at a different park, nothing appeared. Now the search works across all WDW shows at all times.

---

## 2026-03-07T14:00:00Z — Move manual add into search bar as Advanced add

**What:**
- Removed "Add manually" button from bottom of timeline and event builder panel from inside `day-timeline-card`
- Added "+ Add" pill toggle button inside the search bar input row; clicking it opens the full event builder form below the search results within the search bar card
- Hoisted `activeDraft` and `activeSelectedEventType` before the return so the form can operate from search bar context
- Removed now-stale `draft`, `selectedEventType`, and `rideOptions` declarations from the day IIFE
- Removed `.timeline-manual-add` CSS; added `.searchbar-advanced-btn` pill style; moved `.event-builder-panel` margin from bottom to top

**Why:** Consolidates all event-adding entry points into the search bar — one place for both quick-search adding and the full advanced form. Typing in the search bar collapses the advanced form and vice versa, keeping the UI uncluttered.

---

## 2026-03-07T14:20:00Z — Batch 1 refactor: extract data constants from App.jsx (TD-029, TD-030, TD-031)

**What:**
- TD-029: Moved `RIDES_BY_PARK` and `RIDE_IMAGES` from App.jsx into `src/data/rideData.js`; rideData.js now owns all ride reference data
- TD-030: Moved `RESTAURANT_GROUPS` and `ALL_RESTAURANTS` from App.jsx into `src/data/restaurantMetadata.js`; restaurantMetadata.js now owns all restaurant reference data
- TD-031: Created `src/data/tripOptions.js` with eight static UI option arrays (`PARK_OPTIONS`, `DINING_OPTIONS`, `DAY_TYPES`, `SWIM_OPTIONS`, `DISNEY_HOTELS`, `ENTERTAINMENT_TYPES`, `FRANCHISE_OPTIONS`, `EVENT_TYPES`)
- Updated App.jsx imports and export list; removed ~292 lines of constant blocks
- Updated `appHelpers.test.js` to import `RIDES_BY_PARK`/`RIDE_IMAGES` from `rideData.js`

**Why:** App.jsx was 1 973 lines; data constants scattered throughout the file violated single-responsibility. Moving them to co-located data modules reduces App.jsx to ~1 681 lines and gives every constant a named home.

## 2026-03-07T14:26:00Z — Batch 2 refactor: extract logic modules from App.jsx (TD-032, TD-033, TD-034)

**What:**
- TD-032: Created `src/data/storage.js` — `STORAGE_KEY`, `PROJECTS_KEY`, `generateId`, `loadAllProjects`
- TD-033: Added `getDateRange`, `formatPrettyDate`, `formatShortDate`, `formatTime` to `src/utils.js`
- TD-034: Created `src/data/planHelpers.js` — `DEFAULT_PLAN`, `DEFAULT_DRAFT`, `SHOW_TYPE_MAP`, `createBlankDayPlan`, `createEventItem`, `parseRideSelection`, `patchDayPlan`, `detectTheme`, `getEventTypeConfig`, `normalizeEventItem`, `buildEventLabel`, `normalizePlan`, `resetDraftForType`
- Updated App.jsx imports; removed ~222 lines of function definitions
- App.jsx now at ~1 461 lines (down from 1 973 before Batch 1)

**Why:** Second batch of the readability refactor. Pure logic functions with zero React dependencies now live in dedicated modules. `storage.js` imports `normalizePlan` from `planHelpers.js` (not vice versa) to avoid circular dependencies.

## 2026-03-07T14:32:00Z — Batch 3 refactor: display helpers + park-hop handler (TD-035, TD-037)

**What:**
- TD-035: Created `src/data/displayHelpers.js` — `DAY_CHIP_COLORS`, `getDayTypeChipColor`, `hashtagLabel`, `getDayCardStyle`, `getDayTypeIcon`, `getSecondParkOptions`, `getRideOptionsForDay`, `DEFAULT_SLOT`, `getItemSlot`, `getTimeSlots`, `getLocationDisplay` plus all private image/tint/logo constant maps
- TD-037: Extracted 10-line inline park-hop `onClick` lambda into named `toggleParkHop(date)` handler beside `resetDay` and `setDayType`
- Removed `IMG_BASE` from App.jsx (now unused after display helpers moved)
- App.jsx now at ~1 250 lines (down from 1 973 at start of refactor)
- TD-036 (JSX render function extraction) deferred to a follow-up

**Why:** All pure display/style constants and helpers now live in a dedicated module. toggleParkHop completes the named-handler pattern for day-level mutations.

## 2026-03-07T14:35:00Z — Strengthen INTENT.md requirement in CLAUDE.md

**What:**
- Added "INTENT.md MUST be updated before every commit — no exceptions." as an explicit bolded rule in the Workflow Rules section of CLAUDE.md

**Why:** User flagged that the requirement to update INTENT.md before committing needed to be more prominently stated in the agent instructions to prevent it from being skipped.

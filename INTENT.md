# Intent Log

Timestamped record of changes made to this project — what was done and why.
Each entry is appended after every prompt.

## 2026-03-14T17:00:00Z — Audit and refresh rides.yaml against current WDW lineup

**What:**
- Removed DINOSAUR (permanently closed Feb 2, 2026 — DinoLand demolished for Tropical Americas)
- Updated Rock 'n' Roller Coaster → Rock 'n' Roller Coaster Starring The Muppets (retheme, summer 2026)
- Renamed Soarin' Around the World → Soarin' Across America (new film debuts May 26, 2026)
- Removed stale `chevrolet` tag from Test Track (no longer sponsored)
- Added 5 missing Magic Kingdom rides: it's a small world, Buzz Lightyear's Space Ranger Spin, The Many Adventures of Winnie the Pooh, Under the Sea – Journey of The Little Mermaid, The Barnstormer
- Added 2 missing EPCOT rides: Living with the Land, The Seas with Nemo & Friends
- Added 2 missing Hollywood Studios rides: Star Tours – The Adventures Continue, Alien Swirling Saucers

**Why:** Periodic data audit to keep ride data current — DINOSAUR closed, Rock 'n' Roller Coaster rethemed to Muppets, Soarin' getting new American film, and several notable attractions were missing from the YAML.

## 2026-03-14T10:00:00Z — Migrate all static data to YAML (TD-154–158)

**What:**
- Installed `@modyfi/vite-plugin-yaml` (devDependency); added `yaml()` to `vite.config.js` plugins
- Created `src/data/yaml/` with 6 files:
  - `trip-options.yaml` — park/dining/franchise/hotel/event-type arrays
  - `rides.yaml` — 27 rides grouped by park, each with urlSlug, image, description, tags
  - `restaurants.yaml` — 67 restaurants with menuUrl, bookingUrl, heroImage, description, tags, park
  - `park-shows.yaml` — static fallback show suggestions per park
  - `keywords.yaml` — franchise/character/activity keyword maps + princess/pixar/marvel name arrays
  - `park-config.yaml` — themeparks.wiki entity IDs and Google Maps fallback URLs
- Slimmed 4 JS data files to thin YAML importers:
  - `tripOptions.js` (110 → 9 lines)
  - `rideData.js` (203 → 17 lines)
  - `restaurantMetadata.js` (653 → 43 lines)
  - `parkSuggestions.js` (317 → 128 lines — logic functions unchanged)
- Removed TD-154–158 from TECH_DEBT.md

**Why:** Static data is now in human-readable YAML files that are easy to edit without touching JS syntax. Adding a ride, restaurant, or show no longer requires navigating logic code.

## 2026-03-14T00:00:00Z — Monorail day-switch loading animation

**What:**
- Created `src/components/MonorailLoader.jsx` — overlay component with inline SVG monorail car (body gradient, windows, pylon), beam, and day/date label. `role="status"` + `aria-label` for screen readers.
- Updated `src/components/DayPlanSection.jsx` — added `dayLoading` state + `useEffect` that fires on `activeDay` changes (skips initial render via `prevActiveDayRef = useRef(null)`), wraps article + timeline in `.day-content-wrap`, renders `MonorailLoader` for 3500ms when day changes.
- Updated `src/App.css` — added `.day-content-wrap`, `.monorail-overlay`, `.monorail-scene`, `.monorail-train-wrap`, `.monorail-beam`, `.monorail-label*` styles and `@keyframes monorailRide`. Animation automatically suppressed by existing `prefers-reduced-motion` rule.

**Why:** Fun Disney-branded transition when switching days — the monorail slides across the screen for ~3.5s before revealing the new day's content.

## 2026-03-14T10:30:00Z — Fix link clipping by capping description to 1 line

**What:** Added `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` to `.event-description` so it stays on a single line

**Why:** Multi-line descriptions were overflowing the 100px card height, causing the bottom links row to be clipped. Single-line truncation keeps the height budget consistent.

## 2026-03-14T10:25:00Z — Increase card height to 100px to prevent link clipping

**What:** Increased all timeline card heights from 88px to 100px (swipe-reveal-wrap, ghost-event-content)

**Why:** The bottom link row was visually clipped at 88px; 100px gives the extra clearance needed

## 2026-03-14T10:15:00Z — True fixed-height cards with pinned links

**What:**
- Set `height: 88px` (fixed) on `.swipe-reveal-wrap` and `.ghost-event-content`
- `.timeline-event-content` and `.event-text` fill full card height via `height: 100%`
- Event links and ghost links use `margin-top: auto` to pin to the bottom of each card — cards with or without description look the same because the links always sit at the same vertical position
- Ghost accept/dismiss buttons centred vertically with `flex-direction: column; justify-content: center`
- `.ghost-event-content` uses `align-items: stretch` so event-text fills the full height

**Why:**
- `min-height` gave inconsistent heights; true `height: 88px` makes every card identical
- `margin-top: auto` on links means description presence/absence only affects the gap above the links, not the card height — consistent appearance without requiring placeholder content

## 2026-03-14T10:00:00Z — Restore descriptions and links on event cards; flexible card height

**What:**
- Replaced fixed `height: 52px` with `min-height: 56px` on swipe wrapper, event content, and ghost cards so cards grow to fit their content
- Changed `.timeline-event-content` alignment to `flex-start` (content anchors top)
- Reinstated description and action links (View menu, Book, View info, View on map) in TimelineEventCard for real events
- Reinstated description and info/map links for ghost suggestion cards
- Increased vertical padding from 0.3rem to 0.5rem for better breathing room

**Why:**
- Fixed 52px clipped descriptions and removed all action links — reinstating them at a flexible min-height restores full card content

## 2026-03-14T09:45:00Z — Fixed-height timeline event cards

**What:**
- Set `height: 52px` on `.swipe-reveal-wrap` and `.ghost-event-content` so all timeline cards are a uniform height
- Changed `.event-text` from `display: grid` to `display: flex; flex-direction: column` with tighter gap
- Added `.event-text-meta` flex row to place event-type badge and time on the same line, making the 2-row layout (meta row + label) fit within the fixed height
- Removed description and links from the card face (they were below the 52px fold anyway); accessible via edit form

**Why:**
- Uniform card height makes the timeline visually consistent and easier to scan

## 2026-03-14T09:30:00Z — Complete accessibility pass + swipe-to-delete + time-click-edit

**What:**
- Removed `opacity: 0.82` from `.ghost-event-content` (was undermining all child contrast)
- Fixed coral contrast: `.danger` and `.event-delete-btn` changed to `color: var(--dw-ink)` (4.82:1 vs ~3:1 for white); `.reset-day-btn` changed to `#c0392b` and opacity removed; `.event-edit-delete` changed to `#c0392b`
- Fixed ghost accept button green: `#22c55e` → `#15803d` (5.01:1 on white)
- Added `.hero :focus-visible { outline-color: rgba(255,255,255,0.9) }` for white focus ring on dark hero background
- Added `type="button"` and `aria-label="Previous day"` / `aria-label="Next day"` to nav arrow buttons in DayPlanSection
- Added `aria-current="page"` to the active day nav strip button
- Replaced visible edit (✏) button with clickable time — clicking the time stamp on any event card opens the inline edit form
- Added swipe-to-reveal delete: swiping a card left reveals the × delete button (touch gesture); no delete button visible by default
- `createEventItem` now defaults `time` to `'09:00'` if none provided, ensuring all entries always have a time
- Updated test expectation for new default time

**Why:**
- Completes all remaining WCAG 2.1 AA contrast violations identified in accessibility audit
- Swipe-to-delete reduces accidental deletions and cleans up the card UI
- Time-click-edit improves discoverability and reduces button clutter on small cards
- Default time ensures timeline always renders correctly even for quickly-added items

## 2026-03-14T09:00:00Z — Accessibility audit and WCAG 2.1 AA fixes

**What:**
- Raised all sub-0.70 Ink opacity text values to minimum 0.70 (~5.1:1 on white): step-sub, pref-no-results, pref-section-label, setup-hint, setup-summary-info, day-nav-arrows, esr-group/meta labels, timeline-anchor-label, event-description, ghost-tag, ghost-link, event-edit-label, timeline-empty, project-row-info, home-empty, close-panel-btn, settings-note, settings-section strong
- UI-only elements (dismiss icon, searchbar clear, placeholder) raised to 0.55 (~3.5:1 — meets SC 1.4.11 UI component minimum)
- Removed `opacity: 0.6` from `.step-label` — `var(--dw-royal-blue)` at full opacity is 6.9:1
- Changed `.event-type-badge` text to `var(--dw-ink)` — 4 of 6 theme colours failed contrast on white
- `.day-type-badge` 42px → 44px; `.day-nav-arrows button` 2rem → 2.75rem (44px touch targets)
- Ghost action and event inline icon buttons: expanded hit area to 44px via padding + negative margin
- Event edit form buttons: `min-height: 2.75rem`, increased padding
- Input focus ring raised to `rgba(0,87,184,0.8)`; global `:focus-visible` rule added
- `@media (prefers-reduced-motion: reduce)` added, collapses all animations/transitions
- DESIGN.md Section 10 (Accessibility) written: Ink opacity floor, contrast tables, touch target rules, focus spec, motion rules, colour independence, semantic HTML

**Why:** WCAG 2.1 AA audit identified contrast failures (SC 1.4.3), missing focus indicators (SC 2.4.7), no reduced-motion support, and sub-minimum touch targets. All resolved and codified as standing design standards.

## 2026-03-14T08:27:00Z — Fix brand compliance violations in App.css

**What:**
- `.event-description` colour: replaced hardcoded `#6b7280` with `rgba(29, 42, 68, 0.55)` (Ink opacity scale)
- `.event-edit-btn` background: replaced off-brand `#f5c400` with `var(--dw-sun)` token
- `.timeline-empty`: removed `font-style: italic` — italic is reserved for `.event-description` only
- `.whats-next-btn`: changed `border-radius` from `10px` to `999px` pill and background from solid `--dw-royal-blue` to brand gradient, matching primary button spec
- `.top-searchbar-wrap` and `.event-builder-panel`: replaced hardcoded `#f7f8fc` with `var(--dw-cloud)`
- Removed dead `.event-links a` base rule that contained hardcoded `#0f3e7a` and was unreachable in practice
- `.timeline-event-content .event-text p` font-size: corrected from `0.82rem` to `0.85rem` per type scale

**Why:** Full audit against DESIGN.md revealed 7 violations — hardcoded colours outside the palette, wrong button shapes, and italic misuse. All fixes bring the codebase into alignment with the brand guide.

## 2026-03-13T23:30:00Z — Add brand and design guide

**What:**
- Created `DESIGN.md` at the project root — a full brand and design system guide

**Why:**
- Establish a consistent design language for colours, typography, spacing, shape, components, motion, and imagery
- Acts as a single source of truth for all future visual decisions and artwork

---

## 2026-03-13T23:00:00Z — Improve day card header UX

**What:**
- `DayPlanSection.jsx`: changed heading from "Daily Plan by Date" to "Daily Plan"
- `DayPlanSection.jsx` (`renderDaySummaryPills`): replaced `hashtagLabel()` calls with plain text — pills now show "Park" and "Disney's Hollywood Studios" instead of "#Park" and "#Disney'sHollywoodStudios"
- `DayPlanSection.jsx` (`renderDayBadges`): added descriptive `title` and `aria-label` to badge buttons so their remove action is clear
- `DayPlanSection.jsx` (park-hop-dock): "Park hop" now only renders on Park days, shows state ("+ Park hop" / "✓ Park hop on"), uses `park-hop-active` class; "Reset day" is now a separate text-only button
- `App.css`: `.park-hop-btn` changed to outlined ghost pill with green active state; `.reset-day-btn` changed to text-only link; `.day-type-badge::after` adds coral `×` indicator on hover

**Why:** The section had four UX problems: generic heading, unreadable hashtag labels (joined words), two different-weight actions looking identical, and icon buttons with no visible remove affordance.

## 2026-03-13T22:30:00Z — Redesign timeline event cards

**What:**
- `planHelpers.js` (`buildEventLabel`): strip type prefix and park name from labels — rides show just the attraction name, dining shows just the restaurant name, notes show just the note text
- `TimelineEventCard.jsx`: add `eventType` prop; render a small coloured type badge (RIDE / DINNER / FIREWORKS etc.) above the card title
- `DayPlanSection.jsx`: pass `eventType={normalizedItem.type}` for real events and `eventType={suggestion.type}` for ghost suggestions; reduce white gradient overlay on ride background images so more of the photo shows through
- `App.css`: add `.event-type-badge` rule using `color-mix` on `--event-theme-color`; replace blue pill link buttons with small inline text links
- `appHelpers.test.js`: update `buildEventLabel` tests to match new label format

**Why:** Cards were visually cluttered — verbose labels ("Ride: Millennium Falcon: Smugglers Run (Disney's Hollywood Studios)") and large blue pill buttons dominated each card. The redesign separates type context into a coloured badge and lets the attraction name stand as the hero text, with links becoming subtle inline text.

## 2026-03-13T02:00:00Z — Add descriptions to all timeline event cards

**What:**
- `rideData.js`: added `RIDE_DESCRIPTIONS` (29 rides) and `getRideDescription()` helper
- `restaurantMetadata.js`: added `RESTAURANT_DESCRIPTIONS` (~75 restaurants) and `getRestaurantDescription()` helper
- `parkSuggestions.js`: added `description` field to all 9 static park suggestion entries
- `tripOptions.js`: added `description` field to all 12 `EVENT_TYPES` entries (fallback for generic events)
- `displayHelpers.js`: added `getEventDescription(normalizedItem)` — looks up ride → restaurant → event-type in priority order
- `TimelineEventCard.jsx`: added `description` prop; renders `<small class="event-description">` below the label
- `DayPlanSection.jsx`: passes `getEventDescription(normalizedItem)` to confirmed event cards; passes `suggestion.description` to ghost cards
- `App.css`: added `.event-description` rule (0.72rem italic muted grey)

**Why:** Every card item now shows a one-line description, making the timeline scannable without needing prior knowledge of Disney attractions.

---

## 2026-03-13T01:00:00Z — Extract TimelineEventCard component

**What:**
- Created `src/components/TimelineEventCard.jsx` — single component for both confirmed events (`ghost=false`) and ghost suggestions (`ghost=true`). Props: `theme`, `time`, `label`, `backgroundStyle`, `menuUrl`, `bookingUrl`, `viewInfoUrl`, `mapUrl`, `hasRestaurantLinks`, `onEdit`, `onDelete` (real events); `tags`, `infoUrl`, `onAccept`, `onDismiss` (ghost events)
- Updated `DayPlanSection.jsx`: replaced `renderTimelineEvent` and `renderGhostEvent` with `<TimelineEventCard>` calls; removed `renderEventLinks` (logic now lives inside the new component); removed unused `formatTime` import

**Why:** Both card types shared the same outer shell (time, label, themed wrapper, action buttons) but were defined as separate render functions with duplicated structure. Consolidating into one parameterised component ensures consistent markup and makes future style changes apply to both variants in one place.

---

## 2026-03-13T00:00:00Z — Add PWA support for Android installation

**What:**
- Installed `vite-plugin-pwa` (devDependency v0.21.x) — auto-generates service worker via Workbox
- Created `public/images/app-icon.svg` — square 512×512 castle icon on Disney blue background
- Updated `vite.config.js` — added `VitePWA()` plugin with manifest config (name, start_url `/disneyplanner/`, standalone display, SVG icon) and Workbox pre-cache for all assets
- Updated `index.html` — added `theme-color`, `description`, `mobile-web-app-capable`, `apple-mobile-web-app-*` meta tags and `apple-touch-icon` link
- Build now outputs `dist/manifest.webmanifest`, `dist/sw.js`, `dist/registerSW.js`, and `dist/workbox-*.js`

**Why:** User wants the app installable on Android as a home screen app. PWA allows Chrome on Android to prompt "Add to Home Screen"; installed app launches full-screen with no browser chrome and works offline (all state in localStorage).

---

## 2026-03-09T08:40:00Z — Pay down all 38 remaining tech debt items

**What:**
- TD-073/078: Created `src/data/constants.js` exporting shared `IMG_BASE` and `WDW_SUFFIX`; updated `displayHelpers.js`, `rideData.js`, `tripOptions.js` to import `IMG_BASE`; updated `parkSuggestions.js`, `DayPlanSection.jsx`, `WhatsNext.jsx` to use `WDW_SUFFIX`
- TD-069: Added `SLOT_BOUNDARIES` named constants to `displayHelpers.js`; used in `getItemSlot`
- TD-082: Added `appendDayItem(current, date, newItem)` helper to `planHelpers.js`; used in `addDayItem`, `quickAddToDay`, `acceptSuggestion`
- TD-084: Added `appendDismissed(current, date, id)` helper to `planHelpers.js`; used in `acceptSuggestion`, `dismissSuggestion`
- TD-083: Added `pluralize(count, singular, plural)` to `utils.js`; used in `HomeScreen`, `SetupSummary`, `SetupWizard`
- TD-123: Added `currencySymbol: '£'` to `DEFAULT_PLAN`; `SetupSummary` now reads `plan.currencySymbol`
- TD-146: Added canonical-fields comment to `createBlankDayPlan`
- TD-147: Added `text: ''` to `createEventItem` template so legacy items use the canonical shape
- TD-126: Expanded compressed tag assembly loops in `inferTags` to standard multi-line for…of blocks
- TD-140/141/142: Sorted App.jsx imports alphabetically within groups; grouped handlers by category; moved `topSearchResults` useMemo closer to SearchBar
- TD-080: Deduplicated 18 CSS data-theme rules into a single `[data-theme="..."]` block
- TD-117: Added `.close-panel-btn` CSS rule to `App.css`
- TD-049: Broke SetupSummary budget/adults info into separate `<span>` lines using `pluralize`
- TD-052: Broke HomeScreen project row info span; uses `pluralize` for day count
- TD-129: Extracted `handleDelete` handler in HomeScreen
- TD-131: Extracted `handleEditSetup`, `handlePreferences`, `handleSettings` in SetupSummary
- TD-055: Extracted SetupWizard step 6 IIFE → pre-computed `filteredEntertainment` / `filteredFranchises` / `noResults`
- TD-079: Added `updateDraft` helper in SearchBar replacing 4 repeated `setDraftDayItems` patterns
- TD-053: Extracted `buildMapUrl(plan, activeDate)` in WhatsNext
- TD-051: Extracted `navBtnClass` computation in DayPlanSection day nav buttons
- TD-054: Extracted `computeGhostSuggestions` named function replacing IIFE
- TD-056: Extracted `clearLocation` handler inside `renderDayBadges`
- TD-057: Extracted `updateEditDraft` helper inside `renderEditForm`
- TD-058: Extracted `buildItemUrls(normalizedItem, dayPlan)` helper
- TD-059: Extracted `renderEventLinks(...)` helper function
- TD-060: Extracted `renderDayBadges(...)` helper function
- TD-061/130: Extracted `renderDaySummaryPills(...)` with pre-computed `locationText`
- TD-062: Extracted `renderDayFormSelector(...)` helper function
- TD-063: Extracted `renderEditForm(...)` helper function
- TD-064: Extracted `renderTimelineEvent(...)` helper function
- TD-065: Extracted `renderGhostEvent(...)` helper function
- TD-066: Extracted `buildHotelShoppingOptions(myHotel)` above component
- TD-143: Grouped all derived-state computations above return in DayPlanSection
- TD-149: Changed `timeSlots.flatMap(slot => [...])` to `.map(...).filter(Boolean)` pattern

**Why:** Complete all outstanding readability and DRY tech debt items from the TD-049–TD-149 audit

## 2026-03-09T08:18:00Z — Pay down second batch of 30 tech debt items

**What:**
- TD-088: Renamed `p` → `projectPlan` in HomeScreen
- TD-107/108: Removed dead `.setup-actions` and `.inline-fields.four-col` CSS
- TD-109: Removed stale "Floating action buttons" CSS comment
- TD-110: Removed dead `#anna` branch in inferTags (unreachable)
- TD-111/112: Removed dead `.day-nav-pill` and `.event-input-row` CSS
- TD-068: Named cache TTL `CACHE_TTL_MS` in fetchLiveParkShows
- TD-070: Named max tag count `MAX_TAGS = 3` in inferTags
- TD-071: Named search result limits (`MAX_SHOW_RESULTS`, `MAX_RESTAURANT_RESULTS`, `MAX_RIDE_RESULTS`)
- TD-072: Named default tint `DEFAULT_TINT` in displayHelpers
- TD-074: Extracted `WIZARD_STEPS = 6` to planHelpers; used in App.jsx and SetupWizard.jsx
- TD-075: Added comment explaining `latenight` slot in getItemSlot
- TD-076/077: Named `GOOGLE_MAPS_SEARCH_URL` and `GOOGLE_SEARCH_URL` in DayPlanSection
- TD-125: Quoted all object keys consistently in displayHelpers maps
- TD-127: Added branch comments to buildEventLabel
- TD-128: Expanded single-line catch blocks in storage.js to multi-line
- TD-118–122: Corrected ride name punctuation (Peter Pan's, Na'vi, Remy's, Rock 'n', Mickey & Minnie's)
- TD-133/134: Added JSDoc to getLocationDisplay and getDayCardStyle
- TD-136: Commented legacy text field path in normalizeEventItem
- TD-137: Commented DEFAULT_SLOT fallback assignment
- TD-144/145: Added aria-label to edit/delete buttons and ghost accept/dismiss buttons

**Why:** Systematic readability audit — dead code, magic value naming, ride name accuracy, JSDoc, accessibility.

## 2026-03-09T08:02:00Z — Pay down 30 tech debt items (batches 1–10)

**What:**
- TD-116: Fixed "Step X of 5" → "Step X of 6" bug in SetupWizard
- TD-113: Added NaN guard to formatTime; TD-114: added invalid date guard to formatPrettyDate
- TD-089/090: Renamed `s`→`show`, `r`→`restaurant`/`ride` in topSearchResults; TD-096: `t`→`existingTag` in toggleFavoriteTag
- TD-097/098/099: Renamed `prev`→`currentProjects`, `next`→`remainingProjects`, `res`→`resources` in App.jsx handlers
- TD-085/091/092: Renamed `n`→`nameLower` in inferTheme/inferTags; `e`→`showEntity` in adaptLiveShow; `kws`→`keywords` in matchKeywords
- TD-093/094: Renamed `q`→`queryLower`, `t`→`textLower` in fuzzyMatch; `h`→`hours`, `m`→`minutes` in formatTime
- TD-115: Added shape validation to loadAllProjects in storage.js
- TD-086/087/081: Renamed `dp`→`navDayPlan`, `d`→`dateStr` in DayPlanSection; cached `plan.myHotel.trim()` once
- TD-050/095/132: Extracted `handleSearchChange` and `toggleAdvancedSearch` in SearchBar; renamed `et`→`eventType`
- TD-100–106: Removed dead CSS classes (event-list, event-empty, event-tile, event-content, summary-row, chip-row, checklist and all sub-rules)
- TD-067: Deduplicated `new Date().toISOString()` into single `now` constant in createProject
- TD-138/139: Added section separator comments and grouped state declarations by category in App.jsx

**Why:** Systematic readability audit — 30 items across naming clarity, guard clauses, dead code removal, and structural organisation.

## 2026-03-08T21:45:00Z — Pay down tech debt: TD-042–047, TD-124, TD-148, TD-150–153

**What:**
- TD-042: Break DayPlanSection prop destructuring across multiple lines
- TD-043: Break SearchBar prop destructuring across multiple lines
- TD-044: Break SetupSummary prop destructuring across multiple lines
- TD-045: Break SetupWizard prop destructuring across multiple lines
- TD-046: Expand DEFAULT_DRAFT object literal to one field per line
- TD-047: Expand SHOW_TYPE_MAP to one entry per line with explanatory comment
- TD-124: Fix `window.open(url, '_blank', 'noreferrer')` → `'noopener'` in WhatsNext
- TD-148: Memoize `activeRideOptions` with `useMemo` so `topSearchResults` memo isn't defeated every render
- TD-150: Add `window.confirm` guard before `deleteProject` in HomeScreen
- TD-151: Uninstall `@testing-library/react` (unused devDependency)
- TD-152 (new): Add null guard to `updateDayItem` — was crashing if `date` not in `dayPlans`
- TD-153 (new): Move `inferTheme` from `parkSuggestions.js` into `planHelpers.js`; update `detectTheme` to delegate show-name detection to it (gains Fantasmic, Harmonious, Luminous etc. fireworks keywords); `parkSuggestions.js` now imports from `planHelpers.js`; test import updated accordingly

**Why:** Systematic readability audit (TD-042–047 formatting), correctness fixes (TD-124, TD-148, TD-152), user-safety (TD-150), dependency hygiene (TD-151), and DRY consolidation of the two diverging theme-inference functions (TD-153). All 480 tests pass; coverage 88%/86%/90%.

---

## 2026-03-08T16:30:00Z — Full readability audit: 110 tech debt items registered

**What:**
- Read every source file in the project (15 JS/JSX files, 1 CSS, config files)
- Identified 110 small, self-contained readability improvements (TD-042 through TD-151)
- Organised into 12 categories: long lines, function extraction, named constants, DRY violations, naming clarity, dead code, validation, consistency, code expansion, comments, structure, misc
- Each item is scoped to a 10-30 line change

**Why:** Systematic audit to make the codebase as human-readable as possible. Every line should be scannable in one pass. The 110 items cover formatting, naming, dead code, DRY violations, missing guards, consistency bugs, and structural improvements.

---

## 2026-03-08T11:49:00Z — Extract render functions into src/components/

**What:**
- Created `src/components/` with 7 self-contained component files: `HomeScreen.jsx`, `SetupWizard.jsx`, `SetupSummary.jsx`, `SearchBar.jsx`, `DayPlanSection.jsx`, `WhatsNext.jsx`, `SettingsPanel.jsx`
- Each component file carries its own data imports (no longer relies on App.jsx's import scope)
- `App.jsx` reduced from 1,348 → 265 lines; now contains only state, handlers, derived values, and component composition
- Removed the re-export barrel from `App.jsx`; updated `appHelpers.test.js` to import from actual source files (`../data/planHelpers.js`, `../utils.js`, `../data/displayHelpers.js`, `../data/storage.js`, `../data/restaurantMetadata.js`)
- Added `src/components/**` to coverage exclude list in `vite.config.js` (JSX render output is not unit-tested per project rules)
- Updated `CLAUDE.md` to replace the "no new component files" rule with the new `src/components/` convention

**Why:** App.jsx at 1,348 lines was hard to navigate. Extracting the 7 render functions to named component files makes each piece independently readable and editable without scrolling through an entire monolith.

---

## 2026-03-07T20:27:00Z — TD-039/040/041: Add tests for storage.js, rideData.js, displayHelpers.js

**What:**
- Created `src/__tests__/storage.test.js`: tests for `generateId` and all 5 branches of `loadAllProjects` (empty, existing projects, invalid JSON, old-format migration, invalid old JSON). Uses `vi.stubGlobal` for a reliable localStorage mock.
- Added `getRideUrl` and `getRideTags` test suites to `appHelpers.test.js` (known + unknown ride cases)
- Added `getDayCardStyle` Disney Springs branch test and `getItemSlot` latenight + unknown-type tests

**Why:** TD-039/040/041 — `storage.js` was at 15.78%, `rideData.js` functions at 0%, `displayHelpers.js` had two uncovered branches. All three now at 100% statement/function/line coverage. Overall coverage: 80.84% → 87.98%.

---

## 2026-03-07T20:22:00Z — TD-038: Move getRestaurantResources to restaurantMetadata.js

**What:**
- Moved `getRestaurantResources` and `DISNEY_WORLD_BASE_URL` from `App.jsx` into `restaurantMetadata.js`
- Updated App.jsx import; removed now-unused `RESTAURANT_METADATA` from App.jsx imports

**Why:** TD-038 — the function's only dependency is `RESTAURANT_METADATA`; all restaurant lookup logic now lives in one module.

---

## 2026-03-07T20:14:00Z — TD-036: Extract JSX sections into named render functions (App.jsx)

**What:**
- Defined 7 named functions above `App()` in `src/App.jsx`: `HomeScreen`, `SetupWizard`, `SetupSummary`, `SearchBar`, `DayPlanSection`, `WhatsNext`, `SettingsPanel`
- Each accepts explicit props — no closures over App state, no new files
- Converted the IIFE inside the day plan section into the `DayPlanSection` function body
- Added `setPark` named handler to `App()` to replace the inline `setPlan` call in the park `<select>` onChange
- `App()` return is now a clear table of contents: 6 component calls, all props explicit

**Why:** TD-036 — App.jsx return() was a 900-line monolith with a deeply nested IIFE. Extracting render functions makes the structure scannable, makes each section independently readable, and sets up future componentisation without creating file bloat.

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

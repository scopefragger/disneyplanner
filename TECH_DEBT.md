# Tech Debt Register — Disney Holiday Planner

Each item is recorded when the debt is accrued.
It is removed from this file once fixed and verified by a passing build + test run.

---

*TD-029 through TD-041 completed 2026-03-07. App.jsx reduced from 1 973 → ~1 360 lines;
all static data, utilities, plan helpers, display helpers and persistence logic extracted
to named modules; JSX extracted to named render functions; overall test coverage 80% → 88%.*

---

# Readability Audit — TD-042 through TD-151

> **Goal:** make every line of code scannable by a human in one pass.
> Each item is a self-contained 10–30 line change.

---

## Category A — Break Long Lines & Format for Scanning

---

## TD-042 · Break DayPlanSection prop destructuring across multiple lines

**Severity:** Medium
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 8 is ~350 characters — a single-line destructuring of 18 props. Impossible to scan visually.

**Fix:** Break into one prop per line:
```js
export default function DayPlanSection({
  plan, tripDates, activeDay, setActiveDay,
  liveShowData, editingDayItem, setEditingDayItem,
  updateDayPlan, updateDayItem, removeDayItem,
  acceptSuggestion, dismissSuggestion,
  clearDayType, clearPark, clearSwimSpot, clearStaySpot,
  resetDay, toggleParkHop, setDayType, setPark
}) {
```

**Effort:** Trivial

---

## TD-043 · Break SearchBar prop destructuring across multiple lines

**Severity:** Medium
**File:** src/components/SearchBar.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 5 is ~400 characters — 15 props on a single line.

**Fix:** Same multi-line pattern as TD-042.

**Effort:** Trivial

---

## TD-044 · Break SetupSummary prop destructuring across multiple lines

**Severity:** Low
**File:** src/components/SetupSummary.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 3 is a 7-prop destructuring on one line — hard to scan.

**Fix:** Break into 2–3 lines grouped by purpose (data vs setters).

**Effort:** Trivial

---

## TD-045 · Break SetupWizard prop destructuring across multiple lines

**Severity:** Low
**File:** src/components/SetupWizard.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 4 has 10 props on a single line.

**Fix:** Break into 2–3 lines grouped by purpose.

**Effort:** Trivial

---

## TD-046 · Break DEFAULT_DRAFT onto multiple lines

**Severity:** Low
**File:** src/data/planHelpers.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 20 is a single-line object with 6 fields — harder to spot each field at a glance.

**Fix:** One field per line, matching the pattern used by `DEFAULT_PLAN`.

**Effort:** Trivial

---

## TD-047 · Break SHOW_TYPE_MAP onto multiple lines

**Severity:** Low
**File:** src/data/planHelpers.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 23 is a single-line object with 4 key-value pairs.

**Fix:** One entry per line with a comment explaining the `Show → Fireworks` mapping.

**Effort:** Trivial

---

## TD-048 · Break inline ride-image style object onto multiple lines

**Severity:** Medium
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 329 is a 190+ character inline style object with `backgroundImage`, `backgroundSize`, `backgroundPosition`.

**Fix:** Extract to a `const rideImageStyle = { ... }` above the JSX return, or to a small helper.

**Effort:** Trivial

---

## TD-049 · Break SetupSummary budget/adults line onto multiple lines

**Severity:** Low
**File:** src/components/SetupSummary.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 10 is a 200+ character template literal with nested ternaries for plural handling.

**Fix:** Break into separate `<span>` elements or extract plural helper.

**Effort:** Low

---

## TD-050 · Break SearchBar onChange handler (line 17) onto multiple lines

**Severity:** Low
**File:** src/components/SearchBar.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** The search input onChange (line 17) does two things on one line: `setEventSearch(e.target.value); if (addEventOpen) setAddEventOpen(false)`.

**Fix:** Extract to a named `handleSearchChange` function above the return.

**Effort:** Trivial

---

## TD-051 · Break className concatenation in DayPlanSection day nav buttons

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 67 builds a className with `[...].filter(Boolean).join(' ')` inline — long and hard to scan.

**Fix:** Extract to a `const navBtnClass = ...` above the JSX.

**Effort:** Trivial

---

## TD-052 · Break HomeScreen project row info onto multiple lines

**Severity:** Low
**File:** src/components/HomeScreen.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 27-31 are a single `<span>` with a complex nested ternary template literal.

**Fix:** Break into multiple `<span>` elements for date range, hotel.

**Effort:** Low

---

---

## Category B — Extract Inline Logic to Named Functions

---

## TD-053 · Extract WhatsNext map URL builder to a named function

**Severity:** Medium
**File:** src/components/WhatsNext.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 11-25 contain 14 lines of URL-building logic inside an `onClick` handler in JSX.

**Fix:** Extract to `function buildMapUrl(plan, activeDate)` at the top of the file.

**Pattern:** Command
**Effort:** Low

---

## TD-054 · Extract ghostSuggestions IIFE to a named function

**Severity:** Medium
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 29-41 use an IIFE `(() => { ... })()` to compute ghost suggestions. IIFEs are harder to scan than named functions.

**Fix:** Extract to `function computeGhostSuggestions(dayPlan, liveShowData, favoriteTags, dismissed)` above the component.

**Pattern:** Strategy
**Effort:** Low

---

## TD-055 · Extract SetupWizard step 6 IIFE to pre-computed variables

**Severity:** Medium
**File:** src/components/SetupWizard.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 119-149 use a 30-line IIFE inside JSX to filter entertainment and franchise lists. Dense and hard to follow.

**Fix:** Compute `filteredEntertainment` and `filteredFranchises` before the return statement.

**Effort:** Low

---

## TD-056 · Extract location-clear handler to a named function

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 94-98 have an inline onClick with three `if` branches dispatching different clear functions based on `dayType`.

**Fix:** Extract to `const clearLocation = () => { ... }` or a `handleClearLocation` function.

**Pattern:** Command
**Effort:** Trivial

---

## TD-057 · Extract editing draft updater to a helper

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** DRY — extract logic used more than twice

**Problem:** Lines 291 and 300 both use `setEditingDayItem(prev => ({ ...prev, draft: { ...prev.draft, [field]: e.target.value } }))`. Same pattern, duplicated.

**Fix:** Extract `const updateEditDraft = (field, value) => setEditingDayItem(...)`.

**Effort:** Trivial

---

## TD-058 · Extract DayPlanSection map URL construction to a helper

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 275-279 build `mapSearchTerm`, `mapUrl`, and `viewInfoUrl` with nested ternaries and fallbacks — 5 dense lines.

**Fix:** Extract to `function buildItemUrls(normalizedItem, dayPlan)` returning `{ mapUrl, viewInfoUrl }`.

**Effort:** Low

---

## TD-059 · Extract event links rendering to a small component or function

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 336-347 render 4 conditional `<a>` tags for menu, booking, info, and map. Repeated similar structure.

**Fix:** Extract to `function renderEventLinks({ menuUrl, bookingUrl, viewInfoUrl, mapUrl })`.

**Effort:** Low

---

## TD-060 · Extract badge rendering in DayPlanSection to a helper function

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 79-103 render two conditional badge buttons with inline onClick logic. The second badge's onClick has three `if` branches.

**Fix:** Extract to `function renderDayBadges(dayPlan, date, handlers)`.

**Effort:** Low

---

## TD-061 · Extract day summary pills to a helper function

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 112-146 render 4 conditional `<span>` pills with repeated style prop and nested ternary for label text.

**Fix:** Extract to `function renderDaySummaryPills(dayPlan, dayTypeChipColor, locationDisplay)`.

**Effort:** Low

---

## TD-062 · Extract day form selectors to a helper function

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 149-232 contain 5 conditional `<label>/<select>` blocks, each with similar structure but different data. This is 80 lines of repetitive JSX.

**Fix:** Extract to `function renderDayFormSelector(dayPlan, date, handlers)`.

**Effort:** Low

---

## TD-063 · Extract edit form in DayPlanSection to a helper function

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 283-323 render the inline edit form with time/note inputs and save/cancel/delete buttons. A self-contained block.

**Fix:** Extract to `function renderEditForm(editingDayItem, setEditingDayItem, updateDayItem, removeDayItem, date, itemIdx)`.

**Effort:** Low

---

## TD-064 · Extract timeline event content block to a helper function

**Severity:** Medium
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 266-360 render each timeline event — normalizing the item, building labels, computing URLs, and rendering JSX. This is a 94-line block inside a `.flatMap().map()`.

**Fix:** Extract the body of `slotItems.map(item => ...)` to `function renderTimelineEvent(item, date, editingDayItem, ...)`.

**Effort:** Low

---

## TD-065 · Extract ghost event rendering to a helper function

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 361-393 render each ghost suggestion with tags, links, and accept/dismiss buttons.

**Fix:** Extract to `function renderGhostEvent(suggestion, date, acceptSuggestion, dismissSuggestion)`.

**Effort:** Low

---

## TD-066 · Extract hotelShoppingOptions to a standalone function

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 14-22 compute `hotelShoppingOptions` inline with spread, filter, and map. This is setup logic mixed with rendering.

**Fix:** Extract to `function buildHotelShoppingOptions(myHotel)` above the component.

**Effort:** Trivial

---

## TD-067 · Extract createProject timestamp to a single call

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 275 calls `new Date().toISOString()` twice — `createdAt` and `updatedAt` could differ by milliseconds.

**Fix:** `const now = new Date().toISOString()` then use `now` for both.

**Effort:** Trivial

---

---

## Category C — Named Constants for Magic Numbers / Strings

---

## TD-068 · Name cache duration constant in fetchLiveParkShows

**Severity:** Low
**File:** src/data/parkSuggestions.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 270 uses `30 * 60 * 1000` — a magic number for the 30-minute cache TTL.

**Fix:** `const CACHE_TTL_MS = 30 * 60 * 1000` at the top of the file.

**Effort:** Trivial

---

## TD-069 · Name time slot boundaries in getItemSlot

**Severity:** Low
**File:** src/data/displayHelpers.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 195-200 use bare numbers `21, 18, 15, 12, 9` for time-of-day cutoffs.

**Fix:** Define `const SLOT_BOUNDARIES = { night: 21, evening: 18, afternoon: 15, midday: 12, morning: 9 }` and use named lookups.

**Effort:** Low

---

## TD-070 · Name max tag count in inferTags

**Severity:** Trivial
**File:** src/data/parkSuggestions.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 225-227 use bare `3` for the maximum tag count.

**Fix:** `const MAX_TAGS = 3` at the top of the section.

**Effort:** Trivial

---

## TD-071 · Name max search result limits in topSearchResults

**Severity:** Low
**File:** src/App.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 324, 329, 334 use `.slice(0, 6)`, `.slice(0, 6)`, `.slice(0, 5)` — unnamed limits.

**Fix:** `const MAX_SHOW_RESULTS = 6`, `MAX_RESTAURANT_RESULTS = 6`, `MAX_RIDE_RESULTS = 5`.

**Effort:** Trivial

---

## TD-072 · Name fallback tint color in displayHelpers

**Severity:** Trivial
**File:** src/data/displayHelpers.js
**Violation:** Code Quality — Simple, Readable

**Problem:** `'rgba(0, 87, 184, 0.14)'` appears 3 times (lines 98, 107, and getDayCardStyle body) as a default tint.

**Fix:** `const DEFAULT_TINT = 'rgba(0, 87, 184, 0.14)'`.

**Effort:** Trivial

---

## TD-073 · Name Walt Disney World suffix string

**Severity:** Low
**File:** src/components/DayPlanSection.jsx, WhatsNext.jsx
**Violation:** DRY — extract logic used more than twice

**Problem:** The string `' Walt Disney World'` is appended to search/map terms in at least 4 places across DayPlanSection.jsx and WhatsNext.jsx.

**Fix:** `const WDW_SUFFIX = ' Walt Disney World'` in a shared location.

**Effort:** Trivial

---

## TD-074 · Name wizard step count

**Severity:** Trivial
**File:** src/App.jsx, src/components/SetupWizard.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** The number `6` appears in `Math.min(s + 1, 6)`, `currentStep < 6`, and `currentStep === 6` without a named constant.

**Fix:** `const WIZARD_STEPS = 6` in planHelpers or a shared constants file.

**Effort:** Trivial

---

## TD-075 · Name the latenight slot return value

**Severity:** Trivial
**File:** src/data/displayHelpers.js
**Violation:** Code Quality — Simple, Readable

**Problem:** `getItemSlot` returns the string `'latenight'` as a bare string for times before 9am.

**Fix:** Use the `SLOT_BOUNDARIES` constant from TD-069 for consistency, or at minimum add a comment explaining the before-9am slot.

**Effort:** Trivial

---

## TD-076 · Name Google Maps base URL constant

**Severity:** Low
**File:** src/data/parkSuggestions.js, src/components/DayPlanSection.jsx, WhatsNext.jsx
**Violation:** DRY — same URL pattern repeated

**Problem:** `https://www.google.com/maps/search/?api=1&query=` and `https://www.google.com/maps?q=` appear in multiple files.

**Fix:** Export a `GOOGLE_MAPS_SEARCH_URL` constant from a shared location.

**Effort:** Trivial

---

## TD-077 · Name Google search base URL constant

**Severity:** Trivial
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** `https://www.google.com/search?q=` appears as a bare URL on line 278.

**Fix:** `const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q='`.

**Effort:** Trivial

---

---

## Category D — DRY Violations

---

## TD-078 · Extract shared IMG_BASE constant to a shared module

**Severity:** Medium
**File:** src/data/displayHelpers.js, src/data/rideData.js, src/data/tripOptions.js
**Violation:** DRY — extract logic used more than twice

**Problem:** `const IMG_BASE = \`\${import.meta.env.BASE_URL}images/\`` is defined identically in 3 separate files.

**Fix:** Create a shared `src/data/constants.js` exporting `IMG_BASE`, import it in all three files.

**Effort:** Low

---

## TD-079 · Extract repeated setDraftDayItems pattern in SearchBar

**Severity:** Medium
**File:** src/components/SearchBar.jsx
**Violation:** DRY — extract logic used more than twice

**Problem:** The pattern `setDraftDayItems(current => ({ ...current, [activeDate]: { ...activeDraft, field: value } }))` is repeated 6 times (lines 74, 92, 121, 142, 159, 176).

**Fix:** Extract `const updateDraft = (field, value) => setDraftDayItems(...)` at the top of the component.

**Effort:** Low

---

## TD-080 · Deduplicate CSS data-theme color mappings

**Severity:** Medium
**File:** src/App.css
**Violation:** DRY — extract logic used more than twice

**Problem:** The `[data-theme="fireworks"]`, `[data-theme="character"]`, etc. color mappings are defined identically 3 times: for `.timeline-event-content`, `.ghost-event-content`, and `.timeline-event-edit`.

**Fix:** Define theme colors once on a shared parent selector or use CSS custom properties set at the `[data-theme]` level.

**Effort:** Low

---

## TD-081 · Cache plan.myHotel.trim() in DayPlanSection

**Severity:** Trivial
**File:** src/components/DayPlanSection.jsx
**Violation:** DRY — extract logic used more than twice

**Problem:** `plan.myHotel.trim()` is called 4 times (lines 15, 16, 20, 23).

**Fix:** `const myHotel = plan.myHotel.trim()` at the top of the component.

**Effort:** Trivial

---

## TD-082 · Deduplicate patchDayPlan + items spread pattern

**Severity:** Low
**File:** src/App.jsx
**Violation:** DRY — extract logic used more than twice

**Problem:** The pattern `patchDayPlan(current, date, { items: [...(current.dayPlans[date]?.items || []), newItem] })` appears in `addDayItem`, `acceptSuggestion`, and `quickAddToDay`.

**Fix:** Extract `function appendDayItem(current, date, newItem)` in planHelpers.js.

**Effort:** Low

---

## TD-083 · Deduplicate pluralization pattern

**Severity:** Low
**File:** src/components/HomeScreen.jsx, SetupWizard.jsx, SetupSummary.jsx
**Violation:** DRY — extract logic used more than twice

**Problem:** The pattern `${count} day${count !== 1 ? 's' : ''}` appears in 3 files. Similarly `adult${n !== 1 ? 's' : ''}` and `child${n !== 1 ? 'ren' : ''}`.

**Fix:** Extract `function pluralize(count, singular, plural)` to utils.js.

**Effort:** Low

---

## TD-084 · Deduplicate dismissedSuggestions spread in handlers

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** DRY — extract logic used more than twice

**Problem:** `dismissedSuggestions: [...(current.dayPlans[date]?.dismissedSuggestions || []), id]` appears in both `acceptSuggestion` (line 177) and `dismissSuggestion` (line 183).

**Fix:** Extract `function appendDismissed(current, date, id)` helper.

**Effort:** Trivial

---

---

## Category E — Naming Clarity

---

## TD-085 · Rename `n` to `nameLower` in inferTheme and inferTags

**Severity:** Low
**File:** src/data/parkSuggestions.js
**Violation:** Code Quality — Simple, Readable

**Problem:** `const n = name.toLowerCase()` — single-letter variable `n` makes the code harder to scan. Used in both `inferTheme` (line 97) and `inferTags` (line 202).

**Fix:** Rename to `nameLower` or `lowerName` in both functions.

**Effort:** Trivial

---

## TD-086 · Rename `dp` to `dayPlan` in DayPlanSection day nav

**Severity:** Trivial
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 61: `const dp = plan.dayPlans?.[d]` — `dp` is an abbreviation when the full word is more readable.

**Fix:** `const navDayPlan = plan.dayPlans?.[d]`.

**Effort:** Trivial

---

## TD-087 · Rename `d` loop variable to `dateStr` in DayPlanSection

**Severity:** Trivial
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 60: `tripDates.map((d, i) => ...)` — `d` is ambiguous.

**Fix:** Rename to `dateStr` or `tripDate`.

**Effort:** Trivial

---

## TD-088 · Rename `p` to `projectPlan` in HomeScreen

**Severity:** Trivial
**File:** src/components/HomeScreen.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 20: `const p = project.plan` — single-letter alias is less clear than a descriptive name.

**Fix:** `const projectPlan = project.plan`.

**Effort:** Trivial

---

## TD-089 · Rename `s` to `show` in topSearchResults mapping

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 320: `.map(s => ...)` — `s` doesn't clearly communicate it's a show.

**Fix:** Rename to `show`.

**Effort:** Trivial

---

## TD-090 · Rename `r` to descriptive names in topSearchResults

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 325 and 330 both use `r` as a map variable — once for a restaurant, once for a ride.

**Fix:** Rename to `restaurant` and `ride` respectively.

**Effort:** Trivial

---

## TD-091 · Rename `e` to `showEntity` in adaptLiveShow

**Severity:** Trivial
**File:** src/data/parkSuggestions.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 241: `function adaptLiveShow(e, parkName)` — `e` is conventionally used for events, not entities.

**Fix:** Rename to `showEntity` or `liveShowEntity`.

**Effort:** Trivial

---

## TD-092 · Rename `kws` to `keywords` in matchKeywords

**Severity:** Trivial
**File:** src/data/parkSuggestions.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 195: `.filter(([, kws]) => ...)` — abbreviation reduces readability.

**Fix:** Rename to `keywords`.

**Effort:** Trivial

---

## TD-093 · Rename `q` and `t` in fuzzyMatch

**Severity:** Trivial
**File:** src/utils.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 47-48: `const q = query.toLowerCase()` and `const t = text.toLowerCase()` — single-letter variables.

**Fix:** Rename to `queryLower` and `textLower`.

**Effort:** Trivial

---

## TD-094 · Rename `h` and `m` in formatTime

**Severity:** Trivial
**File:** src/utils.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 35: `const [h, m] = time.split(':').map(Number)` — `h` and `m` are less clear than spelled-out names.

**Fix:** Rename to `hours` and `minutes`.

**Effort:** Trivial

---

## TD-095 · Rename `et` to `eventType` in SearchBar map

**Severity:** Trivial
**File:** src/components/SearchBar.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 80: `EVENT_TYPES.map((et) => ...)` — `et` is an abbreviation.

**Fix:** Rename to `eventType`.

**Effort:** Trivial

---

## TD-096 · Rename `t` in toggleFavoriteTag filter

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 41: `.filter(t => t !== tag)` — `t` is ambiguous when `tag` is also in scope.

**Fix:** Rename to `existingTag`.

**Effort:** Trivial

---

## TD-097 · Rename `prev` to `currentProjects` in setProjects callbacks

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 48, 276, 297 use `prev` as the state updater parameter — generic name doesn't indicate it's a projects object.

**Fix:** Rename to `currentProjects`.

**Effort:** Trivial

---

## TD-098 · Rename `next` to `remainingProjects` in deleteProject

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 298: `const next = { ...prev }` — `next` is too generic for what it represents.

**Fix:** `const remainingProjects = { ...currentProjects }`.

**Effort:** Trivial

---

## TD-099 · Rename `res` to `resources` in quickAddToDay

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 195: `const res = getRestaurantResources(item)` — `res` could mean response, result, or resources.

**Fix:** Rename to `resources`.

**Effort:** Trivial

---

---

## Category F — Dead Code Removal

---

## TD-100 · Remove unused .event-list CSS class

**Severity:** Low
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.event-list` (line ~929) is defined in CSS but not referenced in any JSX file.

**Fix:** Delete the rule block.

**Effort:** Trivial

---

## TD-101 · Remove unused .event-empty CSS class

**Severity:** Low
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.event-empty` (line ~935) is defined in CSS but not referenced in any JSX file.

**Fix:** Delete the rule block.

**Effort:** Trivial

---

## TD-102 · Remove unused .event-tile and .event-tile::before CSS

**Severity:** Low
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.event-tile` and `.event-tile::before` (lines ~941-961) are defined but not used anywhere.

**Fix:** Delete both rule blocks.

**Effort:** Trivial

---

## TD-103 · Remove unused .event-content CSS class

**Severity:** Low
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.event-content` (line ~962) is defined but not referenced in any JSX file.

**Fix:** Delete the rule block.

**Effort:** Trivial

---

## TD-104 · Remove unused .summary-row CSS class

**Severity:** Low
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.summary-row` is defined but not referenced in any JSX file.

**Fix:** Delete the rule block.

**Effort:** Trivial

---

## TD-105 · Remove unused .chip-row CSS class

**Severity:** Low
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.chip-row` is defined but not referenced in any JSX file.

**Fix:** Delete the rule block.

**Effort:** Trivial

---

## TD-106 · Remove unused .checklist CSS class

**Severity:** Low
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.checklist` and `.checklist li` are defined but not referenced in any JSX file.

**Fix:** Delete the rule blocks.

**Effort:** Trivial

---

## TD-107 · Remove unused .setup-actions CSS class

**Severity:** Low
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.setup-actions` is defined but not referenced in any JSX file.

**Fix:** Delete the rule block.

**Effort:** Trivial

---

## TD-108 · Remove unused .inline-fields.four-col CSS class

**Severity:** Low
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.inline-fields.four-col` is defined but not referenced.

**Fix:** Delete the rule block.

**Effort:** Trivial

---

## TD-109 · Remove stale "Floating action buttons" CSS comment

**Severity:** Trivial
**File:** src/App.css
**Violation:** Dead code

**Problem:** A comment `/* -- Floating action buttons -- */` remains from removed FAB code (per INTENT.md).

**Fix:** Delete the orphaned comment.

**Effort:** Trivial

---

## TD-110 · Remove dead #anna branch in inferTags

**Severity:** Low
**File:** src/data/parkSuggestions.js
**Violation:** Dead code

**Problem:** Lines 206-208 handle `tag === '#anna'` with a false-positive guard — but `#anna` does not exist in `CHARACTER_KEYWORDS`. The branch never executes.

**Fix:** Either remove the dead branch, or add `'#anna': ['anna']` to `CHARACTER_KEYWORDS` if the intent is to match Anna from Frozen.

**Effort:** Trivial

---

## TD-111 · Remove unused .day-nav-pill mobile CSS

**Severity:** Trivial
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.day-nav-pill` is defined in a mobile media query but not used in any JSX file.

**Fix:** Delete the rule block.

**Effort:** Trivial

---

## TD-112 · Remove unused .event-input-row CSS

**Severity:** Trivial
**File:** src/App.css
**Violation:** Dead code

**Problem:** `.event-input-row` only appears in media queries but is never used in JSX.

**Fix:** Delete the rule blocks from all media queries.

**Effort:** Trivial

---

---

## Category G — Input Validation & Guard Clauses

---

## TD-113 · Add NaN guard to formatTime

**Severity:** Low
**File:** src/utils.js
**Violation:** Code Quality — Simple, Readable

**Problem:** If `time` is `'abc'`, `split(':').map(Number)` produces `[NaN, NaN]` and returns `'NaN:NaN undefined'`.

**Fix:** Add an early return: `if (isNaN(h) || isNaN(m)) return time` to pass through malformed input.

**Effort:** Trivial

---

## TD-114 · Add invalid date guard to formatPrettyDate

**Severity:** Low
**File:** src/utils.js
**Violation:** Code Quality — Simple, Readable

**Problem:** If `dateString` is invalid, `new Date()` returns "Invalid Date" and `toLocaleDateString` produces garbage.

**Fix:** Add `if (!dateString) return ''` and validate the constructed Date.

**Effort:** Trivial

---

## TD-115 · Add shape validation to loadAllProjects

**Severity:** Low
**File:** src/data/storage.js
**Violation:** Code Quality — Readable

**Problem:** `JSON.parse(saved)` on line 13 returns whatever was stored without validating it's an object with expected shape.

**Fix:** Add `if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}`.

**Effort:** Trivial

---

---

## Category H — Consistency & Correctness

---

## TD-116 · Fix "Step X of 5" → "Step X of 6" in SetupWizard

**Severity:** High
**File:** src/components/SetupWizard.jsx
**Violation:** Bug — incorrect step count

**Problem:** Line 7: `Step {currentStep} of 5` but there are 6 steps. Shows "Step 6 of 5" on the preferences step.

**Fix:** Change to `Step {currentStep} of 6`, or better: use a named constant.

**Effort:** Trivial

---

## TD-117 · Add missing .close-panel-btn CSS class

**Severity:** Medium
**File:** src/App.css, src/components/SettingsPanel.jsx
**Violation:** Bug — CSS class referenced but never defined

**Problem:** Line 7 of SettingsPanel.jsx uses `className="close-panel-btn"` but no `.close-panel-btn` rule exists in App.css.

**Fix:** Add the CSS rule with appropriate close-button styling.

**Effort:** Low

---

## TD-118 · Standardize apostrophe in "Peter Pan's Flight"

**Severity:** Low
**File:** src/data/rideData.js
**Violation:** Architecture Rules — consistency

**Problem:** Uses Unicode right single quotation mark (U+2019) `'` while other rides use ASCII apostrophe `'`. String comparisons with user-typed text will fail.

**Fix:** Use ASCII apostrophe `'` consistently, or document the Unicode usage.

**Effort:** Trivial

---

## TD-119 · Fix "Na vi" to "Na'vi" in rideData

**Severity:** Trivial
**File:** src/data/rideData.js
**Violation:** Architecture Rules — consistency

**Problem:** "Na vi River Journey" is missing the apostrophe — actual ride name is "Na'vi River Journey".

**Fix:** Rename to `"Na'vi River Journey"` across all 3 maps (RIDE_URLS, RIDE_TAGS, RIDES_BY_PARK, RIDE_IMAGES).

**Effort:** Trivial

---

## TD-120 · Add missing apostrophe to "Remys Ratatouille Adventure"

**Severity:** Trivial
**File:** src/data/rideData.js
**Violation:** Architecture Rules — consistency

**Problem:** Missing apostrophe — should be "Remy's Ratatouille Adventure".

**Fix:** Rename across all maps.

**Effort:** Trivial

---

## TD-121 · Add missing apostrophes to "Rock n Roller Coaster"

**Severity:** Trivial
**File:** src/data/rideData.js
**Violation:** Architecture Rules — consistency

**Problem:** Missing apostrophes — should be "Rock 'n' Roller Coaster".

**Fix:** Rename across all maps.

**Effort:** Trivial

---

## TD-122 · Add missing apostrophes to "Mickey and Minnies Runaway Railway"

**Severity:** Trivial
**File:** src/data/rideData.js
**Violation:** Architecture Rules — consistency

**Problem:** Missing possessive apostrophe — should be "Mickey & Minnie's Runaway Railway".

**Fix:** Rename across all maps.

**Effort:** Trivial

---

## TD-123 · Parameterize currency symbol in SetupSummary

**Severity:** Low
**File:** src/components/SetupSummary.jsx
**Violation:** Architecture Rules — no hardcoded locale

**Problem:** Line 10 hardcodes `£` (GBP). Non-UK users would expect `$` or their local currency.

**Fix:** Add `currencySymbol` to `DEFAULT_PLAN` (default `'£'`) and reference `plan.currencySymbol` in SetupSummary.

**Effort:** Low

---

## TD-124 · Fix window.open noreferrer usage in WhatsNext

**Severity:** Trivial
**File:** src/components/WhatsNext.jsx
**Violation:** Correctness

**Problem:** Line 24: `window.open(url, '_blank', 'noreferrer')` — the third argument to `window.open` is a window features string, not a rel attribute. `'noreferrer'` does nothing here.

**Fix:** Use `window.open(url, '_blank', 'noopener')` or construct an `<a>` element with `rel="noreferrer noopener"`.

**Effort:** Trivial

---

## TD-125 · Standardize object key quoting in displayHelpers maps

**Severity:** Trivial
**File:** src/data/displayHelpers.js
**Violation:** Code Quality — consistency

**Problem:** `PARK_TINTS` uses unquoted `EPCOT` but quoted `'Magic Kingdom'`. While valid JS, inconsistent quoting reduces scannability.

**Fix:** Quote all keys consistently: `'EPCOT': ...`.

**Effort:** Trivial

---

---

## Category I — Expand Dense Code for Readability

---

## TD-126 · Expand compressed tag assembly loops in inferTags

**Severity:** Medium
**File:** src/data/parkSuggestions.js
**Violation:** Code Quality — prefer 3 readable lines over 1 clever one-liner

**Problem:** Lines 225-227 compress three loop constructs into single lines with inline `if (result.length >= 3) break`. Hard to scan at a glance.

**Fix:** Expand each loop to a standard multi-line `for...of` block with clear break conditions.

**Effort:** Low

---

## TD-127 · Expand ternary chain in buildEventLabel

**Severity:** Low
**File:** src/data/planHelpers.js
**Violation:** Code Quality — prefer 3 readable lines over 1 clever one-liner

**Problem:** Lines 118-128 use 5 early returns with `if` statements. While individually simple, the chain reads as a cascade that would benefit from comments or grouping.

**Fix:** Add brief inline comments explaining each branch: `// Ride with park info`, `// Dining at restaurant`, etc.

**Effort:** Trivial

---

## TD-128 · Expand collapsed catch blocks in storage.js

**Severity:** Trivial
**File:** src/data/storage.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 14 and 26 use `catch { return {} }` on a single line — easy to miss the error swallowing.

**Fix:** Expand to multi-line `catch { \n  return {} \n}` for visibility.

**Effort:** Trivial

---

## TD-129 · Expand inline delete handler in HomeScreen

**Severity:** Low
**File:** src/components/HomeScreen.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 35: `onClick={(e) => { e.stopPropagation(); deleteProject(project.id) }}` — two operations in an inline handler.

**Fix:** Extract to `const handleDelete = (e) => { ... }` above the return.

**Effort:** Trivial

---

## TD-130 · Expand complex hashtagLabel ternary in DayPlanSection

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — prefer 3 readable lines over 1 clever one-liner

**Problem:** Lines 131-135 use a nested ternary inside `hashtagLabel()` to determine location text — 5 lines of ternary logic.

**Fix:** Compute `const locationText = ...` with an `if/else` block before the JSX.

**Effort:** Low

---

## TD-131 · Expand single-line button action handlers in SetupSummary

**Severity:** Trivial
**File:** src/components/SetupSummary.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 13-15 have three buttons with multi-statement inline onClick handlers like `() => { setSetupDone(false); setCurrentStep(1) }`.

**Fix:** Extract to named handlers: `handleEditSetup`, `handlePreferences`, `handleSettings`.

**Effort:** Low

---

## TD-132 · Expand SearchBar advanced-btn onClick

**Severity:** Trivial
**File:** src/components/SearchBar.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 25: `onClick={() => { setAddEventOpen(o => !o); setEventSearch('') }}` — two state updates in one inline handler.

**Fix:** Extract to `const toggleAdvancedSearch = () => { ... }`.

**Effort:** Trivial

---

---

## Category J — Comment Improvements

---

## TD-133 · Add JSDoc to getLocationDisplay

**Severity:** Trivial
**File:** src/data/displayHelpers.js
**Violation:** Code Quality — Readable

**Problem:** `getLocationDisplay` has no JSDoc explaining its return shape `{ label, icon }` or `null`.

**Fix:** Add `/** @returns {{ label: string, icon: string } | null} */`.

**Effort:** Trivial

---

## TD-134 · Add JSDoc to getDayCardStyle return shape

**Severity:** Low
**File:** src/data/displayHelpers.js
**Violation:** Code Quality — Readable

**Problem:** `getDayCardStyle` returns an object with 7 CSS custom properties. The shape is not documented.

**Fix:** Add a JSDoc comment listing the returned CSS custom property names.

**Effort:** Trivial

---

## TD-135 · Document SHOW_TYPE_MAP's Show→Fireworks mapping

**Severity:** Trivial
**File:** src/data/planHelpers.js
**Violation:** Code Quality — Readable

**Problem:** `Show: 'Fireworks'` in `SHOW_TYPE_MAP` is semantically surprising — a "Show" from the API maps to the "Fireworks" event type. No comment explains why.

**Fix:** Add a comment: `// API 'Show' type maps to our 'Fireworks' category (closest match for nighttime spectaculars)`.

**Effort:** Trivial

---

## TD-136 · Document normalizeEventItem legacy text field path

**Severity:** Low
**File:** src/data/planHelpers.js
**Violation:** Code Quality — Readable

**Problem:** Lines 107-114 handle legacy items (without `.type`) by reading `.text` and adding it to the result. This legacy path is undocumented.

**Fix:** Add a comment: `// Legacy items (pre-v2) stored free text in .text instead of .type + .note`.

**Effort:** Trivial

---

## TD-137 · Add comment to DEFAULT_SLOT explaining slot assignment

**Severity:** Trivial
**File:** src/data/displayHelpers.js
**Violation:** Code Quality — Readable

**Problem:** `DEFAULT_SLOT` maps event types to time slots but has no comment explaining it's the fallback when an item has no explicit time.

**Fix:** Add a one-line comment: `// Fallback slot assignment when an event has no explicit time`.

**Effort:** Trivial

---

## TD-138 · Add section separator comments in App.jsx

**Severity:** Low
**File:** src/App.jsx
**Violation:** Code Quality — Readable

**Problem:** App.jsx has 30+ functions with no visual grouping. Handlers for day management, project management, and navigation are interleaved.

**Fix:** Add section comments: `// ── Day plan handlers ──`, `// ── Project handlers ──`, `// ── Navigation ──`.

**Effort:** Trivial

---

---

## Category K — Structural / Organization

---

## TD-139 · Group related state declarations with blank lines

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** Code Quality — Readable

**Problem:** Lines 19-32 declare 14 state variables in a solid block with no grouping. Core plan state, UI state, and search state are mixed together.

**Fix:** Add blank lines between groups: plan state, wizard state, day editing state, search/UI state.

**Effort:** Trivial

---

## TD-140 · Move topSearchResults useMemo closer to its consumer

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** Code Quality — Readable

**Problem:** `topSearchResults` useMemo (lines 316-336) is defined 70 lines before its consumer (the `SearchBar` component at line 386). This creates a mental gap.

**Fix:** Move it directly above the JSX section or above the `SearchBar` props, with a clear comment.

**Effort:** Trivial

---

## TD-141 · Order imports alphabetically within groups in App.jsx

**Severity:** Trivial
**File:** src/App.jsx
**Violation:** Code Quality — consistency

**Problem:** Imports are loosely organized but not strictly alphabetical within their groups (React, data, components).

**Fix:** Sort data imports and component imports alphabetically.

**Effort:** Trivial

---

## TD-142 · Group App.jsx handlers by category

**Severity:** Low
**File:** src/App.jsx
**Violation:** Code Quality — Readable

**Problem:** Handlers for day operations (`updateDayPlan`, `addDayItem`, `clearDayType`, etc.), project operations (`createProject`, `openProject`, `deleteProject`), and navigation (`goHome`, `nextStep`) are interleaved without logical grouping.

**Fix:** Reorder into logical sections with separator comments (see TD-138).

**Effort:** Low

---

## TD-143 · Move DayPlanSection helper computations above the return

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Readable

**Problem:** Lines 9-41 mix variable declarations, derived computations, and an IIFE before the JSX return. The IIFE especially breaks the declarative flow.

**Fix:** Group all derived state (`hotelShoppingOptions`, `locationDisplay`, `ghostSuggestions`, etc.) into a clearly labeled section with a separator comment.

**Effort:** Trivial

---

---

## Category L — Miscellaneous Readability

---

## TD-144 · Add aria-label to icon-only buttons

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — accessibility / readability

**Problem:** The edit button (line 353, `✏`) and delete button (line 355, `×`) use emoji/symbols with no accessible label. While `title` is set for the edit button, the delete button has no label.

**Fix:** Add `aria-label="Delete event"` to the delete button and `aria-label="Edit event"` to the edit button.

**Effort:** Trivial

---

## TD-145 · Add aria-label to ghost accept/dismiss buttons

**Severity:** Low
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — accessibility / readability

**Problem:** Ghost suggestion accept (`✓`, line 387) and dismiss (`✕`, line 389) buttons have `title` but no `aria-label`.

**Fix:** Add `aria-label` attributes matching the titles.

**Effort:** Trivial

---

## TD-146 · Simplify createBlankDayPlan spread to named fields

**Severity:** Trivial
**File:** src/data/planHelpers.js
**Violation:** Code Quality — Readable

**Problem:** Lines 27-31 define defaults then spread `...overrides`, which allows any arbitrary field to be added. The Prototype pattern is correct, but the spread obscures which fields are canonical.

**Fix:** Add a comment listing the canonical fields above the function.

**Effort:** Trivial

---

## TD-147 · Document the normalizeEventItem text field shape mismatch

**Severity:** Low
**File:** src/data/planHelpers.js
**Violation:** Architecture Rules — suggestion object shape

**Problem:** Line 113 adds a `text` field to the result via `createEventItem({ ..., text })`, but `text` is not part of `createEventItem`'s template. This means legacy items have a field not in the canonical shape.

**Fix:** Either add `text: ''` to the `createEventItem` template, or remove `text` from the override and rely solely on `note`.

**Effort:** Low

---

## TD-148 · Simplify activeRideOptions useMemo dependency issue

**Severity:** Medium
**File:** src/App.jsx
**Violation:** Code Quality — correctness

**Problem:** Line 336 lists `activeRideOptions` in the `useMemo` dependency array for `topSearchResults`, but `getRideOptionsForDay` returns a new array every render. This defeats memoization — the memo recalculates every render when a park is selected.

**Fix:** Either memoize `activeRideOptions` separately with `useMemo`, or compute it inside the existing `topSearchResults` memo.

**Effort:** Low

---

## TD-149 · Convert flatMap return pattern from [(...)] to direct return

**Severity:** Trivial
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 258-396: `timeSlots.flatMap(slot => { ... return [(...)] })` wraps the returned JSX in a single-element array `[()]`. This is unusual — `flatMap` expects an array, but a single-element array per slot is the same as using `.map().flat()`.

**Fix:** Use `.map()` and filter nulls, or return the element directly from `flatMap` where possible.

**Effort:** Low

---

## TD-150 · Add project deletion confirmation to HomeScreen

**Severity:** Low
**File:** src/components/HomeScreen.jsx
**Violation:** Code Quality — user safety

**Problem:** Line 35: clicking "Delete" on a project immediately deletes it. No confirmation, no undo.

**Fix:** Add a `window.confirm('Delete this holiday?')` guard before calling `deleteProject`.

**Effort:** Trivial

---

## TD-151 · Remove @testing-library/react from devDependencies

**Severity:** Trivial
**File:** package.json
**Violation:** npm Best Practices — minimal dependencies

**Problem:** `@testing-library/react` is installed as a devDependency but is never imported in any test file. All tests are pure-logic unit tests.

**Fix:** `npm uninstall @testing-library/react`.

**Effort:** Trivial

---

*110 items registered (TD-042 through TD-151). Each is a self-contained change of 10-30 lines.*

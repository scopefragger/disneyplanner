# Tech Debt Register — Disney Holiday Planner

Each item is recorded when the debt is accrued.
It is removed from this file once fixed and verified by a passing build + test run.

---

*TD-029 through TD-041 completed 2026-03-07. App.jsx reduced from 1 973 → ~1 360 lines;
all static data, utilities, plan helpers, display helpers and persistence logic extracted
to named modules; JSX extracted to named render functions; overall test coverage 80% → 88%.*

*TD-042–047, TD-124, TD-148, TD-150–153 completed 2026-03-08. Prop destructurings formatted,
object literals expanded, window.open corrected, activeRideOptions memoized, delete confirmation
added, @testing-library/react removed, updateDayItem null guard added, inferTheme moved to
planHelpers.js and detectTheme expanded with Disney-specific fireworks keywords.*

*TD-048 (inlne style), TD-050/095/132 (SearchBar handlers+naming), TD-067 (timestamp), TD-081/086/087 (DayPlanSection naming+myHotel),
TD-085/091/092 (parkSuggestions naming), TD-089/090/096/097/098/099 (App.jsx naming),
TD-093/094 (utils naming), TD-100–106 (dead CSS: event-list/empty/tile/content + summary-row/chip-row/checklist),
TD-113/114/115 (guards), TD-116 (step count bug), TD-138/139 (App.jsx section comments + state grouping)
completed 2026-03-08.*

---

# Readability Audit — TD-042 through TD-151

> **Goal:** make every line of code scannable by a human in one pass.
> Each item is a self-contained 10–30 line change.

---

## Category A — Break Long Lines & Format for Scanning

---

## TD-049 · Break SetupSummary budget/adults line onto multiple lines

**Severity:** Low
**File:** src/components/SetupSummary.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 10 is a 200+ character template literal with nested ternaries for plural handling.

**Fix:** Break into separate `<span>` elements or extract plural helper.

**Effort:** Low

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

## TD-069 · Name time slot boundaries in getItemSlot

**Severity:** Low
**File:** src/data/displayHelpers.js
**Violation:** Code Quality — Simple, Readable

**Problem:** Lines 195-200 use bare numbers `21, 18, 15, 12, 9` for time-of-day cutoffs.

**Fix:** Define `const SLOT_BOUNDARIES = { night: 21, evening: 18, afternoon: 15, midday: 12, morning: 9 }` and use named lookups.

**Effort:** Low

---

## TD-073 · Name Walt Disney World suffix string

**Severity:** Low
**File:** src/components/DayPlanSection.jsx, WhatsNext.jsx
**Violation:** DRY — extract logic used more than twice

**Problem:** The string `' Walt Disney World'` is appended to search/map terms in at least 4 places across DayPlanSection.jsx and WhatsNext.jsx.

**Fix:** `const WDW_SUFFIX = ' Walt Disney World'` in a shared location.

**Effort:** Trivial

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

## TD-117 · Add missing .close-panel-btn CSS class

**Severity:** Medium
**File:** src/App.css, src/components/SettingsPanel.jsx
**Violation:** Bug — CSS class referenced but never defined

**Problem:** Line 7 of SettingsPanel.jsx uses `className="close-panel-btn"` but no `.close-panel-btn` rule exists in App.css.

**Fix:** Add the CSS rule with appropriate close-button styling.

**Effort:** Low

---

## TD-123 · Parameterize currency symbol in SetupSummary

**Severity:** Low
**File:** src/components/SetupSummary.jsx
**Violation:** Architecture Rules — no hardcoded locale

**Problem:** Line 10 hardcodes `£` (GBP). Non-UK users would expect `$` or their local currency.

**Fix:** Add `currencySymbol` to `DEFAULT_PLAN` (default `'£'`) and reference `plan.currencySymbol` in SetupSummary.

**Effort:** Low

---


## TD-126 · Expand compressed tag assembly loops in inferTags

**Severity:** Medium
**File:** src/data/parkSuggestions.js
**Violation:** Code Quality — prefer 3 readable lines over 1 clever one-liner

**Problem:** Lines 225-227 compress three loop constructs into single lines with inline `if (result.length >= 3) break`. Hard to scan at a glance.

**Fix:** Expand each loop to a standard multi-line `for...of` block with clear break conditions.

**Effort:** Low

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


## TD-149 · Convert flatMap return pattern from [(...)] to direct return

**Severity:** Trivial
**File:** src/components/DayPlanSection.jsx
**Violation:** Code Quality — Simple, Readable

**Problem:** Line 258-396: `timeSlots.flatMap(slot => { ... return [(...)] })` wraps the returned JSX in a single-element array `[()]`. This is unusual — `flatMap` expects an array, but a single-element array per slot is the same as using `.map().flat()`.

**Fix:** Use `.map()` and filter nulls, or return the element directly from `flatMap` where possible.

**Effort:** Low

---

*100 items remaining (TD-048 through TD-149, excluding completed items).*

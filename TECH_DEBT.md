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

*TD-049 (SetupSummary long line), TD-051–066 (DayPlanSection + other component extractions),
TD-069 (SLOT_BOUNDARIES), TD-073 (WDW_SUFFIX), TD-078 (shared IMG_BASE constant),
TD-079 (SearchBar updateDraft), TD-080 (CSS data-theme deduplication),
TD-082–084 (appendDayItem/appendDismissed/pluralize),
TD-117 (close-panel-btn CSS), TD-123 (currencySymbol), TD-126 (inferTags loops),
TD-129–131 (handler extractions), TD-140–143 (App.jsx/DayPlanSection organisation),
TD-146–147 (planHelpers canonical fields), TD-149 (flatMap→map+filter)
completed 2026-03-09.*

---

*No open items.*

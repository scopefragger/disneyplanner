# Disney Holiday Planner — Claude Agent Rules

## Project Overview
A single-page React/Vite app for planning Walt Disney World holidays.
No backend, no auth — all state is persisted to `localStorage`.

---

## Stack
- **React 18** with hooks (no Redux, no router)
- **Vite 5** — build via `/opt/homebrew/bin/node node_modules/.bin/vite build`
- **Vitest** — test runner (run via `/opt/homebrew/bin/node node_modules/.bin/vitest run`)
- **Plain CSS** — all styles in `src/App.css`, no CSS-in-JS, no Tailwind
- `npm` and `npx` are NOT on PATH — always use the full `/opt/homebrew/bin/node` prefix

## Key Files
| File | Purpose |
|------|---------|
| `src/App.jsx` | All app logic, state, handlers, JSX |
| `src/App.css` | All styles |
| `src/data/parkSuggestions.js` | Static suggestions + live API + tag inference |
| `src/__tests__/` | All test files (Vitest) |
| `CLAUDE.md` | This file |
| `INTENT.md` | Timestamped log of what was changed and why |

---

## Workflow Rules

### After every prompt
1. Run the build — it must pass before committing
2. Run tests — maintain ≥ 60% code coverage across statements, branches, and functions
3. Append an entry to `INTENT.md` — timestamp, what was changed, why
4. Commit and push with a descriptive message

```bash
/opt/homebrew/bin/node node_modules/.bin/vite build
/opt/homebrew/bin/node node_modules/.bin/vitest run --coverage
# append entry to INTENT.md
git add -A && git commit -m "..." && git push
```

### INTENT.md format
Each entry:
```
## YYYY-MM-DDTHH:MM:SSZ — Short title

**What:** bullet list of changes

**Why:** reason / motivation
```

### Code Coverage
- Minimum **60% coverage** on statements, branches, and functions
- Tests live in `src/__tests__/` and use `.test.jsx` or `.test.js` extensions
- Focus tests on pure logic first: `parkSuggestions.js` helpers (`inferTheme`, `inferTags`, `fuzzyMatch`, `parseShowTime`), `normalizePlan`, utility functions
- Do not write tests for JSX render output unless explicitly asked

### Commits
- Co-author line required: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- Message format: imperative verb + concise what + why if non-obvious
- Never amend a published commit; create a new one

---

## npm Best Practices
- All scripts defined in `package.json` under `"scripts"` — never run build/test commands ad-hoc without a script entry
- No global package installs; use `node_modules/.bin/` for local binaries
- Keep `package.json` dependencies minimal — no new packages without explicit user approval
- `devDependencies` for build tools, test runners, type definitions
- `dependencies` only for runtime code shipped to the browser

---

## Code Quality — DRY, Simple, Readable
- **DRY**: extract any logic used more than twice into a named function
- **Simple**: prefer 3 readable lines over 1 clever one-liner
- **No premature abstraction**: don't create helpers for one-off operations
- **No speculative features**: only build what is asked for
- **No over-engineering**: no feature flags, no plugin systems, no config objects for things that don't vary
- CSS class names in kebab-case; use existing CSS variables (`var(--dw-castle-blue)`, etc.)
- No `console.log` in production code

---

## Design Patterns (refactoring.guru)

Apply these patterns where they naturally reduce complexity. Do not force a pattern onto code that doesn't benefit from it.

### Creational Patterns
| Pattern | When to use in this project |
|---------|----------------------------|
| **Factory Method** | Creating suggestion objects — use a factory function rather than inline object literals scattered across the codebase |
| **Builder** | Constructing complex plan objects step-by-step (e.g., assembling a day plan from user inputs across multiple steps) |
| **Prototype** | Cloning plan/day objects during normalization rather than manually spreading every field |
| **Singleton** | A single sessionStorage cache manager instance for live show data |

### Structural Patterns
| Pattern | When to use in this project |
|---------|----------------------------|
| **Adapter** | `fetchLiveParkShows` already adapts the themeparks.wiki API shape into our internal suggestion shape — keep this boundary clean and explicit |
| **Facade** | `parkSuggestions.js` is a facade over two data sources (live API + static fallback) — callers should never need to know which source was used |
| **Decorator** | Enriching base suggestion objects with additional fields (e.g., `infoUrl`, `mapUrl`, `tags`) without modifying the original data structure |
| **Composite** | A day plan is a composite of items — operations like filtering or rendering should treat the collection uniformly |

### Behavioral Patterns
| Pattern | When to use in this project |
|---------|----------------------------|
| **Strategy** | Swapping between live API data and static fallback is a strategy — isolate the selection logic behind a single function |
| **Chain of Responsibility** | Tag inference pipeline: franchise → character → activity. Each stage adds tags then passes to the next |
| **Command** | `acceptSuggestion` and `dismissSuggestion` are commands — keep them as named, testable functions, not inline lambdas |
| **Observer** | React's `useEffect`/`useState` implements observer — use it rather than inventing custom event systems |
| **State** | Setup wizard steps (`currentStep` 1–6) are a state machine — transitions should be explicit and predictable |
| **Memento** | Plan state saved to `localStorage` and restored on load is a memento — `normalizePlan` is the restore step |
| **Template Method** | `inferTags` follows a fixed skeleton (collect → assemble → truncate) — keep this structure; vary only the collection rules |

---

## Architecture Rules
- **Single file per concern** — all app logic in `App.jsx`, all styles in `App.css`. Do not create new component files unless asked.
- **No TypeScript** — plain JSX only.
- **localStorage only** — no external persistence, no API calls that mutate state.
- **Park name keys must exactly match** across all files:
  - `'Magic Kingdom'`
  - `'EPCOT'`
  - `"Disney's Hollywood Studios"`
  - `"Disney's Animal Kingdom"`
- **Suggestion object shape** — every suggestion must have: `id`, `label`, `time` (HH:MM), `type`, `theme`, `tags[]`, `infoUrl`, `mapUrl`
- **Tag format** — lowercase hashtag strings: `'#frozen'`, `'#fireworks'`, `'#meetandgreet'`

---

## What NOT to Do
- Do not refactor working code while fixing an unrelated bug
- Do not add error boundaries, PropTypes, or TypeScript types unless asked
- Do not create README or documentation files unless asked
- Do not add `console.log` to production code
- Do not skip the build or coverage check before committing
- Do not force a design pattern onto code that doesn't benefit from it

# Disney Holiday Planner — Brand & Design Guide

A living reference for all visual decisions in the app. When adding new UI, treat this as the source of truth. If you introduce something new, update this file.

---

## 1. Brand Identity

### Personality
The app exists to make Disney trip planning feel magical, not stressful. It should feel like a friendly concierge — knowledgeable, warm, and visually connected to the parks themselves. It is not a spreadsheet. It is not a dashboard. It is a planner you enjoy using.

### Character traits
- **Trustworthy** — clear hierarchy, predictable patterns, nothing confusing
- **Joyful** — photography, warm colours, smooth motion
- **Efficient** — compact information density, no wasted space
- **Honest** — don't hide destructive actions, don't overload with options

### Tone of voice
- Short and direct: "Daily Plan" not "Daily Plan by Date"
- Human labels: "Disney's Hollywood Studios" not "#Disney'sHollywoodStudios"
- State-aware: "+ Park hop" / "✓ Park hop on" — tell the user what's happening
- Hierarchy of concern: primary → secondary → destructive (visually reflected)

---

## 2. Colour System

### Brand Palette

| Token | Hex | Name | Use |
|-------|-----|------|-----|
| `--dw-castle-blue` | `#003b78` | Castle Blue | Primary text, dark accents, deep backgrounds |
| `--dw-royal-blue` | `#0057b8` | Royal Blue | Buttons, links, active states, borders |
| `--dw-sky` | `#8ed8f8` | Sky | Gradients, light backgrounds, ambient colour |
| `--dw-mint` | `#8fd8c2` | Mint | Character theme, gradients, nature accents |
| `--dw-sun` | `#ffd45a` | Sun | Edit actions, highlights, warm accents |
| `--dw-coral` | `#f86664` | Coral | Delete, destructive, close, alerts |
| `--dw-cloud` | `#f3f8ff` | Cloud | Input backgrounds, form surfaces |
| `--dw-ink` | `#1d2a44` | Ink | All body text |
| `--dw-white` | `#ffffff` | White | Card backgrounds, reversed text |

### Semantic rules

| Intent | Colour |
|--------|--------|
| Primary action | Royal Blue gradient → Castle Blue |
| Secondary / ghost action | Royal Blue at low opacity, outlined |
| Positive / active / confirmed | `rgba(34, 197, 94, ...)` green family |
| Warning / destructive | Coral `#f86664` |
| Edit / modify | Sun `#ffd45a` |
| Disabled | `rgba(146, 162, 188, 0.7)` — cool grey |
| Body text | Ink `#1d2a44` |
| Secondary text | Ink at 70–75% opacity |
| Placeholder / muted | Ink at 30–50% opacity |

### Transparency scale
Rather than hardcoded greys, this app uses transparent versions of the brand blues. This keeps surfaces feeling on-brand even in varying light conditions.

| Opacity | Role |
|---------|------|
| 4–5% Royal Blue | Chip / input backgrounds (resting) |
| 8–10% Royal Blue | Hover fill on ghost buttons |
| 12–16% Royal Blue | Subtle borders, dividers |
| 20–25% Royal Blue | Active chip borders, focused borders |
| 70–90% Castle/Royal | Filled interactive elements |

### Event-type theme colours
Timeline events carry a `data-theme` attribute that injects `--event-theme-color`. This single variable cascades into left border, badge colour, and link hover tints.

| Theme | Hex | Used for |
|-------|-----|----------|
| `ride` | `#0057b8` | Attractions and thrill rides |
| `dining` | `#f86664` | All meal types |
| `fireworks` | `#003b78` | Fireworks, parades, spectaculars |
| `character` | `#8fd8c2` | Character meets and greets |
| `nature` | `#4ea777` | Pool, nature, Animal Kingdom |
| `default` | `#8a93a6` | Unthemed / generic events |

---

## 3. Typography

### Font family
```
'Avenir Next', 'Segoe UI', sans-serif
```
Avenir Next is the primary face — geometric, clean, slightly rounded. Fall back to Segoe UI on Windows, then system sans-serif. No web fonts are loaded; this keeps the app fast.

### Type scale

| Role | Size | Weight | Letter-spacing | Notes |
|------|------|--------|----------------|-------|
| Hero title | `clamp(1.5rem, 2.7vw, 2.25rem)` | 700 | — | Only used in the app hero header |
| Section heading (h2) | `1.15rem` | 700 | — | Card-level headings |
| Card heading (h3) | `1rem` | 700 | — | Day card titles, settings titles |
| Large setup question | `1.8rem` | 700 | — | Setup wizard only |
| Body | `0.95rem` | 400 | — | Section hints, descriptions |
| Label | `0.88rem` | 600 | — | Form labels |
| Compact label | `0.82rem` | 700 | — | Inline field labels |
| Small / caption | `0.78rem` | 400–600 | — | Secondary info |
| Day summary pill | `0.74rem` | 700 | — | Park name, day type chips |
| Timeline event label | `0.85rem` | 600 | — | Attraction / restaurant names |
| Timeline event description | `0.72rem` | 400 italic | — | Short descriptor line |
| Timeline event time | `0.68rem` | 700 | `0.04em` | e.g. "10:45am" |
| Ghost tag | `0.65rem` | 700 | `0.03em` | Suggestion hashtag chips |
| Type badge | `0.58rem` | 800 | `0.06em` | RIDE / DINNER / SHOW — always uppercase |
| Group label / eyebrow | `0.6–0.75rem` | 700 | `0.08–0.09em` | Section dividers, uppercase labels |

### Typography rules
- **Do not use more than 3 font sizes within a single card** — pick from the scale
- Badge text (`event-type-badge`) is **always uppercase** with wide tracking — this is its identity
- Italic is reserved for `event-description` only — don't use it elsewhere
- Link text is never italic

---

## 4. Spacing & Layout

### Base unit
The app uses a flexible rem-based scale, not a strict 8px grid. The effective base unit is **0.25rem (4px)**. Most spacing values are multiples of this.

### Common spacing values

| Value | px equiv | Used for |
|-------|----------|----------|
| `0.25rem` | 4px | Tight gaps (ghost tags) |
| `0.35–0.4rem` | 5–6px | Inner chip gaps, small row gaps |
| `0.5rem` | 8px | Button row gaps, nav arrows gap |
| `0.6–0.65rem` | 10px | Form field gaps, action row gaps |
| `0.75rem` | 12px | Timeline gap, inline link gap |
| `1rem` | 16px | Card padding, section padding |
| `1.25–1.5rem` | 20–24px | Hero / summary bar padding |
| `2–2.5rem` | 32–40px | Page vertical margin |

### Card padding rule
Standard cards use `1rem` uniform padding. The `date-card` uses extra bottom padding (`3.35rem`) to reserve space for the absolute-positioned action dock.

### Layout grid
- Page max-width: `min(1100px, 92vw)` — centred with side gutters
- Card grid: `repeat(auto-fit, minmax(280px, 1fr))` — auto-responsive, min 280px column
- Gap: `1rem`
- Timeline row: `grid-template-columns: 5.5rem 1.75rem 1fr` (time | node | events)

### Breakpoints

| Breakpoint | Width | Key changes |
|-----------|-------|-------------|
| Tablet | `≤ 720px` | Narrow time column (`4rem`), stacked form fields, smaller card padding |
| Mobile | `≤ 480px` | Full-width (`100vw`), no card side radius, compact timeline (`3.25rem`), anchor label hidden |

---

## 5. Elevation & Depth

The app uses two levels of shadow, both tinted with Castle Blue.

| Level | Value | Used on |
|-------|-------|---------|
| Ambient (cards) | `0 10px 25px rgba(0, 59, 120, 0.08)` | All `.card` elements |
| Elevated (hero) | `0 18px 40px rgba(0, 59, 120, 0.2)` | Hero bar |
| Overlay (dropdowns) | `0 4px 20px rgba(0, 0, 0, 0.1)` | Search results, modals |
| Focus ring | `0 0 0 3px rgba(0, 87, 184, 0.08–0.1)` | Inputs, focusable elements |

Shadows are always **downward** — no inset shadows, no upward glow. The blue tint in shadows keeps surfaces feeling cohesive.

---

## 6. Shape Language

### Border-radius scale

| Value | Shape | Used for |
|-------|-------|----------|
| `999px` | Full pill | Buttons, search bars, day summary pills, chips, park-hop toggle |
| `18px` / `var(--radius-lg)` | Large round | Hero bar, date card |
| `16px` | Large round | Date card (explicit) |
| `12px` / `var(--radius-md)` | Medium round | Standard cards, panels, search results, event builder |
| `10px` | Slight round | Day nav tabs, form inputs |
| `8px` | Gentle round | Project rows, settings panel |
| `7px` | Tight round | Timeline event cards |
| `6px` | Minimal | Nav arrow buttons, edit form inputs |
| `4px` | Near-square | Event type badge, small action buttons |

### Shape rules
- **Pill (`999px`)** = selectable, toggleable, user-controlled things (chips, toggle buttons)
- **Large round (`16–18px`)** = major containers that showcase imagery
- **Medium round (`12px`)** = standard cards, panels
- **Small round (`4–7px`)** = compact UI elements inside cards (badges, action buttons)
- Never mix pill shapes and sharp corners in the same visual group

---

## 7. Components

### Cards

**Standard card** (`.card`)
- White background, `12px` radius, `1rem` padding
- Border: `1px solid rgba(0, 87, 184, 0.16)`
- Shadow: ambient level

**Day card** (`.date-card`)
- `16px` radius, semi-transparent white background
- Full park background imagery via CSS custom properties (`--day-bg-image`, `--day-tint`, etc.)
- Gradient overlay (`::before`) at 0.92 opacity preserves text legibility
- Extra bottom padding for absolute-positioned action dock
- Entrance animation: `stepReveal` (clip-path wipe from top, 0.4s)

---

### Buttons

#### Hierarchy

| Tier | Style | Examples |
|------|-------|---------|
| **Primary** | Blue gradient pill, white text | "Continue", "Save", "Add to plan" |
| **Secondary** | Outlined pill, Castle Blue text | "Back", "Cancel" |
| **Toggle / Ghost** | Outlined pill, transitions to active state | "Park hop", preference chips |
| **Action** | Sun yellow pill, dark text | Edit (✏) |
| **Destructive** | Coral, text-only or pill | "Reset day", Delete (×) |
| **Icon-only** | Fixed size (42px circle), white bg | Day type badge, edit/delete |

#### Primary button
```
background: linear-gradient(120deg, #0057b8, #003b78)
color: white
border-radius: 999px
padding: 0.6rem 1.4rem
font-weight: 600
hover: opacity 0.88, translateY(-1px)
```

#### Secondary / ghost button
```
background: transparent
border: 1.5px solid rgba(0, 87, 184, 0.25–0.5)
color: --dw-castle-blue
border-radius: 999px
hover: background rgba(0, 87, 184, 0.06–0.08)
```

#### Toggle button (e.g. Park hop)
```
Inactive: ghost style (outlined, white fill)
Active:   green tint bg, green border, dark green text
         background: rgba(34, 197, 94, 0.12)
         border-color: rgba(34, 197, 94, 0.6)
         color: #166534
```

#### Destructive — primary (coral pill)
Use for inline destructive actions that need to be clearly visible.
```
background: rgba(248, 102, 100, 0.9)
color: white
border-radius: 999px
```

#### Destructive — secondary (text only)
Use for less prominent destructive actions — the lower visual weight signals "think before tapping".
```
background: none
border: none
color: --dw-coral
font-weight: 600
opacity: 0.75
hover: opacity 1, text-decoration underline
```

---

### Pills & Badges

**Day summary pill** — shows day type and location on the day card
```
background: color-mix(in srgb, --chip-color 68%, white)
border: 1px solid (chip-color at 85% mixed with dark blue)
border-radius: 999px
padding: 0.22rem 0.6rem
font-size: 0.74rem
font-weight: 700
color: #0f3f7b
```
Text is plain — no `#` prefix, spaces preserved. Use the actual name.

**Event type badge** — sits above the attraction name on timeline cards
```
background: color-mix(in srgb, --event-theme-color 12%, transparent)
border: 1px solid (theme-color at 25%)
border-radius: 4px  ← NOT a pill — intentionally rectangular
padding: 1px 6px
font-size: 0.58rem
font-weight: 800
letter-spacing: 0.06em
text-transform: uppercase
width: fit-content
```
This is the only element that uses `4px` radius — small and dense by design.

**Selectable chip** (preference, dining type)
```
Inactive:  border 1.5–2px solid (royal blue at 20%), bg (royal blue at 4–5%)
Selected:  gradient fill (Royal Blue → Castle Blue), white text, scale(1.03–1.04)
```

---

### Links

**Timeline event links** (Info, Map, Menu, Book)
```
Small transparent pill — NOT full-width buttons
background: rgba(0, 59, 120, 0.07)
border: 1px solid rgba(0, 59, 120, 0.18)
border-radius: 999px
padding: 0.15rem 0.55rem
font-size: 0.7rem
font-weight: 600
color: --dw-castle-blue
hover: background 0.14, border 0.35
```

**Ghost suggestion links** (Info, Map on faded suggestion cards)
```
color: rgba(29, 42, 68, 0.4)
font-size: 0.6rem
font-weight: 700
hover: color --event-theme-color, underline
```

---

### Form Inputs
```
background: --dw-cloud (#f3f8ff)
border: 1px solid rgba(0, 87, 184, 0.24)
border-radius: 10px
padding: 0.62rem 0.72rem
color: --dw-ink
focus: outline 2px solid rgba(0, 87, 184, 0.34), border transparent
```

Search bars use a pill (`999px`) shape to signal "open-ended entry" vs form field's `10px` shape for "structured entry".

---

## 8. Motion & Animation

### Principles
- Motion should **reveal** content, not decorate it
- All transitions are **fast** (0.12–0.15s) — snappy, not sluggish
- Hover states use `opacity` + `translateY(-1px)` — subtle lift, no scale on full buttons
- Chips scale slightly on select (`scale(1.03–1.04)`) — tactile feedback
- Entry animations use **clip-path wipe** (stepReveal) — content slides in from top edge

### Values

| Property | Duration | Easing |
|----------|----------|--------|
| All interactive hover states | `0.15s` | `ease` |
| Button transform/lift | `0.15s` | `ease` |
| Chip scale on select | `0.12s` | `ease` |
| Entry animation (cards, steps) | `0.4–0.5s` | `cubic-bezier(0.22, 1, 0.36, 1)` |

The `cubic-bezier(0.22, 1, 0.36, 1)` easing is the signature animation curve — it has a slight overshoot (spring feel) that matches the Disney brand energy without being cartoonish.

---

## 9. Imagery

### Park photography
Each park has a dedicated hero photo used as the day card background. Images are layered via CSS custom properties:
- `--day-bg-image` — primary park photo
- `--day-bg-image-2` — secondary park photo (for park-hop days)
- `--day-park-blend` — `linear-gradient(135deg, white 35%, transparent 65%)` splits the two images diagonally on hop days
- `--day-tint-overlay` — tinted colour wash over the photo
- `--park-logo-image` / `--park-logo-image-2` — faint park logo watermark at corners (66% size)

The `::before` overlay gradient is `linear-gradient(140deg, rgba(255,255,255,0.86), rgba(255,255,255,0.56))` at `opacity: 0.92` — this keeps ALL text readable regardless of the photo.

### Ride background images
Ride cards use the attraction's photo as a right-aligned background fill:
```
linear-gradient(to right,
  rgba(255,255,255,1) 0%,
  rgba(255,255,255,1) 55%,
  rgba(255,255,255,0.4) 80%,
  rgba(255,255,255,0) 100%
)
```
The left 55% is fully opaque white (text zone). The image bleeds in on the right edge only. This keeps text legible while showing the ride photo.

### Image rules
- **Never** show images without a gradient overlay that protects text legibility
- Ride photos: stored in `public/images/rides/`, referenced via `RIDE_IMAGES` in `rideData.js`
- Park photos: stored in `public/images/parks/`, referenced via `PARK_IMAGES` in `displayHelpers.js`
- Day-type icons (Park, Swimming, Hotel): SVGs in `public/images/`, referenced via `DAY_TYPES` in `tripOptions.js`
- All images are local — no external CDN dependencies

---

## 10. Do's and Don'ts

### Labels & text
- ✅ "Disney's Hollywood Studios" — full name, spaces intact
- ❌ "#Disney'sHollywoodStudios" — hashtag format was removed; don't reintroduce it
- ✅ "Park" / "Dinner" / "Fireworks" — plain, readable type labels
- ❌ "#Park" / "#Fireworks" — the `hashtagLabel()` function exists for tag display only
- ✅ "Reset day" as a quiet text link — low weight for destructive actions
- ❌ "Reset day" as a solid coral pill — matches primary actions, misleads the user

### Colour
- ✅ Use theme colours via `--event-theme-color` and `data-theme`
- ❌ Hardcode per-event colours inline — breaks the theme system
- ✅ Use `color-mix()` for tinted backgrounds (badge fills, chip hovers)
- ❌ Invent new named colours — extend the existing palette first

### Shape
- ✅ Pill (`999px`) for toggles, chips, navigation elements, search
- ✅ `4px` radius for dense inline badges (type badge)
- ✅ `12px` for standard cards and panels
- ❌ Use pill radius on cards — that's hero/date-card territory (`16–18px`)
- ❌ Mix pill and non-pill shapes in the same action group

### Motion
- ✅ Fast, 0.15s transitions on all hover/focus states
- ❌ Animated loading spinners, bouncing icons, or decorative loops

### Imagery
- ✅ Always layer a gradient over photos to protect text
- ❌ Place text directly on an unmasked photo

### New components
Before adding a new UI element, ask:
1. Does an existing component satisfy this? (pill, card, badge, link)
2. If not, which existing radius/colour/weight does it inherit from?
3. Update this file when the new pattern is established.

---
name: refresh-restaurants
description: Audit and refresh restaurants.yaml against current Walt Disney World dining. Finds new openings, closed venues, and stale menu/booking URLs. Run this to keep restaurant data current.
allowed-tools: Read, WebSearch, WebFetch, Edit
argument-hint: "[optional: park or resort area, e.g. 'EPCOT' or 'Disney Springs']"
---

# Refresh Restaurants — Audit Walt Disney World Dining Data

You are auditing and updating `src/data/yaml/restaurants.yaml` with current Disney World dining information.

## Steps

### 1. Read current data
Read `src/data/yaml/restaurants.yaml` and note:
- Total restaurant count per park/area
- Any restaurants that look potentially stale (old URL patterns, missing data)

### 2. Research current Disney World dining
Use WebSearch to find the current dining lineup (or focus on $ARGUMENTS if a specific area was given):

- Search: `Walt Disney World new restaurants 2024 2025 dining`
- Search: `Walt Disney World [area] dining complete list site:disneyworld.disney.go.com`
- Check official Disney dining page: `https://www.disneyworld.co.uk/dining/`

Focus on:
- **New restaurants** opened in the last 1-2 years (especially in new lands or resort renovations)
- **Permanently closed restaurants** (remove from YAML)
- **Renamed or relocated restaurants**
- **Stale booking/menu URLs** — Disney periodically restructures their URL patterns

### 3. Verify URL patterns
For a sample of restaurants (5-10), verify the `menuUrl` and `bookingUrl` patterns are still valid:
- Menu URLs follow: `https://www.disneyworld.co.uk/dining/[park-slug]/[restaurant-slug]/menus/`
- Booking URLs follow: `https://www.disneyworld.co.uk/dine-res/restaurant/[short-code]`

### 4. Report findings
Present a structured summary:
```
TOTAL IN YAML: X restaurants

NEW (not in YAML — should add):
- Restaurant Name — Park/Area — style (table service / quick service / bar)

POSSIBLY CLOSED (verify before removing):
- Restaurant Name — [evidence of closure]

RENAMED:
- Old Name → New Name

URL PATTERN ISSUES:
- Restaurant Name — issue description

MISSING DATA (no description, no tags, etc.):
- Restaurant Name — what's missing

NO CHANGES NEEDED:
- [Areas that look complete and current]
```

### 5. Propose new entries
For each new restaurant to add, use this YAML shape:
```yaml
"Restaurant Name":
  park: "Magic Kingdom | EPCOT | Disney's Hollywood Studios | Disney's Animal Kingdom | Disney Springs | Resort"
  menuUrl: "https://www.disneyworld.co.uk/dining/[park]/[slug]/menus/"
  bookingUrl: "https://www.disneyworld.co.uk/dine-res/restaurant/[code]"
  heroImage: ""
  description: "One sentence description matching the style of existing entries"
  tags: [tag1, tag2, tag3, ...]
```

Tags should include: service type (`table service`/`quick service`/`buffet`/`bar`), cuisine, meal periods (`breakfast`/`lunch`/`dinner`), atmosphere descriptors, and relevant franchise if applicable.

### 6. Apply changes
Present all proposed changes and ask the user to confirm before writing to `restaurants.yaml`.

If confirmed:
1. Update `src/data/yaml/restaurants.yaml`
2. Run: `/opt/homebrew/bin/node node_modules/.bin/vite build`
3. Update `INTENT.md` and commit if the build passes

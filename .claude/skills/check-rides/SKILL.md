---
name: check-rides
description: Audit rides.yaml against the current Walt Disney World attraction lineup. Identifies missing rides, closed attractions, and stale data. Run this periodically to keep ride data current.
allowed-tools: Read, WebSearch, WebFetch, Edit
argument-hint: "[optional: specific park to check, e.g. 'Magic Kingdom']"
---

# Check Rides — Audit Walt Disney World Attraction Data

You are auditing `src/data/yaml/rides.yaml` against the current real-world Disney World attraction lineup.

## Steps

### 1. Read the current YAML
Read `src/data/yaml/rides.yaml` and note every ride currently listed under each park.

### 2. Research the current official lineup
For each park (or the specific park in $ARGUMENTS), use WebSearch to find the current Walt Disney World attractions list:
- Search: `site:disneyworld.disney.go.com/attractions [park name]` OR `Walt Disney World [park] rides attractions list 2025`
- Focus on: official Disney World site (disneyworld.disney.go.com), TouringPlans, or WDWMagic

Check for:
- **New attractions** added since the YAML was written (e.g. new lands, refurbishments that reopened as new rides)
- **Permanently closed attractions** (remove from YAML)
- **Renamed attractions** (update `name` field)
- **URL slug changes** — verify a sample of `urlSlug` values still resolve on `https://disneyworld.disney.go.com/attractions/`

### 3. Check ride descriptions and tags
For any rides flagged as new or changed:
- Write a one-sentence description matching the existing style
- Assign tags from the patterns already in the file (thrill/family, ride type, franchise, intensity)

### 4. Report findings
Present a clear summary:
```
CURRENT YAML: X rides across Y parks

MISSING FROM YAML (should add):
- [Ride Name] — [Park] — suggested urlSlug, tags

POSSIBLY CLOSED / REMOVED (verify before deleting):
- [Ride Name] — [source confirming closure]

RENAMED:
- [Old Name] → [New Name]

URL ISSUES:
- [Ride Name] — slug may be stale

NO CHANGES NEEDED:
- [Park names that look correct]
```

### 5. Apply changes
After presenting the report, ask the user to confirm before writing any changes to `src/data/yaml/rides.yaml`.

If confirmed, update the YAML and run:
```
/opt/homebrew/bin/node node_modules/.bin/vite build
```

Update `INTENT.md` and commit if the build passes.

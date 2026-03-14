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

### 5. Apply changes immediately
**Do not ask for confirmation.** Apply all changes directly:

- **Add** new rides in the correct park section, following the existing YAML shape
- **Remove** permanently closed rides (comment with `# REMOVED: [reason]` on the line above, then delete the entry)
- **Rename** entries by updating the `name` field and `urlSlug`
- **Fix** stale URL slugs in place

Then run the build and tests:
```
/opt/homebrew/bin/node node_modules/.bin/vite build
/opt/homebrew/bin/node node_modules/.bin/vitest run --coverage
```

Update `INTENT.md` with a summary of what changed and why, then commit and push.

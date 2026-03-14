---
name: refresh-park-shows
description: Fetch the latest park shows and showtimes from themeparks.wiki live API and update park-shows.yaml with current entertainment. Run this to keep the static fallback show list current.
allowed-tools: Read, WebFetch, WebSearch, Edit
argument-hint: "[optional: park name, e.g. 'EPCOT']"
---

# Refresh Park Shows — Sync Live Entertainment Data

You are updating `src/data/yaml/park-shows.yaml` with the current Walt Disney World entertainment lineup.

## Steps

### 1. Read current data
Read these files:
- `src/data/yaml/park-shows.yaml` — the current static fallback shows
- `src/data/yaml/park-config.yaml` — the themeparks.wiki entity IDs and map URLs

### 2. Fetch live data from themeparks.wiki
For each park (or the park specified in $ARGUMENTS), call the live API using the entity IDs from `park-config.yaml`:

```
https://api.themeparks.wiki/v1/entity/{entityId}/live
```

Entity IDs are in `park-config.yaml` under `entityIds`. Filter the response for:
- `entityType === 'SHOW'`
- Has at least one `showtimes` entry

For each show found, extract:
- `name` → `label`
- First showtime → `time` (format: HH:MM from ISO timestamp)
- All showtimes as an array

### 3. Also research current shows via web
Use WebSearch to supplement the live API (which may only have today's shows):
- Search: `"[Park Name]" shows entertainment 2025 Walt Disney World schedule`
- Check the official Disney World entertainment page for each park
- Look for: shows that may have opened recently, seasonal spectaculars, returning fan favourites

### 4. Compare and identify changes
Compare the live API results and web research against the current `park-shows.yaml`:

```
PARK: Magic Kingdom
  Currently in YAML: [list]
  Live API shows:    [list]
  Net new:           [list]
  Possibly ended:    [list]
```

### 5. Propose YAML shape for new shows
For each new show, propose a YAML entry following the existing format:
```yaml
- id: mk-[slug]
  label: Show Name
  description: One sentence description
  time: "HH:MM"
  type: Show | Parade | Fireworks
  theme: character | fireworks | nature | default
  tags: ["#tag1", "#tag2", "#tag3"]
  infoUrl: https://disneyworld.disney.go.com/entertainment/[park]/[slug]/
  mapUrl: "https://www.google.com/maps?q=Venue+Park+Walt+Disney+World"
```

Use the `inferTags` logic from `src/data/parkSuggestions.js` as a guide for tag selection.

### 6. Apply changes
Present the proposed changes and ask the user to confirm before writing to `park-shows.yaml`.

If confirmed:
1. Update `src/data/yaml/park-shows.yaml`
2. Run: `/opt/homebrew/bin/node node_modules/.bin/vite build`
3. Update `INTENT.md` and commit if the build passes

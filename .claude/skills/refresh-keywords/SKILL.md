---
name: refresh-keywords
description: Review and expand keywords.yaml — franchise keywords, character names, and activity patterns used for automatic tag inference on live park shows. Run this after Disney announces new films, characters, or experiences.
allowed-tools: Read, WebSearch, Edit
argument-hint: "[optional: specific section to update, e.g. 'franchise' or 'characters' or 'new film: Wish']"
---

# Refresh Keywords — Update Tag Inference Data

You are reviewing and expanding `src/data/yaml/keywords.yaml`, which drives the `inferTags()` function in `src/data/parkSuggestions.js`. Good keywords ensure live park shows and search results get correctly tagged.

## How keywords are used
When a live show name (e.g. "Mickey's Magical Friendship Faire") is processed:
1. `franchiseKeywords` — matched against the name, assigns franchise tags like `#frozen`, `#starwars`
2. `characterKeywords` — assigns character tags like `#mickey`, `#elsa`
3. `activityKeywords` — assigns activity tags like `#fireworks`, `#parade`
4. `princessNames`, `pixarIps`, `marvelHeroes` — checked for broad category tags (`#princess`, `#pixar`, `#marvel`)

A good keyword entry catches variations: nicknames, related characters, venue names, subtitle words.

## Steps

### 1. Read current keywords
Read `src/data/yaml/keywords.yaml` and `src/data/parkSuggestions.js` to understand the current coverage.

### 2. Identify gaps based on $ARGUMENTS or general audit
If a specific topic was given in $ARGUMENTS (e.g. "new film: Wish"), focus on that. Otherwise, run a general audit:

**Check for recent Disney/Pixar/Marvel/Star Wars releases (last 2 years):**
- Search: `Disney Pixar Marvel animated films 2023 2024 2025 new releases`
- Search: `New Disney World attractions experiences 2024 2025 themed`

For each new IP or character that has a Walt Disney World presence (ride, meet & greet, show):
- Does it have a franchise keyword entry?
- Does it have character keyword entries for the main characters?
- Are all common name variations covered (e.g. "Spider-Man" AND "spiderman" AND "peter parker")?

**Check `activityKeywords` completeness:**
- Are there common show/event name words that should trigger activity tags but currently don't?
- Example: if a new type of nighttime show uses a new word pattern, add it

**Check `princessNames`, `pixarIps`, `marvelHeroes` arrays:**
- Any new princess characters? (e.g. Moana 2, Wish)
- Any new Pixar IPs with a park presence?
- Any new Marvel heroes featured at parks?

### 3. Test against known show names
Mentally (or actually) run these show names through the keyword tables to verify they'd get correct tags:
- "Mickey's Magical Friendship Faire" → should get #character, #mickey
- "Happily Ever After Fireworks" → should get #fireworks, #nighttime
- "Indiana Jones Epic Stunt Spectacular" → should get #indianajones, #adventure
- "Festival of Fantasy Parade" → should get #parade
- Any new shows found during research

### 4. Report findings
```
GAPS FOUND:

Franchise keywords missing:
- #[newtag]: suggested keywords [...]

Character keywords missing:
- #[character]: suggested keywords [...]

Activity keyword improvements:
- #[tag]: add keywords [...]

Array additions:
- princessNames: add [...]
- pixarIps: add [...]
- marvelHeroes: add [...]

NO CHANGES NEEDED:
- [sections that look complete]
```

### 5. Apply changes immediately
**Do not ask for confirmation.** Apply all changes directly to `src/data/yaml/keywords.yaml`:

- **Add** new franchise entries under `franchiseKeywords` with all relevant keyword variations
- **Add** new character entries under `characterKeywords`
- **Extend** existing entries with additional keyword variants
- **Add** new names to `princessNames`, `pixarIps`, or `marvelHeroes` arrays as appropriate
- **Remove** or correct any keyword entries for IPs that no longer have a park presence

Then run build and tests (keyword changes affect `inferTags` coverage):
```
/opt/homebrew/bin/node node_modules/.bin/vite build
/opt/homebrew/bin/node node_modules/.bin/vitest run --coverage
```

Update `INTENT.md` with a summary of what changed and why, then commit and push.

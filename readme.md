# Disney Holiday Planner (React + Vite)

A Disney World-inspired holiday planning tool with:
- trip dates, party size, and budget
- park priorities and dining style
- day-by-day itinerary builder
- editable checklist
- automatic local save in the browser

## Stack
- React
- Vite
- GitHub Pages (`gh-pages`)

## Local run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```

## GitHub Pages deployment
1. Update `base` in `/Users/jonesm/Documents/DisneyDashboards/vite.config.js` if your repo name is not `DisneyDashboards`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

This publishes the `dist` folder to the `gh-pages` branch.

## Notes
- Data is stored in `localStorage` under `disney-holiday-planner`.
- Current palette is Disney World-inspired and can be tuned in `/Users/jonesm/Documents/DisneyDashboards/src/App.css` variables.

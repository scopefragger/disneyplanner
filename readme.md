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
- GitHub Pages (GitHub Actions)

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
This repo is configured to auto-deploy on push to `main` via:
- `/Users/jonesm/Documents/DisneyDashboards/.github/workflows/deploy-pages.yml`

One-time GitHub setting:
1. Go to repository `Settings` -> `Pages`
2. Under `Build and deployment`, choose `Source: GitHub Actions`

After that, every push to `main` publishes the latest app.

## Notes
- Base path is set for repo `disneyplanner` in `/Users/jonesm/Documents/DisneyDashboards/vite.config.js`.
- Data is stored in `localStorage` under `disney-holiday-planner`.
- Theme tokens are in `/Users/jonesm/Documents/DisneyDashboards/src/App.css`.

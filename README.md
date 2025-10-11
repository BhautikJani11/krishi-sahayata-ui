# Krishi Sahayata UI

A React + Vite + TypeScript frontend for the Krishi Sahayata platform. It integrates with a FastAPI backend to provide multilingual farming schemes, tips, weather alerts, and an AI chat assistant.

## Setup

1. Prerequisites
   - Node.js 18+
   - npm 9+
   - FastAPI backend running at `http://localhost:8000`
   - Postgres seeded with schemes and tips

2. Install deps and run
```bash
npm install
npm run dev
```

Vite dev server runs on `http://localhost:8080` and proxies API calls to `http://localhost:8000`.

## Backend proxy / CORS
- Frontend calls relative endpoints like `/api/v1/schemes` and `/api/v1/tips`.
- `vite.config.ts` contains:
  - Proxy for `/api/v1` -> `http://localhost:8000`
  - `changeOrigin: true`, `secure: false`
- Ensure backend allows the origin `http://localhost:8080` in CORS config.

## Key features fixed
- Relative URLs in `src/lib/api.ts` with robust async/await and error handling.
- Proper `useEffect` data fetching in `SchemesSection` and `TipsSection` with loading spinners, toasts, and console logs.
- "Read More / Show Less" toggles for schemes and tips (initial slice(0, 2)).
- Language switcher dropdown (EN/HI/GU) in header; language passed down and used in fetch queries and UI labels.
- Tips seasonal filter (Rabi/Kharif/Zaid) applied to backend query param `season`.

## Testing the flow
1. Start backend on `8000` with seeded data (4 schemes and 4 tips; multilingual fields mapped by backend routers).
2. Start frontend on `8080`.
3. Visit Dashboard:
   - Schemes and Tips should load cards with localized names/descriptions.
   - Read More expands to show all items; Show Less collapses to 2.
   - Weather alerts list loads and refreshes.
   - Chat answers questions and may reference tips/schemes via backend AI.

## Troubleshooting
- No data shown:
  - Check browser console logs for `[Schemes]` and `[Tips]` messages and network tab.
  - Verify requests like `/api/v1/schemes?language=en&active_only=true` return JSON arrays.
  - Confirm backend CORS allows `http://localhost:8080`.
- Build issues: run `npm install` then `npm run build`.

## Scripts
```bash
npm run dev      # start Vite with proxy
npm run build    # production build
npm run preview  # preview built app
```

# Krishi Sahayata UI

A Vite + React + TypeScript + shadcn/ui dashboard for farmers. Integrates with a FastAPI backend exposing `/api/v1` endpoints for chat, weather, schemes, and tips.

## Prerequisites
- Node.js 18+
- FastAPI backend running at `http://localhost:8000` with seeded Postgres data

## Quick start
```bash
# 1) Install deps
npm ci

# 2) Start the backend (separate repo)
# Ensure it listens on 8000 and serves /api/v1
# Ensure CORS allows http://localhost:8080 (or use proxy below)

# 3) Start the frontend (dev)
npm run dev
# Open http://localhost:8080
```

## Vite proxy (dev)
The app uses relative API paths so the dev server proxies to the backend.
- Config: `vite.config.ts`
- Proxy: `/api/v1` -> `http://localhost:8000` with `changeOrigin: true`

No env var is required for API base.

## Key features implemented
- Schemes and Tips fetch from backend with language param (`en|hi|gu`) and `active_only=true`
- Robust loading/error UI with spinners and safe fallbacks
- Read More toggles (shows 2 items initially, then expand)
- Language switcher in header wired to all sections
- Season filter for tips
- Responsive cards with icons and apply links
- Chat and Weather sections call backend endpoints

## Endpoints used
- `GET /api/v1/schemes?language=en&active_only=true`
- `GET /api/v1/tips?language=en&active_only=true[&season=...]`
- `POST /api/v1/chat/chat`
- `POST /api/v1/weather/alerts`

## Troubleshooting
- Seeing "No data found—try refreshing"?
  - Confirm backend returns seeded multilingual data and that routes map `name_en/description_hi` etc.
  - Verify backend reachable: `curl http://localhost:8000/api/v1/health`
  - Check browser console network logs; requests should go to `/api/v1/...` (not absolute URLs)
- CORS errors in production:
  - Allow the deploy origin in backend `ALLOWED_ORIGINS`
- Icons missing for tips/weather:
  - Backend should return `icon` names: `Sprout|Wheat|Droplets|Bug|Sun|CloudRain|AlertTriangle`

## Build
```bash
npm run build
npm run preview
```

## Code pointers
- API client: `src/lib/api.ts`
- Header (language switcher): `src/components/dashboard/Header.tsx`
- Schemes: `src/components/dashboard/SchemesSection.tsx`
- Tips: `src/components/dashboard/TipsSection.tsx`
- Weather: `src/components/dashboard/WeatherSection.tsx`
- Chat: `src/components/dashboard/ChatSection.tsx`

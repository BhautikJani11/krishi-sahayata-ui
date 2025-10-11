# Krishi Sahayata - Farmer Education Platform
## Complete Setup and Run Guide

A comprehensive multilingual farmer education platform with AI-powered chat, government schemes, farming tips, and weather alerts.

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **PostgreSQL 14+** (database)
- **Redis** (optional, for caching)

---

## 📦 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/krishi_sahayata

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production

# AI Configuration (Choose one provider)
AI_PROVIDER=gemini  # or 'openai'

# For Gemini AI
GOOGLE_API_KEY=your-google-api-key-here

# For OpenAI (alternative)
OPENAI_API_KEY=your-openai-api-key-here

# Weather API (OpenWeatherMap)
WEATHER_API_KEY=your-openweather-api-key-here

# CORS (Frontend URL)
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173,http://localhost:3000

# Application Settings
DEBUG=True
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### 5. Setup PostgreSQL Database

#### Option A: Local PostgreSQL
```bash
# Create database
createdb krishi_sahayata

# Or using psql
psql -U postgres
CREATE DATABASE krishi_sahayata;
\q
```

#### Option B: Docker PostgreSQL
```bash
docker run --name krishi-postgres \
  -e POSTGRES_DB=krishi_sahayata \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:14
```

### 6. Run Database Migrations
```bash
# Apply migrations
alembic upgrade head

# Verify connection
python test_connect.py
```

### 7. Seed the Database
```bash
python seed_db.py
```

This will populate the database with:
- **4 Government Schemes**: PM-KISAN, Soil Health Card, Fasal Bima Yojana, Kisan Credit Card
- **4 Farming Tips**: Crop Rotation, Wheat Sowing, Irrigation, Pest Control
- All data is **multilingual** (English, Hindi, Gujarati)

### 8. Start Backend Server
```bash
# Development mode
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Or using the start script
chmod +x start.sh
./start.sh
```

Backend will be available at: **http://localhost:8000**
- API Documentation: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd ..  # Go back to root if in backend/
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Vite Configuration
The `vite.config.ts` should already have the proxy configured:

```typescript
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // ... other config
})
```

### 4. Start Frontend Development Server
```bash
npm run dev
```

Frontend will be available at: **http://localhost:8080**

---

## ✅ Verification Checklist

### Backend Health Check
```bash
# Check if backend is running
curl http://localhost:8000/api/v1/health

# Expected response:
# {"status":"healthy","timestamp":"...","version":"1.0.0"}
```

### Test Schemes Endpoint
```bash
# Fetch English schemes
curl "http://localhost:8000/api/v1/schemes/?language=en&active_only=true"

# Fetch Hindi schemes
curl "http://localhost:8000/api/v1/schemes/?language=hi&active_only=true"
```

### Test Tips Endpoint
```bash
# Fetch all tips
curl "http://localhost:8000/api/v1/tips/?language=en&active_only=true"

# Fetch winter tips
curl "http://localhost:8000/api/v1/tips/?language=en&season=winter&active_only=true"
```

### Frontend Integration Check
1. Open browser to http://localhost:8080
2. Open browser console (F12)
3. Look for debug logs:
   - `[SchemesSection] Fetching schemes for language: en`
   - `[SchemesSection] Successfully fetched 4 schemes`
   - `[TipsSection] Fetching tips for language: en, season: all`
   - `[TipsSection] Successfully fetched 4 tips`

---

## 🔧 Troubleshooting

### Issue: "No schemes available" or "No tips available"

**Solution 1: Check Backend Connection**
```bash
# In frontend console, check network tab
# Verify requests to /api/v1/schemes and /api/v1/tips return 200 status
```

**Solution 2: Verify Database Seeding**
```bash
cd backend
python seed_db.py  # Re-run seeding
```

**Solution 3: Check CORS Configuration**
```bash
# In backend/.env, ensure:
ALLOWED_ORIGINS=http://localhost:8080
```

### Issue: Database Connection Error

**Check PostgreSQL is running:**
```bash
# Linux/Mac
sudo systemctl status postgresql
# or
ps aux | grep postgres

# Docker
docker ps | grep postgres
```

**Test connection:**
```bash
cd backend
python test_connect.py
```

### Issue: Frontend Proxy Not Working

**Verify Vite Dev Server:**
```bash
# Kill any process on port 8080
lsof -ti:8080 | xargs kill -9  # Mac/Linux
# Or
netstat -ano | findstr :8080  # Windows

# Restart frontend
npm run dev
```

### Issue: Read More Button Not Working

**Check Console Logs:**
- Should see: `[TipsSection] Expanded tip: <tip-id>`
- If not, check React DevTools for state updates

---

## 🌐 Language Switching

The app supports three languages:
- **English (en)** - Default
- **Hindi (hi)** - हिंदी
- **Gujarati (gu)** - ગુજરાતી

### How It Works:
1. User clicks language button in header
2. Language state updates in Dashboard component
3. Props passed to all child components
4. Components re-fetch data with new language parameter
5. Backend returns language-specific fields (name, description, etc.)

### Adding a New Language:
1. **Backend**: Add columns to database models (e.g., `name_mr` for Marathi)
2. **Backend**: Update language mapping in `schemes.py` and `tips.py`
3. **Frontend**: Add translations to each component's `translations` object
4. **Frontend**: Update language type from `"en" | "hi" | "gu"` to include new language

---

## 📊 Features Overview

### ✅ Fixed Issues:
- ✅ API integration now returns proper mapped fields based on language
- ✅ Frontend interfaces updated to match backend response format
- ✅ Comprehensive error handling with user-friendly messages
- ✅ Loading states with spinners
- ✅ Debug logging with `[ComponentName]` prefixes
- ✅ "Read More" functionality with expandable content
- ✅ "Show All" toggle for schemes and tips (initially shows 2)
- ✅ Season filter dropdown for tips
- ✅ Responsive cards with proper styling
- ✅ CORS properly configured for localhost:8080
- ✅ Multilingual support across all components

### 🎯 Current Features:
1. **Government Schemes Section**
   - Displays 4 seeded schemes (PM-KISAN, Soil Health, Fasal Bima, KCC)
   - Accordion UI for expandable scheme details
   - Apply Now buttons with external links
   - Category badges
   - Show More/Less toggle

2. **Farming Tips Section**
   - Displays 4 seeded tips (Crop Rotation, Wheat Sowing, Irrigation, Pest Control)
   - Icon-based cards with categories
   - Read More/Less toggle for full content
   - Season filter (All, Winter, Summer, Monsoon, Spring, Autumn)
   - Show More/Less toggle

3. **AI Chat Section**
   - Conversational AI assistant for farming queries
   - Context-aware responses using Gemini/OpenAI
   - Multilingual support

4. **Weather Section**
   - Real-time weather alerts
   - Location-based forecasts
   - Multilingual weather advisories

### 🔒 Type Safety:
- Full TypeScript interfaces for all API responses
- Async/await for all API calls
- Proper error boundaries
- React hooks best practices

---

## 🚀 Production Deployment

### Backend (FastAPI)
```bash
# Using Gunicorn with Uvicorn workers
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120
```

### Frontend (Vite Build)
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Deploy 'dist' folder to:
# - Vercel, Netlify, or Cloudflare Pages (recommended)
# - Nginx/Apache static hosting
# - AWS S3 + CloudFront
```

### Environment Variables for Production:
```env
DEBUG=False
ENVIRONMENT=production
ALLOWED_ORIGINS=https://yourdomain.com
DATABASE_URL=<production-database-url>
SECRET_KEY=<strong-random-secret-key>
```

---

## 📚 API Endpoints Reference

### Schemes
- `GET /api/v1/schemes/` - List all schemes
  - Query params: `language` (en/hi/gu), `category`, `active_only`
- `GET /api/v1/schemes/{id}` - Get single scheme
- `POST /api/v1/schemes/` - Create scheme (admin)
- `PATCH /api/v1/schemes/{id}` - Update scheme (admin)
- `DELETE /api/v1/schemes/{id}` - Delete scheme (admin)

### Tips
- `GET /api/v1/tips/` - List all tips
  - Query params: `language`, `category`, `season`, `active_only`
- `GET /api/v1/tips/{id}` - Get single tip
- `POST /api/v1/tips/` - Create tip (admin)
- `PATCH /api/v1/tips/{id}` - Update tip (admin)
- `DELETE /api/v1/tips/{id}` - Delete tip (admin)

### Chat
- `POST /api/v1/chat/chat` - Send chat message
- `GET /api/v1/chat/history/{conversation_id}` - Get chat history

### Weather
- `POST /api/v1/weather/alerts` - Get weather alerts
- `GET /api/v1/weather/current` - Get current weather

### Health
- `GET /api/v1/health` - Health check

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
npm run test
```

### End-to-End Testing
```bash
# Using Playwright or Cypress
npm run test:e2e
```

---

## 📝 Development Workflow

### Daily Development:
1. Start PostgreSQL (if not already running)
2. Start backend: `cd backend && uvicorn app.main:app --reload`
3. Start frontend: `npm run dev`
4. Open http://localhost:8080
5. Check browser console for debug logs

### Adding New Features:
1. **Backend**: Create model → migration → endpoint → test
2. **Frontend**: Create interface → API client method → component → integration
3. Test both independently, then integration
4. Update documentation

---

## 🐛 Debugging Tips

### Enable Verbose Logging:
```bash
# Backend
LOG_LEVEL=DEBUG uvicorn app.main:app --reload --log-level debug

# Frontend - Already has console.log debug statements with [ComponentName] prefix
```

### Database Inspection:
```bash
# Connect to PostgreSQL
psql -U postgres -d krishi_sahayata

# Inspect tables
\dt

# Check seeded data
SELECT id, name_en, category FROM schemes;
SELECT id, title_en, season FROM tips;
```

### Network Debugging:
- Open browser DevTools → Network tab
- Filter by XHR/Fetch
- Inspect request/response for `/api/v1/schemes` and `/api/v1/tips`
- Check status codes, response times, and payload

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit with descriptive message: `git commit -m "Add amazing feature"`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **FastAPI** - Modern Python web framework
- **React** - Frontend library
- **PostgreSQL** - Robust database
- **Gemini AI** - Conversational AI
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework

---

## 📞 Support

For issues or questions:
1. Check this README first
2. Review console logs for error messages
3. Check backend logs: `backend/logs/app.log`
4. Create an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, Python version)

---

**Happy Farming! 🌾 खुश खेती! 🌾 ખુશ ખેતી! 🌾**

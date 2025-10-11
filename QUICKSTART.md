# 🚀 Krishi Sahayata - Quick Start Guide

Get up and running in 5 minutes!

---

## ⚡ Prerequisites Check

```bash
# Check versions
python3 --version  # Should be 3.11+
node --version     # Should be 18+
npm --version
psql --version     # Should be 14+
```

---

## 🎯 Quick Setup

### Step 1: Clone & Setup Environment

```bash
# Navigate to your project
cd krishi-sahayata

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Configure Environment

Create `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/krishi_sahayata
SECRET_KEY=your-secret-key-here-change-in-production
GOOGLE_API_KEY=your-gemini-api-key-here
WEATHER_API_KEY=your-openweather-api-key-here
AI_PROVIDER=gemini
ALLOWED_ORIGINS=http://localhost:8080
DEBUG=True
ENVIRONMENT=development
```

### Step 3: Setup Database

```bash
# Create database
createdb krishi_sahayata

# Run migrations
alembic upgrade head

# Seed data (4 schemes + 4 tips)
python seed_db.py
```

### Step 4: Start Backend

```bash
# From backend/ directory
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

✅ Backend running at: http://localhost:8000

### Step 5: Start Frontend

```bash
# Open new terminal, go to root directory
cd ..  # if still in backend/
npm install
npm run dev
```

✅ Frontend running at: http://localhost:8080

---

## 🧪 Test Everything Works

### Option 1: Automated Test Script

```bash
./test-api-connection.sh
```

### Option 2: Manual Browser Check

1. Open http://localhost:8080
2. Press `F12` to open browser console
3. Look for these logs:
   ```
   [SchemesSection] Successfully fetched 4 schemes
   [TipsSection] Successfully fetched 4 tips
   [ChatSection] Welcome message added
   ```

4. Test functionality:
   - ✅ See 2 government schemes (click "Show All" for 4)
   - ✅ See 2 farming tips (click "Show All" for 4)
   - ✅ Click "Read More" on tips to expand content
   - ✅ Filter tips by season
   - ✅ Switch language (EN → HI → GU) in header
   - ✅ Send a chat message: "What is PM-KISAN?"

---

## 🐛 Quick Troubleshooting

### "No schemes available" or "No tips available"

```bash
# Check backend is running
curl http://localhost:8000/api/v1/health

# Re-seed database
cd backend
python seed_db.py
```

### Database Connection Error

```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # Mac
# Windows: Start from Services

# Verify database exists
psql -U postgres -l | grep krishi_sahayata
```

### Port Already in Use

```bash
# Kill processes on ports
lsof -ti:8000 | xargs kill -9  # Backend
lsof -ti:8080 | xargs kill -9  # Frontend
```

### Frontend Can't Reach Backend

Check `vite.config.ts` has:
```typescript
proxy: {
  '/api/v1': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```

---

## 📊 Expected Results

### Seeded Data:

**4 Government Schemes:**
1. PM-KISAN - ₹6,000/year direct income support
2. Soil Health Card Scheme - Free soil testing
3. Pradhan Mantri Fasal Bima Yojana - Crop insurance
4. Kisan Credit Card - Subsidized farm loans

**4 Farming Tips:**
1. Crop Rotation (All Seasons)
2. Wheat Sowing (Winter)
3. Irrigation Tips (All Seasons)
4. Pest Control (All Seasons)

All data available in **3 languages**: English, Hindi, Gujarati

---

## 🎨 Features to Test

### 1. Schemes Section
- [x] Displays 2 schemes initially
- [x] "Show All Schemes" button to see all 4
- [x] Click scheme name to expand details
- [x] "Apply Now" button opens external link
- [x] Category badges displayed
- [x] Language switching updates content

### 2. Tips Section
- [x] Displays 2 tips initially
- [x] "Show All Tips" button to see all 4
- [x] "Read More" expands full content
- [x] Season filter dropdown (All, Winter, Summer, etc.)
- [x] Icon-based cards with category badges
- [x] Language switching updates content

### 3. Chat Section
- [x] Welcome message displays
- [x] Send messages to AI assistant
- [x] Get farming advice responses
- [x] Multilingual chat support
- [x] Loading states while AI responds

### 4. Language Switcher
- [x] Header button cycles: EN → HI → GU
- [x] All sections update immediately
- [x] API calls include language parameter
- [x] UI text translates properly

---

## 📝 API Endpoints Reference

Test these in browser or with curl:

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Get schemes (English)
curl "http://localhost:8000/api/v1/schemes/?language=en&active_only=true"

# Get tips (Hindi, Winter season)
curl "http://localhost:8000/api/v1/tips/?language=hi&season=winter&active_only=true"

# Get weather
curl "http://localhost:8000/api/v1/weather/current?location=Delhi,IN"
```

---

## 🎯 Next Steps

1. **Customize Content**: Edit `backend/app/db/seed_data.py` and re-run `python seed_db.py`
2. **Add More Languages**: Follow instructions in SETUP_AND_RUN.md
3. **Configure AI**: Add your Gemini or OpenAI API key to `.env`
4. **Deploy**: See production deployment section in SETUP_AND_RUN.md

---

## 📞 Need Help?

1. Check browser console (F12) for `[ComponentName]` debug logs
2. Check backend logs: `backend/logs/app.log`
3. Run test script: `./test-api-connection.sh`
4. Read full documentation: `SETUP_AND_RUN.md`

---

**Ready to farm smarter! 🌾**

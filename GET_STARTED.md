# 🚀 Get Started - Farmer Chatbot

## ⚡ 5-Minute Quick Start

### Step 1: Get API Keys (2 minutes)

**Choose ONE AI provider:**

**Option A: Google Gemini (Recommended - Free)**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

**Option B: OpenAI**
1. Go to https://platform.openai.com/api-keys
2. Sign up/sign in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### Step 2: Setup Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Copy and edit environment file
cp .env.example .env

# Edit .env and add your API key:
# For Gemini:
AI_PROVIDER=gemini
GOOGLE_API_KEY=your_key_here

# For OpenAI:
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here

# Start with Docker (easiest)
docker-compose up -d

# Wait 30 seconds, then seed database
docker-compose exec api python seed_db.py
```

**OR** without Docker:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
createdb farmer_chatbot
python seed_db.py
uvicorn app.main:app --reload
```

### Step 3: Setup Frontend (1 minute)

```bash
# From project root
npm install
cp .env.example .env
npm run dev
```

### Step 4: Test! ✅

Open http://localhost:5173 and:
- ✅ Ask a farming question in the chat
- ✅ Check weather alerts
- ✅ Browse government schemes
- ✅ View farming tips
- ✅ Switch languages (EN/HI/GU)

## 🎯 What You Get

✅ **AI Farming Chatbot** - Ask anything about farming
✅ **Weather Alerts** - Real-time weather information  
✅ **Government Schemes** - Browse and apply
✅ **Farming Tips** - Expert advice
✅ **3 Languages** - English, Hindi, Gujarati

## 📍 URLs After Setup

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## ❓ Need Help?

1. **Backend not starting?**
   - Check: Database is running
   - Check: .env file exists with API key
   - View logs: `docker-compose logs -f api`

2. **Frontend not connecting?**
   - Check: Backend is running at http://localhost:8000
   - Check: Browser console for errors
   - Verify: VITE_API_URL in .env

3. **AI not responding?**
   - Check: API key is correct in backend/.env
   - Check: AI_PROVIDER matches your key type
   - Test: `curl http://localhost:8000/api/v1/health`

## 📚 Full Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command reference
- **[PROJECT_README.md](PROJECT_README.md)** - Full documentation

## 🎉 You're Ready!

Your farmer chatbot is now running! Try asking:
- "What is the best time to plant wheat?"
- "How do I control pests naturally?"
- "Tell me about PM-KISAN scheme"

**Enjoy farming with AI! 🌾**

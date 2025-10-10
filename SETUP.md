# 🌾 Farmer Chatbot - Complete Setup Guide

This guide will help you set up both the backend (FastAPI) and frontend (React + Vite) for the Farmer Chatbot application.

## 📋 Prerequisites

### Required
- **Python 3.11+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **PostgreSQL 15+** - Database
- **Git** - Version control

### Optional
- **Redis** - For caching and rate limiting
- **Docker & Docker Compose** - For containerized deployment

### API Keys
- **AI Provider** (choose one):
  - Google Gemini API key (recommended - has free tier)
  - OpenAI API key
- **Weather API** (optional):
  - OpenWeatherMap API key (free tier available)

## 🚀 Quick Start (Using Docker)

The fastest way to get started:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <repo-name>

# 2. Set up backend environment
cd backend
cp .env.example .env
# Edit .env and add your API keys

# 3. Start all services with Docker
docker-compose up -d

# 4. Seed the database
docker-compose exec api python seed_db.py

# 5. Set up frontend
cd ../
cp .env.example .env
# Edit .env if needed (default backend URL is already set)

# 6. Install frontend dependencies
npm install

# 7. Start frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📖 Detailed Setup

### Backend Setup

#### 1. Navigate to Backend Directory
```bash
cd backend
```

#### 2. Create Virtual Environment
```bash
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Database
DATABASE_URL=postgresql+asyncpg://farmer:farmer123@localhost:5432/farmer_chatbot

# AI Provider (choose one)
AI_PROVIDER=gemini
GOOGLE_API_KEY=your_google_api_key_here
# OR
# AI_PROVIDER=openai
# OPENAI_API_KEY=your_openai_api_key_here

# Weather API (optional)
WEATHER_API_KEY=your_openweather_api_key_here

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production

# CORS (add your frontend URL)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### 5. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb farmer_chatbot

# Or using psql
psql -U postgres
CREATE DATABASE farmer_chatbot;
\q
```

**Option B: Using Docker**
```bash
docker run -d \
  --name farmer_chatbot_db \
  -e POSTGRES_USER=farmer \
  -e POSTGRES_PASSWORD=farmer123 \
  -e POSTGRES_DB=farmer_chatbot \
  -p 5432:5432 \
  postgres:15-alpine
```

#### 6. Initialize and Seed Database
```bash
# Tables are automatically created on first run

# Seed initial data (schemes and tips)
python seed_db.py
```

#### 7. Run Backend Server

**Development Mode:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Production Mode:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Frontend Setup

#### 1. Navigate to Project Root
```bash
cd ..  # From backend directory
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# FastAPI Backend URL
VITE_API_URL=http://localhost:8000/api/v1
```

#### 4. Run Frontend Development Server
```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

#### 5. Build for Production
```bash
npm run build
npm run preview
```

## 🔑 Getting API Keys

### Google Gemini API (Recommended - Free Tier)

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add to backend `.env`:
   ```env
   AI_PROVIDER=gemini
   GOOGLE_API_KEY=your_api_key_here
   ```

### OpenAI API (Alternative)

1. Visit https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and add to backend `.env`:
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your_api_key_here
   ```

### OpenWeatherMap API (Optional)

1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to API keys section
4. Copy your API key and add to backend `.env`:
   ```env
   WEATHER_API_KEY=your_api_key_here
   ```

## 🐳 Docker Deployment

### Full Stack Deployment

```bash
cd backend

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Individual Services

```bash
# Start only database
docker-compose up -d db

# Start database and Redis
docker-compose up -d db redis

# Restart API
docker-compose restart api
```

## 🧪 Testing the Application

### Test Backend API

```bash
# Health check
curl http://localhost:8000/health

# Chat endpoint
curl -X POST "http://localhost:8000/api/v1/chat/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the best time to plant wheat?",
    "language": "en",
    "user_id": "test-user"
  }'

# Weather alerts
curl -X POST "http://localhost:8000/api/v1/weather/alerts" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Delhi,IN",
    "language": "en"
  }'

# Get schemes
curl "http://localhost:8000/api/v1/schemes/?language=en"

# Get tips
curl "http://localhost:8000/api/v1/tips/?language=en"
```

### Test Frontend

1. Open http://localhost:5173
2. Try the chat - ask farming questions
3. Check weather alerts
4. Browse schemes and tips
5. Switch languages (English, Hindi, Gujarati)

## 🔧 Troubleshooting

### Backend Issues

**Problem: Database connection error**
```bash
# Check if PostgreSQL is running
pg_isready

# Check connection string in .env
# Make sure DATABASE_URL is correct
```

**Problem: Module not found**
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Make sure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

**Problem: AI API errors**
```bash
# Verify API key is set correctly
echo $GOOGLE_API_KEY  # Linux/Mac
echo %GOOGLE_API_KEY% # Windows

# Check logs
tail -f logs/app.log
```

### Frontend Issues

**Problem: Cannot connect to backend**
```bash
# Check if backend is running
curl http://localhost:8000/health

# Verify VITE_API_URL in .env
cat .env
```

**Problem: Module not found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

**Problem: Build errors**
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

## 📊 Project Structure

```
farmer-chatbot/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── db/             # Database
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # App entry point
│   ├── logs/               # Application logs
│   ├── .env                # Environment variables
│   ├── requirements.txt    # Python dependencies
│   └── docker-compose.yml  # Docker configuration
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── lib/               # Utilities and API client
│   └── pages/             # Page components
├── .env                    # Frontend environment
├── package.json           # Node dependencies
└── README.md              # Main documentation
```

## 🎯 Next Steps

1. **Customize the chatbot**: Edit the system prompt in `backend/app/services/ai_service.py`
2. **Add more schemes**: Use the API or admin panel to add government schemes
3. **Add more tips**: Create seasonal farming tips through the API
4. **Configure weather**: Set up real weather API for your region
5. **Enable authentication**: Add user authentication and authorization
6. **Deploy to production**: Use cloud services (AWS, GCP, Azure)

## 📚 Documentation

- **Backend API Docs**: http://localhost:8000/docs (when running)
- **Backend README**: `backend/README.md`
- **Frontend Components**: Check `src/components/` directory

## 🆘 Support

If you encounter any issues:

1. Check the logs:
   - Backend: `backend/logs/app.log`
   - Frontend: Browser console
2. Verify all environment variables are set correctly
3. Ensure all services are running
4. Check API endpoint documentation

## 📝 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for Indian Farmers**

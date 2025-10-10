# 🚀 Quick Reference Guide

Essential commands and information for the Farmer Chatbot project.

## 📦 Installation

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Then edit with your API keys
```

### Frontend
```bash
npm install
cp .env.example .env
```

## ▶️ Running the Application

### Development Mode

**Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
npm run dev
```

### Docker (All Services)
```bash
cd backend
docker-compose up -d                    # Start
docker-compose logs -f api              # View logs
docker-compose exec api python seed_db.py  # Seed database
docker-compose down                     # Stop
```

## 🗄️ Database Commands

### Setup
```bash
# Create database
createdb farmer_chatbot

# Seed initial data
cd backend
python seed_db.py
```

### PostgreSQL Commands
```bash
# Connect to database
psql farmer_chatbot

# Common queries
\dt                    # List tables
\d conversations       # Describe table
SELECT * FROM tips LIMIT 5;
```

### Docker Database
```bash
# Access database in Docker
docker-compose exec db psql -U farmer -d farmer_chatbot

# Backup database
docker-compose exec db pg_dump -U farmer farmer_chatbot > backup.sql

# Restore database
docker-compose exec -T db psql -U farmer farmer_chatbot < backup.sql
```

## 🧪 Testing API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Chat (AI)
```bash
curl -X POST http://localhost:8000/api/v1/chat/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the best fertilizer for wheat?",
    "language": "en",
    "user_id": "test-user"
  }'
```

### Weather Alerts
```bash
curl -X POST http://localhost:8000/api/v1/weather/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Delhi,IN",
    "language": "en"
  }'
```

### Get Schemes
```bash
curl "http://localhost:8000/api/v1/schemes/?language=en&active_only=true"
```

### Get Tips
```bash
curl "http://localhost:8000/api/v1/tips/?language=hi&category=irrigation"
```

### Create New Scheme (Admin)
```bash
curl -X POST http://localhost:8000/api/v1/schemes/ \
  -H "Content-Type: application/json" \
  -d '{
    "name_en": "New Farming Scheme",
    "description_en": "Description here",
    "category": "subsidy",
    "is_active": true
  }'
```

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/farmer_chatbot
AI_PROVIDER=gemini
GOOGLE_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 🐛 Debugging

### Backend Logs
```bash
# Development logs (console)
# Automatically shown when running with --reload

# Production logs (file)
tail -f backend/logs/app.log

# Docker logs
docker-compose logs -f api
```

### Database Inspection
```bash
# Check database connection
cd backend
source venv/bin/activate
python -c "from app.db.base import engine; import asyncio; asyncio.run(engine.dispose()); print('DB OK')"
```

### Frontend Console
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

## 🔄 Common Tasks

### Update Dependencies

**Backend:**
```bash
cd backend
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

**Frontend:**
```bash
npm update
npm audit fix
```

### Clear Cache

**Backend:**
```bash
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete
```

**Frontend:**
```bash
rm -rf node_modules/.vite
npm run build
```

### Rebuild Docker Images
```bash
cd backend
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Database Management

### Add New Scheme (Python)
```python
from app.models.scheme import Scheme
from app.db.base import AsyncSessionLocal

async def add_scheme():
    async with AsyncSessionLocal() as db:
        scheme = Scheme(
            name_en="Scheme Name",
            description_en="Description",
            category="subsidy",
            is_active=True
        )
        db.add(scheme)
        await db.commit()
```

### Add New Tip (Python)
```python
from app.models.tip import Tip
from app.db.base import AsyncSessionLocal

async def add_tip():
    async with AsyncSessionLocal() as db:
        tip = Tip(
            title_en="Tip Title",
            description_en="Description",
            category="irrigation",
            icon="Droplets",
            is_active=True
        )
        db.add(tip)
        await db.commit()
```

## 🚀 Production Deployment

### Backend
```bash
# Build Docker image
docker build -t farmer-chatbot-api .

# Run with production settings
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Or with gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Frontend
```bash
# Build for production
npm run build

# Preview build
npm run preview

# Deploy build folder
# Upload 'dist' folder to your hosting service
```

## 📱 URLs

### Development
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Database: localhost:5432

### Docker
- Backend API: http://localhost:8000
- Database: localhost:5432
- Redis: localhost:6379

## 🔐 Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Set DEBUG=False
- [ ] Restrict ALLOWED_ORIGINS
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs

## 📞 Quick Help

### Backend Not Starting
1. Check database is running: `pg_isready`
2. Verify .env file exists and has correct values
3. Check virtual environment is activated
4. Check logs: `tail -f backend/logs/app.log`

### Frontend Not Connecting
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check VITE_API_URL in .env
3. Check browser console for errors
4. Clear browser cache

### Database Issues
1. Check connection: `psql farmer_chatbot`
2. Verify DATABASE_URL in .env
3. Check PostgreSQL is running
4. Try resetting: Drop and recreate database

### AI Not Responding
1. Verify API key is set in .env
2. Check AI_PROVIDER is correct (gemini or openai)
3. Test API key directly
4. Check API quota/credits

## 📚 Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev
- **Gemini API**: https://ai.google.dev
- **OpenAI API**: https://platform.openai.com/docs
- **OpenWeatherMap**: https://openweathermap.org/api
- **PostgreSQL**: https://www.postgresql.org/docs

## 🎯 Next Steps

1. Get API keys (Gemini/OpenAI, Weather)
2. Set up database
3. Configure .env files
4. Seed database
5. Test all features
6. Customize for your needs
7. Deploy to production

---

**Keep this file handy for quick reference!**

# 🌾 Farmer Chatbot - AI-Powered Farming Assistant

A comprehensive, production-ready application providing AI-powered farming advice, weather alerts, government schemes, and farming tips to farmers in India. Built with FastAPI backend and React frontend, featuring multilingual support (English, Hindi, Gujarati).

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Features

### 🤖 AI Chatbot
- **Intelligent Farming Advice**: Get expert guidance on crops, soil, irrigation, pest control
- **Multilingual Support**: Communicate in English, Hindi, or Gujarati
- **Context-Aware**: Maintains conversation history for relevant responses
- **Powered by**: Google Gemini or OpenAI GPT

### 🌦️ Weather Integration
- **Real-Time Alerts**: Get weather warnings and forecasts
- **Location-Based**: Customized alerts for your region
- **Farming-Specific**: Advice based on weather conditions
- **Multiple Languages**: Alerts in English, Hindi, and Gujarati

### 📋 Government Schemes
- **Comprehensive Database**: PM-KISAN, Fasal Bima Yojana, Soil Health Card, etc.
- **Easy Access**: Browse and apply for schemes
- **Multilingual**: Scheme details in all supported languages
- **CRUD Operations**: Admin can manage schemes via API

### 💡 Farming Tips
- **Seasonal Advice**: Tips relevant to current season
- **Category-Based**: Irrigation, pest control, crop rotation, etc.
- **Best Practices**: Modern farming techniques
- **Multilingual**: Tips in all supported languages

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │ ← User Interface (Vite + TypeScript + Shadcn UI)
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  FastAPI Server │ ← API Layer (Python 3.11+)
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    ▼         ▼          ▼          ▼
┌────────┐ ┌─────┐  ┌────────┐  ┌────────┐
│Postgres│ │Redis│  │AI APIs │  │Weather │
│   DB   │ │Cache│  │(Gemini/│  │  API   │
└────────┘ └─────┘  │OpenAI) │  └────────┘
                     └────────┘
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.115
- **Language**: Python 3.11+
- **Database**: PostgreSQL 15 (SQLAlchemy async)
- **Caching**: Redis (optional)
- **AI**: Google Gemini / OpenAI GPT
- **Weather**: OpenWeatherMap API
- **Validation**: Pydantic v2
- **Logging**: Loguru

### Frontend
- **Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Language**: TypeScript 5.8
- **UI Library**: Shadcn UI + Tailwind CSS
- **State**: React Hooks
- **HTTP Client**: Fetch API
- **Icons**: Lucide React

### DevOps
- **Containerization**: Docker + Docker Compose
- **WSGI Server**: Uvicorn
- **Process Manager**: Uvicorn workers
- **Database Migrations**: Alembic (planned)

## 📁 Project Structure

```
farmer-chatbot/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/            # API endpoints
│   │   │   └── endpoints/
│   │   │       ├── chat.py    # Chat/AI endpoints
│   │   │       ├── weather.py # Weather endpoints
│   │   │       ├── schemes.py # Schemes CRUD
│   │   │       └── tips.py    # Tips CRUD
│   │   ├── core/              # Core configuration
│   │   │   ├── config.py      # Settings
│   │   │   └── logging.py     # Logging setup
│   │   ├── db/                # Database
│   │   │   ├── base.py        # DB connection
│   │   │   └── seed_data.py   # Initial data
│   │   ├── models/            # SQLAlchemy models
│   │   │   ├── conversation.py
│   │   │   ├── scheme.py
│   │   │   ├── tip.py
│   │   │   └── weather.py
│   │   ├── schemas/           # Pydantic schemas
│   │   │   ├── conversation.py
│   │   │   ├── scheme.py
│   │   │   ├── tip.py
│   │   │   └── weather.py
│   │   ├── services/          # Business logic
│   │   │   ├── ai_service.py
│   │   │   └── weather_service.py
│   │   ├── middleware/        # Middleware
│   │   │   ├── cors.py
│   │   │   └── error_handler.py
│   │   └── main.py           # App entry point
│   ├── logs/                 # Application logs
│   ├── .env                  # Environment variables
│   ├── .env.example          # Example env file
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile           # Docker image
│   ├── docker-compose.yml   # Docker orchestration
│   ├── seed_db.py          # Database seeding script
│   └── README.md           # Backend documentation
│
├── src/                     # React Frontend
│   ├── components/
│   │   ├── dashboard/      # Dashboard components
│   │   │   ├── ChatSection.tsx
│   │   │   ├── WeatherSection.tsx
│   │   │   ├── SchemesSection.tsx
│   │   │   ├── TipsSection.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/            # Shadcn UI components
│   ├── lib/
│   │   ├── api.ts         # API client
│   │   └── utils.ts       # Utilities
│   ├── pages/
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   └── Index.tsx      # Landing page
│   └── main.tsx          # App entry point
│
├── public/               # Static assets
├── .env                 # Frontend environment
├── .env.example        # Example env file
├── package.json       # Node dependencies
├── SETUP.md          # Setup instructions
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Google Gemini API key OR OpenAI API key
- (Optional) OpenWeatherMap API key

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd farmer-chatbot
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env and add your API keys

# Create database
createdb farmer_chatbot

# Seed database
python seed_db.py

# Run server
uvicorn app.main:app --reload
```

Backend will run at: http://localhost:8000
API Docs: http://localhost:8000/docs

### 3. Frontend Setup
```bash
# From project root
cd ..

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run development server
npm run dev
```

Frontend will run at: http://localhost:5173

### 4. Using Docker (Recommended)
```bash
cd backend

# Start all services
docker-compose up -d

# Seed database
docker-compose exec api python seed_db.py

# View logs
docker-compose logs -f api
```

Then run frontend separately or add it to docker-compose.

## 📖 Detailed Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **API Documentation**: http://localhost:8000/docs (when running)

## 🔌 API Endpoints

### Chat
- `POST /api/v1/chat/chat` - Send message, get AI response
- `POST /api/v1/chat/conversations` - Create conversation
- `GET /api/v1/chat/conversations/{id}` - Get conversation
- `DELETE /api/v1/chat/conversations/{id}` - Delete conversation

### Weather
- `POST /api/v1/weather/alerts` - Get weather alerts
- `GET /api/v1/weather/current` - Get current weather
- `GET /api/v1/weather/forecast` - Get forecast

### Schemes
- `GET /api/v1/schemes/` - List schemes
- `POST /api/v1/schemes/` - Create scheme
- `GET /api/v1/schemes/{id}` - Get scheme
- `PATCH /api/v1/schemes/{id}` - Update scheme
- `DELETE /api/v1/schemes/{id}` - Delete scheme

### Tips
- `GET /api/v1/tips/` - List tips
- `POST /api/v1/tips/` - Create tip
- `GET /api/v1/tips/{id}` - Get tip
- `PATCH /api/v1/tips/{id}` - Update tip
- `DELETE /api/v1/tips/{id}` - Delete tip

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/farmer_chatbot

# AI Provider (choose one)
AI_PROVIDER=gemini  # or openai
GOOGLE_API_KEY=your_google_api_key
# OPENAI_API_KEY=your_openai_api_key

# Weather API (optional)
WEATHER_API_KEY=your_openweather_api_key

# Security
SECRET_KEY=your-secret-key

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:8000/health

# Chat
curl -X POST http://localhost:8000/api/v1/chat/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is crop rotation?", "language": "en"}'

# Weather
curl -X POST http://localhost:8000/api/v1/weather/alerts \
  -H "Content-Type: application/json" \
  -d '{"location": "Delhi,IN", "language": "en"}'
```

### Test Frontend
1. Open http://localhost:5173
2. Try chatting with the AI
3. Check weather alerts
4. Browse schemes and tips
5. Switch between languages

## 🎨 Features Showcase

### Multilingual Support
- **English**: Full application support
- **हिंदी (Hindi)**: UI, content, and AI responses
- **ગુજરાતી (Gujarati)**: UI, content, and AI responses

### AI Chat Examples
- "What is the best time to plant wheat in North India?"
- "How do I control pests organically?"
- "मुझे सिंचाई के बारे में बताएं" (Tell me about irrigation)
- "ખેતીમાં ખાતરનો ઉપયોગ કેવી રીતે કરવો?" (How to use fertilizer in farming?)

### Government Schemes Included
- PM-KISAN (Direct Income Support)
- Pradhan Mantri Fasal Bima Yojana (Crop Insurance)
- Soil Health Card Scheme
- Kisan Credit Card

## 🔐 Security

- Environment-based configuration
- CORS protection
- Input validation with Pydantic
- SQL injection protection (SQLAlchemy ORM)
- Error handling and logging
- Rate limiting (optional with Redis)

## 🚀 Deployment

### Backend Deployment Options
1. **Docker**: Use provided docker-compose.yml
2. **Cloud Platforms**: AWS, GCP, Azure, DigitalOcean
3. **Platform-as-a-Service**: Heroku, Render, Railway

### Frontend Deployment Options
1. **Vercel**: Zero-config deployment for Vite
2. **Netlify**: Simple static site hosting
3. **AWS S3 + CloudFront**: Scalable CDN
4. **Nginx**: Traditional web server

### Production Checklist
- [ ] Change SECRET_KEY in backend .env
- [ ] Use production database (not SQLite)
- [ ] Enable HTTPS
- [ ] Set DEBUG=False
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Enable rate limiting
- [ ] Set up backups
- [ ] Use environment variables for all secrets
- [ ] Configure CDN for static assets

## 📊 Database Schema

### Tables
- **conversations**: Chat conversations
- **messages**: Chat messages
- **schemes**: Government schemes
- **tips**: Farming tips
- **weather_alerts**: Weather alerts (optional storage)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **FastAPI** - Modern Python web framework
- **React** - UI library
- **Shadcn UI** - Beautiful UI components
- **OpenAI / Google** - AI models
- **OpenWeatherMap** - Weather data
- **PostgreSQL** - Reliable database

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation in SETUP.md
- Review API docs at /docs endpoint

## 🗺️ Roadmap

### Phase 1 (Completed)
- [x] AI chatbot with multilingual support
- [x] Weather integration
- [x] Government schemes management
- [x] Farming tips
- [x] REST API
- [x] React frontend
- [x] Docker deployment

### Phase 2 (Planned)
- [ ] User authentication
- [ ] Personalized recommendations
- [ ] Crop price tracking
- [ ] Market information
- [ ] Voice input/output
- [ ] Mobile app
- [ ] SMS integration
- [ ] Offline support

### Phase 3 (Future)
- [ ] Community forum
- [ ] Expert consultation booking
- [ ] IoT sensor integration
- [ ] Crop disease detection (image analysis)
- [ ] Automated farm monitoring
- [ ] Marketplace integration

---

**Built with ❤️ for Indian Farmers**

*Empowering agriculture through technology*

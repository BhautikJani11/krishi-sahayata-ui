from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.settings import Settings, get_settings
from .routers import health, schemes, tips, weather, chatbot
from .core.errors import register_exception_handlers

app = FastAPI(title="Farmer Assistant API", version="0.1.0")

settings: Settings = get_settings()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router, prefix="/api")
app.include_router(schemes.router, prefix="/api")
app.include_router(tips.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(chatbot.router, prefix="/api")

# Errors
register_exception_handlers(app)

@app.get("/")
def root():
    return {"ok": True, "name": app.title, "version": app.version}

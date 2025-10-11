"""
API v1 router.
"""
from fastapi import APIRouter
from .endpoints import chat, weather, schemes, tips

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather"])
api_router.include_router(schemes.router, prefix="/schemes", tags=["Schemes"])
api_router.include_router(tips.router, prefix="/tips", tags=["Tips"])

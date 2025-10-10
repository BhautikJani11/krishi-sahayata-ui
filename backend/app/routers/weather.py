from fastapi import APIRouter, Query, Depends
from pydantic import BaseModel
from typing import List, Optional
from ..services.weather_service import WeatherService
from ..core.settings import get_settings, Settings

router = APIRouter(prefix="/weather", tags=["weather"])

class WeatherAlert(BaseModel):
    severity: str
    message: str
    icon: Optional[str] = None

class WeatherResponse(BaseModel):
    alerts: List[WeatherAlert]
    source: str

@router.get("/alerts", response_model=WeatherResponse)
async def weather_alerts(
    lat: Optional[float] = Query(default=None),
    lon: Optional[float] = Query(default=None),
    settings: Settings = Depends(get_settings),
):
    service = WeatherService(api_key=settings.openweather_api_key)
    alerts, source = await service.get_alerts(lat=lat, lon=lon)
    return {"alerts": alerts, "source": source}

from __future__ import annotations
from typing import List, Dict, Optional, Tuple
import aiohttp
import asyncio

DEFAULT_ALERTS = {
    "en": [
        {"severity": "high", "message": "Heavy rainfall expected in next 48 hours"},
        {"severity": "medium", "message": "Strong winds warning for tomorrow"},
        {"severity": "low", "message": "Sunny weather for next 5 days"},
    ]
}

class WeatherService:
    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key

    async def get_alerts(self, lat: Optional[float] = None, lon: Optional[float] = None) -> Tuple[List[Dict[str, str]], str]:
        if not self.api_key:
            return DEFAULT_ALERTS["en"], "static"
        try:
            params = {"lat": lat or 28.6139, "lon": lon or 77.2090, "appid": self.api_key, "units": "metric"}
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=7)) as session:
                async with session.get("https://api.openweathermap.org/data/2.5/weather", params=params) as resp:
                    data = await resp.json()
                    alerts: List[Dict[str, str]] = []
                    description = data.get("weather", [{}])[0].get("description", "")
                    if "rain" in description:
                        alerts.append({"severity": "high", "message": "Heavy rain likely today"})
                    elif "wind" in description:
                        alerts.append({"severity": "medium", "message": "Strong winds expected"})
                    else:
                        alerts.append({"severity": "low", "message": "Clear or mild weather"})
                    return alerts, "openweather"
        except Exception:
            return DEFAULT_ALERTS["en"], "fallback"

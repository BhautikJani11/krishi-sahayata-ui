from __future__ import annotations
from typing import List, Dict, Literal

class ChatbotService:
    def __init__(self, provider: str = "mock") -> None:
        self.provider = provider

    async def respond(self, messages: List[Dict[str, str]], language: str | None = "en") -> Dict[str, str | None]:
        # Simple rule-based fallback; integrate real LLM provider later
        last_user = next((m for m in reversed(messages) if m.get("role") == "user"), None)
        user_text = (last_user or {}).get("content", "")
        if not user_text:
            return {"code": None, "message": "Hello! Ask me about crops, weather, schemes, or pests."}

        lower = user_text.lower()
        if any(k in lower for k in ["weather", "rain", "temperature"]):
            return {"code": None, "message": "Weather looks clear in most regions. Check alerts for details."}
        if any(k in lower for k in ["scheme", "subsidy", "pm-kisan", "bima"]):
            return {"code": None, "message": "You can explore PM-KISAN, Soil Health Card, and Crop Insurance schemes."}
        if any(k in lower for k in ["pest", "insect", "worm"]):
            return {"code": None, "message": "Use integrated pest management: crop rotation, traps, and bio-pesticides."}

        return {"code": None, "message": "I recommend soil testing and proper irrigation for better yields."}

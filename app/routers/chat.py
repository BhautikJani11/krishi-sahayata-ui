from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal, Optional
import os
import httpx
from app.core.config import get_settings

router = APIRouter()

Role = Literal["user", "assistant", "system"]

class Message(BaseModel):
    role: Role
    content: str

class ConversationCreate(BaseModel):
    user_id: str
    title: Optional[str] = None

class ChatRequest(BaseModel):
    conversation_id: str
    messages: List[Message]

class ChatResponse(BaseModel):
    message: str
    conversation_id: str

FARMING_SYSTEM_PROMPT = (
    "You are an expert agricultural advisor specializing in Indian farming practices. "
    "Provide practical, actionable advice; consider region, soil, water; include timing and schemes; support farmers."
)

settings = get_settings()
AI_API_URL = settings.lovable_ai_url
AI_API_KEY = settings.lovable_api_key or ""


@router.post("/conversations", response_model=dict)
async def create_conversation(payload: ConversationCreate):
    # In-memory placeholder: in production, persist in DB
    return {"id": f"conv_{os.urandom(6).hex()}", "user_id": payload.user_id, "title": payload.title or "Farming Chat"}


@router.post("/completions", response_model=ChatResponse)
async def create_completion(body: ChatRequest):
    if not body.messages:
        raise HTTPException(status_code=400, detail="messages is required")
    if not AI_API_KEY:
        raise HTTPException(status_code=503, detail="AI_UNAVAILABLE")

    messages_payload = [{"role": "system", "content": FARMING_SYSTEM_PROMPT}] + [m.model_dump() for m in body.messages]

    headers = {"Authorization": f"Bearer {AI_API_KEY}", "Content-Type": "application/json"}

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                AI_API_URL,
                headers=headers,
                json={
                    "model": "google/gemini-2.5-flash",
                    "messages": messages_payload,
                    "temperature": 0.7,
                    "max_tokens": 800,
                },
            )
        if resp.status_code == 429:
            raise HTTPException(status_code=429, detail="RATE_LIMIT")
        if resp.status_code == 402:
            raise HTTPException(status_code=402, detail="NO_CREDITS")
        resp.raise_for_status()
        data = resp.json()
        content = (data.get("choices") or [{}])[0].get("message", {}).get("content")
        if not content:
            raise HTTPException(status_code=500, detail="No response from AI model")
        return ChatResponse(message=content, conversation_id=body.conversation_id)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"AI gateway error: {e.response.status_code}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

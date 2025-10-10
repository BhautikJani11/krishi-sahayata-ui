from fastapi import APIRouter, Body, Depends
from pydantic import BaseModel
from typing import List, Literal
from ..services.chatbot_service import ChatbotService
from ..core.settings import Settings, get_settings

router = APIRouter(prefix="/chat", tags=["chat"])

class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    conversationId: str | None = None
    language: str | None = "en"

class ChatResponse(BaseModel):
    code: str | None = None
    message: str

@router.post("/", response_model=ChatResponse)
async def chat(
    payload: ChatRequest = Body(...),
    settings: Settings = Depends(get_settings),
):
    service = ChatbotService(provider=settings.model_provider)
    result = await service.respond(payload.messages, language=payload.language)
    return result

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from ..services.tips_service import TipsService

router = APIRouter(prefix="/tips", tags=["tips"])
service = TipsService()

class Tip(BaseModel):
    title: str
    description: str
    category: str

class TipsResponse(BaseModel):
    items: List[Tip]
    total: int

@router.get("/", response_model=TipsResponse)
async def list_tips(category: Optional[str] = Query(default=None), q: Optional[str] = None, lang: Optional[str] = None):
    items = service.search(category=category, q=q, lang=lang)
    return {"items": items, "total": len(items)}

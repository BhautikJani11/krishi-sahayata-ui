from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from ..services.schemes_service import SchemesService

router = APIRouter(prefix="/schemes", tags=["schemes"])
service = SchemesService()

class Scheme(BaseModel):
    name: str
    description: str
    url: Optional[str] = None

class SchemesResponse(BaseModel):
    items: List[Scheme]
    total: int

@router.get("/", response_model=SchemesResponse)
async def list_schemes(q: Optional[str] = Query(default=None, description="Search query"), lang: Optional[str] = None):
    items = service.search(q=q, lang=lang)
    return {"items": items, "total": len(items)}

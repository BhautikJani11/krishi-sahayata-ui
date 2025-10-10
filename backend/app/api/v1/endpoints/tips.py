"""
Farming tips API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID

from ....db.base import get_db
from ....models.tip import Tip
from ....schemas.tip import TipCreate, TipUpdate, TipResponse
from ....core.logging import log

router = APIRouter()


@router.get("/", response_model=List[TipResponse])
async def get_tips(
    language: str = Query(default="en", description="Language code"),
    category: Optional[str] = Query(None, description="Filter by category"),
    season: Optional[str] = Query(None, description="Filter by season"),
    active_only: bool = Query(True, description="Show only active tips"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all farming tips.
    
    - Filter by language, category, season, and active status
    - Returns tips ordered by priority
    """
    try:
        query = select(Tip)
        
        if active_only:
            query = query.where(Tip.is_active == True)
        
        if category:
            query = query.where(Tip.category == category)
        
        if season:
            query = query.where((Tip.season == season) | (Tip.season == "all"))
        
        query = query.order_by(Tip.priority.desc(), Tip.created_at.desc())
        
        result = await db.execute(query)
        tips = result.scalars().all()
        
        log.info(f"Fetched {len(tips)} tips (language: {language})")
        return tips
        
    except Exception as e:
        log.error(f"Error fetching tips: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch tips: {str(e)}"
        )


@router.get("/{tip_id}", response_model=TipResponse)
async def get_tip(
    tip_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific tip by ID."""
    try:
        result = await db.execute(
            select(Tip).where(Tip.id == tip_id)
        )
        tip = result.scalar_one_or_none()
        
        if not tip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tip not found"
            )
        
        return tip
        
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error fetching tip: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch tip: {str(e)}"
        )


@router.post("/", response_model=TipResponse, status_code=status.HTTP_201_CREATED)
async def create_tip(
    tip: TipCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new farming tip."""
    try:
        new_tip = Tip(**tip.dict())
        db.add(new_tip)
        await db.commit()
        await db.refresh(new_tip)
        
        log.info(f"Created tip {new_tip.id}: {new_tip.title_en}")
        return new_tip
        
    except Exception as e:
        log.error(f"Error creating tip: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create tip: {str(e)}"
        )


@router.patch("/{tip_id}", response_model=TipResponse)
async def update_tip(
    tip_id: UUID,
    tip_update: TipUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an existing tip."""
    try:
        result = await db.execute(
            select(Tip).where(Tip.id == tip_id)
        )
        tip = result.scalar_one_or_none()
        
        if not tip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tip not found"
            )
        
        # Update fields
        update_data = tip_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(tip, field, value)
        
        await db.commit()
        await db.refresh(tip)
        
        log.info(f"Updated tip {tip_id}")
        return tip
        
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error updating tip: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update tip: {str(e)}"
        )


@router.delete("/{tip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tip(
    tip_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a tip."""
    try:
        result = await db.execute(
            select(Tip).where(Tip.id == tip_id)
        )
        tip = result.scalar_one_or_none()
        
        if not tip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tip not found"
            )
        
        await db.delete(tip)
        await db.commit()
        
        log.info(f"Deleted tip {tip_id}")
        
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error deleting tip: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete tip: {str(e)}"
        )

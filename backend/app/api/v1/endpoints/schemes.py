"""
Government schemes API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID

from ....db.base import get_db
from ....models.scheme import Scheme
from ....schemas.scheme import SchemeCreate, SchemeUpdate, SchemeResponse
from ....core.logging import log

router = APIRouter()


@router.get("/", response_model=List[SchemeResponse])
async def get_schemes(
    language: str = Query(default="en", description="Language code"),
    category: Optional[str] = Query(None, description="Filter by category"),
    active_only: bool = Query(True, description="Show only active schemes"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all government schemes.
    
    - Filter by language, category, and active status
    - Returns schemes ordered by priority
    """
    try:
        query = select(Scheme)
        
        if active_only:
            query = query.where(Scheme.is_active == True)
        
        if category:
            query = query.where(Scheme.category == category)
        
        query = query.order_by(Scheme.priority.desc(), Scheme.created_at.desc())
        
        result = await db.execute(query)
        schemes = result.scalars().all()
        
        log.info(f"Fetched {len(schemes)} schemes (language: {language})")
        return schemes
        
    except Exception as e:
        log.error(f"Error fetching schemes: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch schemes: {str(e)}"
        )


@router.get("/{scheme_id}", response_model=SchemeResponse)
async def get_scheme(
    scheme_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific scheme by ID."""
    try:
        result = await db.execute(
            select(Scheme).where(Scheme.id == scheme_id)
        )
        scheme = result.scalar_one_or_none()
        
        if not scheme:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scheme not found"
            )
        
        return scheme
        
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error fetching scheme: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch scheme: {str(e)}"
        )


@router.post("/", response_model=SchemeResponse, status_code=status.HTTP_201_CREATED)
async def create_scheme(
    scheme: SchemeCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new government scheme."""
    try:
        new_scheme = Scheme(**scheme.dict())
        db.add(new_scheme)
        await db.commit()
        await db.refresh(new_scheme)
        
        log.info(f"Created scheme {new_scheme.id}: {new_scheme.name_en}")
        return new_scheme
        
    except Exception as e:
        log.error(f"Error creating scheme: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create scheme: {str(e)}"
        )


@router.patch("/{scheme_id}", response_model=SchemeResponse)
async def update_scheme(
    scheme_id: UUID,
    scheme_update: SchemeUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an existing scheme."""
    try:
        result = await db.execute(
            select(Scheme).where(Scheme.id == scheme_id)
        )
        scheme = result.scalar_one_or_none()
        
        if not scheme:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scheme not found"
            )
        
        # Update fields
        update_data = scheme_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(scheme, field, value)
        
        await db.commit()
        await db.refresh(scheme)
        
        log.info(f"Updated scheme {scheme_id}")
        return scheme
        
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error updating scheme: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update scheme: {str(e)}"
        )


@router.delete("/{scheme_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_scheme(
    scheme_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a scheme."""
    try:
        result = await db.execute(
            select(Scheme).where(Scheme.id == scheme_id)
        )
        scheme = result.scalar_one_or_none()
        
        if not scheme:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scheme not found"
            )
        
        await db.delete(scheme)
        await db.commit()
        
        log.info(f"Deleted scheme {scheme_id}")
        
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error deleting scheme: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete scheme: {str(e)}"
        )

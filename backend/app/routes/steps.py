"""Steps routes: fetch step data and AI insights."""

import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.user import User
from app.services.google_fit import fetch_steps, compute_insights
from app.utils.auth import get_current_user_id

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/steps", tags=["steps"])
settings = get_settings()


@router.get("")
async def get_steps(
    request: Request,
    year: int = Query(default=None, ge=2015, le=2030),
    month: int = Query(default=None, ge=1, le=12),
    db: Session = Depends(get_db),
):
    """
    Fetch step count data for the authenticated user.
    Filters by year (required) and optional month.
    Returns daily step data and computed insights.
    """
    user_id = get_current_user_id(request)
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Default to current year if not specified
    if year is None:
        year = datetime.now().year

    try:
        steps_data = await fetch_steps(
            access_token=user.access_token,
            year=year,
            month=month,
        )
    except Exception as e:
        logger.error("Google Fit fetch failed: %s", e, exc_info=True)
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch data from Google Fit: {str(e)}",
        )

    insights = compute_insights(steps_data)

    return {
        "year": year,
        "month": month,
        "steps": steps_data,
        "metrics": {
            "total_steps": insights["total_steps"],
            "average_steps": insights["average_steps"],
            "active_days": insights["active_days"],
            "total_days": insights.get("total_days", 0),
            "consistency_score": insights.get("consistency_score", 0),
        },
        "insights": insights["insights"],
    }

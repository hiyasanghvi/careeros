# app/tracker/tracker.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from pydantic import BaseModel, ConfigDict

from app.db import get_db
from app.models import UserOpportunity, Opportunity

tracker_router = APIRouter(prefix="/tracker", tags=["Tracker"])

# -------------------- #
# Pydantic Schemas
# -------------------- #

class TrackerCreate(BaseModel):
    user_id: int
    opportunity_id: int
    status: str = "interested"  # interested, applied, shortlisted
    resume_version: Optional[str] = None
    notes: Optional[str] = None
    followup_date: Optional[str] = None


class OpportunityMini(BaseModel):
    id: int
    title: str
    org: str
    type: str
    domain: str
    location: str

    model_config = ConfigDict(from_attributes=True)


class TrackerOut(BaseModel):
    id: int
    user_id: int
    opportunity_id: int
    status: str

    resume_version: Optional[str] = None
    notes: Optional[str] = None
    followup_date: Optional[str] = None

    opportunity: OpportunityMini

    model_config = ConfigDict(from_attributes=True)


# -------------------- #
# Routes
# -------------------- #

@tracker_router.post("/", response_model=TrackerOut)
def create_tracker(entry: TrackerCreate, db: Session = Depends(get_db)):
    existing = db.query(UserOpportunity).filter(
        UserOpportunity.user_id == entry.user_id,
        UserOpportunity.opportunity_id == entry.opportunity_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Tracker entry already exists")

    tracker = UserOpportunity(**entry.model_dump())
    db.add(tracker)
    db.commit()

    # 🔥 IMPORTANT: reload with JOIN
    tracker = (
        db.query(UserOpportunity)
        .options(joinedload(UserOpportunity.opportunity))
        .filter(UserOpportunity.id == tracker.id)
        .first()
    )

    return tracker



@tracker_router.get("/user/{user_id}", response_model=List[TrackerOut])
def get_user_tracker(user_id: int, db: Session = Depends(get_db)):
    entries = (
        db.query(UserOpportunity)
        .options(joinedload(UserOpportunity.opportunity))
        .filter(UserOpportunity.user_id == user_id)
        .all()
    )
    return entries


@tracker_router.put("/{tracker_id}", response_model=TrackerOut)
def update_tracker(tracker_id: int, updated: TrackerCreate, db: Session = Depends(get_db)):
    tracker = db.query(UserOpportunity).filter(UserOpportunity.id == tracker_id).first()

    if not tracker:
        raise HTTPException(status_code=404, detail="Tracker entry not found")

    for key, value in updated.model_dump().items():
        setattr(tracker, key, value)

    db.commit()
    db.refresh(tracker)
    return tracker


@tracker_router.delete("/{tracker_id}")
def delete_tracker(tracker_id: int, db: Session = Depends(get_db)):
    tracker = db.query(UserOpportunity).filter(UserOpportunity.id == tracker_id).first()

    if not tracker:
        raise HTTPException(status_code=404, detail="Tracker entry not found")

    db.delete(tracker)
    db.commit()
    return {"message": "Tracker entry deleted successfully"}

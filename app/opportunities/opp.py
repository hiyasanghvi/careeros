# app/opportunities/opp.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db import get_db
from app.models import Opportunity, UserOpportunity
from pydantic import BaseModel

opp_router = APIRouter()

# Input schema
class OpportunityCreate(BaseModel):
    title: str
    org: str
    type: str
    domain: str
    location: str
    stipend: str
    duration: str
    required_skills: str
    eligibility: str
    description: str
    deadline: str
    apply_link: str
    verified: bool = False

# Output schema (Pydantic v2)
class OpportunityOut(BaseModel):
    id: int
    title: str
    org: str
    type: str
    domain: str
    location: str
    stipend: str
    duration: str
    required_skills: str
    eligibility: str
    description: str
    deadline: str
    apply_link: str
    verified: bool

    model_config = {
        "from_attributes": True
    }

# Create opportunity
@opp_router.post("/", response_model=OpportunityOut)
def create_opportunity(opp: OpportunityCreate, db: Session = Depends(get_db)):
    db_opp = Opportunity(**opp.dict())
    db.add(db_opp)
    db.commit()
    db.refresh(db_opp)
    return db_opp

# List / Filter opportunities
@opp_router.get("/", response_model=List[OpportunityOut])
def list_opportunities(
    q: Optional[str] = None,
    type: Optional[str] = None,
    domain: Optional[str] = None,
    location: Optional[str] = None,
    skill: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Opportunity)

    if q:
        query = query.filter(
            Opportunity.title.ilike(f"%{q}%") |
            Opportunity.org.ilike(f"%{q}%")
        )
    if type:
        query = query.filter(Opportunity.type == type)
    if domain:
        query = query.filter(Opportunity.domain == domain)
    if location:
        query = query.filter(Opportunity.location == location)
    if skill:
        query = query.filter(Opportunity.required_skills.ilike(f"%{skill}%"))

    return query.order_by(Opportunity.id.desc()).all()

# Apply to opportunity
@opp_router.post("/{opp_id}/apply")
def apply_opportunity(opp_id: int, user_id: int, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    existing = db.query(UserOpportunity).filter_by(user_id=user_id, opportunity_id=opp_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied")

    apply = UserOpportunity(user_id=user_id, opportunity_id=opp_id)
    db.add(apply)
    db.commit()
    return {"message": "Applied successfully"}

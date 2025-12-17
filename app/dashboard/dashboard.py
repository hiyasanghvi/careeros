# app/dashboard/dashboard.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import UserOpportunity, Opportunity, User
from typing import Dict

dashboard_router = APIRouter()

@dashboard_router.get("/metrics")
def get_dashboard_metrics(user_id: int = None, db: Session = Depends(get_db)) -> Dict:
    """
    Returns dashboard metrics:
    - total applications
    - status counts (applied, shortlisted, accepted, rejected)
    - domain-wise application count
    """

    query = db.query(UserOpportunity)
    if user_id:
        query = query.filter(UserOpportunity.user_id == user_id)
    tracker_entries = query.all()

    metrics = {
        "total_applications": len(tracker_entries),
        "status_counts": {},
        "domain_counts": {},
    }

    for entry in tracker_entries:
        # Status count
        status = entry.status
        metrics["status_counts"][status] = metrics["status_counts"].get(status, 0) + 1

        # Domain count
        opp = db.query(Opportunity).filter(Opportunity.id == entry.opportunity_id).first()
        if opp:
            domain = opp.domain
            metrics["domain_counts"][domain] = metrics["domain_counts"].get(domain, 0) + 1

    return metrics

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User, Opportunity, UserOpportunity
import re

recommend_router = APIRouter()

def tokenize(text: str):
    return set(re.findall(r"\w+", text.lower()))

@recommend_router.get("/chat")
def smart_recommend(
    user_id: int = Query(...),
    message: str = Query(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    intent_tokens = tokenize(message)

    opportunities = db.query(Opportunity).filter(
        Opportunity.verified == True
    ).all()

    scored = []

    for opp in opportunities:
        score = 0

        # 1️⃣ Message ↔ Opportunity text similarity
        opp_text = f"{opp.title} {opp.domain} {opp.description or ''} {opp.required_skills or ''}"
        opp_tokens = tokenize(opp_text)
        score += len(intent_tokens & opp_tokens) * 3

        # 2️⃣ Match with user's past interests
        past = db.query(UserOpportunity).join(Opportunity).filter(
            UserOpportunity.user_id == user.id,
            Opportunity.domain == opp.domain
        ).count()
        score += past * 2

        # 3️⃣ College boost (same city / generic heuristic)
        if user.college and opp.location:
            if user.college.lower() in opp.location.lower():
                score += 1

        scored.append((opp, score))

    scored.sort(key=lambda x: x[1], reverse=True)

    top = scored[:5]

    return [
        {
            "title": o.title,
            "org": o.org,
            "domain": o.domain,
            "reason": "Recommended based on your interest and activity"
        }
        for o, _ in top
    ]

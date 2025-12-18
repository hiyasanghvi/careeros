from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os                     # <- important!
from app.seed_opps import seed_opportunities
from app.db import Base, engine
from app.models import *

from app.auth.auth import auth_router
from app.opportunities.opp import opp_router
from app.tracker.tracker import tracker_router
from app.dashboard.dashboard import dashboard_router
from app.recommendations.recommend import recommend_router

app = FastAPI(title="CareerOS API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://carrer-os.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CREATE TABLES
Base.metadata.create_all(bind=engine)

# ROUTERS
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(opp_router, prefix="/opportunities", tags=["Opportunities"])
app.include_router(tracker_router, prefix="/tracker", tags=["Tracker"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(recommend_router, prefix="/recommend", tags=["Recommendations"])

# STARTUP EVENT
@app.on_event("startup")
def startup_event():
    # Only seed if env variable SEED_DB=true (default true)
    if os.getenv("SEED_DB", "true") == "true":
        seed_opportunities()

@app.get("/")
def home():
    return {"message": "CareerOS API running"}

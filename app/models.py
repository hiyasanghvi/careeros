from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    college = Column(String)       # <--- make sure this exists
    year = Column(String) 
    applied_opps = relationship("UserOpportunity", back_populates="user")
    

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    org = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Internship / Job
    domain = Column(String, nullable=False)
    location = Column(String, nullable=False)
    stipend = Column(String)
    duration = Column(String)
    required_skills = Column(String)
    eligibility = Column(String)
    description = Column(Text)
    deadline = Column(String)
    apply_link = Column(String)
    verified = Column(Boolean, default=False)

    applicants = relationship("UserOpportunity", back_populates="opportunity")


class UserOpportunity(Base):
    __tablename__ = "user_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"))
    status = Column(String, default="interested")
    resume_version = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    followup_date = Column(String, nullable=True)
    user = relationship("User", back_populates="applied_opps")
    opportunity = relationship("Opportunity", back_populates="applicants")

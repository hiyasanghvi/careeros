# app/seed_opps.py
from app.db import get_db
from app.models import Opportunity
import random

def seed_opportunities():
    # Define all lists inside the function
    titles = [
        "Software Engineer Intern", "Data Analyst Intern", "AI/ML Hackathon Participant",
        "Frontend Developer", "Backend Developer", "Product Manager"
    ]
    orgs = ["Google", "Microsoft", "Amazon", "StartupX", "InnovateTech", "TechCorp"]
    types = ["Internship", "Job", "Hackathon"]
    domains = ["AI/ML", "Web", "Data", "Core"]
    locations = ["Remote", "Bangalore", "Mumbai", "Hyderabad", "Pune", "Delhi"]
    skills_pool = {
        "AI/ML": ["Python", "TensorFlow", "PyTorch", "Data Analysis", "Machine Learning"],
        "Web": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        "Data": ["SQL", "Excel", "Data Visualization", "Python", "R"],
        "Core": ["C++", "Java", "Problem Solving", "Algorithms", "DSA"]
    }

    db = next(get_db())
    
    # Skip if already seeded
    if db.query(Opportunity).count() > 200:
        print("Opportunities already exist. Skipping seeding.")
        return

    for i in range(200):
        domain = random.choice(domains)
        opp_type = random.choice(types)
        opp = Opportunity(
            title=random.choice(titles),
            org=random.choice(orgs),
            type=opp_type,
            domain=domain,
            location=random.choice(locations),
            stipend=f"{random.randint(5000,50000)} INR" if opp_type != "Hackathon" else "0",
            duration=f"{random.randint(1,6)} months" if opp_type != "Hackathon" else "1-2 days",
            required_skills=", ".join(random.sample(skills_pool[domain], 2)),
            eligibility="Open to all students",
            description=f"A {opp_type.lower()} in {domain} domain for skill development.",
            deadline="2025-12-31",
            apply_link="https://www.google.com",
            verified=random.choice([True, False])
        )
        db.add(opp)

    db.commit()
    print("Seeded 200 opportunities successfully!")

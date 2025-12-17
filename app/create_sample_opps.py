# create_sample_opps.py
import requests
import random

BASE_URL = "http://127.0.0.1:8000/opportunities/"

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

def populate_sample_opportunities():
    for i in range(200):
        domain = random.choice(domains)
        opp_type = random.choice(types)
        opp = {
            "title": random.choice(titles),
            "org": random.choice(orgs),
            "type": opp_type,
            "domain": domain,
            "location": random.choice(locations),
            "stipend": f"{random.randint(5000, 50000)} INR" if opp_type != "Hackathon" else "0",
            "duration": f"{random.randint(1,6)} months" if opp_type != "Hackathon" else "1-2 days",
            "required_skills": ", ".join(random.sample(skills_pool[domain], 2)),
            "eligibility": "Open to all students",
            "description": f"A {opp_type.lower()} in {domain} domain for skill development.",
            "deadline": "2025-12-31",
            "apply_link": "https://www.google.com",
            "verified": random.choice([True, False])
        }

        try:
            res = requests.post(BASE_URL, json=opp)
            if res.status_code == 200:
                print(f"Created: {opp['title']} ({opp['type']}) in {opp['domain']}")
            else:
                print(f"Failed: {res.text}")
        except Exception as e:
            print(f"Error: {e}")

# Allow running standalone
if __name__ == "__main__":
    populate_sample_opportunities()

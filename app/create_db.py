# app/create_db.py
from app.db import engine, Base
from app import models

Base.metadata.create_all(bind=engine)
print("Database created successfully!")

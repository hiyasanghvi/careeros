# CareerOS - Full Stack Deployment Guide

CareerOS is a **career growth and tracking platform** with a **React/Next.js frontend** and a **FastAPI backend**. This README provides step-by-step instructions to configure, run, and deploy both frontend and backend.

---

## Table of Contents

1. [Project Structure](#project-structure)  
2. [Frontend Setup (Next.js)](#frontend-setup-nextjs)  
3. [Backend Setup (FastAPI)](#backend-setup-fastapi)  
4. [Environment Variables](#environment-variables)  
5. [API Calls in Frontend](#api-calls-in-frontend)  
6. [Running Locally](#running-locally)  
7. [Deploying Frontend](#deploying-frontend)  
8. [Deploying Backend](#deploying-backend)  


---

## 1. Project Structure

careeros/
<br>│
<br>├─ frontend/ # Next.js frontend
<br>│ ├─ pages/
<br>│ │ ├─ auth/
<br>│ │ │ ├─ LoginPage.tsx
<br>│ │ │ └─ RegisterPage.tsx
<br>│ │ ├─ DashboardPage.tsx
<br>│ │ ├─ OpportunitiesPage.tsx
<br>│ │ ├─ TrackerPage.tsx
<br>│ │ └─ RecommendationsPage.tsx
<br>│ ├─ components/
<br>│ ├─ public/
<br>│ ├─ styles/
<br>│ └─ .env.local
<br>│
<br>├─ backend/ # FastAPI backend
<br>│ ├─ app/
<br>│ │ ├─ main.py
<br>│ │ ├─ auth.py
<br>│ │ ├─ opportunities.py
<br>│ │ ├─ tracker.py
<br>│ │ └─ recommend.py
<br>│ └─ requirements.txt
<br>└─ README.md

---

## 2. Frontend Setup (Next.js)

1. Navigate to the frontend folder:
<br>cd frontend

2. Install dependencies:
<br>npm install

3. Create `.env.local` and add:
<br>NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000

4. Run development server:
<br>npm run dev

5. Frontend will run at `http://localhost:3000`

---

## 3. Backend Setup (FastAPI)

1. Navigate to the backend folder:
<br>cd backend

2. Create a virtual environment:
<br>python -m venv venv

3. Activate virtual environment:
<br>Windows: `venv\Scripts\activate`  
<br>Linux/Mac: `source venv/bin/activate`

4. Install requirements:
<br>pip install -r requirements.txt

5. Run FastAPI server:
<br>uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

6. Backend will run at `http://127.0.0.1:8000`

---

## 4. Environment Variables

**Frontend (`.env.local`)**  

`NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000`
`# Add any required backend secrets or database URLs here`
`DATABASE_URL=sqlite:///./db.sqlite3`
`SECRET_KEY=your_secret_key`

## 5. API Calls in Frontend
<br>eplace all hardcoded backend URLs with process.env.NEXT_PUBLIC_BACKEND_URL:
`const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
});
`

## 6. Running Locally
<br>Start backend first:
<br>cd backend
<br>uvicorn app.main:app --reload

Start frontend:
<br>cd frontend
<br>npm run dev

Open in browser:
<br>http://localhost:3000

## 7. Deploying Frontend
<br>Push frontend repo to GitHub.
<br>Deploy on Vercel:
<br>Connect GitHub repo
<br>Set NEXT_PUBLIC_BACKEND_URL to deployed backend URL
<br>Vercel will automatically build and deploy

## 8. Deploying Backend

<br>Push backend repo to GitHub.
<br>Deploy on Railway, Render, or Heroku:
<br>Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
<br>Add environment variables
<br>Ensure CORS allows frontend domain



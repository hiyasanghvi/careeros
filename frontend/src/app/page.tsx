"use client";

import Link from "next/link";
import "./page.css";

export default function HomePage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="title">Welcome to <span className="highlight">CareerOS</span></h1>
        <p className="subtitle">
          Your ultimate platform to explore career opportunities, track progress, and get smart recommendations. 
          Empower your career journey, one step at a time!
        </p>
        <div className="buttons">
          <Link href="/auth/login">
            <button className="btn login-btn">Login</button>
          </Link>
          <Link href="/auth/register">
            <button className="btn register-btn">Register</button>
          </Link>
        </div>
      </div>
      <div className="animation-container">
        <div className="circle"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>
    </div>
  );
}

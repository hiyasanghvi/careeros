"use client";

import { useState } from "react";
import "../auth.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    year: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful! You can now login.");
        setForm({ name: "", email: "", password: "", college: "", year: "" });
      } else {
        setMessage(data.detail || "Registration failed");
      }
    } catch (err) {
      setMessage("Error connecting to server");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="college"
            placeholder="College"
            value={form.college}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="year"
            placeholder="Graduation Year"
            value={form.year}
            onChange={handleChange}
            required
          />
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
        {message && <p style={{ marginTop: "10px", color: "red" }}>{message}</p>}
        <div className="auth-links">
          Already have an account? <a href="/auth/login">Login</a>
        </div>
      </div>

      <div className="circle"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>
    </div>
  );
}

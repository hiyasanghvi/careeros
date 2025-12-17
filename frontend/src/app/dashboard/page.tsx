"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css";

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, newTask]);
    setNewTask("");
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>🎯 Welcome to CareerOS</h1>
        <p>Your personal career growth dashboard</p>
      </header>

      {/* Metrics */}
      <section className="metrics">
        <div className="metric-card">
          <h3>📈 Progress</h3>
          <p className="metric-number">65%</p>
        </div>
        <div className="metric-card">
          <h3>🚀 Opportunities</h3>
          <p className="metric-number">12</p>
        </div>
        <div className="metric-card">
          <h3>✅ Tasks</h3>
          <p className="metric-number">{tasks.length}</p>
        </div>
      </section>

      {/* To-do */}
      <section className="todo-section">
        <h2>📝 Your To-Do List</h2>

        <div className="todo-input">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul className="todo-list">
          {tasks.map((task, index) => (
            <li key={index}>
              {task}
              <button onClick={() => removeTask(index)}>✕</button>
            </li>
          ))}
        </ul>
      </section>

      {/* API Actions */}
      <section className="api-section">
        <h2>⚙️ Career Actions</h2>

        <div className="api-grid">
          <div className="api-card">
            <h4>📌 Opportunities</h4>
            <p>View & manage career opportunities</p>
            <button onClick={() => router.push("/opportunities")}>
              Go
            </button>
          </div>

          <div className="api-card">
            <h4>📊 Tracker</h4>
            <p>Track applications & progress</p>
             <button onClick={() => router.push("/tracker")}>
              Go
            </button>
          </div>

          <div className="api-card">
            <h4>📈 Dashboard Metrics</h4>
            <p>View career analytics</p>
            <button onClick={() => router.push("/metrics")}>
              Go
            </button>
          </div>

          <div className="api-card">
            <h4>🤖 Recommendations</h4>
            <p>AI-based career suggestions</p>
            <button onClick={() => router.push("/recommendations")}>
              Go
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

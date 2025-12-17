"use client";

import { useEffect, useState } from "react";
import "./tracker.css";

interface TrackerItem {
  id: number;
  opportunity_id: number;
  status: string;
  resume_version?: string | null;
  notes?: string | null;
  followup_date?: string | null;
  opportunity?: {
    id: number;
    title: string;
    org: string;
    type: string;
    domain: string;
    location: string;
  };
}

export default function TrackerPage() {
  const userId = 1; // TEMP: replace with auth user id later
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/tracker/tracker/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load tracker", err);
        setItems([]);
        setLoading(false);
      });
  }, []); // keep empty, userId is constant

  const updateStatus = async (id: number, status: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    await fetch(`http://127.0.0.1:8000/tracker/tracker/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, status }),
    });

    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, status } : i))
    );
  };

  if (loading) return <p className="loading">Loading tracker...</p>;

  return (
    <div className="tracker-page">
      <h1>📌 Application Tracker</h1>

      {items.length === 0 && <p>No applications tracked yet.</p>}

      <table className="tracker-table">
        <thead>
          <tr>
            <th>Opportunity</th>
            <th>Status</th>
            <th>Resume</th>
            <th>Follow-up</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.opportunity?.title || item.opportunity_id}</td>
              <td>
                <select
                  value={item.status}
                  onChange={e => updateStatus(item.id, e.target.value)}
                >
                  <option value="interested">Interested</option>
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                </select>
              </td>
              <td>{item.resume_version || "-"}</td>
              <td>{item.followup_date || "-"}</td>
              <td>{item.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

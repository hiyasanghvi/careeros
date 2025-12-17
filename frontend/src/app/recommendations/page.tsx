"use client";
import { useState } from "react";
import "./recommendations.css";

interface Suggestion {
  title: string;
  org: string;
  domain: string;
}

export default function RecommendationsPage() {
  const userId = 1; // Replace with authenticated user ID
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/recommend/chat?user_id=${userId}&message=${encodeURIComponent(input)}`
      );

      if (!res.ok) throw new Error("Failed to fetch suggestions");
      const data = await res.json();
      setSuggestions(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="recommend-page">
      <h1>🤖 Career Recommendations</h1>

      <div className="chatbox">
        <input
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="Type your skills to find opportunities..."
/>

        <button onClick={handleSend} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="suggestions">
        {suggestions.length === 0 && !loading && (
          <p className="no-suggestions">No suggestions yet.</p>
        )}
        {suggestions.map((s, idx) => (
          <div key={idx} className="suggestion-card">
            <h4>{s.title}</h4>
            <p>
              <strong>Org:</strong> {s.org || "-"}
            </p>
            <p>
              <strong>Domain:</strong> {s.domain || "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

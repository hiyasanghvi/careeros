"use client";

import { useEffect, useState } from "react";
import OpportunityCard from "./OpportunityCard";
import OpportunityFilters from "./OpportunityFilters";
import "./opportunities.css";

export default function OpportunitiesPage() {
  const userId = 1; // TODO: replace with auth user id
  const [opps, setOpps] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState({
    type: "",
    domain: "",
    skill: "",
  });

  // Fetch opportunities
  useEffect(() => {
    const query = new URLSearchParams(filters as any).toString();
    fetch(`http://127.0.0.1:8000/opportunities/?${query}`)
      .then(res => res.json())
      .then(setOpps)
      .catch(console.error);
  }, [filters]);

  // Fetch applied opportunities from tracker
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/tracker/tracker/user/${userId}`)
      .then(res => res.json())
      .then(tracker => {
        const ids = new Set<number>(tracker.map((t: any) => t.opportunity_id));
        setAppliedIds(ids);
      })
      .catch(err => console.error("Failed to load tracker", err));
  }, []); // keep dependency empty since userId is constant

  // Apply handler
  const applyOpportunity = async (oppId: number) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/tracker/tracker/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        opportunity_id: oppId,
        status: "applied", // just a string
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.detail || "Already applied");
      return;
    }

    setAppliedIds(prev => {
      const next = new Set(prev);
      next.add(oppId);
      return next;
    });

    alert("Applied successfully!");
  } catch (err) {
    console.error(err);
    alert("Error applying to opportunity");
  }
};


  return (
    <div className="opportunities-page">
      <header className="opp-header">
        <h1>Explore Opportunities</h1>
        <p>Internships, jobs & programs from startups to MNCs</p>
      </header>

      <div className="opp-layout">
        <OpportunityFilters onChange={setFilters} />

        <div className="opp-list">
          {opps.length === 0 && <p>No opportunities found</p>}

          {opps.map(opp => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              applied={appliedIds.has(opp.id)}
              onApply={applyOpportunity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

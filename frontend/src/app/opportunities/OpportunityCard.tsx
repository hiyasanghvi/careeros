"use client";

interface OpportunityCardProps {
  opp: any;
  applied: boolean;
  onApply: (oppId: number) => void;
}

export default function OpportunityCard({ opp, applied, onApply }: OpportunityCardProps) {
  return (
    <div className="opp-card">
      <div>
        <h4>{opp.title}</h4>
        <p><strong>Org:</strong> {opp.org}</p>
        <p><strong>Type:</strong> {opp.type}</p>
        <p><strong>Domain:</strong> {opp.domain}</p>
        <p><strong>Skills:</strong> {opp.required_skills}</p>
        <p><strong>Location:</strong> {opp.location}</p>
        <p><strong>Stipend:</strong> {opp.stipend}</p>
      </div>

      <button
        className={`apply-btn ${applied ? "applied" : ""}`}
        onClick={() => onApply(opp.id)} // only pass opp.id, NOT event
        disabled={applied}
      >
        {applied ? "Applied" : "Apply"}
      </button>
    </div>
  );
}

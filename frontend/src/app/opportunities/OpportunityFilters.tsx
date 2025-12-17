"use client";
import React from "react";

interface Props {
  onChange: (filters: any) => void;
}

export default function OpportunityFilters({ onChange }: Props) {
  const [filters, setFilters] = React.useState({
    type: "",
    domain: "",
    skill: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onChange(newFilters);
  };

  return (
    <div className="opp-filters">
      <h3>Filter Opportunities</h3>

      <label>Type</label>
      <select name="type" value={filters.type} onChange={handleChange}>
        <option value="">All</option>
        <option value="Internship">Internship</option>
        <option value="Job">Job</option>
        <option value="Hackathon">Hackathon</option>
      </select>

      <label>Domain</label>
      <select name="domain" value={filters.domain} onChange={handleChange}>
        <option value="">All</option>
        <option value="AI/ML">AI/ML</option>
        <option value="Web">Web</option>
        <option value="Data">Data</option>
        <option value="Core">Core</option>
      </select>

      <label>Skills</label>
      <input
        type="text"
        name="skill"
        placeholder="e.g. Python, React"
        value={filters.skill}
        onChange={(e) => handleChange(e as any)}
      />
    </div>
  );
}

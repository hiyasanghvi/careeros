"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./metrics.css";

interface Metrics {
  total_opportunities: number;
  total_users: number;
  total_applied: number;
  total_shortlisted: number;
  opportunities_by_domain: Record<string, number>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FFF"];

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("http://127.0.0.1:8000/dashboard/metrics");
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load metrics");
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) return <p className="loading">Loading metrics...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!metrics) return <p className="error">No metrics available</p>;

  // Safely handle undefined/null opportunities_by_domain
  const pieData = metrics.opportunities_by_domain
    ? Object.entries(metrics.opportunities_by_domain).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  return (
    <div className="dashboard-metrics">
      <h1>📊 Dashboard Metrics</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Opportunities</h3>
          <p>{metrics.total_opportunities}</p>
        </div>
        <div className="metric-card">
          <h3>Total Users</h3>
          <p>{metrics.total_users}</p>
        </div>
        <div className="metric-card">
          <h3>Total Applied</h3>
          <p>{metrics.total_applied}</p>
        </div>
        <div className="metric-card">
          <h3>Total Shortlisted</h3>
          <p>{metrics.total_shortlisted}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Opportunities by Domain</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No domain data available</p>
          )}
        </div>

        <div className="chart-container">
          <h3>Applications by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { status: "Applied", count: metrics.total_applied },
                { status: "Shortlisted", count: metrics.total_shortlisted },
              ]}
            >
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

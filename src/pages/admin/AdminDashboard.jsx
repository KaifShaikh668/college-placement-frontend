import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load dashboard", error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalStudents = stats?.totalStudents ?? 0;
  const totalApplications = stats?.totalApplications ?? 0;
  const selectedCount = stats?.selectedCount ?? 0;
  const selectionRate = Number(stats?.selectionRate ?? 0);

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        {lastUpdated && (
          <span className="last-updated">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>{totalStudents}</h3>
          <p>Total Students</p>
        </div>

        <div className="kpi-card">
          <h3>{totalApplications}</h3>
          <p>Total Applications</p>
        </div>

        <div className="kpi-card">
          <h3>{selectedCount}</h3>
          <p>Selected</p>
        </div>

        <div className="kpi-card highlight">
          <h3>{selectionRate}%</h3>
          <p>Selection Rate</p>
        </div>
      </div>

      {/* Placement Funnel */}
      <div className="funnel-section">
        <h4>Placement Funnel</h4>
        <div className="funnel-row">
          <div className="funnel-box">
            <span>{totalStudents}</span>
            <p>Students</p>
          </div>

          <div className="arrow">→</div>

          <div className="funnel-box">
            <span>{totalApplications}</span>
            <p>Applications</p>
          </div>

          <div className="arrow">→</div>

          <div className="funnel-box selected-box">
            <span>{selectedCount}</span>
            <p>Selected</p>
          </div>
        </div>
      </div>

      {/* Placement Insights */}
      <div className="insights-section">
        <h4>Placement Insights</h4>

        <div className="insights-grid">

          <div className="insight-card">
            <p>Applications per Student</p>
            <h3>
              {totalStudents > 0
                ? (totalApplications / totalStudents).toFixed(2)
                : "0.00"}
            </h3>
          </div>

          <div className="insight-card">
            <p>Conversion Ratio</p>
            <h3>
              {totalApplications > 0
                ? (selectedCount / totalApplications).toFixed(2)
                : "0.00"}
            </h3>
          </div>

          <div className="insight-card">
            <p>Placement Health</p>
            <h3>
              {selectionRate >= 50
                ? "Excellent"
                : selectionRate >= 20
                ? "Good"
                : "Needs Improvement"}
            </h3>
          </div>

          <div className="insight-card">
            <p>Unselected Applications</p>
            <h3>
              {totalApplications - selectedCount}
            </h3>
          </div>

        </div>
      </div>

    </div>
  );
}

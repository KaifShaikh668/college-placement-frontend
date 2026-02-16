// -------------------- IMPORTS --------------------
import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
      setRecentStudents(res.data.recentStudents || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load admin stats", error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const selectionRate = stats?.selectionRate ?? 0;

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

      {/* ---------------- KPI CARDS ---------------- */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>{stats?.totalStudents ?? 0}</h3>
          <p>Total Students</p>
        </div>

        <div className="kpi-card">
          <h3>{stats?.totalApplications ?? 0}</h3>
          <p>Total Applications</p>
        </div>

        <div className="kpi-card">
          <h3>{stats?.selectedCount ?? 0}</h3>
          <p>Selected</p>
        </div>

        <div className="kpi-card highlight">
          <h3>{selectionRate}%</h3>
          <p>Selection Rate</p>
        </div>
      </div>

      {/* ---------------- PLACEMENT FUNNEL ---------------- */}
      <div className="funnel-section">
        <h4>Placement Funnel</h4>

        <div className="funnel-row">
          <div className="funnel-box">
            <span>{stats?.totalStudents ?? 0}</span>
            <p>Students</p>
          </div>

          <div className="arrow">→</div>

          <div className="funnel-box">
            <span>{stats?.totalApplications ?? 0}</span>
            <p>Applications</p>
          </div>

          <div className="arrow">→</div>

          <div className="funnel-box selected-box">
            <span>{stats?.selectedCount ?? 0}</span>
            <p>Selected</p>
          </div>
        </div>
      </div>

      {/* ---------------- QUICK ACTIONS ---------------- */}
      <div className="quick-actions">
        <h4>Quick Actions</h4>

        <div className="action-grid">
          <button onClick={() => navigate("/admin/students")}>
            Manage Students
          </button>

          <button onClick={() => navigate("/admin/drives")}>
            Manage Drives
          </button>

          <button onClick={() => navigate("/admin/applications")}>
            View Applications
          </button>

          <button onClick={() => navigate("/admin/notices")}>
            Send Notice
          </button>
        </div>
      </div>

    </div>
  );
}

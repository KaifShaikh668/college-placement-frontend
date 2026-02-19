// -------------------- IMPORTS --------------------
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
      {/* ---------------- HEADER ---------------- */}
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

      {/* ---------------- DEPARTMENT PERFORMANCE ---------------- */}
      <div className="department-section">
        <h4>Department Wise Placement Performance</h4>

        {!stats?.departmentPerformance ||
        stats.departmentPerformance.length === 0 ? (
          <p className="empty-text">No department data available.</p>
        ) : (
          <div className="department-grid">
            {stats.departmentPerformance.map((dept, index) => (
              <div key={index} className="department-card">
                <h5>{dept._id}</h5>

                <div className="dept-row">
                  <span>Total Students</span>
                  <strong>{dept.totalStudents ?? 0}</strong>
                </div>

                <div className="dept-row">
                  <span>Total Applications</span>
                  <strong>{dept.totalApplications ?? 0}</strong>
                </div>

                <div className="dept-row">
                  <span>Selected</span>
                  <strong>{dept.selectedCount ?? 0}</strong>
                </div>

                <div className="dept-row">
                  <span>Success Rate</span>
                  <strong>{dept.selectionRate ?? 0}%</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

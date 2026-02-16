// -------------------- IMPORTS --------------------
import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

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

    const interval = setInterval(() => {
      fetchStats();
    }, 10000); // refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        {lastUpdated && (
          <span className="last-updated">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* -------------------- KPI CARDS -------------------- */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>{stats?.totalStudents ?? 0}</h3>
          <p>Total Students</p>
        </div>

        <div className="kpi-card">
          <h3>{stats?.totalJobs ?? 0}</h3>
          <p>Total Companies</p>
        </div>

        <div className="kpi-card">
          <h3>{stats?.totalApplications ?? 0}</h3>
          <p>Applications</p>
        </div>

        <div className="kpi-card highlight">
          <h3>{stats?.selectedCount ?? 0}</h3>
          <p>Selected</p>
        </div>
      </div>

      {/* -------------------- INFO SECTION -------------------- */}
      <div className="info-grid">
        {/* Recent Registrations */}
        <div className="info-card">
          <h4>Recent Registrations</h4>

          {recentStudents.length === 0 ? (
            <p className="empty-text">No recent students.</p>
          ) : (
            <ul>
              {recentStudents.map((student, index) => (
                <li key={index}>
                  <span className="student-name">{student.name}</span>
                  <span className="student-dept">{student.department}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Application Summary */}
        <div className="info-card">
          <h4>Application Summary</h4>

          <div className="summary-row">
            <span>Total Applications</span>
            <strong>{stats?.totalApplications ?? 0}</strong>
          </div>

          <div className="summary-row">
            <span>Selected</span>
            <strong>{stats?.selectedCount ?? 0}</strong>
          </div>

          <div className="summary-row">
            <span>Pending</span>
            <strong>
              {(stats?.totalApplications ?? 0) -
                (stats?.selectedCount ?? 0)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

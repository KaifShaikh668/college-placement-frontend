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
    }, 10000);

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

      {/* -------------------- SMART KPI CARDS -------------------- */}
      <div className="kpi-grid">

        <div className="kpi-card">
          <div className="kpi-top">
            <h2>{stats?.totalStudents ?? 0}</h2>
            <span className="kpi-badge green">Live</span>
          </div>
          <p>Total Students</p>
          <div className="kpi-progress">
            <div
              className="kpi-progress-fill"
              style={{ width: `${(stats?.totalStudents ?? 0) * 5}%` }}
            ></div>
          </div>
        </div>

        <div className="kpi-card blue">
          <div className="kpi-top">
            <h2>{stats?.totalJobs ?? 0}</h2>
            <span className="kpi-badge blue-badge">Active</span>
          </div>
          <p>Total Companies</p>
          <div className="kpi-progress">
            <div
              className="kpi-progress-fill blue-fill"
              style={{ width: `${(stats?.totalJobs ?? 0) * 20}%` }}
            ></div>
          </div>
        </div>

        <div className="kpi-card purple">
          <div className="kpi-top">
            <h2>{stats?.totalApplications ?? 0}</h2>
            <span className="kpi-badge purple-badge">Incoming</span>
          </div>
          <p>Applications</p>
          <div className="kpi-progress">
            <div
              className="kpi-progress-fill purple-fill"
              style={{ width: `${(stats?.totalApplications ?? 0) * 3}%` }}
            ></div>
          </div>
        </div>

        <div className="kpi-card orange">
          <div className="kpi-top">
            <h2>{stats?.selectedCount ?? 0}</h2>
            <span className="kpi-badge orange-badge">Selected</span>
          </div>
          <p>Selected</p>
          <div className="kpi-progress">
            <div
              className="kpi-progress-fill orange-fill"
              style={{ width: `${(stats?.selectedCount ?? 0) * 30}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* -------------------- INFO SECTION -------------------- */}
      <div className="info-grid">
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

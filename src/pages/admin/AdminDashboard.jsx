import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [students, setStudents] = useState(0);
  const [applications, setApplications] = useState(0);
  const [selected, setSelected] = useState(0);
  const [rate, setRate] = useState(0);

  useEffect(() => {

    const animateValue = (setter, end, duration = 800) => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
        setLastUpdated(new Date());

        animateValue(setStudents, res.data.totalStudents || 0);
        animateValue(setApplications, res.data.totalApplications || 0);
        animateValue(setSelected, res.data.selectedCount || 0);
        animateValue(setRate, parseFloat(res.data.selectionRate) || 0);

      } catch (error) {
        console.error("Failed to load dashboard", error);
      }
    };

    fetchStats();

  }, []);

  return (
    <div className="admin-dashboard">

      <div className="dashboard-header">
        <h2>Executive Dashboard</h2>
        {lastUpdated && (
          <span className="last-updated">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="kpi-grid executive">

        <div className="kpi-card executive-card">
          <div className="kpi-label">Total Students</div>
          <div className="kpi-value">{students}</div>
        </div>

        <div className="kpi-card executive-card">
          <div className="kpi-label">Applications</div>
          <div className="kpi-value">{applications}</div>
        </div>

        <div className="kpi-card executive-card">
          <div className="kpi-label">Selected</div>
          <div className="kpi-value">{selected}</div>
        </div>

        <div className="kpi-card executive-card highlight">
          <div className="kpi-label">Selection Rate</div>
          <div className="kpi-value">{rate}%</div>
        </div>

      </div>

      <div className="executive-summary">
        <h4>Placement Health Overview</h4>

        <p>
          {rate >= 50
            ? "🚀 Outstanding placement performance."
            : rate >= 25
            ? "📈 Good placement performance."
            : "⚠️ Needs improvement."}
        </p>

        <div className="summary-metrics">
          <div>
            <strong>Unselected Applications:</strong>{" "}
            {(stats?.totalApplications ?? 0) -
              (stats?.selectedCount ?? 0)}
          </div>

          <div>
            <strong>Applications per Student:</strong>{" "}
            {stats?.totalStudents > 0
              ? (stats.totalApplications / stats.totalStudents).toFixed(2)
              : 0}
          </div>
        </div>
      </div>

    </div>
  );
}

// -------------------- IMPORTS --------------------
import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
        setChartData(res.data.monthlyRegistrations || []);
      } catch (error) {
        console.error("Failed to load admin stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* -------------------- STATS CARDS -------------------- */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <h3>{stats?.totalStudents ?? 0}</h3>
          <p>Total Students</p>
        </div>

        <div className="admin-stat-card">
          <h3>{stats?.totalJobs ?? 0}</h3>
          <p>Total Companies</p>
        </div>

        <div className="admin-stat-card">
          <h3>{stats?.totalApplications ?? 0}</h3>
          <p>Applications Received</p>
        </div>

        <div className="admin-stat-card">
          <h3>{stats?.selectedCount ?? 0}</h3>
          <p>Selected Candidates</p>
        </div>
      </div>

      {/* -------------------- CHART -------------------- */}
      <div className="admin-chart-box">
        <h3 className="chart-title">Monthly Student Registrations</h3>

        <div className="chart-wrapper" style={{ height: "350px" }}>
          {chartData.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                paddingTop: "120px",
                color: "#888",
                fontWeight: "500",
              }}
            >
              No registration data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="students"
                  fill="#4b5fff"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

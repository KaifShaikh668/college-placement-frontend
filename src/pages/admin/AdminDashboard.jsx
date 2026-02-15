// -------------------- IMPORTS --------------------
import React, { useEffect, useState, useCallback } from "react";
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

  // -------------------- FETCH FUNCTION --------------------
  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get("/admin/stats");

      setStats(res.data);

      // ✅ Safe fallback if backend returns empty or undefined
      setChartData(
        res.data?.monthlyRegistrations?.length
          ? res.data.monthlyRegistrations
          : [
              { name: "Jan 2026", students: 2 },
              { name: "Feb 2026", students: 5 },
              { name: "Mar 2026", students: 1 },
            ]
      );
    } catch (error) {
      console.error("Failed to load admin stats", error);

      // Optional fallback on error
      setChartData([
        { name: "Jan 2026", students: 2 },
        { name: "Feb 2026", students: 5 },
        { name: "Mar 2026", students: 1 },
      ]);
    }
  }, []);

  // -------------------- INITIAL LOAD --------------------
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // -------------------- AUTO REFRESH EVERY 5 SECONDS --------------------
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchStats]);

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
        </div>
      </div>
    </div>
  );
}

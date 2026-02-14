// -------------------- IMPORTS --------------------
import React, { useEffect, useState } from "react";
import API from "../../api"; // ✅ CHANGED (using your API file)
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

// -------------------- STATIC CHART DATA --------------------
const chartData = [
  { name: "Jan", students: 40 },
  { name: "Feb", students: 55 },
  { name: "Mar", students: 75 },
  { name: "Apr", students: 60 },
];

// -------------------- COMPONENT --------------------
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats"); // ✅ CHANGED
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load admin stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="admin-title">Admin Dashboard</h2>

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

      <div className="admin-chart-box">
        <h3 className="chart-title">Monthly Student Registrations</h3>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#4b5fff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

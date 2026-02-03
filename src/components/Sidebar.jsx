import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "230px",
      background: "white",
      padding: "25px",
      height: "100vh",
      boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
      position: "fixed"
    }}>
      <h4 style={{ fontWeight: "700", marginBottom: "30px" }}>Menu</h4>

      <nav style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <Link to="/dashboard" style={{ textDecoration: "none", color: "#333" }}>Dashboard</Link>
        <Link to="/profile" style={{ textDecoration: "none", color: "#333" }}>Profile</Link>
        <Link to="/appliedjobs" style={{ textDecoration: "none", color: "#333" }}>Applied Jobs</Link>
        <Link to="/jobdrives" style={{ textDecoration: "none", color: "#333" }}>Job Drives</Link>
        <Link to="/logout" style={{ textDecoration: "none", color: "red" }}>Logout</Link>
        
      </nav>
    </div>
  );
}

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/login/student");
  };

  return (
    <nav className="top-navbar">
      <div className="nav-right">
        <NavLink to="/dashboard" className="menu-item">Dashboard</NavLink>
        <NavLink to="/profile" className="menu-item">Profile</NavLink>
        <NavLink to="/appliedjobs" className="menu-item">Applied Jobs</NavLink>
        <NavLink to="/jobdrives" className="menu-item">Job Drives</NavLink>
        
        <span className="menu-item logout" onClick={logout}>Logout</span>
      </div>
    </nav>
  );
}

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/AdminSidebar.css";
import {
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaBell,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">Placement - Admin</div>

      <nav className="admin-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaTachometerAlt className="icon" /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/manage-students"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaUsers className="icon" /> Manage Students
        </NavLink>

        <NavLink
          to="/admin/manage-drives"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaBriefcase className="icon" /> Manage Drives
        </NavLink>

        {/* ✅ Manage Applications */}
        <NavLink
          to="/admin/manage-applications"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaClipboardList className="icon" /> Applications
        </NavLink>

        <NavLink
          to="/admin/notices"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaBell className="icon" /> Notices
        </NavLink>
      </nav>

      <button className="admin-logout" onClick={handleLogout}>
        <FaSignOutAlt className="icon" /> Logout
      </button>
    </aside>
  );
}

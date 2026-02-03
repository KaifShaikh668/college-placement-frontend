import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import {
  FaUser,
  FaBell,
  FaBriefcase,
  FaHome,
  FaListAlt,
  FaSignOutAlt
} from "react-icons/fa";

export default function StudentSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/login/student");
  };

  return (
    <div className="sidebar">

      <h3 className="sidebar-title">Student Panel</h3>

      <NavLink
        to="/student/dashboard"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        <FaHome className="icon" /> Dashboard
      </NavLink>

      <NavLink
        to="/student/profile"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        <FaUser className="icon" /> Profile
      </NavLink>

      <NavLink
        to="/student/applied-jobs"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        <FaListAlt className="icon" /> Applied Jobs
      </NavLink>

      <NavLink
        to="/student/job-drives"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        <FaBriefcase className="icon" /> Job Drives
      </NavLink>

      <NavLink
        to="/student/notifications"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        <FaBell className="icon" /> Notifications
      </NavLink>

      <button className="sidebar-logout" onClick={logout}>
        <FaSignOutAlt className="icon" /> Logout
      </button>
    </div>
  );
}

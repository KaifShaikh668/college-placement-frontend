import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar-section">
        <AdminSidebar />
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}

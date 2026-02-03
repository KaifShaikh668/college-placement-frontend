import React from "react";
import StudentSidebar from "../components/StudentSidebar";

export default function StudentLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <StudentSidebar />

      <div style={{ marginLeft: "240px", padding: "20px", width: "100%" }}>
        {children}
      </div>
    </div>
  );
}

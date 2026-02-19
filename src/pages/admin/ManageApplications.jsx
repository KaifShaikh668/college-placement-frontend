import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import "../../styles/ManageStudents.css";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedApp, setSelectedApp] = useState(null);

  const token = localStorage.getItem("adminToken");

  const fetchApplications = async () => {
    try {
      setLoading(true);

      if (!token) {
        alert("Admin token missing. Please login again.");
        setLoading(false);
        return;
      }

      const res = await API.get("/applications/admin/all");

      setApplications(res.data || []);
    } catch (error) {
      console.error("FETCH APPLICATIONS ERROR:", error);
      alert(error.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, []);

  const updateStatus = async (id, status) => {
    try {
      if (!token) {
        alert("Admin token missing. Please login again.");
        return;
      }

      await API.put(`/applications/admin/${id}/status`, { status });

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        )
      );

      if (selectedApp?._id === id) {
        setSelectedApp((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="manage-students">
        <h2>Manage Applications</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="manage-students">
      <div className="ms-header">
        <div>
          <h2>Manage Applications</h2>
          <p>View and update student job applications.</p>
        </div>
      </div>

      <div className="card">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Company</th>
              <th>Role</th>
              <th>Applied On</th>
              <th>Status</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.student?.name || "N/A"}</td>
                  <td>{app.student?.email || "N/A"}</td>
                  <td>{app.job?.company || "N/A"}</td>
                  <td>{app.job?.role || "N/A"}</td>
                  <td>{app.createdAt ? app.createdAt.slice(0, 10) : "N/A"}</td>

                  <td>
                    <select
                      value={app.status || "Applied"}
                      onChange={(e) => updateStatus(app._id, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                      }}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Selected">Selected</option>
                    </select>
                  </td>

                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => setSelectedApp(app)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedApp(null)}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              width: "450px",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "10px" }}>Application Details</h3>

            <p><b>Student:</b> {selectedApp.student?.name || "N/A"}</p>
            <p><b>Email:</b> {selectedApp.student?.email || "N/A"}</p>
            <p><b>Company:</b> {selectedApp.job?.company || "N/A"}</p>
            <p><b>Role:</b> {selectedApp.job?.role || "N/A"}</p>
            <p><b>Status:</b> {selectedApp.status || "Applied"}</p>
            <p><b>Applied On:</b> {selectedApp.createdAt ? selectedApp.createdAt.slice(0, 10) : "N/A"}</p>

            <button
              className="btn-delete"
              style={{ marginTop: "15px" }}
              onClick={() => setSelectedApp(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

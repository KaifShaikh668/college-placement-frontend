import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/AppliedJobs.css";

export default function AppliedJobs() {

  // ---------------- REAL APPLIED JOBS ----------------
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        const res = await axios.get(
          "http://localhost:5002/api/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 🔒 SAFETY: remove applications whose job was deleted
        const validApplications = res.data.filter(app => app.job);

        setAppliedJobs(validApplications);
      } catch (error) {
        alert("Failed to load applied jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  // ---------------- MODAL HANDLING ----------------
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const openModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  return (
    <StudentLayout>
      <div className="applied-wrapper">

        <h2 className="page-title">Applied Jobs</h2>

        {loading ? (
          <p>Loading...</p>
        ) : appliedJobs.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="applied-grid">
            {appliedJobs.map((app) => (
              <div className="applied-card" key={app._id}>
                
                <div className="applied-header">
                  <h3 className="company">{app.job.company}</h3>
                  <span className={`status-badge ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </div>

                <p className="role">{app.job.role}</p>
                <p className="applied-date">
                  <b>Applied On:</b>{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>

                <button
                  className="view-btn"
                  onClick={() =>
                    openModal({
                      company: app.job.company,
                      role: app.job.role,
                      location: app.job.location,
                      salary: app.job.salary,
                      status: app.status,
                      description: app.job.description,
                    })
                  }
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- MODAL ---------------- */}
        {showModal && selectedJob && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2>
                {selectedJob.company} — {selectedJob.role}
              </h2>

              <p><b>Location:</b> {selectedJob.location}</p>
              <p><b>Salary:</b> {selectedJob.salary}</p>
              <p><b>Status:</b> {selectedJob.status}</p>

              <p><b>Description:</b></p>
              <p>{selectedJob.description}</p>

              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </StudentLayout>
  );
}

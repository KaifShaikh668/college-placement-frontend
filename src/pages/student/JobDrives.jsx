import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../utils/api";
import "../../styles/JobDrives.css";

export default function JobDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrives();
    // eslint-disable-next-line
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);

      const res = await API.get("/jobs");

      // ✅ Support both response formats:
      // 1) res.data = []
      // 2) res.data = { data: [] }
      const jobs = Array.isArray(res.data) ? res.data : res.data?.data || [];

      setDrives(jobs);
    } catch (error) {
      console.error("Job Drives Error:", error?.response || error);

      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to load job drives";

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await API.post(`/applications/${jobId}`);
      alert("✅ Applied successfully");
      fetchDrives(); // ✅ refresh list after apply
    } catch (error) {
      console.error("Apply Error:", error?.response || error);

      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Already applied or error occurred";

      alert(msg);
    }
  };

  return (
    <StudentLayout>
      <div className="jobdrives-wrapper">
        <h2 className="page-title">Job Drives</h2>

        {loading ? (
          <p>Loading job drives...</p>
        ) : drives.length === 0 ? (
          <p style={{ fontWeight: 700, color: "#444" }}>
            No job drives available right now.
          </p>
        ) : (
          <div className="jobdrives-grid">
            {drives.map((job) => (
              <div className="job-card" key={job._id}>
                <div className="job-header">
                  <h3>{job.company || "Company Name"}</h3>

                  <span
                    className={`status-badge ${
                      job.status ? job.status.toLowerCase() : "open"
                    }`}
                  >
                    {job.status || "Open"}
                  </span>
                </div>

                <p className="role">{job.role || "Job Role"}</p>

                {/* ✅ Apply only if Open */}
                {(job.status === "Open" || !job.status) && (
                  <button
                    className="apply-btn"
                    onClick={() => handleApply(job._id)}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

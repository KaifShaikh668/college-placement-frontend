// -------------------- IMPORTS --------------------
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../utils/api";
import "../../styles/Dashboard.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// -------------------- COMPONENT --------------------
export default function StudentDashboard() {
  const navigate = useNavigate();

  // ✅ Student from localStorage (login saves this)
  const student = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("student"));
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!student) navigate("/login/student");
  }, [student, navigate]);

  // -------------------- LOGOUT --------------------
  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("studentToken");
    navigate("/login/student");
  };

  // -------------------- PROFILE COMPLETION --------------------
  const [completion, setCompletion] = useState(
    Number(localStorage.getItem("profileCompletion")) || 0
  );

  useEffect(() => {
    const updateCompletion = () => {
      setCompletion(Number(localStorage.getItem("profileCompletion")) || 0);
    };

    window.addEventListener("storage", updateCompletion);
    updateCompletion();

    return () => window.removeEventListener("storage", updateCompletion);
  }, []);

  // -------------------- DASHBOARD STATS (DB) ✅ --------------------
  const [stats, setStats] = useState({
    totalApplications: 0,
    applied: 0,
    shortlisted: 0,
    selected: 0,
    rejected: 0,
  });

  // -------------------- NOTIFICATIONS (DB) ✅ --------------------
  const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/student/stats");

        setStats({
          totalApplications: res.data?.totalApplications ?? 0,
          applied: res.data?.applied ?? 0,
          shortlisted: res.data?.shortlisted ?? 0,
          selected: res.data?.selected ?? 0,
          rejected: res.data?.rejected ?? 0,
        });
      } catch (err) {
        console.error("Stats fetch failed:", err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications/student");

        const list = Array.isArray(res.data) ? res.data : [];

        setNotifications(list);

        // ✅ Count unread
        const unread = list.filter((n) => !n.isRead).length;
        setNotifCount(unread);
      } catch (err) {
        console.error("Notifications fetch failed:", err);
      }
    };

    fetchStats();
    fetchNotifications();
  }, []);

  // -------------------- MODAL (Drive View - UI Preserved) --------------------
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);

  const openDriveModal = (drive) => {
    setSelectedDrive(drive);
    setShowDriveModal(true);
  };

  // -------------------- UI STATIC DRIVES (kept same for now) --------------------
  const drives = [
    {
      id: 1,
      company: "Google",
      role: "SDE Intern",
      date: "12 Dec 2025",
      status: "Open",
      location: "Bangalore",
      salary: "₹80,000 / month",
      eligibility: "CGPA 7.5+",
      description: "Work with Google engineering team",
    },
  ];

  // ✅ Show only latest 4 notices in dashboard (from DB notifications)
  const latestNotices = notifications.slice(0, 4);

  // -------------------- UI --------------------
  return (
    <StudentLayout>
      <div className="dashboard-wrapper">
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h2>Welcome, {student?.name}</h2>
            <p>{student?.email}</p>
          </div>
          <button className="btn small-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalApplications}</h3>
            <p>Total Applications</p>
          </div>

          <div className="stat-card">
            <h3>{stats.applied}</h3>
            <p>Applied</p>
          </div>

          <div className="stat-card">
            <h3>{notifCount}</h3>
            <p>Notifications</p>
          </div>

          <div className="stat-card">
            <h3>{completion}%</h3>
            <p>Profile Completion</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="main-grid">
          {/* DRIVES */}
          <div className="card drives-card">
            <h4>Upcoming Job Drives</h4>

            {drives.map((d) => (
              <div key={d.id} className="drive-row">
                <div>
                  <b>{d.company}</b> — {d.role}
                </div>
                <button
                  className="btn small-blue"
                  onClick={() => openDriveModal(d)}
                >
                  View
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="right-column">
            <div className="card notice-card">
              <h4>Notices</h4>

              {latestNotices.length === 0 ? (
                <p style={{ color: "#666" }}>No notices available</p>
              ) : (
                latestNotices.map((n) => (
                  <p key={n._id}>
                    {n.title}
                  </p>
                ))
              )}
            </div>

            <div className="card activity-card">
              <h4>Recent Activity</h4>
              <p>Profile viewed</p>
              <p>Notifications checked</p>
              <p>Applied jobs count updated</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        show={showDriveModal}
        onHide={() => setShowDriveModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDrive?.company} — {selectedDrive?.role}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedDrive?.description}</p>
          <p>
            <b>Date:</b> {selectedDrive?.date}
          </p>
          <p>
            <b>Location:</b> {selectedDrive?.location}
          </p>
          <p>
            <b>Salary:</b> {selectedDrive?.salary}
          </p>
          <p>
            <b>Eligibility:</b> {selectedDrive?.eligibility}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDriveModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </StudentLayout>
  );
}

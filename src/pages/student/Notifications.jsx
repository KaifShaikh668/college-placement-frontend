import React, { useCallback, useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../utils/api";
import "../../styles/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------- MODAL ----------------
  const [showModal, setShowModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // ✅ Format "time ago" (safe)
  const formatTime = useMemo(() => {
    return (dateString) => {
      if (!dateString) return "Just now";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Just now";

      const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

      if (diffSeconds < 0) return "Just now"; // future date safety
      if (diffSeconds < 60) return `${diffSeconds}s ago`;

      const mins = Math.floor(diffSeconds / 60);
      if (mins < 60) return `${mins}m ago`;

      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;

      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    };
  }, []);

  // ✅ Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/notifications/student");

      const list = Array.isArray(res.data) ? res.data : [];

      // ✅ Normalize for UI
      const formatted = list.map((n) => ({
        _id: n._id,
        title: n.title || "",
        message: n.message || "",
        time: n.time || n.createdAt || n.notificationCreatedAt || null,
        status: n.status ? n.status : n.isRead ? "read" : "new",
      }));

      setNotifications(formatted);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      alert("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ✅ Open modal + mark as read (backend)
  const openModal = async (notice) => {
    if (!notice?._id) return;

    setSelectedNotice(notice);
    setShowModal(true);

    // ✅ Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n._id === notice._id ? { ...n, status: "read" } : n))
    );

    // ✅ Mark as read on backend
    try {
      await API.put(`/notifications/student/${notice._id}/read`);
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  const closeModal = () => {
    setSelectedNotice(null);
    setShowModal(false);
  };

  return (
    <StudentLayout>
      <div className="notifications-wrapper">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <h2 className="page-title">Notifications</h2>

          <button
            className="view-btn"
            style={{ width: "140px" }}
            onClick={fetchNotifications}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p style={{ padding: "16px", color: "#666" }}>
            Loading notifications...
          </p>
        ) : notifications.length === 0 ? (
          <p style={{ padding: "16px", color: "#666" }}>
            No notifications found
          </p>
        ) : (
          <div className="notifications-list">
            {notifications.map((n) => (
              <div className="notif-card" key={n._id}>
                <div className="notif-header">
                  <h3 className="notif-title">{n.title}</h3>

                  <span
                    className={`notif-badge ${
                      n.status === "new" ? "new" : "read"
                    }`}
                  >
                    {n.status === "new" ? "NEW" : "READ"}
                  </span>
                </div>

                <p className="notif-message">{n.message}</p>
                <p className="notif-time">{formatTime(n.time)}</p>

                <button className="view-btn" onClick={() => openModal(n)}>
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- MODAL ---------------- */}
        {showModal && selectedNotice && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedNotice.title}</h2>
              <p className="modal-msg">{selectedNotice.message}</p>
              <p>
                <b>Received:</b> {formatTime(selectedNotice.time)}
              </p>

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

import React, { useEffect, useMemo, useState } from "react";
import API from "../../utils/api";
import "../../styles/ManageNotices.css";

const PAGE_SIZE = 5;

export default function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", message: "" });

  // ✅ Fetch notices from backend (admin view)
  const fetchNotices = async () => {
    try {
      const res = await API.get("/notifications/admin");

      // backend returns array
      const formatted = (res.data || []).map((n) => ({
        _id: n._id,
        title: n.title,
        message: n.message,
        date: new Date(n.createdAt).toISOString().slice(0, 10),
      }));

      setNotices(formatted);
    } catch (error) {
      console.error("Failed to load notices:", error);
      alert("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  /* ---------- PAGINATION ---------- */
  const totalPages = useMemo(() => {
    return Math.ceil(notices.length / PAGE_SIZE);
  }, [notices]);

  const start = (page - 1) * PAGE_SIZE;

  const currentNotices = useMemo(() => {
    return notices.slice(start, start + PAGE_SIZE);
  }, [notices, start]);

  /* ---------- ACTIONS ---------- */
  function startAdd() {
    setEditingId("new");
    setForm({ title: "", message: "" });
  }

  function startEdit(n) {
    setEditingId(n._id);
    setForm({ title: n.title, message: n.message });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ title: "", message: "" });
  }

  // ✅ Save Notice = Create or Update (Backend)
  const saveNotice = async () => {
    if (!form.title.trim() || !form.message.trim()) return;

    try {
      if (editingId === "new") {
        // ✅ CREATE -> send to students
        await API.post("/notifications/admin", {
          title: form.title,
          message: form.message,
          targetDepartment: "All",
          targetYear: "All",
        });
      } else {
        // ✅ UPDATE
        await API.put(`/notifications/admin/${editingId}`, {
          title: form.title,
          message: form.message,
        });
      }

      cancelEdit();
      await fetchNotices();
      setPage(1);
    } catch (error) {
      console.error("Save notice failed:", error);
      alert("Failed to save notice");
    }
  };

  // ✅ Delete notice from backend
  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    try {
      await API.delete(`/notifications/admin/${id}`);
      await fetchNotices();

      // ✅ if page becomes empty, go back
      setPage((prev) => (prev > 1 && currentNotices.length === 1 ? prev - 1 : prev));
    } catch (error) {
      console.error("Delete notice failed:", error);
      alert("Failed to delete notice");
    }
  };

  return (
    <div className="manage-notices">
      {/* HEADER */}
      <div className="mn-header">
        <div>
          <h2>Manage Notices</h2>
          <p>Create and manage notices for students</p>
        </div>

        <button className="btn-add" onClick={startAdd}>
          + Add Notice
        </button>
      </div>

      {/* TABLE */}
      <div className="card">
        {loading ? (
          <p style={{ padding: "16px" }}>Loading notices...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* ✅ Add/Edit Row */}
              {editingId && (
                <tr className="edit-row">
                  <td>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Enter title"
                    />
                  </td>
                  <td>
                    <input
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Enter message"
                    />
                  </td>
                  <td>—</td>
                  <td>
                    <button className="btn-save" onClick={saveNotice}>
                      Save
                    </button>
                    <button className="btn-cancel" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </td>
                </tr>
              )}

              {/* ✅ Notices */}
              {currentNotices.map((n) => (
                <tr key={n._id}>
                  <td>{n.title}</td>
                  <td>{n.message}</td>
                  <td>{n.date}</td>
                  <td>
                    <>
                      <button className="btn-edit" onClick={() => startEdit(n)}>
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteNotice(n._id)}
                      >
                        Delete
                      </button>
                    </>
                  </td>
                </tr>
              ))}

              {/* ✅ Empty */}
              {currentNotices.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty">
                    No notices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

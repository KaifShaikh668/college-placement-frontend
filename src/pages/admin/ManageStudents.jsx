import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ManageStudents.css";

const PAGE_SIZE = 5;

/* 🔐 MOCK ROLE (later comes from backend / auth) */
const currentUserRole = "ADMIN"; // change to "VIEWER" to test permissions

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    status: "Active",
  });

  /* ✅ SORT STATE */
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const token = localStorage.getItem("adminToken");

  /* =========================
     FETCH STUDENTS (REAL DATA)
  ========================= */
  const fetchStudents = async () => {
    try {
      setLoading(true);

      // ✅ FIXED URL ✅
      const res = await axios.get("http://localhost:5002/api/student", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped = res.data.map((s) => ({
        id: s._id,
        name: s.name || "N/A",
        email: s.email || "N/A",
        course: s.course || "Not Added",
        status: s.status || "Active",
      }));

      setStudents(mapped);
    } catch (error) {
      console.error("FETCH STUDENTS ERROR:", error);
      alert(error.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, []);

  /* ---------- FILTER ---------- */
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.email.toLowerCase().includes(query.toLowerCase()) ||
      s.course.toLowerCase().includes(query.toLowerCase())
  );

  /* ---------- SORT ---------- */
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;

    const x = (a[sortKey] || "").toString().toLowerCase();
    const y = (b[sortKey] || "").toString().toLowerCase();

    if (x < y) return sortDir === "asc" ? -1 : 1;
    if (x > y) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const currentStudents = sorted.slice(start, start + PAGE_SIZE);

  /* ---------- ACTIONS ---------- */
  function startAdd() {
    if (currentUserRole !== "ADMIN") return;
    setEditingId("new");
    setForm({ name: "", email: "", course: "", status: "Active" });
  }

  function startEdit(student) {
    if (currentUserRole !== "ADMIN") return;
    setEditingId(student.id);
    setForm(student);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  // ✅ BACKEND UPDATE FIXED
  const saveStudent = async () => {
    if (currentUserRole !== "ADMIN") return;

    if (!form.name || !form.email) {
      alert("Name and Email are required");
      return;
    }

    try {
      // ADD NEW STUDENT (not supported yet)
      if (editingId === "new") {
        alert("Add student backend not connected yet ✅");
        cancelEdit();
        return;
      }

      // ✅ UPDATE STUDENT ✅
      await axios.put(
        `http://localhost:5002/api/student/${editingId}`,
        {
          name: form.name,
          email: form.email,
          course: form.course,
          status: form.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      cancelEdit();
      fetchStudents();
    } catch (error) {
      console.error("UPDATE STUDENT ERROR:", error);
      alert(error.response?.data?.message || "Failed to update student");
    }
  };

  // ✅ DELETE STUDENT (BACKEND WORKING)
  const deleteStudent = async (id) => {
    if (currentUserRole !== "ADMIN") return;

    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5002/api/student/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchStudents();
    } catch (error) {
      console.error("DELETE STUDENT ERROR:", error);
      alert(error.response?.data?.message || "Failed to delete student");
    }
  };

  return (
    <div className="manage-students">
      {/* HEADER */}
      <div className="ms-header">
        <div>
          <h2>Manage Students</h2>
          <p>View, add and manage student records.</p>
        </div>

        <div className="ms-actions">
          <input
            placeholder="Search students..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />

          {currentUserRole === "ADMIN" && (
            <button onClick={startAdd}>+ Add Student</button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        {loading ? (
          <p style={{ padding: "15px" }}>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort("name")}>
                  Name {sortKey === "name" && (sortDir === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => toggleSort("email")}>
                  Email {sortKey === "email" && (sortDir === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => toggleSort("course")}>
                  Course{" "}
                  {sortKey === "course" && (sortDir === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => toggleSort("status")}>
                  Status{" "}
                  {sortKey === "status" && (sortDir === "asc" ? "▲" : "▼")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {editingId && currentUserRole === "ADMIN" && (
                <tr className="edit-row">
                  <td>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={form.course}
                      onChange={(e) =>
                        setForm({ ...form, course: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-save" onClick={saveStudent}>
                      Save
                    </button>
                    <button className="btn-cancel" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </td>
                </tr>
              )}

              {currentStudents.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.course}</td>
                  <td>
                    <span className={`badge ${s.status.toLowerCase()}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    {currentUserRole === "ADMIN" ? (
                      <>
                        <button className="btn-edit" onClick={() => startEdit(s)}>
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => deleteStudent(s.id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="muted">View only</span>
                    )}
                  </td>
                </tr>
              ))}

              {currentStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty">
                    No students found
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

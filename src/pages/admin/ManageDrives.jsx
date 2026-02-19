import React, { useCallback, useEffect, useState } from "react";
import API from "../../utils/api";
import "../../styles/ManageDrives.css";

export default function ManageDrives() {
  const [drives, setDrives] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    company: "",
    role: "",
    date: "",
    status: "Open",
  });

  const token = localStorage.getItem("adminToken");

  /* =========================
     FETCH DRIVES (FIXED)
  ========================= */
  const fetchDrives = useCallback(async () => {
    if (!token) return;

    try {
      const res = await API.get("/jobs/admin");
      setDrives(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load job drives");
    }
  }, [token]);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  /* =========================
     ACTIONS
  ========================= */
  const startAdd = () => {
    setEditingId("new");
    setForm({
      company: "",
      role: "",
      date: "",
      status: "Open",
    });
  };

  const startEdit = (drive) => {
    setEditingId(drive._id);
    setForm({
      company: drive.company,
      role: drive.role,
      date: drive.driveDate ? drive.driveDate.slice(0, 10) : "",
      status: drive.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveDrive = async () => {
    try {
      const payload = {
        company: form.company,
        role: form.role,
        status: form.status,
        driveDate: form.date,
      };

      if (editingId === "new") {
        await API.post("/jobs/admin", payload);
      } else {
        await API.put(`/jobs/admin/${editingId}`, payload);
      }

      cancelEdit();
      fetchDrives();
    } catch (error) {
      console.error(error);
      alert("Failed to save drive");
    }
  };

  const deleteDrive = async (id) => {
    if (!window.confirm("Delete this drive?")) return;

    try {
      await API.delete(`/jobs/admin/${id}`);
      fetchDrives();
    } catch (error) {
      console.error(error);
      alert("Failed to delete drive");
    }
  };

  return (
    <div className="manage-drives">
      <div className="md-header">
        <div>
          <h2>Manage Job Drives</h2>
          <p>Create, edit and manage placement drives.</p>
        </div>
        <button className="add-btn" onClick={startAdd}>
          + Add Drive
        </button>
      </div>

      <div className="card">
        <table className="drives-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Date</th>
              <th>Status</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {editingId && (
              <tr className="edit-row">
                <td>
                  <input
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                  />
                </td>

                <td>
                  <input
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                  />
                </td>

                <td>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
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
                    <option>Open</option>
                    <option>Closed</option>
                  </select>
                </td>

                <td className="actions">
                  <button className="btn-save" onClick={saveDrive}>
                    Save
                  </button>
                  <button className="btn-cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </td>
              </tr>
            )}

            {drives.map((d) => (
              <tr key={d._id}>
                <td>{d.company}</td>
                <td>{d.role}</td>
                <td>{d.driveDate?.slice(0, 10)}</td>
                <td>
                  <span className={`badge ${d.status.toLowerCase()}`}>
                    {d.status}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => startEdit(d)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteDrive(d._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )}

            {drives.length === 0 && !editingId && (
              <tr>
                <td colSpan="5" className="empty">
                  No job drives found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";

export default function StudentRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleRegister(e) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      !formData.studentId ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://college-placement-backend-fup4.onrender.com/api/auth/register",
        {
          studentId: formData.studentId,
          email: formData.email,
          password: formData.password,
        }
      );

      // ✅ Success message under form
      setSuccessMessage(res.data.message);

      // ✅ Toast popup
      setShowToast(true);

      // Auto hide toast
      setTimeout(() => {
        setShowToast(false);
      }, 3000);

      // ✅ Auto redirect after 2 seconds
      setTimeout(() => {
        navigate("/login/student");
      }, 2000);

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      {/* ✅ Toast Popup */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            zIndex: 9999,
            fontWeight: "500",
          }}
        >
          Registration Successful 🎉
        </div>
      )}

      <div className="auth-card">
        <h2>Student Registration</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          {/* ✅ Green Success Message */}
          {successMessage && (
            <p style={{ color: "green", marginTop: "10px" }}>
              {successMessage}
            </p>
          )}

          {/* ❌ Error Message */}
          {errorMessage && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
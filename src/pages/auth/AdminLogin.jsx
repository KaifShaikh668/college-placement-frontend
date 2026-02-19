import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import "../../styles/Login.css";

import logo from "../../assets/images/logo.png";
import hero from "../../assets/images/hero.png";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => {
    const val = email.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return val.length > 0 && regex.test(val);
  }, [email]);

  const handleAdminLogin = async () => {
    if (!email.trim() || !pass.trim()) {
      alert("All fields are required");
      return;
    }

    if (!emailValid) {
      alert("Enter a valid admin email.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Correct backend route
      const res = await API.post("/auth/login", {
        email: email.trim(),
        password: pass.trim(),
      });

      // ✅ Save admin token
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="left-panel">
        <img src={logo} alt="Logo" className="login-logo" />

        <h1 className="project-title">Admin Login – College Placement Cell</h1>

        <div className="auth-card shadow">
          <h4 className="text-center mb-3">Admin Login</h4>

          <div className="input-with-status">
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {email.trim().length > 0 && (
              <span className={`status-icon ${emailValid ? "valid" : "invalid"}`}>
                {emailValid ? "✓" : "✕"}
              </span>
            )}
          </div>

          <div className="password-wrapper mb-3">
            <input
              type={show ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />

            <button
              type="button"
              className="show-hide-btn"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={handleAdminLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            className="back-link-btn"
            onClick={() => navigate("/login/student")}
          >
            ← Back to Student Login
          </button>
        </div>
      </div>

      <div className="right-panel">
        <img src={hero} alt="Admin Illustration" className="hero-img" />
      </div>
    </div>
  );
}

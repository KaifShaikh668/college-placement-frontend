import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/Login.css";

import logo from "../../assets/images/logo.png";
import hero from "../../assets/images/hero.png";

export default function StudentLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  /* 🔥 Show success toast if redirected from register */
  useEffect(() => {
    if (location.state?.registered) {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  }, [location]);

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async () => {
    const email = loginEmail.trim();
    const password = loginPassword.trim();

    if (!email || !password) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "https://college-placement-backend-fup4.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("studentToken", res.data.token);
      localStorage.setItem("student", JSON.stringify(res.data.user));

      navigate("/student/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
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
          Registration Successful 🎉 Please login.
        </div>
      )}

      <div className="left-panel">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="project-title">Welcome to College Placement Cell</h1>

        <div className="auth-card shadow">
          <div className="form-area">
            <h3 className="text-center">Student Login</h3>

            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <div className="password-wrapper">
              <input
                type={showLoginPass ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button
                type="button"
                className="show-hide-btn"
                onClick={() => setShowLoginPass(!showLoginPass)}
              >
                {showLoginPass ? "Hide" : "Show"}
              </button>
            </div>

            <button
              className="primary-btn w-100"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <img src={hero} alt="Placement Illustration" className="hero-img" />
      </div>
    </div>
  );
}
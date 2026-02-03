import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Login.css";

import logo from "../../assets/images/logo.png";
import hero from "../../assets/images/hero.png";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [regEmail, setRegEmail] = useState("");
  const [regStudentId, setRegStudentId] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);

  /* ---------------- VALIDATIONS ---------------- */
  const emailValid = useMemo(() => {
    const val = regEmail.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return val.length > 0 && regex.test(val);
  }, [regEmail]);

  const studentIdValid = useMemo(() => {
    const val = regStudentId.trim();
    return /^[0-9]{7}$/.test(val);
  }, [regStudentId]);

  const passwordValid = useMemo(() => {
    const val = regPassword.trim();
    const hasMin = val.length >= 6;
    const hasLetter = /[A-Za-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    return val.length > 0 && hasMin && hasLetter && hasNumber;
  }, [regPassword]);

  const confirmPasswordValid = useMemo(() => {
    const pass = regPassword.trim();
    const confirm = regConfirmPassword.trim();
    return confirm.length > 0 && pass === confirm;
  }, [regPassword, regConfirmPassword]);

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async () => {
    const email = loginEmail.trim();
    const password = loginPassword.trim();

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5002/api/auth/login", {
        email,
        password,
        role: "student",
      });

      localStorage.setItem("studentToken", res.data.token);
      localStorage.setItem("student", JSON.stringify(res.data.user));

      navigate("/student/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REGISTER ---------------- */
  const handleRegister = async () => {
    const email = regEmail.trim();
    const studentId = regStudentId.trim();
    const password = regPassword.trim();
    const confirmPassword = regConfirmPassword.trim();

    if (!email || !studentId || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (!emailValid) {
      alert("Enter a valid email address");
      return;
    }

    if (!studentIdValid) {
      alert("Student ID must be exactly 7 digits");
      return;
    }

    if (!passwordValid) {
      alert("Password must be minimum 6 characters and contain letters + numbers");
      return;
    }

    if (!confirmPasswordValid) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5002/api/auth/register", {
        email,
        studentId,
        password,
      });

      alert("Registration Successful!");
      setActiveTab("login");

      // reset fields
      setRegEmail("");
      setRegStudentId("");
      setRegPassword("");
      setRegConfirmPassword("");
      setShowRegPass(false);
      setShowRegConfirmPass(false);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="left-panel">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="project-title">Welcome to College Placement Cell</h1>

        <div className="auth-card shadow">
          {/* ✅ Tabs */}
          <div className="tab-container">
            <button
              className={activeTab === "login" ? "tab active" : "tab"}
              onClick={() => setActiveTab("login")}
              type="button"
            >
              Login
            </button>

            <button
              className={activeTab === "register" ? "tab active" : "tab"}
              onClick={() => setActiveTab("register")}
              type="button"
            >
              Register
            </button>
          </div>

          {/* ✅ LOGIN FORM */}
          {activeTab === "login" && (
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

              <button
                className="admin-login-btn"
                onClick={() => navigate("/admin/login")}
              >
                Admin Login →
              </button>
            </div>
          )}

          {/* ✅ REGISTER FORM */}
          {activeTab === "register" && (
            <div className="form-area">
              <h3 className="text-center">Student Registration</h3>

              {/* EMAIL + STATUS */}
              <div className="input-with-status">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />

                {regEmail.trim().length > 0 && (
                  <span className={`status-icon ${emailValid ? "valid" : "invalid"}`}>
                    {emailValid ? "✓" : "✕"}
                  </span>
                )}
              </div>

              {/* STUDENT ID + STATUS */}
              <div className="input-with-status">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Student ID"
                  value={regStudentId}
                  onChange={(e) =>
                    setRegStudentId(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  maxLength={7}
                />

                {regStudentId.trim().length > 0 && (
                  <span
                    className={`status-icon ${
                      studentIdValid ? "valid" : "invalid"
                    }`}
                  >
                    {studentIdValid ? "✓" : "✕"}
                  </span>
                )}
              </div>

              {/* PASSWORD + STATUS */}
              <div className="password-wrapper input-with-status">
                <input
                  type={showRegPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() => setShowRegPass(!showRegPass)}
                >
                  {showRegPass ? "Hide" : "Show"}
                </button>

                {regPassword.trim().length > 0 && (
                  <span
                    className={`status-icon ${
                      passwordValid ? "valid" : "invalid"
                    }`}
                    style={{ right: "55px" }}
                  >
                    {passwordValid ? "✓" : "✕"}
                  </span>
                )}
              </div>

              {/* CONFIRM PASSWORD + STATUS */}
              <div className="password-wrapper input-with-status">
                <input
                  type={showRegConfirmPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Re-enter Password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
                >
                  {showRegConfirmPass ? "Hide" : "Show"}
                </button>

                {regConfirmPassword.trim().length > 0 && (
                  <span
                    className={`status-icon ${
                      confirmPasswordValid ? "valid" : "invalid"
                    }`}
                    style={{ right: "55px" }}
                  >
                    {confirmPasswordValid ? "✓" : "✕"}
                  </span>
                )}
              </div>

              <button className="success-btn w-100" onClick={handleRegister}>
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="right-panel">
        <img src={hero} alt="Placement Illustration" className="hero-img" />
      </div>
    </div>
  );
}

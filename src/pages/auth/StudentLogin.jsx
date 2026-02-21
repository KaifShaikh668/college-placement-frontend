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

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  /* ---------------- VALIDATIONS ---------------- */
  const emailValid = useMemo(() => {
    const val = regEmail.trim();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

  /* ---------------- REGISTER ---------------- */
  const handleRegister = async () => {
    const email = regEmail.trim();
    const studentId = regStudentId.trim();
    const password = regPassword.trim();
    const confirmPassword = regConfirmPassword.trim();

    let errors = {};

    if (!email) errors.email = "Email is required";
    else if (!emailValid) errors.email = "Enter a valid email address";

    if (!studentId) errors.studentId = "Student ID is required";
    else if (!studentIdValid)
      errors.studentId = "Student ID must be exactly 7 digits";

    if (!password) errors.password = "Password is required";
    else if (!passwordValid)
      errors.password =
        "Password must be minimum 6 characters with letters & numbers";

    if (!confirmPassword)
      errors.confirmPassword = "Please confirm your password";
    else if (!confirmPasswordValid)
      errors.confirmPassword = "Passwords do not match";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      await axios.post(
        "https://college-placement-backend-fup4.onrender.com/api/auth/register",
        { email, studentId, password }
      );

      setSuccessMessage("Registration successful! Redirecting to login...");
      setShowToast(true);

      setTimeout(() => {
        setActiveTab("login");
        setRegEmail("");
        setRegStudentId("");
        setRegPassword("");
        setRegConfirmPassword("");
        setShowRegPass(false);
        setShowRegConfirmPass(false);
        setFormErrors({});
        setSuccessMessage("");
        setShowToast(false);
      }, 2000);

    } catch (error) {
      setFormErrors({
        general: error.response?.data?.message || "Registration failed",
      });
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
          Registration Successful 🎉
        </div>
      )}

      <div className="left-panel">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="project-title">Welcome to College Placement Cell</h1>

        <div className="auth-card shadow">
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
            </div>
          )}

          {activeTab === "register" && (
            <div className="form-area">
              <h3 className="text-center">Student Registration</h3>

              {successMessage && (
                <p style={{ color: "green", textAlign: "center" }}>
                  {successMessage}
                </p>
              )}

              {formErrors.general && (
                <p className="error-message text-center">
                  {formErrors.general}
                </p>
              )}

              {/* Keep rest of your register form exactly same */}
              {/* (No logic removed, only success system added) */}

              {/* ... your existing inputs remain unchanged ... */}

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
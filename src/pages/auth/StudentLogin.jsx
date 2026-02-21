import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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
  const [showToast, setShowToast] = useState(false);

  /* ---------------- VALIDATIONS ---------------- */

  const emailValid = useMemo(() => {
    return /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/.test(
      regEmail.trim()
    );
  }, [regEmail]);

  const studentIdValid = useMemo(() => {
    return /^\d{7}$/.test(regStudentId.trim());
  }, [regStudentId]);

  const passwordValid = useMemo(() => {
    const val = regPassword;
    return (
      val.length >= 6 &&
      (val.match(/\d/g) || []).length >= 3 &&
      /[!@#$%^&*]/.test(val) &&
      /[A-Za-z]/.test(val)
    );
  }, [regPassword]);

  const confirmPasswordValid = useMemo(() => {
    return (
      regConfirmPassword.length > 0 &&
      regPassword === regConfirmPassword
    );
  }, [regPassword, regConfirmPassword]);

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "https://college-placement-backend-fup4.onrender.com/api/auth/login",
        {
          email: loginEmail.trim(),
          password: loginPassword.trim(),
        }
      );

      localStorage.setItem("studentToken", res.data.token);
      localStorage.setItem("student", JSON.stringify(res.data.user));

      navigate("/student/dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REGISTER ---------------- */

  const handleRegister = async () => {
    if (
      !emailValid ||
      !studentIdValid ||
      !passwordValid ||
      !confirmPasswordValid
    )
      return;

    try {
      await axios.post(
        "https://college-placement-backend-fup4.onrender.com/api/auth/register",
        {
          email: regEmail.trim(),
          studentId: regStudentId.trim(),
          password: regPassword.trim(),
        }
      );

      setShowToast(true);

      setTimeout(() => {
        setActiveTab("login");
        setRegEmail("");
        setRegStudentId("");
        setRegPassword("");
        setRegConfirmPassword("");
        setShowToast(false);
      }, 2000);
    } catch (err) {
      setFormErrors({
        general:
          err.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="login-wrapper">
      {showToast && (
        <div className="toast-success">
          Registration Successful 🎉
        </div>
      )}

      <div className="left-panel">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="project-title">
          Welcome to College Placement Cell
        </h1>

        <div className="auth-card shadow">

          {/* ---------- TABS ---------- */}
          <div className="tab-container">
            <button
              className={activeTab === "login" ? "tab active" : "tab"}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>

            <button
              className={activeTab === "register" ? "tab active" : "tab"}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          {/* ---------- LOGIN ---------- */}
          {activeTab === "login" && (
            <div className="form-area">
              <h3>Student Login</h3>

              <input
                className="form-control"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) =>
                  setLoginEmail(e.target.value)
                }
              />

              <div className="password-wrapper">
                <input
                  type={showLoginPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) =>
                    setLoginPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() =>
                    setShowLoginPass(!showLoginPass)
                  }
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

          {/* ---------- REGISTER ---------- */}
          {activeTab === "register" && (
            <div className="form-area">
              <h3>Student Registration</h3>

              {/* EMAIL */}
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Email"
                  value={regEmail}
                  onChange={(e) =>
                    setRegEmail(e.target.value)
                  }
                />
                {regEmail &&
                  (emailValid ? (
                    <FaCheckCircle className="valid-icon"/>
                  ) : (
                    <FaTimesCircle className="invalid-icon"/>
                  ))}
              </div>

              {/* STUDENT ID */}
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Student ID"
                  maxLength={7}
                  value={regStudentId}
                  onChange={(e) =>
                    setRegStudentId(
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
                {regStudentId &&
                  (studentIdValid ? (
                    <FaCheckCircle className="valid-icon"/>
                  ) : (
                    <FaTimesCircle className="invalid-icon"/>
                  ))}
              </div>

              {/* PASSWORD */}
              <div className="password-wrapper input-group">
                <input
                  type={showRegPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) =>
                    setRegPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() =>
                    setShowRegPass(!showRegPass)
                  }
                >
                  {showRegPass ? "Hide" : "Show"}
                </button>

                {regPassword &&
                  (passwordValid ? (
                    <FaCheckCircle className="valid-icon"/>
                  ) : (
                    <FaTimesCircle className="invalid-icon"/>
                  ))}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="password-wrapper input-group">
                <input
                  type={
                    showRegConfirmPass ? "text" : "password"
                  }
                  className="form-control"
                  placeholder="Re-enter Password"
                  value={regConfirmPassword}
                  onChange={(e) =>
                    setRegConfirmPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() =>
                    setShowRegConfirmPass(
                      !showRegConfirmPass
                    )
                  }
                >
                  {showRegConfirmPass
                    ? "Hide"
                    : "Show"}
                </button>

                {regConfirmPassword &&
                  (confirmPasswordValid ? (
                    <FaCheckCircle className="valid-icon"/>
                  ) : (
                    <FaTimesCircle className="invalid-icon"/>
                  ))}
              </div>

              <button
                className="success-btn w-100"
                onClick={handleRegister}
                disabled={
                  !emailValid ||
                  !studentIdValid ||
                  !passwordValid ||
                  !confirmPasswordValid
                }
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="right-panel">
        <img src={hero} alt="Hero" className="hero-img"/>
      </div>
    </div>
  );
}
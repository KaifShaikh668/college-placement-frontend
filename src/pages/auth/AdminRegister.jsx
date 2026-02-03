import React from "react";
import { Link } from "react-router-dom";
import "../../styles/AuthPortal.css";

export default function AdminRegister() {
  const submit = (e) => {
    e.preventDefault();
    alert("Admin Registered Successfully!");
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Admin Register</h2>

        <form onSubmit={submit}>
          <input type="text" className="auth-input" required placeholder="Full Name" />
          <input type="email" className="auth-input" required placeholder="Admin Email" />
          <input type="password" className="auth-input" required placeholder="Create Password" />

          <button className="auth-btn">Register</button>
        </form>

        <div className="auth-switch">
          Already registered? <Link to="/login/admin">Login</Link>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../../styles/Login.css";

import logo from "../../assets/images/logo.png";
import hero from "../../assets/images/hero.png";

export default function StudentLogin() {

const navigate = useNavigate();

const [activeTab,setActiveTab]=useState("login");

const [loginEmail,setLoginEmail]=useState("");
const [loginPassword,setLoginPassword]=useState("");
const [showLoginPass,setShowLoginPass]=useState(false);
const [loading,setLoading]=useState(false);

const [regEmail,setRegEmail]=useState("");
const [regStudentId,setRegStudentId]=useState("");
const [regPassword,setRegPassword]=useState("");
const [regConfirmPassword,setRegConfirmPassword]=useState("");

const [showRegPass,setShowRegPass]=useState(false);
const [showRegConfirmPass,setShowRegConfirmPass]=useState(false);

const [showToast,setShowToast]=useState(false);

/* ---------- VALIDATION ---------- */

const emailValid = useMemo(()=>{
return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(regEmail.trim());
},[regEmail]);

const studentIdValid = useMemo(()=>{
return /^\d{7}$/.test(regStudentId.trim());
},[regStudentId]);

const passwordValid = useMemo(()=>{
const v=regPassword;
return(
v.length>=6 &&
/\d/.test(v) &&
/[!@#$%^&*]/.test(v)
);
},[regPassword]);

const confirmPasswordValid =
regConfirmPassword.length>0 &&
regPassword===regConfirmPassword;

/* ---------- LOGIN ---------- */

const handleLogin=async()=>{

if(!loginEmail||!loginPassword)return;

try{
setLoading(true);

const res=await axios.post(
"https://college-placement-backend-fup4.onrender.com/api/auth/login",
{
email:loginEmail.trim(),
password:loginPassword.trim()
});

localStorage.setItem("studentToken",res.data.token);
localStorage.setItem("student",
JSON.stringify(res.data.user));

navigate("/student/dashboard");

}finally{
setLoading(false);
}
};

/* ---------- REGISTER ---------- */

const handleRegister=async()=>{

if(!emailValid||
!studentIdValid||
!passwordValid||
!confirmPasswordValid) return;

await axios.post(
"https://college-placement-backend-fup4.onrender.com/api/auth/register",
{
email:regEmail.trim(),
studentId:regStudentId.trim(),
password:regPassword.trim()
});

setShowToast(true);

setTimeout(()=>{
setActiveTab("login");
setRegEmail("");
setRegStudentId("");
setRegPassword("");
setRegConfirmPassword("");
setShowToast(false);
},2000);
};

return(
<div className="login-wrapper">

{showToast &&
<div className="toast-success">
Registration Successful 🎉
</div>}

<div className="left-panel">

<img
src={logo}
alt="College Placement Cell Logo"
className="login-logo"
/>

<h1 className="project-title">
Welcome to College Placement Cell
</h1>

<div className="auth-card shadow">

<div className="tab-container">
<button
className={activeTab==="login"?"tab active":"tab"}
onClick={()=>setActiveTab("login")}
>
Login
</button>

<button
className={activeTab==="register"?"tab active":"tab"}
onClick={()=>setActiveTab("register")}
>
Register
</button>
</div>

{/* ================= LOGIN ================= */}
{activeTab==="login"&&(
<div className="form-area">

<h3 className="text-center">
Student Login
</h3>

<input
className="form-control"
placeholder="Email"
value={loginEmail}
onChange={(e)=>setLoginEmail(e.target.value)}
/>

<div className="password-wrapper">
<input
type={showLoginPass?"text":"password"}
className="form-control"
placeholder="Password"
value={loginPassword}
onChange={(e)=>setLoginPassword(e.target.value)}
/>

<button
type="button"
className="show-hide-btn"
onClick={()=>setShowLoginPass(!showLoginPass)}
>
{showLoginPass?"Hide":"Show"}
</button>
</div>

<button
className="primary-btn w-100"
onClick={handleLogin}
disabled={loading}
>
{loading?"Logging in...":"Login"}
</button>

{/* ✅ FORGOT PASSWORD */}
<button
className="back-link-btn"
onClick={()=>navigate("/forgot-password")}
>
Forgot Password?
</button>

{/* ✅ ADMIN LOGIN ROUTE */}
<button
className="admin-login-btn"
onClick={()=>navigate("/admin/login")}
>
Admin Login
</button>

</div>
)}

{/* ================= REGISTER ================= */}
{activeTab==="register"&&(
<div className="form-area">

<div className="input-with-status">
<input
className="form-control"
placeholder="Email"
value={regEmail}
onChange={(e)=>setRegEmail(e.target.value)}
/>

{regEmail &&
(emailValid?
<FaCheckCircle className="status-icon valid"/>:
<FaTimesCircle className="status-icon invalid"/>)
}
</div>

<div className="input-with-status">
<input
className="form-control"
placeholder="Student ID"
maxLength={7}
value={regStudentId}
onChange={(e)=>
setRegStudentId(
e.target.value.replace(/[^0-9]/g,"")
)}
/>

{regStudentId &&
(studentIdValid?
<FaCheckCircle className="status-icon valid"/>:
<FaTimesCircle className="status-icon invalid"/>)
}
</div>

<div className="password-wrapper input-with-status">

<input
type={showRegPass?"text":"password"}
className="form-control"
placeholder="Password"
value={regPassword}
onChange={(e)=>setRegPassword(e.target.value)}
/>

<button
type="button"
className="show-hide-btn"
onClick={()=>setShowRegPass(!showRegPass)}
>
{showRegPass?"Hide":"Show"}
</button>

{regPassword &&
(passwordValid?
<FaCheckCircle className="status-icon valid"/>:
<FaTimesCircle className="status-icon invalid"/>)
}

</div>

{regPassword && !passwordValid && (
<p className="password-hint">
Minimum 6 characters with
<br/>• at least 1 number
<br/>• 1 special character
</p>
)}

<div className="password-wrapper input-with-status">

<input
type={showRegConfirmPass?"text":"password"}
className="form-control"
placeholder="Confirm Password"
value={regConfirmPassword}
onChange={(e)=>setRegConfirmPassword(e.target.value)}
/>

<button
type="button"
className="show-hide-btn"
onClick={()=>setShowRegConfirmPass(!showRegConfirmPass)}
>
{showRegConfirmPass?"Hide":"Show"}
</button>

{regConfirmPassword &&
(confirmPasswordValid?
<FaCheckCircle className="status-icon valid"/>:
<FaTimesCircle className="status-icon invalid"/>)
}
</div>

<button
className="success-btn w-100"
onClick={handleRegister}
disabled={
!emailValid||
!studentIdValid||
!passwordValid||
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
<img
src={hero}
alt="Student placement illustration"
className="hero-img"
/>
</div>

</div>
);
}
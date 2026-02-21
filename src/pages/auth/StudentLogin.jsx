import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

const [errors,setErrors]=useState({});

/* ---------------- LIVE VALIDATION ---------------- */

const emailValid=useMemo(()=>{
return /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/
.test(regEmail);
},[regEmail]);

const studentIdValid=useMemo(()=>{
return /^\d{7}$/.test(regStudentId);
},[regStudentId]);

const passwordValid=useMemo(()=>{
const v=regPassword;
return(
v.length>=6 &&
(v.match(/\d/g)||[]).length>=3 &&
/[!@#$%^&*]/.test(v) &&
/[A-Za-z]/.test(v)
);
},[regPassword]);

const confirmPasswordValid=useMemo(()=>{
return regPassword===regConfirmPassword &&
regConfirmPassword.length>0;
},[regPassword,regConfirmPassword]);

/* ---------------- LOGIN ---------------- */

const handleLogin=async()=>{
if(!loginEmail||!loginPassword)return;

try{
setLoading(true);

const res=await axios.post(
"https://college-placement-backend-fup4.onrender.com/api/auth/login",
{
email:loginEmail.trim(),
password:loginPassword.trim()
}
);

localStorage.setItem("studentToken",res.data.token);
navigate("/student/dashboard");

}catch(err){
console.log(err);
}finally{
setLoading(false);
}
};

/* ---------------- REGISTER ---------------- */

const handleRegister=async()=>{

let newErrors={};

if(!emailValid)
newErrors.email="Only gmail.com or yahoo.com allowed";

if(!studentIdValid)
newErrors.studentId="Student ID must be 7 digits";

if(!passwordValid)
newErrors.password=
"Password must contain 6 chars, 3 numbers & 1 special character";

if(!confirmPasswordValid)
newErrors.confirmPassword="Passwords do not match";

setErrors(newErrors);

if(Object.keys(newErrors).length>0)return;

await axios.post(
"https://college-placement-backend-fup4.onrender.com/api/auth/register",
{
email:regEmail,
studentId:regStudentId,
password:regPassword
}
);

setActiveTab("login");
};

return(

<div className="login-wrapper">

<div className="left-panel">

<img src={logo} alt="" className="login-logo"/>
<h1 className="project-title">
Welcome to College Placement Cell
</h1>

<div className="auth-card">

<div className="tab-container">
<button
className={activeTab==="login"?"tab active":"tab"}
onClick={()=>setActiveTab("login")}
>Login</button>

<button
className={activeTab==="register"?"tab active":"tab"}
onClick={()=>setActiveTab("register")}
>Register</button>
</div>

{/* LOGIN */}
{activeTab==="login"&&(

<div className="form-area">

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
className="primary-btn"
onClick={handleLogin}
disabled={loading}
>
{loading?"Logging...":"Login"}
</button>

</div>
)}

{/* REGISTER */}
{activeTab==="register"&&(

<div className="form-area">

<input
className={`form-control ${
regEmail &&
(emailValid?"valid-input":"invalid-input")
}`}
placeholder="Email"
value={regEmail}
onChange={(e)=>setRegEmail(e.target.value)}
/>
{errors.email&&
<p className="error-message">{errors.email}</p>}

<input
className={`form-control ${
regStudentId &&
(studentIdValid?"valid-input":"invalid-input")
}`}
placeholder="Student ID"
maxLength={7}
value={regStudentId}
onChange={(e)=>
setRegStudentId(
e.target.value.replace(/[^0-9]/g,"")
)}
/>
{errors.studentId&&
<p className="error-message">{errors.studentId}</p>}

<input
type="password"
className={`form-control ${
regPassword &&
(passwordValid?"valid-input":"invalid-input")
}`}
placeholder="Password"
value={regPassword}
onChange={(e)=>setRegPassword(e.target.value)}
/>
{errors.password&&
<p className="error-message">{errors.password}</p>}

<input
type="password"
className={`form-control ${
regConfirmPassword &&
(confirmPasswordValid?"valid-input":"invalid-input")
}`}
placeholder="Confirm Password"
value={regConfirmPassword}
onChange={(e)=>setRegConfirmPassword(e.target.value)}
/>
{errors.confirmPassword&&
<p className="error-message">
{errors.confirmPassword}
</p>}

<button
className="success-btn"
onClick={handleRegister}
>
Register
</button>

</div>
)}

</div>
</div>

<div className="right-panel">
<img src={hero} alt="" className="hero-img"/>
</div>

</div>
);
}
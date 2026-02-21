import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../../styles/Login.css";

export default function StudentRegister() {

const navigate = useNavigate();

const [formData,setFormData]=useState({
 studentId:"",
 email:"",
 password:"",
 confirmPassword:""
});

const [loading,setLoading]=useState(false);
const [showToast,setShowToast]=useState(false);

/* ---------- VALIDATION ---------- */

const emailValid =
/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/
.test(formData.email);

const studentIdValid=/^\d{7}$/
.test(formData.studentId);

const passwordValid=(()=>{
 const v=formData.password;
 return(
  v.length>=6 &&
  (v.match(/\d/g)||[]).length>=3 &&
  /[!@#$%^&*]/.test(v) &&
  /[A-Za-z]/.test(v)
 );
})();

const confirmPasswordValid=
formData.password===formData.confirmPassword &&
formData.confirmPassword.length>0;

function handleChange(e){
 setFormData({
  ...formData,
  [e.target.name]:e.target.value
 });
}

async function handleRegister(e){
 e.preventDefault();

 if(!emailValid||
    !studentIdValid||
    !passwordValid||
    !confirmPasswordValid) return;

 try{
  setLoading(true);

  await axios.post(
   "https://college-placement-backend-fup4.onrender.com/api/auth/register",
   {
    studentId:formData.studentId.trim(),
    email:formData.email.trim(),
    password:formData.password.trim()
   }
  );

  setShowToast(true);

  setTimeout(()=>{
   navigate("/login/student");
  },2000);

 }finally{
  setLoading(false);
 }
}

return(
<div className="auth-container">

{showToast &&
<div className="toast-success">
 Registration Successful 🎉
</div>}

<div className="auth-card">
<h2>Student Registration</h2>

<form onSubmit={handleRegister}>

<div className="input-group">
<input
 name="studentId"
 placeholder="Student ID"
 value={formData.studentId}
 onChange={handleChange}
/>
{formData.studentId &&
(studentIdValid ?
<FaCheckCircle className="valid-icon"/> :
<FaTimesCircle className="invalid-icon"/>
)}
</div>

<div className="input-group">
<input
 name="email"
 placeholder="Email"
 value={formData.email}
 onChange={handleChange}
/>
{formData.email &&
(emailValid ?
<FaCheckCircle className="valid-icon"/> :
<FaTimesCircle className="invalid-icon"/>
)}
</div>

<div className="input-group">
<input
 type="password"
 name="password"
 placeholder="Password"
 value={formData.password}
 onChange={handleChange}
/>
{formData.password &&
(passwordValid ?
<FaCheckCircle className="valid-icon"/> :
<FaTimesCircle className="invalid-icon"/>
)}
</div>

<div className="input-group">
<input
 type="password"
 name="confirmPassword"
 placeholder="Confirm Password"
 value={formData.confirmPassword}
 onChange={handleChange}
/>
{formData.confirmPassword &&
(confirmPasswordValid ?
<FaCheckCircle className="valid-icon"/> :
<FaTimesCircle className="invalid-icon"/>
)}
</div>

<button
type="submit"
disabled={
 !emailValid||
 !studentIdValid||
 !passwordValid||
 !confirmPasswordValid||
 loading
}>
{loading?"Registering...":"Register"}
</button>

</form>
</div>
</div>
);
}
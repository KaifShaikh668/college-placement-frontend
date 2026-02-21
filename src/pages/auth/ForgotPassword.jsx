import React, { useState } from "react";
import "../../styles/Login.css";

import logo from "../../assets/images/logo.png";
import hero from "../../assets/images/hero.png";

export default function ForgotPassword() {

const [email,setEmail]=useState("");

const handleSubmit=(e)=>{
e.preventDefault();
alert("Password reset link will be sent to email");
};

return(

<div className="login-wrapper">

<div className="left-panel">

<img
src={logo}
alt="College Placement Cell Logo"
className="login-logo"
/>

<h1 className="project-title">
Forgot Password – College Placement Cell
</h1>

<div className="auth-card shadow">

<h3 className="text-center">
Reset Password
</h3>

<form onSubmit={handleSubmit}>

<input
type="email"
className="form-control"
placeholder="Enter Registered Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<button
type="submit"
className="primary-btn w-100"
>
Send Reset Link
</button>

</form>

</div>
</div>

<div className="right-panel">
<img
src={hero}
alt="Password recovery illustration"
className="hero-img"
/>
</div>

</div>
);
}
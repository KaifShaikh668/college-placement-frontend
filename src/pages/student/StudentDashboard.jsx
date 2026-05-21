// -------------------- IMPORTS --------------------
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../utils/api";
import "../../styles/Dashboard.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaBell } from "react-icons/fa";

// -------------------- COMPONENT --------------------
export default function StudentDashboard() {

const navigate = useNavigate();

// ---------------- SAFE STUDENT ----------------
const student = useMemo(()=>{
  try{
    const data = localStorage.getItem("student");
    return data ? JSON.parse(data) : null;
  }catch{
    return null;
  }
},[]);

useEffect(()=>{
  if(!student){
    navigate("/login/student");
  }
},[student,navigate]);

// ---------------- LOGOUT ----------------
const handleLogout=()=>{
  localStorage.removeItem("student");
  localStorage.removeItem("studentToken");
  navigate("/login/student");
};

// ---------------- PROFILE COMPLETION ----------------
const [completion,setCompletion]=useState(
Number(localStorage.getItem("profileCompletion"))||0
);

useEffect(()=>{
const updateCompletion=()=>{
setCompletion(
Number(localStorage.getItem("profileCompletion"))||0
);
};

window.addEventListener("storage",updateCompletion);
updateCompletion();

return()=>window.removeEventListener("storage",updateCompletion);

},[]);

// -------------------- STATS --------------------
const [stats,setStats]=useState({
totalApplications:0,
applied:0,
shortlisted:0,
selected:0,
rejected:0
});

// -------------------- NOTIFICATIONS ----------------
const [notifications,setNotifications]=useState([]);
const [notifCount,setNotifCount]=useState(0);
const [showNotif,setShowNotif]=useState(false);

// -------------------- JOB DRIVES ----------------
const [drives,setDrives]=useState([]);

// ---------------- FETCH DASHBOARD ----------------
const fetchDashboard=async()=>{

try{

// STATS
const statsRes=await API.get("/student/stats");
const s=statsRes.data?.data||statsRes.data||{};

setStats({
totalApplications:s.totalApplications??0,
applied:s.applied??0,
shortlisted:s.shortlisted??0,
selected:s.selected??0,
rejected:s.rejected??0
});

// NOTIFICATIONS
const notifRes=
await API.get("/notifications/student");

const list=Array.isArray(notifRes.data)
?notifRes.data
:notifRes.data?.data||[];

setNotifications(list);
setNotifCount(
list.filter(n=>!n.isRead).length
);

// JOB DRIVES LIVE
const driveRes=
await API.get("/jobs/student");

setDrives(
driveRes.data?.data||
driveRes.data||
[]
);

}catch(err){
console.error("Dashboard load error",err);
}
};

// ---------------- AUTO REFRESH ----------------
useEffect(()=>{

fetchDashboard();

// every 10 sec refresh
const interval=setInterval(()=>{
fetchDashboard();
},10000);

return()=>clearInterval(interval);

},[]);

// ---------------- APPLY JOB ----------------
const applyJob=async(jobId)=>{

try{

await API.post("/applications/apply",{
jobId
});

alert("Applied Successfully");

fetchDashboard();

}catch(err){
alert(
err.response?.data?.message||
"Application failed"
);
}
};

// ---------------- MODAL ----------------
const [showDriveModal,setShowDriveModal]=
useState(false);

const [selectedDrive,setSelectedDrive]=
useState(null);

const openDriveModal=(drive)=>{
setSelectedDrive(drive);
setShowDriveModal(true);
};

const latestNotices=
notifications.slice(0,4);

// ---------------- UI ----------------
return(

<StudentLayout>

<div className="dashboard-wrapper">

{/* HEADER */}
<div className="dashboard-header">

<div>
<h2>
Welcome, {student?.name||"Student"}
</h2>
<p>{student?.email}</p>
</div>

<div style={{display:"flex",gap:"15px"}}>

{/* NOTIFICATION BELL */}
<div
className="notification-bell"
onClick={()=>setShowNotif(!showNotif)}
style={{cursor:"pointer",position:"relative"}}
>

<FaBell size={20}/>

{notifCount>0&&(
<span className="notif-badge">
{notifCount}
</span>
)}

</div>

</div>

</div>

{/* NOTIFICATION DROPDOWN */}
{showNotif&&(
<div className="notif-dropdown">

{notifications.length===0?
<p>No Notifications</p>
:
notifications.map(n=>(
<p key={n._id}>{n.title}</p>
))
}

</div>
)}

{/* STATS */}
<div className="stats-grid">

<div className="stat-card">
<h3>{stats.totalApplications}</h3>
<p>Total Applications</p>
</div>

<div className="stat-card">
<h3>{stats.applied}</h3>
<p>Applied</p>
</div>

<div className="stat-card">
<h3>{notifCount}</h3>
<p>Notifications</p>
</div>

<div className="stat-card">
<h3>{completion}%</h3>
<p>Profile Completion</p>
</div>

</div>

{/* MAIN GRID */}
<div className="main-grid">

{/* JOB DRIVES */}
<div className="card drives-card">
<h4>Upcoming Job Drives</h4>

{drives.length===0?(
<p>No drives available</p>
):
drives.map(d=>(
<div
key={d._id}
className="drive-row"
>

<div>
<b>{d.company}</b> — {d.role}
</div>

<div style={{display:"flex",gap:"10px"}}>

<button
className="btn small-blue"
onClick={()=>openDriveModal(d)}
>
View
</button>

<button
className="btn small-green"
onClick={()=>applyJob(d._id)}
>
Apply
</button>

</div>

</div>
))
}

</div>

{/* RIGHT SIDE */}
<div className="right-column">

<div className="card notice-card">
<h4>Notices</h4>

{latestNotices.length===0?
<p style={{color:"#666"}}>
No notices available
</p>
:
latestNotices.map(n=>(
<p key={n._id}>{n.title}</p>
))
}

</div>

<div className="card activity-card">
<h4>Recent Activity</h4>
<p>Profile viewed</p>
<p>{stats.applied} jobs applied</p>
<p>Notifications checked</p>
</div>

</div>

</div>

</div>

{/* MODAL */}
<Modal
show={showDriveModal}
onHide={()=>setShowDriveModal(false)}
centered
>

<Modal.Header closeButton>
<Modal.Title>
{selectedDrive?.company}
{" — "}
{selectedDrive?.role}
</Modal.Title>
</Modal.Header>

<Modal.Body>
<p>{selectedDrive?.description}</p>
<p><b>Date:</b> {selectedDrive?.date}</p>
<p><b>Location:</b> {selectedDrive?.location}</p>
<p><b>Salary:</b> {selectedDrive?.salary}</p>
<p><b>Eligibility:</b> {selectedDrive?.eligibility}</p>
</Modal.Body>

<Modal.Footer>
<Button
onClick={()=>setShowDriveModal(false)}
>
Close
</Button>
</Modal.Footer>

</Modal>

</StudentLayout>
);
}
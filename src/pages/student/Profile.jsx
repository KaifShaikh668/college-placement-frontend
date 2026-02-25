// ---------------- IMPORTS ----------------
import React, { useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../utils/api";
import "../../styles/Profile.css";

export default function Profile() {

const [activeTab,setActiveTab]=useState("personal");

const [studentData,setStudentData]=useState(null);
const [loading,setLoading]=useState(true);
const [saving,setSaving]=useState(false);

const [form,setForm]=useState({
gender:"",
dob:"",
aadhaar:"",
street:"",
city:"",
state:"",
pincode:"",
ssc:"",
hsc:"",
graduation:"",
cgpa:"",
resumeName:"",
profilePic:""
});

/* ---------------- FETCH PROFILE ---------------- */
const fetchStudentProfile=async()=>{
try{

const res=await API.get("/student/me");

/* ✅ SUPPORT BOTH RESPONSE TYPES */
const data=res.data?.data || res.data;

setStudentData(data || {});

setForm({
gender:data?.profile?.gender || "",
dob:data?.profile?.dob || "",
aadhaar:data?.profile?.aadhaar || "",

street:data?.profile?.address?.street || "",
city:data?.profile?.address?.city || "",
state:data?.profile?.address?.state || "",
pincode:data?.profile?.address?.pincode || "",

ssc:data?.profile?.academics?.ssc || "",
hsc:data?.profile?.academics?.hsc || "",
graduation:data?.profile?.academics?.graduation || "",
cgpa:data?.profile?.academics?.cgpa || "",

resumeName:data?.profile?.resumeName || "",
profilePic:data?.profile?.profilePic || ""
});

}catch(err){
console.error("Profile fetch error:",err);
alert("Session expired. Please login again.");
}
finally{
setLoading(false);
}
};

useEffect(()=>{
fetchStudentProfile();
},[]);

/* ---------------- INPUT CHANGE ---------------- */
const handleChange=(e)=>{
const{name,value}=e.target;

if(["ssc","hsc","cgpa"].includes(name)){
if(!/^[0-9]*$/.test(value)) return;
}

setForm(prev=>({
...prev,
[name]:value
}));
};

/* ---------------- PROFILE PIC ---------------- */
const handleProfilePic=(e)=>{
const file=e.target.files[0];
if(!file)return;

const reader=new FileReader();

reader.onload=()=>{
setForm(prev=>({
...prev,
profilePic:reader.result
}));
};

reader.readAsDataURL(file);
};

/* ---------------- RESUME ---------------- */
const handleResumeUpload=(e)=>{
const file=e.target.files[0];
if(!file)return;

if(file.type!=="application/pdf"){
alert("Upload PDF only");
return;
}

setForm(prev=>({
...prev,
resumeName:file.name
}));
};

/* ---------------- VALIDATION ---------------- */
const errors=useMemo(()=>({
aadhaar:
form.aadhaar &&
form.aadhaar.length!==12
?"Aadhaar must be 12 digits":"",

pincode:
form.pincode &&
form.pincode.length!==6
?"Pincode must be 6 digits":""
}),[form]);

/* ---------------- COMPLETION ---------------- */
const completion=useMemo(()=>{

const fields=[
"gender","dob","aadhaar",
"street","city","state","pincode",
"ssc","hsc","graduation","cgpa"
];

const filled=fields.filter(
k=>form[k]?.toString().trim()!==""
).length;

return Math.round((filled/fields.length)*100);

},[form]);

/* ---------------- SAVE PROFILE ---------------- */
const saveProfile=async()=>{

if(errors.aadhaar||errors.pincode){
alert("Fix errors before saving");
return;
}

try{
setSaving(true);

await API.put("/student/me",{
gender:form.gender,
dob:form.dob,
aadhaar:form.aadhaar,

street:form.street,
city:form.city,
state:form.state,
pincode:form.pincode,

ssc:form.ssc,
hsc:form.hsc,
graduation:form.graduation,
cgpa:form.cgpa,

resumeName:form.resumeName,
profilePic:form.profilePic
});

localStorage.setItem(
"profileCompletion",
completion
);

alert("✅ Profile Updated");

fetchStudentProfile();

}catch(err){
console.error(err);
alert("Failed to save profile");
}
finally{
setSaving(false);
}
};

/* ---------------- LOADING ---------------- */
if(loading){
return(
<StudentLayout>
<div className="profile-wrapper">
<p style={{padding:"20px"}}>
Loading profile...
</p>
</div>
</StudentLayout>
);
}

/* ---------------- UI ---------------- */
return(
<StudentLayout>

<div className="profile-wrapper">

{/* HEADER CARD */}
<div className="portal-top-card">

<div className="portal-left">

<label className="portal-avatar">

<img
src={
form.profilePic ||
"https://ui-avatars.com/api/?name=Student"
}
alt="profile"
/>

<input
type="file"
accept="image/*"
onChange={handleProfilePic}
/>

<span className="avatar-edit">
Change
</span>

</label>

<div className="portal-basic">

<h2 className="portal-name">
{studentData?.name || "Student"}
</h2>

<p className="portal-sub">
Student ID:
<b> {studentData?.studentId}</b>
</p>

<div className="portal-tags">
<span>Dept: {studentData?.department}</span>
<span>Year: {studentData?.year}</span>
<span>Mobile: {studentData?.contactNumber}</span>
</div>

<p className="portal-email">
{studentData?.email}
</p>

</div>
</div>

<div className="portal-right">

<p className="completion-label">
Profile Completion
</p>

<p className="completion-value">
{completion}%
</p>

<div className="portal-progress">
<div
className="portal-progress-fill"
style={{width:`${completion}%`}}
/>
</div>

<button
className="portal-save-btn"
onClick={saveProfile}
disabled={saving}
>
{saving?"Saving...":"Save Profile"}
</button>

</div>

</div>

</div>

</StudentLayout>
);
}
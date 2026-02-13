import React, { useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../utils/api";
import "../../styles/Profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    gender: "",
    dob: "",
    aadhaar: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    ssc: "",
    hsc: "",
    graduation: "",
    cgpa: "",
    resumeName: "",
    profilePic: "",
  });

  /* ---------------- LOAD PROFILE FROM DB ---------------- */
  const fetchStudentProfile = async () => {
    try {
      const res = await API.get("/student/me");

      setStudentData(res.data);

      setForm({
        gender: res.data?.profile?.gender || "",
        dob: res.data?.profile?.dob || "",
        aadhaar: res.data?.profile?.aadhaar || "",
        street: res.data?.profile?.address?.street || "",
        city: res.data?.profile?.address?.city || "",
        state: res.data?.profile?.address?.state || "",
        pincode: res.data?.profile?.address?.pincode || "",
        ssc: res.data?.profile?.academics?.ssc || "",
        hsc: res.data?.profile?.academics?.hsc || "",
        graduation: res.data?.profile?.academics?.graduation || "",
        cgpa: res.data?.profile?.academics?.cgpa || "",
        resumeName: res.data?.profile?.resumeName || "",
        profilePic: res.data?.profile?.profilePic || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      alert("Failed to load profile. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  /* ---------------- PROFILE COMPLETION ---------------- */
  const completion = useMemo(() => {
    const fieldsToCount = [
      "gender","dob","aadhaar","street","city","state",
      "pincode","ssc","hsc","graduation","cgpa",
    ];

    const total = fieldsToCount.length;
    const filled = fieldsToCount.filter(
      (key) => form[key]?.toString().trim() !== ""
    ).length;

    return Math.round((filled / total) * 100);
  }, [form]);

  const allStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal",
    "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli",
    "Daman & Diu","Delhi","Lakshadweep","Puducherry","Ladakh","Jammu & Kashmir"
  ];

  const graduationCourses = [
    "Bachelor of Arts (B.A)",
    "Bachelor of Commerce (B.Com)",
    "Bachelor of Science (B.Sc.)",
    "Bachelor of Management Studies (B.M.S.)",
    "B.Sc (Information Technology)",
  ];

  if (loading) {
    return (
      <StudentLayout>
        <div className="profile-wrapper">
          <p style={{ padding: "20px" }}>Loading profile...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="profile-wrapper">

        {/* HEADER */}
        <div className="portal-top-card">
          <div className="portal-left">
            <div className="portal-avatar">
              <img
                src={form.profilePic || "/default-avatar.png"}
                alt="profile"
              />
            </div>

            <div className="portal-basic">
              <h2 className="portal-name">{studentData?.name || "Student"}</h2>
              <p className="portal-sub">
                Student ID: <b>{studentData?.studentId}</b>
              </p>

              <div className="portal-tags">
                <span>Dept: {studentData?.department}</span>
                <span>Year: {studentData?.year}</span>
                <span>Mobile: {studentData?.contactNumber}</span>
              </div>

              <p className="portal-email">{studentData?.email}</p>
            </div>
          </div>

          <div className="portal-right">
            <p className="completion-label">Profile Completion</p>
            <p className="completion-value">{completion}%</p>
            <div className="portal-progress">
              <div
                className="portal-progress-fill"
                style={{ width: `${completion}%` }}
              />
            </div>
            <button className="portal-save-btn" disabled>
              View Only
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="portal-tabs">
          <button
            className={activeTab === "personal" ? "ptab active" : "ptab"}
            onClick={() => setActiveTab("personal")}
          >
            Personal Details
          </button>
          <button
            className={activeTab === "address" ? "ptab active" : "ptab"}
            onClick={() => setActiveTab("address")}
          >
            Address Details
          </button>
          <button
            className={activeTab === "academics" ? "ptab active" : "ptab"}
            onClick={() => setActiveTab("academics")}
          >
            Academic Details
          </button>
        </div>

        {/* PERSONAL */}
        {activeTab === "personal" && (
          <div className="portal-card">
            <h3 className="portal-title">Personal Details</h3>
            <div className="portal-grid">

              <div className="portal-field">
                <label>Gender</label>
                <select value={form.gender} disabled>
                  <option>{form.gender || "Not Provided"}</option>
                </select>
              </div>

              <div className="portal-field">
                <label>Date of Birth</label>
                <input type="date" value={form.dob} disabled />
              </div>

              <div className="portal-field">
                <label>Aadhaar Number</label>
                <input value={form.aadhaar} disabled />
              </div>

            </div>
          </div>
        )}

        {/* ADDRESS */}
        {activeTab === "address" && (
          <div className="portal-card">
            <h3 className="portal-title">Address Details</h3>
            <div className="portal-grid">

              <div className="portal-field">
                <label>Permanent Address</label>
                <input value={form.street} disabled />
              </div>

              <div className="portal-field">
                <label>City</label>
                <input value={form.city} disabled />
              </div>

              <div className="portal-field">
                <label>State</label>
                <select value={form.state} disabled>
                  <option>{form.state || "Not Provided"}</option>
                </select>
              </div>

              <div className="portal-field">
                <label>Pincode</label>
                <input value={form.pincode} disabled />
              </div>

            </div>
          </div>
        )}

        {/* ACADEMICS */}
        {activeTab === "academics" && (
          <div className="portal-card">
            <h3 className="portal-title">Academic Details</h3>
            <div className="portal-grid">

              <div className="portal-field">
                <label>SSC Percentage</label>
                <input value={form.ssc} disabled />
              </div>

              <div className="portal-field">
                <label>HSC Percentage</label>
                <input value={form.hsc} disabled />
              </div>

              <div className="portal-field">
                <label>Graduation Course</label>
                <select value={form.graduation} disabled>
                  <option>{form.graduation || "Not Provided"}</option>
                </select>
              </div>

              <div className="portal-field">
                <label>CGPA / Percentage</label>
                <input value={form.cgpa} disabled />
              </div>

              <div className="portal-field">
                <label>Resume</label>
                <input value={form.resumeName || "Not Uploaded"} disabled />
              </div>

            </div>
          </div>
        )}

      </div>
    </StudentLayout>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../utils/api";
import "../../styles/Profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["ssc", "hsc", "cgpa"].includes(name)) {
      if (!/^[0-9]*$/.test(value)) return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- PROFILE PIC UPLOAD (DB) ---------------- */
  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        profilePic: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- RESUME UPLOAD ---------------- */
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Upload PDF only.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      resumeName: file.name,
    }));
  };

  /* ---------------- VALIDATION ---------------- */
  const errors = useMemo(() => {
    return {
      aadhaar:
        form.aadhaar && form.aadhaar.length !== 12
          ? "Aadhaar must be 12 digits"
          : "",
      pincode:
        form.pincode && form.pincode.length !== 6
          ? "Pincode must be 6 digits"
          : "",
    };
  }, [form.aadhaar, form.pincode]);

  /* ---------------- PROFILE COMPLETION ---------------- */
  const completion = useMemo(() => {
    const fieldsToCount = [
      "gender",
      "dob",
      "aadhaar",
      "street",
      "city",
      "state",
      "pincode",
      "ssc",
      "hsc",
      "graduation",
      "cgpa",
    ];

    const total = fieldsToCount.length;
    const filled = fieldsToCount.filter(
      (key) => form[key]?.toString().trim() !== ""
    ).length;

    return Math.round((filled / total) * 100);
  }, [form]);

  /* ---------------- SAVE TO DB ---------------- */
  const saveProfile = async () => {
    if (errors.aadhaar || errors.pincode) {
      alert("Please fix the errors before saving.");
      return;
    }

    try {
      setSaving(true);

      await API.put("/student/me", {
        gender: form.gender,
        dob: form.dob,
        aadhaar: form.aadhaar,

        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode,

        ssc: form.ssc,
        hsc: form.hsc,
        graduation: form.graduation,
        cgpa: form.cgpa,

        resumeName: form.resumeName,
        profilePic: form.profilePic,
      });

      localStorage.setItem("profileCompletion", completion);

      alert("✅ Profile updated successfully!");
      fetchStudentProfile();
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("❌ Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- LISTS ---------------- */
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
        {/* ✅ PORTAL HEADER CARD */}
        <div className="portal-top-card">
          <div className="portal-left">
            <label className="portal-avatar">
              <img
                src={form.profilePic || "/default-avatar.png"}
                alt="profile"
              />
              <input type="file" accept="image/*" onChange={handleProfilePic} />
              <span className="avatar-edit">Change</span>
            </label>

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
            <button
              className="portal-save-btn"
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>

        {/* ✅ PORTAL TABS */}
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

        {/* ✅ PERSONAL DETAILS */}
        {activeTab === "personal" && (
          <div className="portal-card">
            <h3 className="portal-title">Personal Details</h3>

            <div className="portal-grid">
              <div className="portal-field">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="portal-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                />
              </div>

              <div className="portal-field">
                <label>Aadhaar Number</label>
                <input
                  name="aadhaar"
                  maxLength="12"
                  value={form.aadhaar}
                  onChange={handleChange}
                />
                {errors.aadhaar && <p className="error">{errors.aadhaar}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ✅ ADDRESS DETAILS */}
        {activeTab === "address" && (
          <div className="portal-card">
            <h3 className="portal-title">Address Details</h3>

            <div className="portal-grid">
              <div className="portal-field">
                <label>Permanent Address</label>
                <input
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                />
              </div>

              <div className="portal-field">
                <label>City</label>
                <input name="city" value={form.city} onChange={handleChange} />
              </div>

              <div className="portal-field">
                <label>State</label>
                <select name="state" value={form.state} onChange={handleChange}>
                  <option value="">Select State</option>
                  {allStates.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="portal-field">
                <label>Pincode</label>
                <input
                  name="pincode"
                  maxLength="6"
                  value={form.pincode}
                  onChange={handleChange}
                />
                {errors.pincode && <p className="error">{errors.pincode}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ✅ ACADEMIC DETAILS */}
        {activeTab === "academics" && (
          <div className="portal-card">
            <h3 className="portal-title">Academic Details</h3>

            <div className="portal-grid">
              <div className="portal-field">
                <label>SSC Percentage</label>
                <input
                  name="ssc"
                  maxLength="3"
                  value={form.ssc}
                  onChange={handleChange}
                />
              </div>

              <div className="portal-field">
                <label>HSC Percentage</label>
                <input
                  name="hsc"
                  maxLength="3"
                  value={form.hsc}
                  onChange={handleChange}
                />
              </div>

              <div className="portal-field">
                <label>Graduation Course</label>
                <select
                  name="graduation"
                  value={form.graduation}
                  onChange={handleChange}
                >
                  <option value="">Select Course</option>
                  {graduationCourses.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="portal-field">
                <label>CGPA / Percentage</label>
                <input
                  name="cgpa"
                  maxLength="3"
                  value={form.cgpa}
                  onChange={handleChange}
                />
              </div>

              <div className="portal-field">
                <label>Upload Resume (PDF)</label>
                <input type="file" accept=".pdf" onChange={handleResumeUpload} />
                {form.resumeName && (
                  <p className="resume-preview">Uploaded: {form.resumeName}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

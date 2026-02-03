import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// PUBLIC PAGES ✅
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Departments from "./pages/public/Departments";

// AUTH
import StudentLogin from "./pages/auth/StudentLogin";
import StudentRegister from "./pages/auth/StudentRegister";
import AdminLogin from "./pages/auth/AdminLogin";

// STUDENT PAGES
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import AppliedJobs from "./pages/student/AppliedJobs";
import JobDrives from "./pages/student/JobDrives";
import Notifications from "./pages/student/Notifications";

// ADMIN
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageApplications from "./pages/admin/ManageApplications";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageDrives from "./pages/admin/ManageDrives";
import ManageNotices from "./pages/admin/ManageNotices";

// Student Route Protection
const StudentProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("studentToken");
  return token ? children : <Navigate to="/login/student" replace />;
};

// Admin Route Protection
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ✅ ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/departments" element={<Departments />} />

        {/* ================= AUTH ================= */}
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ================= STUDENT ROUTES ================= */}
        <Route
          path="/student/dashboard"
          element={
            <StudentProtectedRoute>
              <StudentDashboard />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <StudentProtectedRoute>
              <Profile />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/applied-jobs"
          element={
            <StudentProtectedRoute>
              <AppliedJobs />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/job-drives"
          element={
            <StudentProtectedRoute>
              <JobDrives />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/notifications"
          element={
            <StudentProtectedRoute>
              <Notifications />
            </StudentProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-drives" element={<ManageDrives />} />
          <Route path="manage-applications" element={<ManageApplications />} />
          <Route path="notices" element={<ManageNotices />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

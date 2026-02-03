import axios from "axios";

const API = axios.create({
  baseURL: "https://college-placement-backend-fup4.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const studentToken = localStorage.getItem("studentToken");
  const adminToken = localStorage.getItem("adminToken");

  // ✅ Admin token should be sent for admin APIs
  if (
    (req.url?.startsWith("/admin") || req.url?.includes("/notifications/admin")) &&
    adminToken
  ) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  }

  // ✅ Otherwise student token
  else if (studentToken) {
    req.headers.Authorization = `Bearer ${studentToken}`;
  }

  return req;
});

export default API;

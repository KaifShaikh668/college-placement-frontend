import axios from "axios";

const API = axios.create({
  baseURL: "https://college-placement-backend-fup4.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const adminToken = localStorage.getItem("adminToken");
  const studentToken = localStorage.getItem("studentToken");

  // Ensure headers object exists
  if (!req.headers) {
    req.headers = {};
  }

  // ✅ If admin logged in → always send admin token
  if (adminToken) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  }

  // ✅ Otherwise send student token
  else if (studentToken) {
    req.headers.Authorization = `Bearer ${studentToken}`;
  }

  return req;
});

export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "https://college-placement-backend-fup4.onrender.com/api",
});

// Attach token properly
API.interceptors.request.use((req) => {
  const adminToken = localStorage.getItem("adminToken");
  const studentToken = localStorage.getItem("studentToken");

  if (adminToken) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  } else if (studentToken) {
    req.headers.Authorization = `Bearer ${studentToken}`;
  }

  return req;
});

export default API;

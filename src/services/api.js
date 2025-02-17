import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json,multipart/form-data" },
});

// ✅ Interceptor: เพิ่ม Token ลงใน Header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔍 ส่ง Token:', token); // ✅ Debug ตรวจสอบ Token ที่ถูกส่งไป
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
export { API_BASE_URL };

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://pms-server-production.up.railway.app/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});
// Interceptor สำหรับใส่ Tab ID ลงใน Headers ของทุกคำขอ
api.interceptors.request.use(
  (config) => {
    const tabId = sessionStorage.getItem('tabId');
    if (tabId) {
      config.headers['x-tab-id'] = tabId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor สำหรับจัดการคำตอบ และลอง Refresh Session เมื่อพบ 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.get('/auth/refresh-session');
        if (refreshResponse.data.success) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        sessionStorage.removeItem('tabId'); // ✅ ลบ tabId เมื่อ session หมดอายุ
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };

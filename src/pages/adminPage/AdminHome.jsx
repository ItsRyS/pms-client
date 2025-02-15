import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // แก้ไขให้เรียกใช้ `api` แทน verifyToken

const AdminHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        let tabId = sessionStorage.getItem("tabId");
        if (!tabId) {
          tabId = `${Date.now()}-${Math.random()}`;
          sessionStorage.setItem("tabId", tabId);
        }
        const response = await api.get("/auth/check-session", { headers: { "x-tab-id": tabId } });
        if (!response.data.isAuthenticated) navigate("/SignIn");
      } catch  {
        navigate("/SignIn");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to Admin Home</h1>
      {/* ส่วนอื่น ๆ ของหน้า */}
    </div>
  );
};

export default AdminHome;

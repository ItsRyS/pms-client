import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/auth/check-session");
        if (!response.data.isAuthenticated) {
          navigate("/SignIn");
        }
      } catch {
        navigate("/SignIn");
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to Admin Home</h1>
      {/* เพิ่มเนื้อหาที่ต้องการแสดง */}
    </div>
  );
};

export default AdminHome;

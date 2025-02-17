import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CssBaseline,
  FormLabel,
  FormControl,
  TextField,
  Typography,
  IconButton,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

import api from '../../services/api';
import { useSnackbar } from '../../components/ReusableSnackbar';

// ✅ กำหนดโครงสร้าง Layout หลัก
const RootContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    height: 'auto',
  },
}));

const LeftContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: '#FFA64D',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '2rem',
  color: '#fff',
  [theme.breakpoints.down('sm')]: {
    padding: '1rem',
  },
}));

const RightContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  position: 'relative',
  overflow: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: '1rem',
  },
}));

const FormContainer = styled(Box)({
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

const StyledButton = styled(Button)({
  backgroundColor: '#F7941E',
  '&:hover': { backgroundColor: '#e6851a' },
  fontSize: '1rem',
  padding: '0.75rem',
  borderRadius: '8px',
});

const HomeButton = styled(IconButton)({
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  backgroundColor: '#FFA64D',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#FF8C00',
  },
});

export default function SignIn() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  // ✅ ตรวจสอบและเก็บ Tab ID ใน sessionStorage
  useEffect(() => {
    if (!sessionStorage.getItem('tabId')) {
      sessionStorage.setItem('tabId', `${Date.now()}-${Math.random()}`);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await api.post('/auth/login', data);
      const { role, token } = response.data;

      localStorage.setItem('token', token);
      console.log("🔑 Token ที่ถูกเก็บ:", localStorage.getItem("token"));
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        console.log("📅 Token หมดอายุ:", new Date(decoded.exp * 1000));
      }
      showSnackbar('เข้าสู่ระบบสำเร็จ!', 'success');

      setTimeout(() => {
        navigate(role === 'teacher' ? '/adminHome' : '/studentHome');
      }, 1500);
    } catch (error) {
      setErrors({
        email: 'Email หรือ Password ไม่ถูกต้อง',
      });
      showSnackbar(
        error.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ',
        'error'
      );
    }
  };

  return (
    <>
      <CssBaseline />
      <RootContainer>
        {/* ✅ กล่องซ้าย */}
        <LeftContainer>
          <img
            src="/PMS-logo2.svg"
            alt="IT-PMS Logo"
            style={{ width: '60%', maxWidth: '250px' }}
          />
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
            ระบบการจัดการโครงงาน
          </Typography>
          <Typography variant="body2">
            กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
          </Typography>
        </LeftContainer>

        {/* ✅ กล่องขวา */}
        <RightContainer>
          <FormContainer component="form" onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                fullWidth
                required
                error={!!errors.email} // ✅ ถ้ามี error ให้แสดงเป็น true
                helperText={errors.email || ''} // ✅ แสดงข้อความ error
              />
            </FormControl>

            <FormControl>
              <FormLabel>รหัสผ่าน</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                placeholder="••••••"
                fullWidth
                required
                error={!!errors.password}
                helperText={errors.password || ''}
              />
            </FormControl>

            <StyledButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#FFA64D',
                '&:hover': { backgroundColor: '#FF8C00' },
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                mt: '1rem',
                mb: '4rem',
              }}
            >
              เข้าสู่ระบบ
            </StyledButton>

            <Typography sx={{ textAlign: 'center', mt: 2 }}>
              ยังไม่มีบัญชี?{' '}
              <Link
                href="/signup"
                sx={{ color: '#F7941E', fontWeight: 'bold' }}
              >
                สมัครสมาชิกที่นี่
              </Link>
            </Typography>
          </FormContainer>

          {/* ✅ ปุ่ม Home */}
          <HomeButton component={Link} to="/">
            <HomeIcon />
          </HomeButton>
        </RightContainer>
      </RootContainer>
    </>
  );
}

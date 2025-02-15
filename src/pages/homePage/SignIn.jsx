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
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import HomeIcon from "@mui/icons-material/Home";

import api from '../../services/api';
import { useSnackbar } from '../../components/ReusableSnackbar';

const RootContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  flexDirection: 'row', // Default for larger screens
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column', // Stack items on small screens
  },
}));

const LeftContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: '#F7941E',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  color: '#fff',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    flex: 'none',
    padding: '1rem',
  },
}));

const LogoImage = styled('img')({
  width: '100%',
  maxWidth: '350px', // Adjusted for better scaling
  height: 'auto',
  objectFit: 'contain',
});

const RightContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
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

const BackButton = styled(IconButton)({
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  color: '#000',
});

export default function SignIn() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (!sessionStorage.getItem('tabId')) {
      sessionStorage.setItem('tabId', `${Date.now()}-${Math.random()}`);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await api.post("/auth/login", data);
      const { role, token } = response.data;

      localStorage.setItem("token", token);
      showSnackbar("เข้าสู่ระบบสำเร็จ!", "success");

      setTimeout(() => {
        navigate(role === "teacher" ? "/adminHome" : "/studentHome");
      }, 1500);
    } catch (error) {
      showSnackbar(error.response?.data?.error || "เข้าสู่ระบบไม่สำเร็จ", "error");
      console.error("Failed to login:", setErrors);
    }
  };


  return (
    <>
      <CssBaseline />
      <RootContainer>
        <LeftContainer>
          <LogoImage src="/software.png" alt="IT Logo" />
        </LeftContainer>

        <RightContainer>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            ระบบการจัดการโครงงาน
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
            กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
          </Typography>

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
                error={!!errors.email}
                helperText={errors.email || ''}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
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

            <StyledButton type="submit" variant="contained" fullWidth>
              เข้าสู่ระบบ
            </StyledButton>
            <Typography sx={{ textAlign: 'center', mt: 2 }}>
              ยังไม่มีบัญชี?{' '}
              <Link href="/signup" sx={{ color: '#F7941E', fontWeight: 'bold' }}>
                สมัครสมาชิกที่นี่
              </Link>
            </Typography>
          </FormContainer>

          <BackButton onClick={() => navigate('/')}>
            <HomeIcon fontSize="large" />
          </BackButton>
        </RightContainer>
      </RootContainer>
    </>
  );
}

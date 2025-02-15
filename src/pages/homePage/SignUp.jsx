import { useState } from 'react';
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

const RootContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
});

const LeftContainer = styled(Box)({
  flex: 1,
  backgroundColor: '#F7941E',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  textAlign: 'center',
  padding: '2rem',
});

const LogoImage = styled('img')({
  width: '580px',
  height: '580px',
  objectFit: 'contain',
});

const RightContainer = styled(Box)({
  flex: 1,
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  position: 'relative',
});

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

export default function SignUp() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    setErrors({});
    try {
      const response = await api.post('/auth/register', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 201) {
        showSnackbar('สมัครสมาชิกสำเร็จ! กำลังเปลี่ยนหน้า...', 'success');
        setTimeout(() => navigate('/signin'), 2000);
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่',
        'error'
      );
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
            สมัครสมาชิก
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
            กรุณากรอกข้อมูลเพื่อสมัครสมาชิก
          </Typography>

          <FormContainer component="form" onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>ชื่อผู้ใช้</FormLabel>
              <TextField
                id="username"
                name="username"
                type="text"
                placeholder="ชื่อของคุณ"
                fullWidth
                required
                error={!!errors.username}
                helperText={errors.username || ''}
              />
            </FormControl>

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

            <StyledButton type="submit" variant="contained" fullWidth>
              สมัครสมาชิก
            </StyledButton>
            <Typography sx={{ textAlign: 'center', mt: 2 }}>
              มีบัญชีอยู่แล้ว?{' '}
              <Link href="/signin" sx={{ color: '#F7941E', fontWeight: 'bold' }}>
                เข้าสู่ระบบที่นี่
              </Link>
            </Typography>
          </FormContainer>

          <BackButton onClick={() => navigate('/')}> <HomeIcon fontSize="large" /> </BackButton>
        </RightContainer>
      </RootContainer>
    </>
  );
}

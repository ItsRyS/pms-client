import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Avatar,
  Tooltip,
  Grid,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff, CameraAlt } from '@mui/icons-material';
import api from '../../services/api';
import { useSnackbar } from '../../components/ReusableSnackbar';

const ProfileUser = () => {
  const { updateProfileImage, updateUserData } = useOutletContext();
  const [initialUser, setInitialUser] = useState(null);
  const [user, setUser] = useState({
    id: '',
    username: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    profileImage: '',
  });

  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/me');
        const { id, username, email, role, profile_image } = response.data;
        const userData = {
          id,
          username,
          email,
          role,
          profileImage: profile_image,
          password: '',
          confirmPassword: '',
        };
        setUser(userData);
        setInitialUser(userData);
      } catch {
        showSnackbar('Failed to fetch user data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [showSnackbar]);

  const hasChanges = () => {
    if (!initialUser) return false;
    return (
      user.username !== initialUser.username ||
      user.email !== initialUser.email ||
      user.password !== '' ||
      user.confirmPassword !== ''
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showSnackbar('File size exceeds the maximum limit of 2MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await api.post('/users/upload-profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser((prevUser) => ({
        ...prevUser,
        profileImage: response.data.profileImage,
      }));

      if (updateProfileImage) {
        updateProfileImage(response.data.profileImage);
      }
      if (updateUserData) {
        updateUserData(user.username, response.data.profileImage);
      }

      showSnackbar('Profile picture updated successfully', 'success');
    } catch {
      showSnackbar('Failed to upload profile picture', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password && user.password !== user.confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return;
    }

    try {
      const payload = {
        username: user.username,
        email: user.email,
        role: user.role,
        ...(user.password && { password: user.password }),
      };

      const response = await api.put(`/users/${user.id}`, payload);
      if (response.status === 200) {
        // Detailed success messages
        if (user.username !== initialUser.username) {
          showSnackbar('Username updated successfully', 'success');
        }
        if (user.email !== initialUser.email) {
          showSnackbar('Email updated successfully', 'success');
        }
        if (user.password) {
          showSnackbar('Password changed successfully', 'success');
        }

        if (updateUserData) {
          updateUserData(user.username, user.profileImage);
        }

        const tabId = sessionStorage.getItem('tabId');
        if (tabId) {
          await api.post('/auth/update-session', {
            tabId,
            username: user.username,
            profileImage: user.profileImage,
          });
        }

        // Reset password fields and update initial state
        setUser(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
        setInitialUser(prev => ({
          ...prev,
          username: user.username,
          email: user.email
        }));
      }
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Failed to update profile', 'error');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Edit Profile
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left Column - Profile Image */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="profile-image-upload">
                  <Tooltip title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์" arrow>
                    <Avatar
                      src={
                        user.profileImage
                          ? `http://localhost:5000/${user.profileImage}`
                          : 'https://i.pravatar.cc/300'
                      }
                      sx={{
                        width: 200,
                        height: 200,
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    >
                      <CameraAlt
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '50%',
                          padding: 1,
                          color: 'white',
                        }}
                      />
                    </Avatar>
                  </Tooltip>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProfileImageChange}
                  />
                </label>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {user.username}
                </Typography>
                <Typography color="textSecondary">{user.role}</Typography>
              </Box>
            </Grid>

            {/* Right Column - Form Fields */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={user.password}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={user.confirmPassword}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!hasChanges()}
                    fullWidth
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ProfileUser;
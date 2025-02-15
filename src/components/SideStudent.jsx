import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Divider,
  Typography,
  Avatar,
  Toolbar,
  Skeleton,
} from '@mui/material';
import { Home, School, Assignment, PresentToAll } from '@mui/icons-material';
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import api,{ API_BASE_URL } from '../services/api';
import { useSnackbar } from '../components/ReusableSnackbar';

// Constants
const drawerWidth = 240;
const COLORS = {
  drawer: '#EEEDED',
  divider: '#374151',
  text: {
    primary: '#000000',
    secondary: '#374151',
  },
};

// Memoized User Info Component
const UserInfo = React.memo(({ username, role, profileImage, loading }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
    {loading ? (
      <>
        <Skeleton variant="circular" width={100} height={100} />
        <Skeleton variant="text" width={120} sx={{ mt: 1 }} />
        <Skeleton variant="text" width={80} />
      </>
    ) : (
      <>
        <Avatar src={profileImage ? `${API_BASE_URL}/${profileImage}` : "/default-avatar.png"} sx={{ width: 100, height: 100 }} />
        <Typography variant="body1">{username}</Typography>
        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>{role}</Typography>
      </>
    )}
    <Divider sx={{ width: "100%", mt: 2 }} />
  </Box>
));

UserInfo.displayName = 'UserInfo';

UserInfo.propTypes = {
  username: PropTypes.string,
  role: PropTypes.string,
  profileImage: PropTypes.string,
  loading: PropTypes.bool,
};

const SideStudent = ({ mobileOpen, handleDrawerToggle, setTitle }) => {
  const [username, setUsername] = useState('Loading...');
  const [role, setRole] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
  const updateUserData = (newUsername, newProfileImage) => {
    if (newUsername) setUsername(newUsername);
    if (newProfileImage) setProfileImage(newProfileImage);
  };

  // ส่งฟังก์ชันนี้ไปยัง ProfileUser ผ่าน useOutletContext
  useOutletContext({ updateUserData });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/auth/check-session");
        setUsername(response.data.user.username);
        setRole(response.data.user.role);
        setProfileImage(response.data.user.profileImage);
      } catch {
        navigate("/SignIn");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      navigate("/SignIn");
    } catch {
      showSnackbar("Logout failed", "error");
    }
  };

  const menuItems = [
    {
      to: '/studentHome',
      text: 'หน้าหลัก',
      icon: <Home sx={{ color: COLORS.text.secondary }} />,
      title: 'หน้าหลัก',
    },
    {
      to: '/studentHome/ProfileUser',
      text: 'ข้อมูลส่วนตัว',
      icon: <Home sx={{ color: COLORS.text.secondary }} />,
      title: 'ข้อมูลส่วนตัว',
    },
    {
      to: '/studentHome/Documentation',
      text: 'แบบร่างเอกสาร',
      icon: <School sx={{ color: COLORS.text.secondary }} />,
      title: 'แบบร่างเอกสาร',
    },
    {
      to: '/studentHome/projectRequest',
      text: 'คำร้องโครงการ',
      icon: <Assignment sx={{ color: COLORS.text.secondary }} />,
      title: 'คำร้องโครงการ',
    },
    {
      to: '/studentHome/uploadProjectDocument',
      text: 'ส่งเอกสาร',
      icon: <PresentToAll sx={{ color: COLORS.text.secondary }} />,
      title: 'ส่งเอกสาร',
    },
  ];

  const drawerContent = (
    <>
      <Toolbar />
      <UserInfo
        username={username}
        role={role}
        profileImage={profileImage}
        loading={loading}
      />

      <List>
        {menuItems.map(({ to, text, icon, title }, index) => (
          <NavLink
            key={index}
            to={{ pathname: to }}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItemButton onClick={() => setTitle(title)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </NavLink>
        ))}
      </List>

      <Divider sx={{ borderColor: COLORS.divider, mt: 2 }} />
      <Box sx={{ padding: 2 }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={handleLogout}
        >
          ออกจากระบบ
        </Button>
      </Box>
    </>
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            padding: 1,
            overflowY: 'auto',
            backgroundColor: COLORS.drawer,
            color: COLORS.text.primary,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: COLORS.drawer,
            color: COLORS.text.primary,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

SideStudent.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
};

export default SideStudent;
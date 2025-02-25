import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Button,
  Toolbar,
  ListItem,
  Skeleton,
} from '@mui/material';
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone"
import NoteAddTwoToneIcon from "@mui/icons-material/NoteAddTwoTone";
import NewReleasesTwoToneIcon from "@mui/icons-material/NewReleasesTwoTone";
import { NavLink, useNavigate } from 'react-router-dom';
import DashboardTwoToneIcon from "@mui/icons-material/DashboardTwoTone";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import TypeSpecimenTwoToneIcon from "@mui/icons-material/TypeSpecimenTwoTone";
import AssignmentTurnedInTwoToneIcon from "@mui/icons-material/AssignmentTurnedInTwoTone";
import LogoutIcon from '@mui/icons-material/Logout';
import { useSnackbar } from '../components/ReusableSnackbar';
import api ,{ API_BASE_URL } from '../services/api';
import UploadFileTwoToneIcon from "@mui/icons-material/UploadFileTwoTone"
// Constants
const drawerWidth = 240;
const COLORS = {
  drawer: '#FFB38A',
  divider: '#FFD7B5',
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
        <Typography variant="body1" sx={{ color: COLORS.text.primary, mt: 1 }}>
          {username}
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary, textTransform: "capitalize" }}>
          {role}
        </Typography>
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

const SideAdmin = ({ mobileOpen, handleDrawerToggle, setTitle }) => {
  const [username, setUsername] = useState('Loading...');
  const [role, setRole] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

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
        <ListItem>
          <ListItemText primary="หมวดจัดการ" sx={{ color: COLORS.text.secondary }} />
        </ListItem>
        <List component="div" disablePadding>
          {[
            {
              to: '/adminHome',
              text: 'หน้าหลัก',
              icon: <DashboardTwoToneIcon sx={{ color: COLORS.text.secondary }} />,
              title: 'หน้าหลัก',
            },
            {
              to: '/adminHome/manage-user',
              text: 'จัดการผู้ใช้',
              icon: <PeopleAltTwoToneIcon sx={{ color: COLORS.text.secondary }} />,
              title: 'จัดการผู้ใช้',
            },
            {
              to: '/adminHome/TeacherInfo',
              text: 'ข้อมูลอาจารย์',
              icon: <PeopleAltTwoToneIcon sx={{ color: COLORS.text.secondary }} />,
              title: 'ข้อมูลอาจารย์',
            },
            {
              to: '/adminHome/upload-doc',
              text: 'เพิ่มแบบฟอร์มเอกสาร',
              icon: <UploadFileTwoToneIcon sx={{ color: COLORS.text.secondary }} />,
              title: 'เพิ่มแบบฟอร์มเอกสาร',
            },
            {
              to: '/adminHome/project-types',
              text: 'จัดการประเภทโครงการ',
              icon: <TypeSpecimenTwoToneIcon sx={{ color: COLORS.text.secondary }} />,
              title: 'จัดการประเภทโครงการ',
            },

          ].map(({ to, text, icon, title }, index) => (
            <NavLink
              key={index}
              to={{
                pathname: to,
                search: `?reload=${Date.now()}`,
              }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemButton onClick={() => setTitle(title)} sx={{ pl: 4 }}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </NavLink>
          ))}
        </List>

        <ListItem>
          <ListItemText primary="หมวดโครงงาน" sx={{ color: COLORS.text.secondary }} />
        </ListItem>
        <List component="div" disablePadding>
          {[

            {
              to: '/adminHome/CheckProject',
              text: 'อนุมัติโครงการ',
              icon: <CheckCircleTwoToneIcon sx={{ color: COLORS.text.secondary }} />,
              title: 'อนุมัติโครงการ',
            },
            {
              to: '/adminHome/ViewProjectDocuments',
              text: 'ตรวจเอกสารโครงงาน',
              icon: <AssignmentTurnedInTwoToneIcon sx={{ color: COLORS.text.secondary }} />,
              title: 'ตรวจเอกสารโครงงาน',
            },
            {
              to: '/adminHome/release-project',
              text: 'เผยแพร่โครงการ',
              icon: <NewReleasesTwoToneIcon sx={{ color: COLORS.text.secondary }} />,
              title: 'เผยแพร่โครงการ',
            },
            {
              to: '/adminHome/AddOldProject',
              text: 'เพิ่มเอกสารโครงงานเก่า',
              icon: <NoteAddTwoToneIcon sx={{ color: COLORS.text.secondary }} />,
              title: 'เพิ่มเอกสารโครงงานเก่า',
            },
          ].map(({ to, text, icon, title }, index) => (
            <NavLink
              key={index}
              to={{
                pathname: to,
                search: `?reload=${Date.now()}`,
              }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemButton onClick={() => setTitle(title)} sx={{ pl: 4 }}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </NavLink>
          ))}
        </List>
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

SideAdmin.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
};

export default SideAdmin;
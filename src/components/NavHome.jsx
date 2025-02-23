import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import { Link } from "react-router-dom";
import LoginTwoToneIcon from "@mui/icons-material/LoginTwoTone";
import AssignmentIndTwoToneIcon from "@mui/icons-material/AssignmentIndTwoTone";
import { Typography } from "@mui/material";

const menuItems = [
  {
    text: 'คณะอาจารย์',
    icon: <AssignmentIndTwoToneIcon />,
    to: '/TeacherPage',
    color: '#000000',
    variant: 'text',
  },
  {
    text: 'โครงงานเก่า',
    icon: <AssignmentIndTwoToneIcon />,
    to: '/OldProject',
    variant: 'text',
    color: '#000000',
    fontWeight: 'bold',
  },
  {
    text: 'เข้าสู่ระบบ',
    icon: <LoginTwoToneIcon />,
    to: '/SignIn',
    variant: 'contained',
    color: 'warning',
    fontWeight: 'bold',
  },
];

const NavbarHome = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = (open) => () => setMobileOpen(open);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#FFA64D", width: "100%", zIndex: 99 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Mobile Menu Button */}
        <IconButton color="inherit" edge="start" sx={{ display: { xs: "block", sm: "none" } }} onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "#fff", padding: "4px 8px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <img src="/up-logo.png" alt="IT-PMS Logo" style={{ height: "48px", width: "auto" }} />
            <Typography variant="h6" component="div" sx={{ ml: 1, fontWeight: 500, color: "#FFA64D" }}>
              IT
            </Typography>
            <Typography variant="h6" component="div" sx={{ ml: 0.5, fontWeight: 500, color: "#FFFFFF" }}>
              -PMS
            </Typography>
          </Link>
        </Box>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 3, ml: "auto" }}>
          {menuItems.map(({ text, to }, index) => (
            <Button key={index} component={Link} to={to} variant="text" sx={{ fontSize: "1rem", color: "#000", fontWeight: 500 }}>
              {text}
            </Button>
          ))}
        </Box>

        {/* Mobile Drawer Menu */}
        <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250, padding: "16px" }}>
            {menuItems.map(({ text, to }, index) => (
              <Button key={index} component={Link} to={to} fullWidth sx={{ fontSize: "1rem", color: "#000", fontWeight: 500 }}>
                {text}
              </Button>
            ))}
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarHome;
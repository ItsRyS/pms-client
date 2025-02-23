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
    text: "คณะอาจารย์",
    icon: <AssignmentIndTwoToneIcon />,
    to: "/TeacherPage",
    color: "#000000",
    variant: "text",
  },
  {
    text: "โครงงานเก่า",
    icon: <AssignmentIndTwoToneIcon />,
    to: "/OldProject",
    variant: "text",
    color: "#000000",
    fontWeight: "bold",
  },
  {
    text: "เข้าสู่ระบบ",
    icon: <LoginTwoToneIcon />,
    to: "/SignIn",
    variant: "contained",
    color: "warning",
    fontWeight: "bold",
  },
];

const NavbarHome = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = (open) => () => setMobileOpen(open);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#FFA64D",
        width: "100%",
        zIndex: 99,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // เพิ่มเงาให้ AppBar
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          edge="start"
          sx={{ display: { xs: "block", sm: "none" } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo & Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2, // ปรับระยะห่างให้สวยงาม
            px: 1.5,
            borderRadius: 2,
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", // ใส่เงาให้ดูเด่นขึ้น
          }}
        >
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <img
              src="/up-logo.png"
              alt="IT-PMS Logo"
              style={{ height: "48px", width: "auto" }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                ml: 1, // ปรับระยะห่างจากโลโก้
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // เพิ่มเงาให้ตัวอักษร
              }}
            >
              <span style={{ color: "#FF5722" }}>IT</span>
              <span style={{ color: "#FFFFFF" }}>-PMS</span>
            </Typography>
          </Link>
        </Box>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 3, ml: "auto" }}>
          {menuItems.map(({ text, to }, index) => (
            <Button
              key={index}
              component={Link}
              to={to}
              variant="text"
              sx={{
                fontSize: "1rem",
                color: "#000",
                fontWeight: 500,
                "&:hover": { color: "#FF5722" },
              }}
            >
              {text}
            </Button>
          ))}
        </Box>

        {/* Mobile Drawer Menu */}
        <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250, padding: "16px" }}>
            {menuItems.map(({ text, to }, index) => (
              <Button
                key={index}
                component={Link}
                to={to}
                fullWidth
                sx={{
                  fontSize: "1rem",
                  color: "#000",
                  fontWeight: 500,
                  "&:hover": { color: "#FF5722" },
                }}
              >
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

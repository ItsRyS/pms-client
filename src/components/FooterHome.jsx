import { Box, Typography, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

const FooterHome = () => {
  return (
    <Box
  component="footer"
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    backgroundColor: "#FFA64D",
    color: "#f0f4f8",
    width: "100%",
    boxSizing: "border-box",
    mt: "auto",
    textAlign: { xs: "center", sm: "left" },
  }}
>
  <Typography variant="body2" sx={{ mb: { xs: 1, sm: 0 } }}>
    สงวนลิขสิทธิ์ © 2567 - บริษัท ไลลาร์ เพอฟอร์ม จำกัด
  </Typography>

  <Box sx={{ display: "flex", gap: "8px" }}>
    <IconButton href="https://github.com/ItsRyS" target="_blank" sx={{ color: "#f0f4f8" }}>
      <GitHubIcon />
    </IconButton>
    <IconButton href="mailto:ForzaLyraBelil@outlook.com" sx={{ color: "#f0f4f8" }}>
      <EmailIcon />
    </IconButton>
  </Box>
</Box>

  );
};

export default FooterHome;

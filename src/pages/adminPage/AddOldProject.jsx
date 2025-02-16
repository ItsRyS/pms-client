import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import api from '../../services/api';
import NavbarHome from '../../components/NavHome';
import FooterHome from '../../components/FooterHome';
import { useSnackbar } from '../../components/ReusableSnackbar';

const AddOldProject = () => {
  const showSnackbar = useSnackbar();

  const [formData, setFormData] = useState({
    old_project_name_th: '',
    old_project_name_eng: '',
    project_type: '',
    document_year: '',
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);

  // ✅ ดึงประเภทของโครงงานจาก API `/project-types`
  useEffect(() => {
    api
      .get('/project-types')
      .then((response) => {
        setProjectTypes(response.data);
      })
      .catch((error) => {
        console.error('❌ Error fetching project types:', error);
      });
  }, []);

  // ✅ อัปเดตค่าเมื่อผู้ใช้ป้อนข้อมูล
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ อัปเดตไฟล์ที่เลือก
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  // ✅ ส่งข้อมูลไปยัง API `/old-projects`
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      showSnackbar('กรุณาเลือกไฟล์โครงงานก่อนอัปโหลด', 'error');
      return;
    }

    const submitData = new FormData();
    submitData.append('old_project_name_th', formData.old_project_name_th);
    submitData.append('old_project_name_eng', formData.old_project_name_eng);
    submitData.append('project_type', formData.project_type);
    submitData.append('document_year', formData.document_year);
    submitData.append('file', formData.file);

    setLoading(true);

    try {
      const response = await api.post('/old-projects', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showSnackbar('เพิ่มโครงงานเก่าสำเร็จ!', 'success');
      console.log('✅ File uploaded successfully:', response.data);

      setFormData({
        old_project_name_th: '',
        old_project_name_eng: '',
        project_type: '',
        document_year: '',
        file: null,
      });
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      showSnackbar('เกิดข้อผิดพลาดในการเพิ่มโครงงาน', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarHome />
      <Box sx={{ flex: 1, py: 5 }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
            เพิ่มโครงงานเก่า
          </Typography>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextField
              label="ชื่อโครงงาน (ภาษาไทย)"
              name="old_project_name_th"
              fullWidth
              required
              margin="normal"
              value={formData.old_project_name_th}
              onChange={handleChange}
            />

            <TextField
              label="ชื่อโครงงาน (ภาษาอังกฤษ)"
              name="old_project_name_eng"
              fullWidth
              required
              margin="normal"
              value={formData.old_project_name_eng}
              onChange={handleChange}
            />

            <FormControl fullWidth required margin="normal">
              <InputLabel>ประเภทโครงงาน</InputLabel>
              <Select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
              >
                {projectTypes.map((type) => (
                  <MenuItem key={type.project_type_id} value={type.project_type_name}>
                    {type.project_type_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="ปีเอกสาร"
              name="document_year"
              type="number"
              fullWidth
              required
              margin="normal"
              value={formData.document_year}
              onChange={handleChange}
              inputProps={{ min: 1900, max: new Date().getFullYear() }}
            />

            <input type="file" accept="application/pdf" onChange={handleFileChange} required />

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'เพิ่มโครงงาน'}
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
      <FooterHome />
    </Box>
  );
};

export default AddOldProject;

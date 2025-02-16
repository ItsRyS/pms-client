import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../../services/api';
import NavbarHome from '../../components/NavHome';
import FooterHome from '../../components/FooterHome';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const OldProject = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);

  // ✅ ดึงรายการโครงงานเก่าจาก API
  useEffect(() => {
    api
      .get('/old-projects')
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('❌ Error fetching old projects:', error);
      });
  }, []);

  // ✅ เปิด PDF Dialog
  const handleOpenPdfDialog = (filePath) => {
    if (!filePath) {
      console.error('⚠️ No document available');
      return;
    }
    setPdfLoading(true);
    setSelectedProject(filePath);
    setPdfOpen(true);
  };

  // ✅ ปิด PDF Dialog
  const handleClosePdfDialog = () => {
    setPdfOpen(false);
    setSelectedProject(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarHome />
      <Box sx={{ flex: 1, py: 5 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
            รายการโครงงานเก่า
          </Typography>

          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ชื่อโครงงาน (TH)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ชื่อโครงงาน (ENG)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ประเภทโครงงาน</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ปีเอกสาร</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">ไฟล์เอกสาร</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.old_id}>
                    <TableCell>{project.old_project_name_th}</TableCell>
                    <TableCell>{project.old_project_name_eng}</TableCell>
                    <TableCell>{project.project_type}</TableCell>
                    <TableCell>{project.document_year}</TableCell>
                    <TableCell align="center">
                      {project.file_path ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenPdfDialog(project.file_path)}
                        >
                          ดูเอกสาร
                        </Button>
                      ) : (
                        <Typography variant="body2" color="error">
                          ไม่มีเอกสาร
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
      <FooterHome />

      {/* ✅ Dialog แสดง PDF */}
      <Dialog open={pdfOpen} onClose={handleClosePdfDialog} maxWidth="md" fullWidth>
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
          {pdfLoading && <CircularProgress />}
          {selectedProject && (
            <Document
              file={selectedProject}
              onLoadSuccess={() => setPdfLoading(false)}
              onLoadError={() => console.error('❌ Failed to load PDF')}
            >
              <Page pageNumber={1} />
            </Document>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePdfDialog} color="primary" variant="contained">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OldProject;

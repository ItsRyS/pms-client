import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from '../../components/ReusableSnackbar';
import api from '../../services/api';
import { useSearchParams } from 'react-router-dom';

const ViewProjectDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openRejectOptions, setOpenRejectOptions] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [searchParams] = useSearchParams();
  const showSnackbar = useSnackbar();

  // ฟังก์ชันสำหรับโหลดข้อมูลเอกสาร
  const fetchPendingDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/project-documents/all');
      setDocuments(response.data.filter((doc) => doc.status === 'pending'));
    } catch (error) {
      showSnackbar('Failed to load documents.', 'error');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchPendingDocuments();
  }, [fetchPendingDocuments, searchParams]);

  // ปิด Dialog และรีเซ็ตค่า rejectReason
  const handleCloseRejectDialog = () => {
    setOpenRejectOptions(false);
    setRejectReason(''); // รีเซ็ตค่า
  };

  // เปิด Dialog และรีเซ็ตค่า rejectReason
  const handleOpenRejectDialog = () => {
    setRejectReason(''); // รีเซ็ตค่า
    setOpenRejectOptions(true);
  };

  // จัดการ Action (Approve, Reject, Return)
  const handleAction = async (action, payload = null) => {
    try {
      const endpoint = `/project-documents/${selectedDocument.document_id}/${action}`;

      if (action === 'return') {
        if (!payload) {
          showSnackbar('กรุณาเลือกไฟล์สำหรับคืนเอกสาร', 'error');
          return;
        }

        const formData = new FormData();
        formData.append('file', payload);

        console.log(' Sending file:', payload.name);
        await api.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else if (action === 'reject') {
        await api.post(endpoint, { reason: payload });
      } else {
        await api.post(endpoint);
      }

      showSnackbar(
        `Document ${action === 'approve' ? 'Approved ' :
          action === 'reject' ? 'Rejected ' :
          'Returned '} Successfully.`,
        'success'
      );
      fetchPendingDocuments();
      setSelectedDocument(null);
      if (action === 'reject') handleCloseRejectDialog();
    } catch (error) {
      showSnackbar(`Failed to ${action} document.`, 'error');
      console.error(` Error ${action}ing document:`, error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Submitted Project Documents
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Submitted By</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.document_id}>
                <TableCell>{doc.project_name}</TableCell>
                <TableCell>{doc.type_name}</TableCell>
                <TableCell>{doc.student_name}</TableCell>
                <TableCell>
                  {new Date(doc.submitted_at).toLocaleString()}
                </TableCell>
                <TableCell>{doc.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() =>
                      setSelectedDocument({
                        url: doc.file_path, // ใช้ URL ตรงจากฐานข้อมูล
                        name: doc.type_name,
                        document_id: doc.document_id,
                      })
                    }
                  >
                    View Document
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedDocument && (
        <Modal open={!!selectedDocument} onClose={() => setSelectedDocument(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', md: '80%', lg: '70%' }, // Responsive width
            maxWidth: '1000px',
            maxHeight: '90vh', // ป้องกัน Modal ล้นจอ
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            overflow: 'hidden',
            p: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Document Preview: {selectedDocument.name}
          </Typography>

          {/* ปรับขนาดของ iframe ให้เต็มที่ตามหน้าจอ */}
          <Box
            sx={{
              width: '100%',
              height: { xs: '55vh', sm: '65vh', md: '75vh' },
              overflow: 'hidden',
            }}
          >
            <iframe
              src={selectedDocument.url}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Box>

          {/* ปุ่มแสดงผลให้จัดเรียงให้เหมาะสม */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap', // ทำให้ปุ่มขึ้นบรรทัดใหม่เมื่อพื้นที่ไม่พอ
              justifyContent: 'center',
              gap: 2,
              paddingBottom: 2, // เพิ่มช่องว่างขอบล่าง
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAction('approve')}
              sx={{ minWidth: { xs: '100%', sm: '150px' }, fontSize: '1rem' }}
            >
              อนุมัติ
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleOpenRejectDialog}
              sx={{ minWidth: { xs: '100%', sm: '150px' }, fontSize: '1rem' }}
            >
              ไม่อนุมัติ
            </Button>

            <Button
              variant="contained"
              component="label"
              color="primary"
              sx={{ minWidth: { xs: '100%', sm: '200px' }, fontSize: '1rem' }}
            >
              ส่งเอกสารคืน
              <input type="file" hidden onChange={(e) => handleAction('return', e.target.files[0])} />
            </Button>
          </Box>
        </Box>
      </Modal>

      )}

      <Dialog open={openRejectOptions} onClose={handleCloseRejectDialog}>
        <DialogTitle>Reject Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Provide a detailed reason"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button
            onClick={() => handleAction('reject', rejectReason)}
            color="error"
            disabled={!rejectReason.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ViewProjectDocuments;

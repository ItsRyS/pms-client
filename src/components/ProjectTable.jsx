import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Paper,
  TextField,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Typography,
  Container,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import api from '../services/api';
import { useSnackbar } from './ReusableSnackbar';

const ProjectTable = ({ rows, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('project_name_th');
  const [openDocument, setOpenDocument] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleViewDocument = async (projectId) => {
    try {
      const response = await api.get(`/project-release/complete-report/${projectId}`);
      if (response.data.success) {
        const fullDocumentUrl = response.data.documentPath.startsWith('/')
          ? `${window.location.origin}${response.data.documentPath}`
          : `${window.location.origin}/${response.data.documentPath}`;
        setDocumentUrl(fullDocumentUrl);
        setOpenDocument(true);
      } else {
        throw new Error('Document not found');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      showSnackbar('Unable to open document. Please try again.', 'error');
    }
  };

  const columns = [
    {
      field: 'project_name_th',
      headerName: 'ชื่อโครงงาน (TH)',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'project_name_eng',
      headerName: 'ชื่อโครงงาน (EN)',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'team_members',
      headerName: 'สมาชิกในทีม',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <Box>
          {params.value?.split(', ').map((member, index) => (
            <Typography key={index} variant="body2">
              {member}
            </Typography>
          )) || 'ไม่มีสมาชิก'}
        </Box>
      ),
    },
    {
      field: 'project_advisor',
      headerName: 'ที่ปรึกษา',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'project_type',
      headerName: 'ประเภท',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'project_status',
      headerName: 'สถานะ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'project_create_time',
      headerName: 'วันที่สร้าง',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'actions',
      headerName: 'รายละเอียดเอกสาร',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          color={params.row.project_status === 'complete' ? 'primary' : 'inherit'}
          disabled={params.row.project_status !== 'complete'}
          onClick={() => params.row.project_status === 'complete' && handleViewDocument(params.row.project_id)}
          sx={{
            textTransform: 'none',
            fontSize: '0.8rem',
            height: '30px',
          }}
        >
          {params.row.project_status === 'complete' ? 'ดูเอกสาร' : 'กำลังดำเนินการ'}
        </Button>
      ),
    },
  ];

  const filteredRows = rows.filter((row) =>
    row[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '90vh',
      width: '100%',
      py: 4,
    }}>
      <Container maxWidth="xl" sx={{ width: '100%' }}>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            flexDirection: 'column',
            padding: 2,
            overflow: 'hidden',
            backgroundColor: '#fff',
            borderRadius: '8px',
            maxWidth: '1400px',
            mx: 'auto',
          }}
        >
          {/* Search Section */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="ค้นหาตาม"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="project_name_th">ชื่อโครงการ (TH)</MenuItem>
                  <MenuItem value="project_name_eng">ชื่อโครงการ (EN)</MenuItem>
                  <MenuItem value="project_advisor">ที่ปรึกษา</MenuItem>
                  <MenuItem value="team_members">สมาชิกในทีม</MenuItem>
                  <MenuItem value="project_type">ประเภท</MenuItem>
                  <MenuItem value="project_status">สถานะ</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  placeholder="ค้นหาข้อมูล"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Table Section */}
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              getRowId={(row) => row.project_id}
              density='comfortable'
              loading={loading}
              autoHeight
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  color: '#000',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-cell': {
                  fontSize: '0.9rem',
                  padding: '8px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                '& .MuiDataGrid-row:nth-of-type(odd)': {
                  backgroundColor: '#fafafa',
                },
                border: 'none',
              }}
            />
          </Box>
        </Paper>
      </Container>

      {/* Document Dialog */}
      <Dialog
        open={openDocument}
        onClose={() => setOpenDocument(false)}
        fullScreen={fullScreen}
        maxWidth={false}
        PaperProps={{
          sx: { width: '100%', height: fullScreen ? '100vh' : '90vh', m: 0 },
        }}
      >
        <DialogTitle>
          เอกสารฉบับสมบูรณ์
          <IconButton
            onClick={() => setOpenDocument(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {documentUrl ? (
            <iframe
              src={documentUrl}
              width="100%"
              height="100%"
              title="เอกสารฉบับสมบูรณ์"
              style={{ border: 'none' }}
            />
          ) : (
            <Typography>No document available</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

ProjectTable.propTypes = {
  rows: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ProjectTable;
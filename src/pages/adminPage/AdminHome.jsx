import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import api from '../../services/api';

const AdminHome = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [railwayServices, setRailwayServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRailway, setLoadingRailway] = useState(true);

  useEffect(() => {
    // ตรวจสอบ Session
    const checkSession = async () => {
      try {
        const response = await api.get('/auth/check-session');
        if (!response.data.isAuthenticated) {
          navigate('/SignIn');
        }
      } catch {
        navigate('/SignIn');
      }
    };

    // ดึงข้อมูลแดชบอร์ด
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin-dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    // ดึงข้อมูลสถานะ Service จาก Railway
    const fetchRailwayStatus = async () => {
      try {
        const response = await api.get('/railway/status');
        setRailwayServices(response.data.services);
      } catch (error) {
        console.error('Error fetching Railway service status', error);
      } finally {
        setLoadingRailway(false);
      }
    };

    checkSession();
    fetchDashboardData();
    fetchRailwayStatus();
  }, [navigate]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom textAlign="center">
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* แสดงสถิติ 3 ช่อง (Active Projects, Pending Requests, Pending Documents) */}
        {[
          { title: 'Active Projects', value: dashboardData.activeProjects },
          {
            title: 'Pending Project Requests',
            value: dashboardData.pendingProjectRequests,
          },
          { title: 'Pending Documents', value: dashboardData.pendingDocuments },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ textAlign: 'center', padding: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Pie Chart - การกระจายประเภทโครงการ */}
        <Grid item xs={12} md={8} lg={6} sx={{ mx: 'auto' }}>
          <Card sx={{ padding: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Project Type Distribution
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: { xs: 250, sm: 300, md: 350, lg: 400 },
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Pie
                  data={{
                    labels: dashboardData.projectTypeDistribution.map(
                      (item) => item.project_type
                    ),
                    datasets: [
                      {
                        data: dashboardData.projectTypeDistribution.map(
                          (item) => item.total
                        ),
                        backgroundColor: [
                          '#FF6384',
                          '#36A2EB',
                          '#FFCE56',
                          '#4BC0C0',
                          '#9966FF',
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Railway Service Status */}
        <Grid item xs={12} md={6} lg={4} sx={{ mx: 'auto' }}>
          <Card sx={{ padding: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Railway Service Status
              </Typography>
              {loadingRailway ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                railwayServices.map((service, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    sx={{ marginBottom: 1 }}
                  >
                    <Typography>{service.name}</Typography>
                    <Chip
                      label={service.status || 'UNKNOWN'}
                      color={
                        service.status === 'SUCCESS'
                          ? 'success'
                          : service.status === 'FAILED'
                            ? 'error'
                            : 'warning'
                      }
                      size="small"
                    />
                    <Typography>
                      {service.updatedAt
                        ? new Date(service.updatedAt).toLocaleString()
                        : 'N/A'}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminHome;

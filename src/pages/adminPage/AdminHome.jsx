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
import PropTypes from 'prop-types';

// Railway Status Component
const RailwayStatus = ({ services, loading }) => {
  const getStatusColor = (status, state) => {
    if (state === "HEALTHY") return "success";
    if (state === "UNHEALTHY") return "error";
    if (status === "SUCCESS") return "success";
    if (status === "FAILED") return "error";
    if (status === "BUILDING" || status === "DEPLOYING") return "warning";
    return "default";
  };

  const getStatusLabel = (status, state) => {
    if (state === "HEALTHY") return "Running";
    if (state === "UNHEALTHY") return "Down";
    if (status === "NO_DEPLOYMENT") return "No Deployment";
    return status || "Unknown";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ padding: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Railway Service Status
        </Typography>
        {services.map((service) => (
          <Box
            key={service.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 1,
              borderBottom: "1px solid #eee",
              "&:last-child": {
                borderBottom: "none"
              }
            }}
          >
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {service.name}
            </Typography>
            <Chip
              label={getStatusLabel(service.status, service.state)}
              color={getStatusColor(service.status, service.state)}
              size="small"
              sx={{ mx: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {service.updatedAt
                ? new Date(service.updatedAt).toLocaleString()
                : "N/A"}
            </Typography>
          </Box>
        ))}
  </CardContent>
    </Card>
  );
};

RailwayStatus.propTypes = {
  services: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

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

  const statsItems = [
    {
      title: 'Active Projects',
      value: dashboardData.activeProjects
    },
    {
      title: 'Pending Project Requests',
      value: dashboardData.pendingProjectRequests,
    },
    {
      title: 'Pending Documents',
      value: dashboardData.pendingDocuments
    },
  ];

  const pieChartData = {
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
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom textAlign="center">
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {statsItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ textAlign: 'center', padding: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Project Type Distribution Chart */}
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
                  data={pieChartData}
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
          <RailwayStatus
            services={railwayServices}
            loading={loadingRailway}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminHome;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import api from "../../services/api";

const AdminHome = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบ Session
    const checkSession = async () => {
      try {
        const response = await api.get("/auth/check-session");
        if (!response.data.isAuthenticated) {
          navigate("/SignIn");
        }
      } catch {
        navigate("/SignIn");
      }
    };

    // ดึงข้อมูลแดชบอร์ด
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/admin-dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Total Active Projects */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Projects</Typography>
              <Typography variant="h4">{dashboardData.activeProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Project Requests */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Project Requests</Typography>
              <Typography variant="h4">{dashboardData.pendingProjectRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Documents */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Documents</Typography>
              <Typography variant="h4">{dashboardData.pendingDocuments}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Type Distribution (Pie Chart) */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Project Type Distribution</Typography>
              <Pie
                data={{
                  labels: dashboardData.projectTypeDistribution.map((item) => item.project_type),
                  datasets: [
                    {
                      data: dashboardData.projectTypeDistribution.map((item) => item.total),
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                      ],
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminHome;

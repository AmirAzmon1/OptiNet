import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import styled from 'styled-components';

const DashboardContainer = styled(Box)`
  padding: 24px;
`;

const StatCard = styled(Paper)`
  padding: 20px;
  height: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

interface DashboardProps {
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const navigate = useNavigate();

  return (
    <DashboardContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="primary">
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard sx={{background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`}}>
            <Typography variant="h6" color="primary">Total Routers</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>24</Typography>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StatCard sx={{background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`}}>
            <Typography variant="h6" color="primary">Active Routers</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>18</Typography>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StatCard sx={{background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`}}>
            <Typography variant="h6" color="primary">Average Load</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>65%</Typography>
          </StatCard>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard; 
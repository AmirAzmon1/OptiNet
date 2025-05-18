import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button, Divider } from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Group as GroupIcon,
  Router as RouterIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import styled from 'styled-components';

const DashboardContainer = styled(Box)`
  display: flex;
  min-height: calc(100vh - 48px);
`;

const Sidebar = styled(Box)`
  width: 240px;
  background-color: #f5f5f5;
  padding: 24px 16px;
  border-right: 1px solid #e0e0e0;
`;

const SidebarItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 8px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }

  &.active {
    background-color: #bbdefb;
    color: #1976d2;
  }
`;

const Content = styled(Box)`
  flex: 1;
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
  const currentPath = window.location.pathname;

  return (
    <DashboardContainer>
      <Sidebar>
        <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
          ניווט מהיר
        </Typography>

        <SidebarItem 
          to="/dashboard" 
          className={currentPath === '/dashboard' ? 'active' : ''}
        >
          <RouterIcon sx={{ mr: 2 }} />
          Dashboard
        </SidebarItem>

        <SidebarItem 
          to="/user" 
          className={currentPath === '/user' ? 'active' : ''}
        >
          <PersonIcon sx={{ mr: 2 }} />
          My Profile
        </SidebarItem>

        <SidebarItem 
          to="/family" 
          className={currentPath === '/family' ? 'active' : ''}
        >
          <GroupIcon sx={{ mr: 2 }} />
          My Family
        </SidebarItem>

        <SidebarItem 
          to="/network" 
          className={currentPath === '/network' ? 'active' : ''}
        >
          <PeopleIcon sx={{ mr: 2 }} />
          All Users
        </SidebarItem>

        <Divider sx={{ my: 2 }} />

        <SidebarItem 
          to="/routers" 
          className={currentPath === '/routers' ? 'active' : ''}
        >
          <RouterIcon sx={{ mr: 2 }} />
          Routers
        </SidebarItem>

        <SidebarItem 
          to="/settings" 
          className={currentPath === '/settings' ? 'active' : ''}
        >
          <SettingsIcon sx={{ mr: 2 }} />
          Settings
        </SidebarItem>

        <Box mt={4}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/home')}
            fullWidth
          >
            Back to Home
          </Button>
        </Box>
      </Sidebar>

      <Content>
        <Typography variant="h4" color="primary" sx={{ mb: 4 }}>
          Dashboard
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
          <StatCard sx={{background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`}}>
            <Typography variant="h6" color="primary">Total Routers</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>24</Typography>
          </StatCard>
          
          <StatCard sx={{background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`}}>
            <Typography variant="h6" color="primary">Active Routers</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>18</Typography>
          </StatCard>
          
          <StatCard sx={{background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`}}>
            <Typography variant="h6" color="primary">Average Load</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>65%</Typography>
          </StatCard>
        </Box>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard; 
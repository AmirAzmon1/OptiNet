import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Router as RouterIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import styled from 'styled-components';

const HomeContainer = styled(Box)`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
`;

const HeaderBar = styled(Box)`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  margin-bottom: 24px;
  position: relative;
`;

const StyledCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    transform: translateY(-5px);
  }
`;

interface HomeProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard',
      color: '#1976d2'
    },
    {
      title: 'Router List',
      icon: <RouterIcon sx={{ fontSize: 40 }} />,
      path: '/routers',
      color: '#2e7d32'
    },
    {
      title: 'Settings',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      path: '/settings',
      color: '#ed6c02'
    }
  ];

  return (
    <HomeContainer>
      <HeaderBar>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 500, textAlign: 'center', flex: 1, mb: 5 }}>
          Welcome to the Router Management System
        </Typography>
        <Box sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
          <IconButton onClick={handleLogout} color="primary">
            <LogoutIcon />
          </IconButton>
        </Box>
      </HeaderBar>
      <Box flex={1} width="100%" display="flex" justifyContent="center" alignItems="flex-start">
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start" sx={{ maxWidth: 900 }}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.title} display="flex" justifyContent="center">
              <StyledCard sx={{ width: 220, minHeight: 260, boxShadow: 3 }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ color: item.color, mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h5" component="div">
                    {item.title}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate(item.path)}
                    sx={{ backgroundColor: item.color }}
                  >
                    Enter
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </HomeContainer>
  );
};

export default Home; 
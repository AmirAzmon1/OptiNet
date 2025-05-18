import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import styled from 'styled-components';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RouterList from './pages/RouterList';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

// Define the User interface
interface User {
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
}

// Define the UserMap interface
interface UserMap {
  [email: string]: User;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });

  const [darkMode, setDarkMode] = React.useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Ensure default admin user always exists
  useEffect(() => {
    const adminUser: User = {
      email: 'admin@gmail.com',
      password: '1234',
      name: 'Admin User',
      isAdmin: true
    };

    // Get existing users map
    const usersMap: UserMap = JSON.parse(localStorage.getItem('usersMap') || '{}');
    
    // Add admin user to users map if not already there
    if (!usersMap['admin@gmail.com']) {
      usersMap['admin@gmail.com'] = adminUser;
      localStorage.setItem('usersMap', JSON.stringify(usersMap));
    }
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
      }),
    [darkMode],
  );

  const handleAuthChange = (value: boolean) => {
    setIsAuthenticated(value);
    localStorage.setItem('isAuthenticated', value.toString());
  };

  const handleThemeChange = (value: boolean) => {
    setDarkMode(value);
    localStorage.setItem('darkMode', value.toString());
  };

  // Helper function to check if user is admin
  const isAdmin = () => {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      return currentUser.isAdmin === true;
    }
    return false;
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box minHeight="100vh" sx={{ backgroundColor: theme.palette.background.default }}>
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={handleAuthChange} />} />
            <Route path="/signup" element={<Signup setIsAuthenticated={handleAuthChange} />} />
            <Route 
              path="/home" 
              element={
                isAuthenticated ? 
                  <Home setIsAuthenticated={handleAuthChange} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? 
                  <Dashboard darkMode={darkMode} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/routers" 
              element={
                isAuthenticated ? 
                  <RouterList darkMode={darkMode} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/settings" 
              element={
                isAuthenticated ? 
                  <Settings darkMode={darkMode} onThemeChange={handleThemeChange} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            {/* Admin route with admin-only access */}
            <Route 
              path="/admin" 
              element={
                isAuthenticated && isAdmin() ? 
                  <Admin darkMode={darkMode} /> : 
                  <Navigate to="/home" replace />
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import styled from 'styled-components';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RouterList from './pages/RouterList';
import Settings from './pages/Settings';
import UserPage from './pages/UserPage';
import FamilyPage from './pages/FamilyPage';
import NetworkPage from './pages/NetworkPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });

  const [darkMode, setDarkMode] = React.useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

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
            <Route 
              path="/user" 
              element={
                isAuthenticated ? 
                  <UserPage /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/family" 
              element={
                isAuthenticated ? 
                  <FamilyPage /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/network" 
              element={
                isAuthenticated ? 
                  <NetworkPage /> : 
                  <Navigate to="/login" replace />
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
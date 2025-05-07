import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });

  const handleAuthChange = (value: boolean) => {
    setIsAuthenticated(value);
    localStorage.setItem('isAuthenticated', value.toString());
  };

  return (
    <Router>
      <AppContainer>
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
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App; 
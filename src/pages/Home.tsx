import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #c82333;
  }
`;

const Content = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

interface HomeProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <Container>
      <Header>
        <Title>Welcome to Your Dashboard</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      <Content>
        <h2>Welcome to your new account!</h2>
        <p>This is your personal dashboard. You can start adding your content here.</p>
      </Content>
    </Container>
  );
};

export default Home; 
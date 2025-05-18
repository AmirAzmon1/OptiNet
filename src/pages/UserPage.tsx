import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const Container = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #1976d2;
  margin: 0;
`;

const Content = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const UserPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <Title>My profile</Title>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Header>
      <Content>
        <p>פרטי המשתמש יוצגו כאן</p>
      </Content>
    </Container>
  );
};

export default UserPage; 
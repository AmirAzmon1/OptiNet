import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import styled from 'styled-components';
import RouterListComponent from '../components/RouterList';

const ListContainer = styled(Box)`
  padding: 24px;
`;

interface RouterListProps {
  darkMode: boolean;
}

const RouterList: React.FC<RouterListProps> = () => {
  const navigate = useNavigate();

  return (
    <ListContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="primary">
          Network Neighbors
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Box>

      <RouterListComponent />
    </ListContainer>
  );
};

export default RouterList; 
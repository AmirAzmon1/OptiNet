import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import styled from 'styled-components';

const ListContainer = styled(Box)`
  padding: 24px;
`;

const StyledTableRow = styled(TableRow)`
  &:hover {
    /* Remove theme usage here, use sx prop instead */
  }
`;

interface RouterListProps {
  darkMode: boolean;
}

const RouterList: React.FC<RouterListProps> = () => {
  const navigate = useNavigate();
  
  // Sample data - will come from server later
  const routers = [
    { id: 1, name: 'Router-01', status: 'active', load: '45%', location: 'Tel Aviv' },
    { id: 2, name: 'Router-02', status: 'inactive', load: '0%', location: 'Jerusalem' },
    { id: 3, name: 'Router-03', status: 'active', load: '78%', location: 'Haifa' },
  ];

  return (
    <ListContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="primary">
          Router List
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Load</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routers.map((router) => (
              <StyledTableRow key={router.id} sx={{'&:hover': {backgroundColor: (theme) => theme.palette.action.hover}}}>
                <TableCell>{router.id}</TableCell>
                <TableCell>{router.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={router.status === 'active' ? 'Active' : 'Inactive'} 
                    color={router.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{router.load}</TableCell>
                <TableCell>{router.location}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ListContainer>
  );
};

export default RouterList; 
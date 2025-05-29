import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { RouterStatus } from '../components/RouterStatus';

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

const Section = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

interface UserData {
  username: string;
  familyName: string;
  isAdmin: boolean;
}

const NetworkPage: React.FC = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersMapStr = localStorage.getItem('usersMap');

    if (usersMapStr) {
      try {
        const usersMap: { [username: string]: UserData } = JSON.parse(usersMapStr);
        // Convert the usersMap object into an array of UserData
        let usersArray = Object.values(usersMap);

        // Filter out incomplete user entries (missing username or familyName)
        usersArray = usersArray.filter(user => user.username && user.familyName !== undefined);

        setAllUsers(usersArray);
      } catch (error) {
        console.error("Failed to parse users data from localStorage", error);
        setAllUsers([]); // Set to empty array on error
      }
    }
    setLoading(false);
  }, []);

  return (
    <Container>
      <Header>
        <Title>Network Status</Title>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Header>

      {/* Router Status Section */}
      <Section elevation={2}>
        <Typography variant="h6" gutterBottom>
          Smart Router Status
        </Typography>
        <RouterStatus />
      </Section>

      {/* Users Section */}
      <Section elevation={2}>
        <Typography variant="h6" gutterBottom>
          Registered Users
        </Typography>

        {loading ? (
          <Typography>Loading users data...</Typography>
        ) : allUsers.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="all users table">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Family</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allUsers.map((user: UserData) => (
                  <TableRow key={user.username}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.familyName}</TableCell>
                    <TableCell>{user.isAdmin ? 'Administrator' : 'Family Member'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No users found in the system.</Typography>
        )}
      </Section>
    </Container>
  );
};

export default NetworkPage; 
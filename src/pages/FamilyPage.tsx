import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, FamilyRestroom as FamilyIcon } from '@mui/icons-material';

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

const FamilyPage: React.FC = () => {
  const navigate = useNavigate();
  const [familyName, setFamilyName] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<UserData[]>([]);

  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser');
    const usersMapStr = localStorage.getItem('usersMap');

    if (currentUserStr && usersMapStr) {
      try {
        const currentUser: UserData = JSON.parse(currentUserStr);
        const usersMap: { [username: string]: UserData } = JSON.parse(usersMapStr);

        if (currentUser && currentUser.familyName !== undefined && usersMap) {
          setFamilyName(currentUser.familyName);

          // Filter users belonging to the current user's family
          const membersOfFamily = Object.values(usersMap).filter(
            (user) => user.familyName === currentUser.familyName
          );
          setFamilyMembers(membersOfFamily);
        } else {
          console.error("Invalid user or users data in localStorage");
          // Optionally redirect to login or show an error message
          // navigate('/login');
        }
      } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        // Optionally redirect to login or show an error message
        // navigate('/login');
      }
    } else {
      console.error("User data or users map not found in localStorage");
      // Redirect to login if no user data is found
      navigate('/login');
    }
  }, [navigate]); // Add navigate to dependency array

  if (!familyName) {
    return <Typography>Loading family data...</Typography>;
  }

  return (
    <Container>
      <Header>
        <Title>Family Information</Title>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Header>

      <Section elevation={2}>
        <Typography variant="h6" gutterBottom>
          Family: {familyName}
        </Typography>

        <Typography variant="body1" gutterBottom>
          Members:
        </Typography>

        {familyMembers.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="family members table">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familyMembers.map((member) => (
                  <TableRow key={member.username}>
                    <TableCell>{member.username}</TableCell>
                    <TableCell>{member.isAdmin ? 'Administrator' : 'Family Member'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No family members found.</Typography>
        )}
      </Section>
    </Container>
  );
};

export default FamilyPage; 
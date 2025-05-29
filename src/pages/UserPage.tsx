import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Paper, Grid, Avatar, Chip, Box, Tooltip } from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Person as PersonIcon, 
  FamilyRestroom as FamilyIcon, 
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';

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

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
`;

const WelcomeMessage = styled.div`
  background: linear-gradient(135deg, #1976d2 0%, #64b5f6 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
`;

const AdminBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EasterEgg = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  opacity: 0.1;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 1;
  }
`;

interface UserData {
  username: string;
  familyName: string;
  isAdmin: boolean;
  joinDate?: string; // Assuming joinDate is not stored and we'll show current month/year
  lastLogin?: string; // Assuming lastLogin is not stored and we'll show current time
}

const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        const user = JSON.parse(currentUserStr);
        // Ensure required properties exist
        if (user && user.username && user.familyName !== undefined && user.isAdmin !== undefined) {
          setUserData({
            username: user.username,
            familyName: user.familyName,
            isAdmin: user.isAdmin,
            // Set joinDate and lastLogin to current for demonstration, 
            // or remove if not needed and not stored.
            joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            lastLogin: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          });
        } else {
          console.error("Invalid user data in localStorage");
          // Optionally clear invalid data or redirect to login
          // localStorage.removeItem('currentUser');
          // navigate('/login');
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // Optionally clear invalid data or redirect to login
        // localStorage.removeItem('currentUser');
        // navigate('/login');
      }
    }
  }, [navigate]); // Add navigate to dependency array

  const handleEasterEggClick = () => {
    if (userData?.isAdmin) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
    }
  };

  if (!userData) {
    return <Typography>Loading user data...</Typography>;
  }

  return (
    <Container>
      <Header>
        <Title>My Profile</Title>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Header>

      <WelcomeMessage>
        {userData.isAdmin && (
          <AdminBadge>
            <AdminIcon />
            <Typography variant="body2">Admin Access</Typography>
          </AdminBadge>
        )}
        <Typography variant="h5" gutterBottom>
          Welcome back, {userData.username}!
        </Typography>
        <Typography variant="body1">
          Last login: {userData.lastLogin}
        </Typography>
      </WelcomeMessage>

      <Grid container spacing={3}>
        <Grid component="div" item xs={12} md={6}>
          <Section elevation={2}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <InfoRow>
              <PersonIcon color="primary" />
              <Typography>
                <strong>Username:</strong> {userData.username}
              </Typography>
            </InfoRow>
            <InfoRow>
              <SecurityIcon color="primary" />
              <Typography>
                <strong>Role:</strong> {userData.isAdmin ? 'Administrator' : 'Family Member'}
              </Typography>
            </InfoRow>
            {userData.isAdmin && (
              <InfoRow>
                <StarIcon color="primary" />
                <Typography>
                  <strong>Special Access:</strong> Full system control
                </Typography>
              </InfoRow>
            )}
          </Section>
        </Grid>

        <Grid component="div" item xs={12} md={6}>
          <Section elevation={2}>
            <Typography variant="h6" gutterBottom>
              Family Information
            </Typography>
            <InfoRow>
              <FamilyIcon color="primary" />
              <Typography>
                <strong>Family:</strong> {userData.familyName}
              </Typography>
            </InfoRow>
            {/* Display Join Date if needed, currently set to current month/year */}
            <InfoRow>
              <PersonIcon color="primary" />
              <Typography>
                <strong>Member Since:</strong> {userData.joinDate}
              </Typography>
            </InfoRow>
          </Section>
        </Grid>
      </Grid>

      {userData.isAdmin && (
        <EasterEgg onClick={handleEasterEggClick}>
          <Tooltip title="Click for a surprise!">
            <TrophyIcon sx={{ fontSize: 40, color: '#ffd700' }} />
          </Tooltip>
        </EasterEgg>
      )}

      {showEasterEgg && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            animation: 'fadeIn 0.5s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }}
        >
          <Typography variant="h4" color="primary" align="center">
            🎉 You found the admin easter egg! 🎉
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Thanks for being an awesome admin!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default UserPage;
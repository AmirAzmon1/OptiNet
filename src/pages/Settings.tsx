import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Switch,
  Divider,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import styled from 'styled-components';

const SettingsContainer = styled(Box)`
  padding: 24px;
`;

const SettingsPaper = styled(Paper)`
  padding: 20px;
  margin-top: 20px;
`;

interface SettingsProps {
  darkMode: boolean;
  onThemeChange: (value: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, onThemeChange }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState(true);
  const [autoUpdate, setAutoUpdate] = React.useState(true);

  return (
    <SettingsContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="primary">
          Settings
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Box>

      <SettingsPaper>
        <List>
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Notifications" 
              secondary="Receive notifications about system changes"
            />
            <Switch
              edge="end"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Auto Updates" 
              secondary="Install updates automatically"
            />
            <Switch
              edge="end"
              checked={autoUpdate}
              onChange={(e) => setAutoUpdate(e.target.checked)}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <PaletteIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Dark Mode" 
              secondary="Enable dark theme"
            />
            <Switch
              edge="end"
              checked={darkMode}
              onChange={(e) => onThemeChange(e.target.checked)}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Language" 
              secondary="English"
            />
          </ListItem>
        </List>
      </SettingsPaper>
    </SettingsContainer>
  );
};

export default Settings; 
import React from 'react';
import { useRouterData, NeighborNetwork, ConnectedClient } from '../services/api';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

export const RouterStatus: React.FC = () => {
  const { 
    neighborNetworks, 
    connectedClients, 
    userAssignments, 
    error, 
    loading 
  } = useRouterData();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading router data: {error}
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Router Status
      </Typography>

      {/* Neighbor Networks Section */}
      <Typography variant="h5" gutterBottom mt={4}>
        Neighbor Networks
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>IP Address</TableCell>
              <TableCell>Interface</TableCell>
              <TableCell>SSID</TableCell>
              <TableCell>Latency (ms)</TableCell>
              <TableCell>Traffic Rate</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Active Clients</TableCell>
              <TableCell>Clients Inactive</TableCell>
              <TableCell>Clients Maybe</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {neighborNetworks.map((network: NeighborNetwork, index) => (
              <TableRow key={network.ip || index}>
                <TableCell>{network.ip || 'N/A'}</TableCell>
                <TableCell>{network.interface || 'N/A'}</TableCell>
                <TableCell>{network.ssid || 'N/A'}</TableCell>
                <TableCell>{network.latency?.toFixed(2) || 'N/A'}</TableCell>
                <TableCell>{network.traffic_rate?.toLocaleString() || 'N/A'}</TableCell>
                <TableCell>{network.score?.toFixed(2) || 'N/A'}</TableCell>
                <TableCell>{network.clients_active ?? 'N/A'}</TableCell>
                <TableCell>{network.clients_inactive ?? 'N/A'}</TableCell>
                <TableCell>{network.clients_maybe ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Connected Clients Section */}
      <Typography variant="h5" gutterBottom mt={4}>
        Connected Clients
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>IP Address</TableCell>
              <TableCell>Assigned Network</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {connectedClients.map((client: ConnectedClient, index) => (
              <TableRow key={client.ip || index}>
                <TableCell>{client.ip || 'N/A'}</TableCell>
                <TableCell>{client.assigned_to || 'N/A'}</TableCell>
                <TableCell>{client.state || 'N/A'}</TableCell>
                <TableCell>{typeof client.score === 'number' ? client.score.toFixed(3) : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Assignments Section */}
      <Typography variant="h5" gutterBottom mt={4}>
        All User Assignments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client IP</TableCell>
              <TableCell>Assigned Network</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(userAssignments).map(([ip, network], index) => (
              <TableRow key={ip || index}>
                <TableCell>{ip || 'N/A'}</TableCell>
                <TableCell>{network.name || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 
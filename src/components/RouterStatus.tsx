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
              <TableCell>Network Name</TableCell>
              <TableCell>IP</TableCell>
              <TableCell>Interface</TableCell>
              <TableCell>Latency (ms)</TableCell>
              <TableCell>Traffic (bytes)</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Active Clients</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {neighborNetworks.map((network: NeighborNetwork) => (
              <TableRow key={network.name}>
                <TableCell>{network.name}</TableCell>
                <TableCell>{network.ip}</TableCell>
                <TableCell>{network.interface}</TableCell>
                <TableCell>{network.latency.toFixed(1)}</TableCell>
                <TableCell>{network.traffic.toLocaleString()}</TableCell>
                <TableCell>{(network.score * 100).toFixed(1)}%</TableCell>
                <TableCell>{network.active_clients}</TableCell>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {connectedClients.map((client: ConnectedClient) => (
              <TableRow key={client.ip}>
                <TableCell>{client.ip}</TableCell>
                <TableCell>{client.assigned_to}</TableCell>
                <TableCell>{client.state}</TableCell>
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
            {Object.entries(userAssignments).map(([ip, network]) => (
              <TableRow key={ip}>
                <TableCell>{ip}</TableCell>
                <TableCell>{network}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 
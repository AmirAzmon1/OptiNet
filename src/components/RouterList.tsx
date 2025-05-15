import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Neighbor {
  name: string;
  ip_address: string;
  latency: number;
  speed: number;
  load: number;
  status: string;
  packet_loss: number;
  uptime: number;
  last_checked: string;
  rating: number;
  is_current_route: boolean;
  avg_response_time: number;
}

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #1976d2;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
`;

const Th = styled.th`
  background-color: #1976d2;
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #1565c0;

  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(7),
  &:nth-child(8),
  &:nth-child(11) {
    text-align: right;
  }

  &:nth-child(6),
  &:nth-child(9),
  &:nth-child(10) {
    text-align: center;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;

  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(7),
  &:nth-child(8),
  &:nth-child(11) {
    text-align: right;
  }

  &:nth-child(6),
  &:nth-child(9),
  &:nth-child(10) {
    text-align: center;
  }
`;

const Tr = styled.tr<{ isCurrentRoute?: boolean }>`
  background-color: ${props => props.isCurrentRoute ? '#e3f2fd' : 'white'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.isCurrentRoute ? '#bbdefb' : '#f5f5f5'};
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: capitalize;
  background-color: ${props => {
    switch (props.status) {
      case 'active': return '#e8f5e9';
      case 'maintenance': return '#fff3e0';
      case 'inactive': return '#ffebee';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#2e7d32';
      case 'maintenance': return '#ef6c00';
      case 'inactive': return '#c62828';
      default: return '#616161';
    }
  }};
`;

const RatingStars = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${props => props.filled ? '#ffd700' : '#e0e0e0'};
  font-size: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #d32f2f;
`;

const RouterList: React.FC = () => {
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNeighbors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/neighbors');
      if (!response.ok) {
        throw new Error('Failed to fetch neighbors');
      }
      const data = await response.json();
      setNeighbors(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeighbors();
    const interval = setInterval(fetchNeighbors, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingContainer>Loading neighbors data...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>Error: {error}</ErrorContainer>;
  }

  return (
    <Container>
      <Title>Network Neighbors</Title>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>IP Address</Th>
              <Th>Latency (ms)</Th>
              <Th>Speed (Mbps)</Th>
              <Th>Load (%)</Th>
              <Th>Status</Th>
              <Th>Packet Loss (%)</Th>
              <Th>Uptime (days)</Th>
              <Th>Last Checked</Th>
              <Th>Rating</Th>
              <Th>Avg Response (ms)</Th>
            </tr>
          </thead>
          <tbody>
            {neighbors.map((neighbor, index) => (
              <Tr key={index} isCurrentRoute={neighbor.is_current_route}>
                <Td>{neighbor.name}</Td>
                <Td>{neighbor.ip_address}</Td>
                <Td>{neighbor.latency.toFixed(2)}</Td>
                <Td>{neighbor.speed}</Td>
                <Td>{neighbor.load.toFixed(2)}</Td>
                <Td>
                  <StatusBadge status={neighbor.status}>
                    {neighbor.status}
                  </StatusBadge>
                </Td>
                <Td>{neighbor.packet_loss.toFixed(2)}</Td>
                <Td>{neighbor.uptime}</Td>
                <Td>{new Date(neighbor.last_checked).toLocaleString()}</Td>
                <Td>
                  <RatingStars>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} filled={i < Math.round(neighbor.rating)}>
                        ★
                      </Star>
                    ))}
                    <span style={{ marginLeft: '4px', fontSize: '12px', color: '#666' }}>
                      ({neighbor.rating.toFixed(1)})
                    </span>
                  </RatingStars>
                </Td>
                <Td>{neighbor.avg_response_time.toFixed(2)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RouterList; 
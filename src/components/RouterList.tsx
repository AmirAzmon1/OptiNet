import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Neighbor {
  clients_active: number;
  clients_inactive: number;
  clients_maybe: number;
  interface: string;
  ip: string;
  latency: number;
  load: number;
  score: number;
  ssid: string;
  traffic: number;
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
  &:nth-child(6),
  &:nth-child(7) {
    text-align: right;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;

  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6),
  &:nth-child(7) {
    text-align: right;
  }
`;

const Tr = styled.tr`
  background-color: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
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
      const response = await fetch('http://192.168.1.57:5000/neighbors');
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
              <Th>IP Address</Th>
              <Th>Interface</Th>
              <Th>SSID</Th>
              <Th>Latency (ms)</Th>
              <Th>Traffic (bytes)</Th>
              <Th>Load</Th>
              <Th>Score</Th>
              <Th>Active Clients</Th>
              <Th>Clients Inactive</Th>
              <Th>Clients Maybe</Th>
            </tr>
          </thead>
          <tbody>
            {neighbors.map((neighbor, index) => (
              <Tr key={index}>
                <Td>{neighbor.ip}</Td>
                <Td>{neighbor.interface}</Td>
                <Td>{neighbor.ssid || 'N/A'}</Td>
                <Td>{neighbor.latency?.toFixed(2) || 'N/A'}</Td>
                <Td>{neighbor.traffic?.toLocaleString() || 'N/A'}</Td>
                <Td>{neighbor.load || 'N/A'}</Td>
                <Td>{(neighbor.score * 100)?.toFixed(1)}%</Td>
                <Td>{neighbor.clients_active ?? 'N/A'}</Td>
                <Td>{neighbor.clients_inactive ?? 'N/A'}</Td>
                <Td>{neighbor.clients_maybe ?? 'N/A'}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RouterList; 
import { useState, useEffect } from 'react';

// Types
export interface NeighborNetwork {
  clients_active: number;
  clients_inactive: number;
  clients_maybe: number;
  interface: string;
  ip: string;
  latency: number;
  score: number;
  ssid: string;
  traffic_rate: number;
}

export interface ConnectedClient {
  ip: string;
  assigned_to: string;
  state: string;
  score: number;
}

export interface UserAssignments {
  [key: string]: {
    interface: string;
    ip: string;
    latency: number;
    load: number;
    name: string;
    score: number;
    table: string;
    table_id: string;
    traffic: number;
  };
}

// API Configuration
//const API_BASE_URL = 'http://192.168.1.57:5000';
const API_BASE_URL = 'http://192.168.8.1:5000';

// Custom hook for fetching router data
export function useRouterData() {
  const [neighborNetworks, setNeighborNetworks] = useState<NeighborNetwork[]>([]);
  const [connectedClients, setConnectedClients] = useState<ConnectedClient[]>([]);
  const [userAssignments, setUserAssignments] = useState<UserAssignments>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      // Fetch neighbors data
      const neighborsResponse = await fetch(`${API_BASE_URL}/neighbors`);
      if (!neighborsResponse.ok) throw new Error('Failed to fetch neighbors data');
      const neighborsData = await neighborsResponse.json();
      setNeighborNetworks(neighborsData);

      // Fetch clients data
      const clientsResponse = await fetch(`${API_BASE_URL}/clients`);
      if (!clientsResponse.ok) throw new Error('Failed to fetch clients data');
      const clientsData = await clientsResponse.json();
      setConnectedClients(clientsData);

      // Fetch assignments data
      const assignmentsResponse = await fetch(`${API_BASE_URL}/assignments`);
      if (!assignmentsResponse.ok) throw new Error('Failed to fetch assignments data');
      const assignmentsData = await assignmentsResponse.json();
      setUserAssignments(assignmentsData);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAllData();

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchAllData, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return {
    neighborNetworks,
    connectedClients,
    userAssignments,
    error,
    loading,
    refetch: fetchAllData
  };
} 
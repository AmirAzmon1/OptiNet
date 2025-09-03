import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, Card, CardContent, Chip, IconButton } from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  NetworkCheck as NetworkCheckIcon
} from '@mui/icons-material';
import styled from 'styled-components';

const StatisticsContainer = styled(Box)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    pointer-events: none;
  }
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
`;

const HeaderTitle = styled(Typography)`
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const BackButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  margin-right: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  }
`;

const MainContent = styled(Box)`
  position: relative;
  z-index: 1;
`;

const StatsGrid = styled(Grid)`
  margin-bottom: 32px;
`;

const StatCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const StatCardContent = styled(CardContent)`
  padding: 24px;
  text-align: center;
`;

const StatIcon = styled(Box)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 28px;
`;

const StatValue = styled(Typography)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
`;

const StatLabel = styled(Typography)`
  color: #7f8c8d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
`;

const GraphContainer = styled(Paper)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 32px;
  margin: 32px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

const GraphHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const GraphTitle = styled(Typography)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 1.5rem;
`;

const ControlButtons = styled(Box)`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled(Button)`
  border-radius: 25px;
  text-transform: none;
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s ease;
  
  &.start {
    background: linear-gradient(135deg, #00b894, #00cec9);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 184, 148, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 184, 148, 0.6);
    }
  }
  
  &.stop {
    background: linear-gradient(135deg, #e17055, #d63031);
    color: white;
    box-shadow: 0 4px 15px rgba(225, 112, 85, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(225, 112, 85, 0.6);
    }
  }
  
  &.refresh {
    background: linear-gradient(135deg, #fdcb6e, #e17055);
    color: white;
    box-shadow: 0 4px 15px rgba(253, 203, 110, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(253, 203, 110, 0.6);
    }
  }
`;

const CanvasContainer = styled(Box)`
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 16px;
  padding: 20px;
  border: 2px solid rgba(102, 126, 234, 0.1);
`;

const StatusChip = styled(Chip)`
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
  font-weight: 600;
  border-radius: 20px;
`;

interface StatisticsProps {
  darkMode: boolean;
}

const Statistics: React.FC<StatisticsProps> = ({ darkMode }) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const neighborsListRef = useRef<any[]>([]);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isChartReady, setIsChartReady] = useState(false);
  const [stats, setStats] = useState({
    totalUpdates: 0,
    averageScore: 0,
    activeRouters: 0,
    lastUpdate: 'Never'
  });

  useEffect(() => {
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      console.log('Chart.js loaded successfully');
      setIsChartReady(true);
    };
    script.onerror = () => {
      console.error('Failed to load Chart.js');
      setIsChartReady(false);
    };
    document.head.appendChild(script);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  const initializeChart = () => {
    if (!canvasRef.current) {
      console.log('Canvas not ready');
      return false;
    }
    
    if (!(window as any).Chart) {
      console.log('Chart.js not loaded yet');
      return false;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      console.log('Could not get canvas context');
      return false;
    }

    try {
      chartRef.current = new (window as any).Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          responsive: true,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 14,
                  weight: '600'
                },
                padding: 20
              }
            }
          },
          scales: {
            x: { 
              title: { 
                display: true, 
                text: 'Time (updates)',
                font: { size: 14, weight: '600' }
              },
              grid: {
                color: 'rgba(102, 126, 234, 0.1)'
              }
            },
            y: { 
              title: { 
                display: true, 
                text: 'Score',
                font: { size: 14, weight: '600' }
              },
              suggestedMin: 0, 
              suggestedMax: 100,
              grid: {
                color: 'rgba(102, 126, 234, 0.1)'
              }
            }
          }
        }
      });
      console.log('Chart initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing chart:', error);
      return false;
    }
  };

  const generateColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };

  const fetchData = async () => {
    if (!chartRef.current || !isChartReady) {
      console.log('Chart not ready, skipping fetch');
      return;
    }

    try {
      const response = await fetch('http://192.168.8.1:5000/neighbors');
      const neighbors = await response.json();

      if (neighborsListRef.current.length === 0) {
        neighborsListRef.current = neighbors.map((n: any) => ({
          ssid: n.ssid,
          data: [],
          color: generateColor(n.ssid)
        }));

        neighborsListRef.current.forEach((neighbor: any) => {
          if (chartRef.current && chartRef.current.data && chartRef.current.data.datasets) {
            chartRef.current.data.datasets.push({
              label: neighbor.ssid,
              data: neighbor.data,
              borderColor: neighbor.color,
              backgroundColor: neighbor.color + '20',
              fill: false,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              pointHoverRadius: 6
            });
          }
        });
      }

      if (chartRef.current && chartRef.current.data) {
        chartRef.current.data.labels.push('');
        if (chartRef.current.data.labels.length > 50) {
          chartRef.current.data.labels.shift();
          neighborsListRef.current.forEach((n: any) => n.data.shift());
        }

        let totalScore = 0;
        neighbors.forEach((neighbor: any) => {
          const found = neighborsListRef.current.find((n: any) => n.ssid === neighbor.ssid);
          if (found) {
            found.data.push(neighbor.score);
            totalScore += neighbor.score;
          }
        });

        // Update stats
        setStats(prev => ({
          totalUpdates: prev.totalUpdates + 1,
          averageScore: Math.round((totalScore / neighbors.length) * 100) / 100,
          activeRouters: neighbors.length,
          lastUpdate: new Date().toLocaleTimeString()
        }));

        chartRef.current.update();
      }

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleStartSimulation = () => {
    if (updateIntervalRef.current || !isChartReady) return;
    
    try {
      setIsRunning(true);
      const chartInitialized = initializeChart();
      
      if (chartInitialized) {
        // Wait a bit for Chart.js to be ready
        setTimeout(() => {
          if (chartRef.current) {
            fetchData();
            updateIntervalRef.current = setInterval(fetchData, 2000);
          } else {
            console.log('Chart still not ready, retrying...');
            setIsRunning(false);
          }
        }, 500);
      } else {
        console.log('Failed to initialize chart');
        setIsRunning(false);
      }
    } catch (error) {
      console.error('Error starting simulation:', error);
      setIsRunning(false);
    }
  };

  const handleRefresh = () => {
    try {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
        setIsRunning(false);
      }
      
      if (chartRef.current) {
        chartRef.current.data.labels = [];
        chartRef.current.data.datasets.forEach((dataset: any) => {
          dataset.data = [];
        });
        chartRef.current.update();
      }
      
      setStats({
        totalUpdates: 0,
        averageScore: 0,
        activeRouters: 0,
        lastUpdate: 'Never'
      });
      
      // Reset the neighbors list
      neighborsListRef.current = [];
      
      console.log('Data reset successfully');
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  return (
    <StatisticsContainer>
      <Header>
        <BackButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </BackButton>
        <HeaderTitle variant="h3">
          📊 Network Statistics Dashboard
        </HeaderTitle>
      </Header>

      <MainContent>
        <StatsGrid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <StatCardContent>
                <StatIcon>
                  <TrendingUpIcon />
                </StatIcon>
                <StatValue>{stats.totalUpdates}</StatValue>
                <StatLabel>Total Updates</StatLabel>
              </StatCardContent>
            </StatCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <StatCardContent>
                <StatIcon>
                  <SpeedIcon />
                </StatIcon>
                <StatValue>{stats.averageScore}</StatValue>
                <StatLabel>Average Score</StatLabel>
              </StatCardContent>
            </StatCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <StatCardContent>
                <StatIcon>
                  <PeopleIcon />
                </StatIcon>
                <StatValue>{stats.activeRouters}</StatValue>
                <StatLabel>Active Routers</StatLabel>
              </StatCardContent>
            </StatCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <StatCardContent>
                <StatIcon>
                  <NetworkCheckIcon />
                </StatIcon>
                <StatValue>{stats.lastUpdate}</StatValue>
                <StatLabel>Last Update</StatLabel>
              </StatCardContent>
            </StatCard>
          </Grid>
        </StatsGrid>

        <GraphContainer>
          <GraphHeader>
            <Box>
              <GraphTitle variant="h5">
                🚀 Load Balancer Performance Monitor
              </GraphTitle>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Real-time monitoring of load balancer performance metrics including latency, client distribution, and traffic patterns.
              </Typography>
            </Box>
            
            <ControlButtons>
              {isRunning ? (
                <StatusChip label="🟢 Live" />
              ) : (
                <StatusChip label="🔴 Stopped" />
              )}
            </ControlButtons>
          </GraphHeader>
          
          <ControlButtons sx={{ justifyContent: 'center', mb: 3 }}>
            <ActionButton
              className="start"
              startIcon={<PlayIcon />}
              onClick={handleStartSimulation}
              disabled={isRunning || !isChartReady}
            >
              {!isChartReady ? 'Loading Chart.js...' : 'Start Monitoring'}
            </ActionButton>
            
            <ActionButton
              className="refresh"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Reset Data
            </ActionButton>
          </ControlButtons>

          {!isChartReady && (
            <Box sx={{ textAlign: 'center', p: 2, color: '#666' }}>
              <Typography variant="body2">
                Loading Chart.js library... Please wait a moment.
              </Typography>
            </Box>
          )}

          <CanvasContainer>
            <canvas 
              ref={canvasRef}
              style={{
                width: '90%',
                height: '400px',
                maxWidth: '1200px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </CanvasContainer>
          
          {/* Formula elegantly placed below the chart */}
          <Box sx={{ mt: 4, textAlign: 'center', p: 3, background: 'rgba(102, 126, 234, 0.05)', borderRadius: '16px', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#667eea', fontWeight: 600 }}>
              🧮 Score Calculation: (0.6 × Latency) + (0.3 × Clients) + (0.1 × Traffic) × 100
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label="Latency: 60%" 
                sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', fontWeight: 600 }}
              />
              <Chip 
                label="Clients: 30%" 
                sx={{ background: 'linear-gradient(135deg, #00b894, #00cec9)', color: 'white', fontWeight: 600 }}
              />
              <Chip 
                label="Traffic: 10%" 
                sx={{ background: 'linear-gradient(135deg, #fdcb6e, #e17055)', color: 'white', fontWeight: 600 }}
              />
            </Box>
          </Box>
        </GraphContainer>

        {/* Removed the old FormulaBox section */}
      </MainContent>
    </StatisticsContainer>
  );
};

export default Statistics;

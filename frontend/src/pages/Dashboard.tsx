import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Alert,
  Button,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  LinearProgress,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Badge,
  Avatar,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Refresh,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Speed,
  Timeline,
  ShowChart,
  Settings,
  Fullscreen,
  ZoomIn,
  ZoomOut,
  FilterList,
  DataUsage,
  Analytics,
  Memory,
  Sensors,
  Terrain,
  Water,
  Construction,
  Engineering,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Treemap,
  Sankey,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';

// CSS Animations for enhanced visual effects
const styles = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideIn {
    0% { transform: translateX(-10px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

// Advanced data interfaces for SCADA-style monitoring
interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'critical' | 'warning' | 'normal' | 'offline';
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  threshold: { min: number; max: number; critical: number };
  history: Array<{ timestamp: string; value: number }>;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  network: number;
  diskIO: number;
  uptime: string;
  activeAlerts: number;
  totalSensors: number;
  onlineSensors: number;
}

interface PredictionData {
  timeframe: string;
  probability: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: Array<{ name: string; impact: number }>;
}

// Color schemes for advanced theming
const CHART_COLORS = {
  primary: ['#1565C0', '#1976D2', '#1E88E5', '#2196F3', '#42A5F5'],
  critical: ['#D32F2F', '#F44336', '#EF5350', '#E57373', '#FFCDD2'],
  warning: ['#F57C00', '#FF9800', '#FFB74D', '#FFCC02', '#FFF8E1'],
  success: ['#388E3C', '#4CAF50', '#66BB6A', '#81C784', '#C8E6C9'],
  gradient: {
    temperature: ['#2196F3', '#00BCD4', '#4CAF50', '#FFEB3B', '#FF9800', '#F44336'],
    pressure: ['#E1F5FE', '#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#03A9F4'],
    vibration: ['#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0'],
  }
};

const Dashboard: React.FC = () => {
  // State management for advanced dashboard
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState(0);
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null);
  const [dataRefreshRate, setDataRefreshRate] = useState(5); // seconds
  const [showPredictions, setShowPredictions] = useState(true);
  const [chartZoom, setChartZoom] = useState(100);
  const [filterSeverity, setFilterSeverity] = useState('all');
  
  // Advanced sensor data state
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [networkTopology, setNetworkTopology] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);

  // Advanced data generation for SCADA simulation
  const generateAdvancedSensorData = useCallback(() => {
    const sensors: SensorData[] = [
      {
        id: 'SSR_001',
        name: 'Slope Stability Radar - North Face',
        value: 0.8 + Math.sin(Date.now() / 10000) * 0.3 + Math.random() * 0.1,
        unit: 'mm',
        status: Math.random() > 0.9 ? 'warning' : 'normal',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        lastUpdate: new Date().toISOString(),
        threshold: { min: 0, max: 2.0, critical: 1.8 },
        history: Array.from({ length: 50 }, (_, i) => ({
          timestamp: new Date(Date.now() - (49 - i) * 60000).toISOString(),
          value: 0.8 + Math.sin((Date.now() - (49 - i) * 60000) / 10000) * 0.3 + Math.random() * 0.1
        }))
      },
      {
        id: 'PIEZO_001',
        name: 'Piezometer - Deep Level',
        value: 45 + Math.cos(Date.now() / 15000) * 15 + Math.random() * 5,
        unit: 'kPa',
        status: Math.random() > 0.85 ? 'critical' : 'normal',
        trend: 'stable',
        lastUpdate: new Date().toISOString(),
        threshold: { min: 0, max: 80, critical: 70 },
        history: Array.from({ length: 50 }, (_, i) => ({
          timestamp: new Date(Date.now() - (49 - i) * 60000).toISOString(),
          value: 45 + Math.cos((Date.now() - (49 - i) * 60000) / 15000) * 15 + Math.random() * 5
        }))
      },
      {
        id: 'ACCEL_001',
        name: 'Accelerometer - Critical Zone',
        value: 2.5 + Math.sin(Date.now() / 8000) * 1.0 + Math.random() * 0.3,
        unit: 'g',
        status: Math.random() > 0.95 ? 'critical' : Math.random() > 0.8 ? 'warning' : 'normal',
        trend: 'up',
        lastUpdate: new Date().toISOString(),
        threshold: { min: 0, max: 5.0, critical: 4.5 },
        history: Array.from({ length: 50 }, (_, i) => ({
          timestamp: new Date(Date.now() - (49 - i) * 60000).toISOString(),
          value: 2.5 + Math.sin((Date.now() - (49 - i) * 60000) / 8000) * 1.0 + Math.random() * 0.3
        }))
      },
      {
        id: 'TILT_001',
        name: 'Tiltmeter - Bench 215',
        value: 0.15 + Math.cos(Date.now() / 12000) * 0.05 + Math.random() * 0.02,
        unit: '°',
        status: 'normal',
        trend: 'down',
        lastUpdate: new Date().toISOString(),
        threshold: { min: 0, max: 0.5, critical: 0.4 },
        history: Array.from({ length: 50 }, (_, i) => ({
          timestamp: new Date(Date.now() - (49 - i) * 60000).toISOString(),
          value: 0.15 + Math.cos((Date.now() - (49 - i) * 60000) / 12000) * 0.05 + Math.random() * 0.02
        }))
      },
      {
        id: 'STRAIN_001',
        name: 'Strain Gauge - Main Wall',
        value: 120 + Math.sin(Date.now() / 20000) * 30 + Math.random() * 10,
        unit: 'με',
        status: Math.random() > 0.9 ? 'warning' : 'normal',
        trend: 'stable',
        lastUpdate: new Date().toISOString(),
        threshold: { min: 0, max: 200, critical: 180 },
        history: Array.from({ length: 50 }, (_, i) => ({
          timestamp: new Date(Date.now() - (49 - i) * 60000).toISOString(),
          value: 120 + Math.sin((Date.now() - (49 - i) * 60000) / 20000) * 30 + Math.random() * 10
        }))
      },
      {
        id: 'WEATHER_001',
        name: 'Weather Station - Rainfall',
        value: Math.max(0, Math.sin(Date.now() / 30000) * 8 + Math.random() * 4),
        unit: 'mm/h',
        status: 'normal',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        lastUpdate: new Date().toISOString(),
        threshold: { min: 0, max: 25, critical: 20 },
        history: Array.from({ length: 50 }, (_, i) => ({
          timestamp: new Date(Date.now() - (49 - i) * 60000).toISOString(),
          value: Math.max(0, Math.sin((Date.now() - (49 - i) * 60000) / 30000) * 8 + Math.random() * 4)
        }))
      }
    ];

    // Generate system metrics
    const metrics: SystemMetrics = {
      cpu: 45 + Math.random() * 30,
      memory: 62 + Math.random() * 20,
      network: 78 + Math.random() * 15,
      diskIO: 35 + Math.random() * 25,
      uptime: '15d 7h 32m',
      activeAlerts: sensors.filter(s => s.status !== 'normal').length,
      totalSensors: sensors.length,
      onlineSensors: sensors.filter(s => s.status !== 'offline').length
    };

    // Generate prediction data
    const predictionData: PredictionData[] = [
      {
        timeframe: '1 Hour',
        probability: 15 + Math.random() * 10,
        confidence: 85 + Math.random() * 10,
        riskLevel: 'low',
        factors: [
          { name: 'Slope Displacement', impact: 25 },
          { name: 'Weather Conditions', impact: 45 },
          { name: 'Vibration Levels', impact: 30 }
        ]
      },
      {
        timeframe: '6 Hours',
        probability: 25 + Math.random() * 15,
        confidence: 78 + Math.random() * 12,
        riskLevel: 'medium',
        factors: [
          { name: 'Slope Displacement', impact: 35 },
          { name: 'Weather Conditions', impact: 40 },
          { name: 'Vibration Levels', impact: 25 }
        ]
      },
      {
        timeframe: '24 Hours',
        probability: 40 + Math.random() * 20,
        confidence: 65 + Math.random() * 15,
        riskLevel: 'medium',
        factors: [
          { name: 'Slope Displacement', impact: 45 },
          { name: 'Weather Conditions', impact: 30 },
          { name: 'Vibration Levels', impact: 25 }
        ]
      }
    ];

    // Generate heatmap data for spatial analysis
    const heatmap = Array.from({ length: 20 }, (_, x) =>
      Array.from({ length: 20 }, (_, y) => ({
        x,
        y,
        value: Math.sin(x * 0.3) * Math.cos(y * 0.3) * 100 + Math.random() * 50,
        risk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      }))
    ).flat();

    // Generate performance trend data
    const performance = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      accuracy: 85 + Math.random() * 10,
      responseTime: 50 + Math.random() * 30,
      throughput: 1000 + Math.random() * 500,
      errors: Math.floor(Math.random() * 10)
    }));

    setSensorData(sensors);
    setSystemMetrics(metrics);
    setPredictions(predictionData);
    setHeatmapData(heatmap);
    setPerformanceMetrics(performance);
  }, []);

  // Real-time data updates
  useEffect(() => {
    generateAdvancedSensorData();
    
    if (realTimeMode) {
      const interval = setInterval(generateAdvancedSensorData, dataRefreshRate * 1000);
      return () => clearInterval(interval);
    }
  }, [realTimeMode, dataRefreshRate, generateAdvancedSensorData]);

  // Advanced gauge component
  const AdvancedGauge: React.FC<{
    value: number;
    min: number;
    max: number;
    critical: number;
    label: string;
    unit: string;
    size?: number;
  }> = ({ value, min, max, critical, label, unit, size = 150 }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const criticalPercentage = ((critical - min) / (max - min)) * 100;
    
    const getColor = () => {
      if (value >= critical) return '#f44336';
      if (value >= critical * 0.8) return '#ff9800';
      return '#4caf50';
    };

    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={size}
            thickness={4}
            sx={{ color: '#e0e0e0', position: 'absolute' }}
          />
          <CircularProgress
            variant="determinate"
            value={criticalPercentage}
            size={size}
            thickness={4}
            sx={{ color: '#ffeb3b', position: 'absolute' }}
          />
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={size}
            thickness={6}
            sx={{ color: getColor() }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" fontWeight="bold" color={getColor()}>
              {value.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {unit}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
          {label}
        </Typography>
      </Box>
    );
  };

  // Advanced status indicator
  const StatusIndicator: React.FC<{ status: string; count?: number }> = ({ status, count }) => {
    const getStatusConfig = () => {
      switch (status) {
        case 'critical': return { color: '#f44336', icon: <Error />, label: 'Critical' };
        case 'warning': return { color: '#ff9800', icon: <Warning />, label: 'Warning' };
        case 'normal': return { color: '#4caf50', icon: <CheckCircle />, label: 'Normal' };
        default: return { color: '#9e9e9e', icon: <Error />, label: 'Unknown' };
      }
    };

    const config = getStatusConfig();
    
    return (
      <Chip
        icon={config.icon}
        label={count ? `${config.label} (${count})` : config.label}
        sx={{
          bgcolor: config.color,
          color: 'white',
          fontWeight: 600,
          '& .MuiChip-icon': { color: 'white' }
        }}
      />
    );
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Box 
      sx={{ 
        py: { xs: 0.5, sm: 1, md: 2, lg: 3 }, 
        px: { xs: 0.5, sm: 1, md: 2, lg: 3, xl: 4 }, // Enhanced responsive padding
        width: '100%',
        minWidth: '100%',
        height: '100%',
        overflowY: 'auto',
        // Enhanced scrollbar for better mobile experience
        '&::-webkit-scrollbar': {
          width: { xs: '4px', sm: '8px', md: '12px' },
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '6px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        }
      }}
    >
      {/* Advanced Header with Controls */}
      <Box sx={{ mb: { xs: 2, md: 4 } }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          fontWeight="bold"
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
            textAlign: { xs: 'center', sm: 'left' },
            fontWeight: { xs: 600, md: 700 }
          }}
        >
          🎛️ Ultra-Advanced SCADA Dashboard
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem', lg: '1.25rem' },
            textAlign: { xs: 'center', sm: 'left' },
            mb: { xs: 2, sm: 3 }
          }}
        >
          Real-time monitoring and predictive analytics for rockfall prediction system
        </Typography>
        
        {/* Advanced Control Panel */}
        <Paper sx={{ 
          p: { xs: 1, sm: 1.5, md: 2 }, 
          mt: { xs: 1, sm: 2 }, 
          bgcolor: '#fafafa',
          borderRadius: { xs: 1, sm: 2 },
          overflow: 'auto'
        }}>
          <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={realTimeMode} 
                    onChange={(e) => setRealTimeMode(e.target.checked)}
                    color="primary"
                    size={window.innerWidth < 600 ? 'small' : 'medium'}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Real-time Mode
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Time Range</InputLabel>
                <Select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  label="Time Range"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  <MenuItem value="1h">1 Hour</MenuItem>
                  <MenuItem value="6h">6 Hours</MenuItem>
                  <MenuItem value="24h">24 Hours</MenuItem>
                  <MenuItem value="7d">7 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  Refresh Rate: {dataRefreshRate}s
                </Typography>
                <Slider
                  value={dataRefreshRate}
                  onChange={(_, value) => setDataRefreshRate(value as number)}
                  min={1}
                  max={30}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Filter</InputLabel>
                <Select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  label="Filter"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  <MenuItem value="all">All Sensors</MenuItem>
                  <MenuItem value="critical">Critical Only</MenuItem>
                  <MenuItem value="warning">Warning+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Tooltip title="Refresh Data">
                  <IconButton 
                    onClick={generateAdvancedSensorData} 
                    color="primary"
                    size={window.innerWidth < 600 ? 'small' : 'medium'}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* System Overview Cards - Improved Layout */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        {/* Active Sensors Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            textAlign: 'center', 
            bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: { xs: 2, sm: 3 },
            minHeight: { xs: 140, sm: 160, md: 180 },
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)'
            }
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Avatar sx={{ 
                bgcolor: '#1976d2', 
                mx: 'auto', 
                mb: 2,
                width: { xs: 48, sm: 56, md: 64 },
                height: { xs: 48, sm: 56, md: 64 },
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}>
                <Sensors sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="primary" sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                mb: 1
              }}>
                {systemMetrics?.onlineSensors || 0}/{systemMetrics?.totalSensors || 0}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 500
              }}>
                Active Sensors
              </Typography>
              <Typography variant="caption" color="success.main" sx={{
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                fontWeight: 600,
                mt: 0.5
              }}>
                ✓ System Operational
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Alerts Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            textAlign: 'center', 
            bgcolor: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
            borderRadius: { xs: 2, sm: 3 },
            minHeight: { xs: 140, sm: 160, md: 180 },
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(245, 124, 0, 0.15)'
            }
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Avatar sx={{ 
                bgcolor: '#f57c00', 
                mx: 'auto', 
                mb: 2,
                width: { xs: 48, sm: 56, md: 64 },
                height: { xs: 48, sm: 56, md: 64 },
                boxShadow: '0 4px 12px rgba(245, 124, 0, 0.3)'
              }}>
                <Warning sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="warning.main" sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                mb: 1
              }}>
                {systemMetrics?.activeAlerts || 0}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 500
              }}>
                Active Alerts
              </Typography>
              <Typography variant="caption" color={systemMetrics?.activeAlerts && systemMetrics.activeAlerts > 0 ? "warning.main" : "success.main"} sx={{
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                fontWeight: 600,
                mt: 0.5
              }}>
                {systemMetrics?.activeAlerts && systemMetrics.activeAlerts > 0 ? "⚠ Requires Attention" : "✓ All Clear"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* System Uptime Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            textAlign: 'center', 
            bgcolor: 'linear-gradient(135deg, #e8f5e8 0%, #a5d6a7 100%)',
            borderRadius: { xs: 2, sm: 3 },
            minHeight: { xs: 140, sm: 160, md: 180 },
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(56, 142, 60, 0.15)'
            }
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Avatar sx={{ 
                bgcolor: '#388e3c', 
                mx: 'auto', 
                mb: 2,
                width: { xs: 48, sm: 56, md: 64 },
                height: { xs: 48, sm: 56, md: 64 },
                boxShadow: '0 4px 12px rgba(56, 142, 60, 0.3)'
              }}>
                <Timeline sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="success.main" sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                mb: 1
              }}>
                {systemMetrics?.uptime || "99.9%"}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 500
              }}>
                System Uptime
              </Typography>
              <Typography variant="caption" color="success.main" sx={{
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                fontWeight: 600,
                mt: 0.5
              }}>
                ✓ Excellent Performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Prediction Status Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            textAlign: 'center', 
            bgcolor: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)',
            borderRadius: { xs: 2, sm: 3 },
            minHeight: { xs: 140, sm: 160, md: 180 },
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(123, 31, 162, 0.15)'
            }
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Avatar sx={{ 
                bgcolor: '#7b1fa2', 
                mx: 'auto', 
                mb: 2,
                width: { xs: 48, sm: 56, md: 64 },
                height: { xs: 48, sm: 56, md: 64 },
                boxShadow: '0 4px 12px rgba(123, 31, 162, 0.3)'
              }}>
                <Analytics sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="secondary.main" sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                mb: 1
              }}>
                AI
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 500
              }}>
                Predictive Mode
              </Typography>
              <Typography variant="caption" color="secondary.main" sx={{
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                fontWeight: 600,
                mt: 0.5
              }}>
                🔮 ML Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Navigation Tabs with Better Organization */}
      <Paper sx={{ 
        mb: { xs: 3, md: 4 },
        borderRadius: { xs: 2, sm: 3 },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)'
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
              fontWeight: 600,
              minWidth: { xs: 'auto', sm: 140 },
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 1.5, sm: 2 },
              textTransform: 'none',
              color: 'rgba(0,0,0,0.7)',
              borderRadius: { xs: 1, sm: 1.5 },
              margin: { xs: 0.5, sm: 1 },
              transition: 'all 0.3s ease-in-out',
              '&.Mui-selected': {
                color: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                fontWeight: 700
              },
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                transform: 'translateY(-1px)'
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: 1.5,
              background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'
            }
          }}
        >
          <Tab 
            label="� System Overview" 
            id="tab-0"
            aria-controls="tabpanel-0"
          />
          <Tab 
            label="📊 Live Analytics" 
            id="tab-1"
            aria-controls="tabpanel-1"
          />
          <Tab 
            label="🤖 AI Predictions" 
            id="tab-2"
            aria-controls="tabpanel-2"
          />
          <Tab 
            label="🗺️ Spatial View" 
            id="tab-3"
            aria-controls="tabpanel-3"
          />
          <Tab 
            label="⚡ Performance" 
            id="tab-4"
            aria-controls="tabpanel-4"
          />
        </Tabs>
      </Paper>

      {/* Enhanced Tab Content with Proper Organization */}
      {activeTab === 0 && (
        <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
          {/* Critical Systems Section */}
          <Typography variant="h5" sx={{ 
            mb: 3, 
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
          }}>
            🎯 Critical System Monitoring
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Enhanced Gauge Display */}
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: { xs: 2, sm: 3 },
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}>
                <CardHeader
                  title="🎯 Critical Sensor Gauges"
                  subheader="Real-time SCADA-style monitoring with advanced analytics"
                  titleTypographyProps={{
                    variant: 'h6',
                    sx: { 
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      fontWeight: 600,
                      color: 'primary.main'
                    }
                  }}
                  subheaderTypographyProps={{
                    sx: { 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      color: 'text.secondary'
                    }
                  }}
                  action={
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip 
                        label="LIVE" 
                        color="success" 
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          animation: 'pulse 2s infinite'
                        }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => setChartZoom(chartZoom + 10)}
                        sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                      >
                        <ZoomIn />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => setChartZoom(Math.max(50, chartZoom - 10))}
                        sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                      >
                        <ZoomOut />
                      </IconButton>
                    </Box>
                }
              />
              <CardContent>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  {sensorData.slice(0, 4).map((sensor) => (
                    <Grid item xs={6} sm={6} md={3} key={sensor.id}>
                      <AdvancedGauge
                        value={sensor.value}
                        min={sensor.threshold.min}
                        max={sensor.threshold.max}
                        critical={sensor.threshold.critical}
                        label={sensor.name.split(' - ')[0]}
                        unit={sensor.unit}
                        size={120}
                      />
                      <Box sx={{ mt: 1, textAlign: 'center' }}>
                        <StatusIndicator status={sensor.status} />
                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                          Last: {formatTime(sensor.lastUpdate)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Enhanced Multi-Sensor Analytics Section */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              borderRadius: { xs: 2, sm: 3 },
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              <CardHeader
                title="📈 Advanced Trend Analysis"
                subheader="Real-time multi-sensor data visualization with predictive insights"
                titleTypographyProps={{
                  variant: 'h6',
                  sx: { 
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    fontWeight: 600,
                    color: 'primary.main'
                  }
                }}
                subheaderTypographyProps={{
                  sx: { 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: 'text.secondary'
                  }
                }}
                action={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Select
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                      size="small"
                      sx={{ minWidth: { xs: 80, sm: 100 }, fontSize: '0.875rem' }}
                    >
                      <MenuItem value="1h">1H</MenuItem>
                      <MenuItem value="6h">6H</MenuItem>
                      <MenuItem value="24h">24H</MenuItem>
                      <MenuItem value="7d">7D</MenuItem>
                    </Select>
                    <IconButton 
                      onClick={() => setFullscreenChart('trends')}
                      sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                    >
                      <Fullscreen />
                    </IconButton>
                  </Box>
                }
              />
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <ResponsiveContainer width="100%" height={window.innerWidth < 600 ? 250 : window.innerWidth < 900 ? 300 : 400}>
                  <ComposedChart data={sensorData[0]?.history || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatTime}
                      interval="preserveStartEnd"
                      fontSize={window.innerWidth < 600 ? 10 : 12}
                    />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      fontSize={window.innerWidth < 600 ? 10 : 12}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      fontSize={window.innerWidth < 600 ? 10 : 12}
                    />
                    <RechartsTooltip 
                      labelFormatter={(value) => `Time: ${formatTime(value)}`}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ccc',
                        fontSize: window.innerWidth < 600 ? '0.8rem' : '0.875rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="value"
                      stroke="#1976d2"
                      fill="url(#colorGradient)"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey={(data) => sensorData[1]?.history.find(h => h.timestamp === data.timestamp)?.value || 0}
                      stroke="#f57c00"
                      strokeWidth={2}
                      dot={false}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Enhanced System Performance Dashboard */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              borderRadius: { xs: 2, sm: 3 },
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              height: 'fit-content'
            }}>
              <CardHeader
                title="⚙️ System Health Monitor"
                subheader="Real-time resource utilization and performance metrics"
                titleTypographyProps={{
                  variant: 'h6',
                  sx: { 
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    fontWeight: 600,
                    color: 'primary.main'
                  }
                }}
                subheaderTypographyProps={{
                  sx: { 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: 'text.secondary'
                  }
                }}
                action={
                  <Chip 
                    label="LIVE" 
                    color="success" 
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      animation: 'pulse 2s infinite'
                    }}
                  />
                }
              />
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* CPU Usage Section */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1 
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      🖥️ CPU Usage
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                      {systemMetrics?.cpu.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={systemMetrics?.cpu || 0} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Memory</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {systemMetrics?.memory.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={systemMetrics?.memory || 0} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color="warning"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Network I/O</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {systemMetrics?.network.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={systemMetrics?.network || 0} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color="success"
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Disk I/O</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {systemMetrics?.diskIO.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={systemMetrics?.diskIO || 0} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color="secondary"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Section Divider */}
          <Grid item xs={12}>
            <Divider sx={{ 
              my: { xs: 2, sm: 3 },
              background: 'linear-gradient(90deg, transparent 0%, #1976d2 50%, transparent 100%)',
              height: 2,
              border: 'none'
            }} />
            <Typography variant="h5" sx={{ 
              textAlign: 'center',
              mb: 3, 
              mt: 2,
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
            }}>
              📊 Advanced Analytics Dashboard
            </Typography>
          </Grid>

          {/* Enhanced Multi-Parameter Radar Analysis */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: { xs: 2, sm: 3 },
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              <CardHeader
                title="🕸️ Multi-Parameter Radar"
                subheader="Comprehensive 360° sensor performance analysis"
                titleTypographyProps={{
                  variant: 'h6',
                  sx: { 
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    fontWeight: 600,
                    color: 'primary.main'
                  }
                }}
                subheaderTypographyProps={{
                  sx: { 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: 'text.secondary'
                  }
                }}
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={sensorData.map(sensor => ({
                    name: sensor.name.split(' - ')[0],
                    value: (sensor.value / sensor.threshold.max) * 100,
                    critical: (sensor.threshold.critical / sensor.threshold.max) * 100
                  }))}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Current"
                      dataKey="value"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Critical"
                      dataKey="critical"
                      stroke="#f44336"
                      fill="transparent"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Enhanced Status Distribution Analysis */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: { xs: 2, sm: 3 },
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              <CardHeader
                title="🚦 System Health Overview"
                subheader="Real-time status distribution and health metrics"
                titleTypographyProps={{
                  variant: 'h6',
                  sx: { 
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    fontWeight: 600,
                    color: 'primary.main'
                  }
                }}
                subheaderTypographyProps={{
                  sx: { 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: 'text.secondary'
                  }
                }}
                action={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    animation: 'slideIn 0.6s ease-out'
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated: {new Date().toLocaleTimeString()}
                    </Typography>
                  </Box>
                }
              />
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 2
                    }}
                  >
                    📊 Operational Status Breakdown
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1, sm: 1.5 }, 
                    flexWrap: 'wrap', 
                    mb: { xs: 2, sm: 3 },
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    <StatusIndicator 
                      status="normal" 
                      count={sensorData.filter(s => s.status === 'normal').length} 
                    />
                    <StatusIndicator 
                      status="warning" 
                      count={sensorData.filter(s => s.status === 'warning').length} 
                    />
                    <StatusIndicator 
                      status="critical" 
                      count={sensorData.filter(s => s.status === 'critical').length} 
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: { xs: 1, sm: 2 } }} />

                <ResponsiveContainer 
                  width="100%" 
                  height={window.innerWidth < 600 ? 150 : 200}
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Normal', value: sensorData.filter(s => s.status === 'normal').length, color: '#4caf50' },
                        { name: 'Warning', value: sensorData.filter(s => s.status === 'warning').length, color: '#ff9800' },
                        { name: 'Critical', value: sensorData.filter(s => s.status === 'critical').length, color: '#f44336' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={window.innerWidth < 600 ? 60 : 80}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Normal', value: sensorData.filter(s => s.status === 'normal').length, color: '#4caf50' },
                        { name: 'Warning', value: sensorData.filter(s => s.status === 'warning').length, color: '#ff9800' },
                        { name: 'Critical', value: sensorData.filter(s => s.status === 'critical').length, color: '#f44336' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Box>
      )}

      {/* Analytics Tab Content */}
      {activeTab === 1 && (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Correlation Matrix */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader
                title="🔗 Sensor Correlation Matrix"
                subheader="Cross-parameter relationship analysis"
                titleTypographyProps={{
                  variant: 'h6',
                  sx: { fontSize: { xs: '1rem', sm: '1.25rem' } }
                }}
                subheaderTypographyProps={{
                  sx: { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
                }}
              />
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <ResponsiveContainer 
                  width="100%" 
                  height={window.innerWidth < 600 ? 200 : 300}
                >
                  <ScatterChart
                    data={sensorData.map((sensor, i) => ({
                      x: sensor.value,
                      y: sensorData[(i + 1) % sensorData.length]?.value || 0,
                      name: sensor.name.split(' - ')[0],
                      status: sensor.status
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="x" 
                      name="Primary Sensor"
                      fontSize={window.innerWidth < 600 ? 10 : 12}
                    />
                    <YAxis 
                      dataKey="y" 
                      name="Secondary Sensor"
                      fontSize={window.innerWidth < 600 ? 10 : 12}
                    />
                    <RechartsTooltip 
                      formatter={(value, name) => [typeof value === 'number' ? value.toFixed(3) : value, name]}
                      labelFormatter={(value) => `Correlation Point`}
                    />
                    <Scatter dataKey="y" fill="#1976d2">
                      {sensorData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.status === 'critical' ? '#f44336' : entry.status === 'warning' ? '#ff9800' : '#4caf50'} 
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Statistical Analysis */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader
                title="📊 Statistical Analysis"
                subheader="Real-time statistical metrics"
                titleTypographyProps={{
                  variant: 'h6',
                  sx: { fontSize: { xs: '1rem', sm: '1.25rem' } }
                }}
                subheaderTypographyProps={{
                  sx: { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
                }}
              />
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    Distribution Analysis
                  </Typography>
                  <ResponsiveContainer 
                    width="100%" 
                    height={window.innerWidth < 600 ? 150 : 200}
                  >
                    <BarChart data={sensorData.map(sensor => ({
                      name: sensor.name.split(' - ')[0],
                      mean: sensor.value,
                      stdDev: sensor.value * 0.1,
                      variance: Math.pow(sensor.value * 0.1, 2)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name"
                        fontSize={window.innerWidth < 600 ? 10 : 12}
                      />
                      <YAxis fontSize={window.innerWidth < 600 ? 10 : 12} />
                      <RechartsTooltip />
                      <Bar dataKey="mean" fill="#1976d2" name="Mean Value" />
                      <Bar dataKey="stdDev" fill="#ff9800" name="Std Dev" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Trend Prediction */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="📈 Advanced Trend Analysis & Prediction"
                subheader="Machine learning powered forecasting"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart
                    data={Array.from({ length: 48 }, (_, i) => {
                      const isPrediction = i >= 24;
                      const baseTime = new Date(Date.now() - (47 - i) * 60 * 60 * 1000);
                      return {
                        time: baseTime.toISOString(),
                        historical: !isPrediction ? 0.8 + Math.sin(i * 0.3) * 0.3 + Math.random() * 0.1 : null,
                        predicted: isPrediction ? 0.8 + Math.sin(i * 0.3) * 0.3 + (i - 24) * 0.02 : null,
                        confidence: isPrediction ? 95 - (i - 24) * 2 : null,
                        upperBound: isPrediction ? (0.8 + Math.sin(i * 0.3) * 0.3 + (i - 24) * 0.02) * 1.1 : null,
                        lowerBound: isPrediction ? (0.8 + Math.sin(i * 0.3) * 0.3 + (i - 24) * 0.02) * 0.9 : null
                      };
                    })}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(time) => new Date(time).toLocaleTimeString('en-US', { hour: '2-digit' })}
                    />
                    <YAxis />
                    <RechartsTooltip 
                      labelFormatter={(time) => new Date(time).toLocaleString()}
                    />
                    
                    {/* Historical Data */}
                    <Line
                      type="monotone"
                      dataKey="historical"
                      stroke="#1976d2"
                      strokeWidth={3}
                      name="Historical Data"
                      connectNulls={false}
                      dot={false}
                    />
                    
                    {/* Predicted Data */}
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#f57c00"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="AI Prediction"
                      connectNulls={false}
                      dot={false}
                    />
                    
                    {/* Confidence Bands */}
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      stroke="none"
                      fill="#ffcc02"
                      fillOpacity={0.2}
                      name="Confidence Band"
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      stroke="none"
                      fill="#ffcc02"
                      fillOpacity={0.2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* AI Prediction Cards */}
          {predictions.map((pred, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                bgcolor: pred.riskLevel === 'critical' ? '#ffebee' : 
                       pred.riskLevel === 'high' ? '#fff3e0' : 
                       pred.riskLevel === 'medium' ? '#fff8e1' : '#e8f5e8'
              }}>
                <CardHeader
                  title={`🔮 ${pred.timeframe} Prediction`}
                  subheader={`Risk Level: ${pred.riskLevel.toUpperCase()}`}
                />
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h3" fontWeight="bold" 
                      color={pred.riskLevel === 'critical' ? 'error' : 
                             pred.riskLevel === 'high' ? 'warning' : 
                             pred.riskLevel === 'medium' ? 'warning' : 'success'}>
                      {pred.probability.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Failure Probability
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Confidence: {pred.confidence.toFixed(1)}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={pred.confidence} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Contributing Factors:
                  </Typography>
                  {pred.factors.map((factor, i) => (
                    <Box key={i} sx={{ mb: 1 }}>
                      <Typography variant="caption" display="block">
                        {factor.name}: {factor.impact}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={factor.impact} 
                        sx={{ height: 4, borderRadius: 2 }}
                        color={factor.impact > 40 ? 'error' : factor.impact > 25 ? 'warning' : 'success'}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* ML Model Performance */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="🤖 Machine Learning Model Performance"
                subheader="Real-time model accuracy and training metrics"
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={performanceMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line 
                          type="monotone" 
                          dataKey="accuracy" 
                          stroke="#4caf50" 
                          name="Accuracy %" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="responseTime" 
                          stroke="#ff9800" 
                          name="Response Time (ms)" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={performanceMetrics.slice(-12)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="throughput" fill="#1976d2" name="Throughput" />
                        <Bar dataKey="errors" fill="#f44336" name="Errors" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          {/* 3D Heatmap Visualization */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardHeader
                title="🗺️ Spatial Risk Heatmap"
                subheader="3D visualization of risk distribution across mining area"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <Treemap
                    data={heatmapData.filter((_, i) => i < 50).map(point => ({
                      name: `Zone ${point.x}-${point.y}`,
                      size: point.value,
                      risk: point.risk
                    }))}
                    dataKey="size"
                    aspectRatio={4/3}
                    stroke="#fff"
                    fill="#1976d2"
                  >
                    {heatmapData.filter((_, i) => i < 50).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.risk === 'high' ? '#f44336' : 
                              entry.risk === 'medium' ? '#ff9800' : '#4caf50'} 
                      />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Geographic Distribution */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardHeader
                title="📍 Sensor Network Topology"
                subheader="Real-time sensor network status"
              />
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {sensorData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Sensors
                  </Typography>
                </Box>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'North Face', value: 35, color: '#1976d2' },
                        { name: 'South Face', value: 28, color: '#f57c00' },
                        { name: 'East Wall', value: 22, color: '#4caf50' },
                        { name: 'West Wall', value: 15, color: '#9c27b0' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'North Face', value: 35, color: '#1976d2' },
                        { name: 'South Face', value: 28, color: '#f57c00' },
                        { name: 'East Wall', value: 22, color: '#4caf50' },
                        { name: 'West Wall', value: 15, color: '#9c27b0' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Grid container spacing={3}>
          {/* Performance Overview */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="⚡ System Performance Analytics"
                subheader="Comprehensive performance monitoring and optimization metrics"
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                      <Speed sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {(performanceMetrics.reduce((acc, curr) => acc + curr.responseTime, 0) / performanceMetrics.length).toFixed(0)}ms
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Response Time
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8', borderRadius: 2 }}>
                      <DataUsage sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {(performanceMetrics.reduce((acc, curr) => acc + curr.throughput, 0) / performanceMetrics.length).toFixed(0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Throughput/h
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                      <Analytics sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        {(performanceMetrics.reduce((acc, curr) => acc + curr.accuracy, 0) / performanceMetrics.length).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Model Accuracy
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
                      <Error sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="error.main">
                        {performanceMetrics.reduce((acc, curr) => acc + curr.errors, 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Errors (24h)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Performance Metrics */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="📊 Detailed Performance Trends"
                subheader="24-hour performance analysis with trend indicators"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    
                    <Bar yAxisId="left" dataKey="throughput" fill="#1976d2" name="Throughput" />
                    <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#4caf50" strokeWidth={3} name="Accuracy %" />
                    <Line yAxisId="right" type="monotone" dataKey="responseTime" stroke="#ff9800" strokeWidth={2} name="Response Time" />
                    <Area yAxisId="left" type="monotone" dataKey="errors" fill="#f44336" fillOpacity={0.3} stroke="#f44336" name="Errors" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
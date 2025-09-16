import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tooltip,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  CircularProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Backup as BackupIcon,
  DevicesOther as DeviceIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  WifiOff as OfflineIcon,
  Radar as RadarIcon,
  Water as WaterIcon,
  Scanner as ScannerIcon,
  LinearScale as LinearScaleIcon,
  Straighten as StraightenIcon,
  Vibration as VibrationIcon,
  Cloud as CloudIcon,
  Hearing as HearingIcon,
  Engineering as EngineeringIcon,
  CameraAlt as CameraIcon,
  FlightTakeoff as DroneIcon,
  PowerSettingsNew as PowerIcon,
  Refresh as RefreshIcon,
  Build as ConfigureIcon,
  Visibility as ViewIcon,
  TableChart as TableIcon,
  BarChart as ChartIcon,
  TrendingUp as TrendingUpIcon,
  SignalWifi4Bar as SignalIcon,
  SignalWifiOff as NoSignalIcon,
  Speed as SpeedIcon,
  DataUsage as DataIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Device interfaces and types
interface DeviceField {
  name: string;
  unit?: string;
  formula?: string;
  currentValue?: number | string;
  lastUpdate?: string;
  threshold?: {
    min?: number;
    max?: number;
    critical?: number;
  };
}

interface DeviceMetrics {
  uptime: number; // percentage
  dataQuality: number; // percentage
  lastDataReceived: string;
  totalReadings: number;
  errorRate: number; // percentage
  signalStrength?: number; // percentage
}

interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'online' | 'offline' | 'warning' | 'error' | 'maintenance';
  enabled: boolean;
  lastUpdate: string;
  fields: DeviceField[];
  outputFormat: string[];
  metrics: DeviceMetrics;
  apiEndpoint?: string;
  icon: React.ReactElement;
  chartData?: Array<{timestamp: string, value: number}>;
}

interface DeviceCategory {
  id: string;
  name: string;
  description: string;
  devices: Device[];
  icon: React.ReactElement;
}

// Helper function to get device icon
const getDeviceIcon = (deviceType: string, status: string) => {
  const iconColor = status === 'online' ? 'success.main' : 
                   status === 'warning' ? 'warning.main' : 
                   status === 'error' ? 'error.main' : 'grey.500';
  
  switch (deviceType.toLowerCase()) {
    case 'radar': case 'ssr': return <RadarIcon sx={{ color: iconColor }} />;
    case 'piezometer': return <WaterIcon sx={{ color: iconColor }} />;
    case 'lidar': case 'scanner': return <ScannerIcon sx={{ color: iconColor }} />;
    case 'extensometer': return <LinearScaleIcon sx={{ color: iconColor }} />;
    case 'inclinometer': return <StraightenIcon sx={{ color: iconColor }} />;
    case 'vibration': case 'seismograph': return <VibrationIcon sx={{ color: iconColor }} />;
    case 'rain': return <CloudIcon sx={{ color: iconColor }} />;
    case 'acoustic': case 'geophone': return <HearingIcon sx={{ color: iconColor }} />;
    case 'survey': return <EngineeringIcon sx={{ color: iconColor }} />;
    case 'drone': return <DroneIcon sx={{ color: iconColor }} />;
    case 'camera': return <CameraIcon sx={{ color: iconColor }} />;
    default: return <DeviceIcon sx={{ color: iconColor }} />;
  }
};

// Enhanced mock device data with real-time simulation
const generateMockData = (deviceId: string) => {
  const now = new Date();
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.random() * 100 + Math.sin(i * 0.1) * 20 + 50
    });
  }
  return data;
};

// Enhanced mock device data based on the provided context
const deviceCategories: DeviceCategory[] = [
  {
    id: 'slope-stability',
    name: 'Slope Stability & Water Monitoring',
    description: 'Devices monitoring slope movement and water pressure',
    icon: <RadarIcon />,
    devices: [
      {
        id: 'ssr-001',
        name: 'Slope Stability Radar (SSR)',
        type: 'radar',
        location: 'North Face - Sector A',
        status: 'online',
        enabled: true,
        lastUpdate: '2 minutes ago',
        fields: [
          { name: 'Timestamp', unit: '', currentValue: new Date().toISOString() },
          { name: 'Target Coordinates', unit: 'x, y, z', currentValue: '125.4, 67.8, 342.1' },
          { name: 'Line-of-Sight Displacement', unit: 'mm', currentValue: 2.3, threshold: { max: 10, critical: 20 } },
          { name: 'Velocity', unit: 'mm/day', formula: 'Velocity = ΔDisplacement / ΔTime', currentValue: 0.8, threshold: { max: 5, critical: 15 } }
        ],
        outputFormat: ['.csv', '.json'],
        metrics: {
          uptime: 98.5,
          dataQuality: 96.2,
          lastDataReceived: '2 minutes ago',
          totalReadings: 15420,
          errorRate: 1.8,
          signalStrength: 92
        },
        apiEndpoint: '/api/devices/ssr-001',
        icon: getDeviceIcon('radar', 'online'),
        chartData: generateMockData('ssr-001')
      },
      {
        id: 'piezo-001',
        name: 'Piezometer',
        type: 'piezometer',
        location: 'Borehole B-12',
        status: 'online',
        enabled: true,
        lastUpdate: '5 minutes ago',
        fields: [
          { name: 'Timestamp', unit: '', currentValue: new Date().toISOString() },
          { name: 'Pore Pressure', unit: 'kPa', currentValue: 45.7, threshold: { max: 100, critical: 150 } },
          { name: 'Depth', unit: 'm', currentValue: 12.5 }
        ],
        outputFormat: ['.csv', '.json'],
        metrics: {
          uptime: 99.1,
          dataQuality: 94.8,
          lastDataReceived: '5 minutes ago',
          totalReadings: 8760,
          errorRate: 0.9,
          signalStrength: 88
        },
        apiEndpoint: '/api/devices/piezo-001',
        icon: getDeviceIcon('piezometer', 'online'),
        chartData: generateMockData('piezo-001')
      },
      {
        id: 'lidar-001',
        name: 'Terrestrial Laser Scanner (LiDAR)',
        type: 'lidar',
        location: 'Station 1 - Overview',
        status: 'warning',
        enabled: true,
        lastUpdate: '15 minutes ago',
        fields: [
          { name: 'Timestamp', unit: '', currentValue: new Date().toISOString() },
          { name: 'Point Cloud', unit: 'x, y, z', currentValue: '2.1M points' },
          { name: 'Intensity', unit: '', currentValue: 0.85 },
          { name: 'Slope Angle', unit: 'degrees', formula: 'θ = arctan(√((Δx)² + (Δy)²) / Δz)', currentValue: 67.3 }
        ],
        outputFormat: ['.las', '.laz', '.tiff'],
        metrics: {
          uptime: 89.3,
          dataQuality: 91.5,
          lastDataReceived: '15 minutes ago',
          totalReadings: 2340,
          errorRate: 5.2,
          signalStrength: 76
        },
        apiEndpoint: '/api/devices/lidar-001',
        icon: getDeviceIcon('lidar', 'warning'),
        chartData: generateMockData('lidar-001')
      },
      {
        id: 'ext-001',
        name: 'Extensometer',
        type: 'extensometer',
        location: 'Joint J-5',
        status: 'online',
        enabled: true,
        lastUpdate: '3 minutes ago',
        fields: [
          { name: 'Timestamp', unit: '', currentValue: new Date().toISOString() },
          { name: 'Sensor ID', unit: '', currentValue: 'EXT-J5-001' },
          { name: 'Displacement', unit: 'mm', currentValue: 1.2, threshold: { max: 5, critical: 10 } },
          { name: 'Strain', unit: '', formula: 'ε = ΔLength / Original Length', currentValue: 0.00012 }
        ],
        outputFormat: ['.csv', '.txt'],
        metrics: {
          uptime: 97.8,
          dataQuality: 95.1,
          lastDataReceived: '3 minutes ago',
          totalReadings: 12450,
          errorRate: 2.1,
          signalStrength: 91
        },
        apiEndpoint: '/api/devices/ext-001',
        icon: getDeviceIcon('extensometer', 'online'),
        chartData: generateMockData('ext-001')
      },
      {
        id: 'incl-001',
        name: 'Inclinometer',
        type: 'inclinometer',
        location: 'Borehole I-8',
        status: 'offline',
        enabled: false,
        lastUpdate: '2 hours ago',
        fields: [
          { name: 'Timestamp', unit: '', currentValue: '2024-09-16T12:00:00Z' },
          { name: 'Sensor ID', unit: '', currentValue: 'INCL-I8-001' },
          { name: 'Inclination Angle', unit: 'θ', currentValue: 15.7 },
          { name: 'Depth', unit: 'm', currentValue: 25.0 }
        ],
        outputFormat: ['.csv', 'proprietary binary'],
        metrics: {
          uptime: 65.2,
          dataQuality: 78.3,
          lastDataReceived: '2 hours ago',
          totalReadings: 5420,
          errorRate: 15.7,
          signalStrength: 0
        },
        apiEndpoint: '/api/devices/incl-001',
        icon: getDeviceIcon('inclinometer', 'offline'),
        chartData: generateMockData('incl-001')
      }
    ]
  },
  {
    id: 'operational-impact',
    name: 'Operational & Human Impact Analysis',
    description: 'Devices monitoring vibrations, rainfall and acoustic signatures',
    icon: <VibrationIcon />,
    devices: [
      {
        id: 'vibr-001',
        name: 'Vibration Monitor (Seismograph)',
        type: 'vibration',
        location: 'Blast Zone Perimeter',
        status: 'online',
        enabled: true,
        lastUpdate: '1 minute ago',
        fields: [
          { name: 'Timestamp', unit: '', currentValue: new Date().toISOString() },
          { name: 'Peak Particle Velocity (PPV)', unit: 'mm/s', currentValue: 12.4, threshold: { max: 50, critical: 100 } },
          { name: 'Frequency', unit: 'Hz', currentValue: 25.6 }
        ],
        outputFormat: ['.csv', '.dat'],
        metrics: {
          uptime: 96.7,
          dataQuality: 93.4,
          lastDataReceived: '1 minute ago',
          totalReadings: 18920,
          errorRate: 3.1,
          signalStrength: 89
        },
        apiEndpoint: '/api/devices/vibr-001',
        icon: getDeviceIcon('vibration', 'online'),
        chartData: generateMockData('vibr-001')
      },
      {
        id: 'rain-001',
        name: 'Rain Gauge',
        type: 'rain',
        location: 'Weather Station Alpha',
        status: 'online',
        enabled: true,
        lastUpdate: '30 seconds ago',
        fields: [
          { name: 'Timestamp', unit: '', currentValue: new Date().toISOString() },
          { name: 'Rainfall', unit: 'mm/hour', currentValue: 2.3, threshold: { max: 50, critical: 100 } },
          { name: 'Cumulative Rainfall', unit: 'mm', formula: 'Σ Rainfall(t) from t=0 to T', currentValue: 15.7 }
        ],
        outputFormat: ['.csv', '.json'],
        metrics: {
          uptime: 99.8,
          dataQuality: 98.1,
          lastDataReceived: '30 seconds ago',
          totalReadings: 35640,
          errorRate: 0.2,
          signalStrength: 95
        },
        apiEndpoint: '/api/devices/rain-001',
        icon: getDeviceIcon('rain', 'online'),
        chartData: generateMockData('rain-001')
      },
      {
        id: 'acoustic-001',
        name: 'Acoustic Sensor/Geophone',
        type: 'acoustic',
        location: 'Rock Face Monitor Point',
        status: 'error',
        enabled: true,
        lastUpdate: '45 minutes ago',
        fields: [
          { name: 'Timestamp', unit: '', currentValue: '2024-09-16T13:15:00Z' },
          { name: 'Sound Signature', unit: 'Hz', currentValue: 450.2 },
          { name: 'Amplitude', unit: 'dB', currentValue: 67.8, threshold: { max: 85, critical: 100 } }
        ],
        outputFormat: ['.wav', '.csv', '.json'],
        metrics: {
          uptime: 72.1,
          dataQuality: 65.8,
          lastDataReceived: '45 minutes ago',
          totalReadings: 9870,
          errorRate: 12.4,
          signalStrength: 45
        },
        apiEndpoint: '/api/devices/acoustic-001',
        icon: getDeviceIcon('acoustic', 'error'),
        chartData: generateMockData('acoustic-001')
      }
    ]
  },
  {
    id: 'consequence-mitigation',
    name: 'Consequence & Mitigation Analysis',
    description: 'Devices for surveying and visual monitoring of mitigation effectiveness',
    icon: <EngineeringIcon />,
    devices: [
      {
        id: 'survey-001',
        name: 'Surveying Equipment',
        type: 'survey',
        location: 'Multiple Survey Points',
        status: 'online',
        enabled: true,
        lastUpdate: '10 minutes ago',
        fields: [
          { name: 'Displacement', unit: 'mm', currentValue: 3.7, threshold: { max: 10, critical: 25 } },
          { name: 'Deformation', unit: 'mm', currentValue: 1.2 },
          { name: 'Risk Reduction Factor', unit: '', formula: 'RRF = (Risk_unmitigated - Risk_mitigated) / Risk_unmitigated', currentValue: 0.75 }
        ],
        outputFormat: ['.csv', '.txt'],
        metrics: {
          uptime: 94.3,
          dataQuality: 96.7,
          lastDataReceived: '10 minutes ago',
          totalReadings: 7850,
          errorRate: 2.8,
          signalStrength: 87
        },
        apiEndpoint: '/api/devices/survey-001',
        icon: getDeviceIcon('survey', 'online'),
        chartData: generateMockData('survey-001')
      },
      {
        id: 'drone-001',
        name: 'Drone-Based Photogrammetry',
        type: 'drone',
        location: 'Aerial Survey Route',
        status: 'online',
        enabled: true,
        lastUpdate: '25 minutes ago',
        fields: [
          { name: 'High-resolution imagery', unit: '', currentValue: '4K @ 60fps' },
          { name: 'Digital Elevation Model (DEM)', unit: '', currentValue: '2cm resolution' },
          { name: 'Flight Status', unit: '', currentValue: 'Mission Complete' }
        ],
        outputFormat: ['.jpg', '.las', '.tiff'],
        metrics: {
          uptime: 87.6,
          dataQuality: 92.3,
          lastDataReceived: '25 minutes ago',
          totalReadings: 1250,
          errorRate: 4.7,
          signalStrength: 82
        },
        apiEndpoint: '/api/devices/drone-001',
        icon: getDeviceIcon('drone', 'online'),
        chartData: generateMockData('drone-001')
      },
      {
        id: 'camera-001',
        name: 'High-Resolution Time-Lapse Camera',
        type: 'camera',
        location: 'Observation Point Charlie',
        status: 'online',
        enabled: true,
        lastUpdate: '5 minutes ago',
        fields: [
          { name: 'Timestamp', unit: '', currentValue: new Date().toISOString() },
          { name: 'Visual Imagery', unit: '', currentValue: '1920x1080 @ 30fps' },
          { name: 'Video Stream', unit: '', currentValue: 'Active' },
          { name: 'Storage Used', unit: 'GB', currentValue: 245.7, threshold: { max: 500, critical: 450 } }
        ],
        outputFormat: ['.jpg', '.png', '.mp4'],
        metrics: {
          uptime: 98.9,
          dataQuality: 97.4,
          lastDataReceived: '5 minutes ago',
          totalReadings: 21340,
          errorRate: 1.1,
          signalStrength: 93
        },
        apiEndpoint: '/api/devices/camera-001',
        icon: getDeviceIcon('camera', 'online'),
        chartData: generateMockData('camera-001')
      }
    ]
  }
];

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['slope-stability']);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [chartDialogOpen, setChartDialogOpen] = useState(false);
  const [selectedDeviceChart, setSelectedDeviceChart] = useState<Device | null>(null);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      criticalOnly: false,
    },
    monitoring: {
      dataRetention: 365,
      sensorInterval: 30,
      alertThreshold: 'medium',
      autoBackup: true,
    },
    system: {
      language: 'en',
      timezone: 'UTC',
      theme: 'light',
      debugMode: false,
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNotificationChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: event.target.checked,
      },
    }));
  };

  const handleMonitoringChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        [setting]: event.target.value,
      },
    }));
  };

  const handleSystemChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [setting]: event.target.value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement save functionality
    console.log('Saving settings:', settings);
  };

  // Device Manager helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'offline': return 'default';
      case 'maintenance': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircleIcon />;
      case 'warning': return <WarningIcon />;
      case 'error': return <ErrorIcon />;
      case 'offline': return <OfflineIcon />;
      case 'maintenance': return <ConfigureIcon />;
      default: return <OfflineIcon />;
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDeviceAction = async (deviceId: string, action: 'restart' | 'configure' | 'calibrate' | 'enable' | 'disable') => {
    console.log(`Performing ${action} on device ${deviceId}`);
    
    try {
      // Simulate API call
      const response = await fetch(`/api/devices/${deviceId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log(`${action} successful for device ${deviceId}`);
        // Update device status locally for demo
        // In real implementation, you'd refresh the device data
      } else {
        console.error(`${action} failed for device ${deviceId}`);
      }
    } catch (error) {
      console.error(`Error performing ${action} on device ${deviceId}:`, error);
    }
  };

  const checkDeviceAPI = async (device: Device) => {
    if (!device.apiEndpoint) return false;
    
    try {
      const response = await fetch(device.apiEndpoint);
      return response.ok;
    } catch (error) {
      console.error(`API check failed for device ${device.id}:`, error);
      return false;
    }
  };

  const getMetricColor = (value: number, type: 'uptime' | 'quality' | 'error') => {
    if (type === 'error') {
      return value > 10 ? 'error' : value > 5 ? 'warning' : 'success';
    }
    return value > 90 ? 'success' : value > 70 ? 'warning' : 'error';
  };

  const openDeviceDetails = (device: Device) => {
    setSelectedDevice(device);
    setDeviceDialogOpen(true);
  };

  const openDeviceChart = (device: Device) => {
    setSelectedDeviceChart(device);
    setChartDialogOpen(true);
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100%', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Container maxWidth="xl" sx={{ 
        flexGrow: 1, 
        p: { xs: 1, sm: 2, md: 3 }, 
        height: '100%',
        overflowY: 'scroll',
        overflowX: 'auto',
        maxHeight: '100vh',
        width: '100%',
        maxWidth: '100% !important',
        '&::-webkit-scrollbar': {
          width: { xs: '4px', sm: '6px', md: '8px' },
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a8a8a8',
        }
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ 
          mb: { xs: 2, sm: 3, md: 4 },
          textAlign: { xs: 'center', sm: 'left' },
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}>
          Configure system preferences and monitoring parameters
        </Typography>

        <Card sx={{ borderRadius: { xs: 1, sm: 2 } }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant={window.innerWidth < 768 ? "scrollable" : "standard"}
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTab-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  minWidth: { xs: 80, sm: 120 },
                  minHeight: { xs: 48, sm: 64 }
                }
              }}
            >
              <Tab 
                icon={<NotificationsIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />} 
                label="Notifications" 
                iconPosition="start"
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
              />
              <Tab 
                icon={<SettingsIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />} 
                label="Monitoring" 
                iconPosition="start"
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
              />
              <Tab 
                icon={<SecurityIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />} 
                label="System" 
                iconPosition="start"
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
              />
              <Tab 
                icon={<BackupIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />} 
                label="Data Management" 
                iconPosition="start"
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
              />
              <Tab 
                icon={<DeviceIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />} 
                label="Device Manager" 
                iconPosition="start"
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
              />
            </Tabs>
          </Box>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={0}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                Notification Preferences
              </Typography>
              <List>
                <ListItem sx={{ 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  py: { xs: 2, sm: 1 }
                }}>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive alerts via email"
                    sx={{ 
                      mb: { xs: 1, sm: 0 },
                      '& .MuiListItemText-primary': {
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      },
                      '& .MuiListItemText-secondary': {
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                      }
                    }}
                  />
                  <ListItemSecondaryAction sx={{ 
                    position: { xs: 'static', sm: 'absolute' },
                    right: { xs: 'auto', sm: 16 },
                    top: { xs: 'auto', sm: '50%' },
                    transform: { xs: 'none', sm: 'translateY(-50%)' }
                  }}>
                    <Switch
                      checked={settings.notifications.email}
                      onChange={handleNotificationChange('email')}
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  py: { xs: 2, sm: 1 }
                }}>
                  <ListItemText
                    primary="SMS Notifications"
                    secondary="Receive critical alerts via SMS"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.sms}
                      onChange={handleNotificationChange('sms')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Browser and mobile push notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.push}
                      onChange={handleNotificationChange('push')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Critical Alerts Only"
                    secondary="Only receive high-priority alerts"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.criticalOnly}
                      onChange={handleNotificationChange('criticalOnly')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </TabPanel>

          {/* Monitoring Tab */}
          <TabPanel value={tabValue} index={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monitoring Configuration
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data Retention (days)"
                    type="number"
                    fullWidth
                    value={settings.monitoring.dataRetention}
                    onChange={handleMonitoringChange('dataRetention')}
                    helperText="How long to keep sensor data"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Sensor Reading Interval (seconds)"
                    type="number"
                    fullWidth
                    value={settings.monitoring.sensorInterval}
                    onChange={handleMonitoringChange('sensorInterval')}
                    helperText="Frequency of sensor data collection"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Alert Threshold</InputLabel>
                    <Select
                      value={settings.monitoring.alertThreshold}
                      label="Alert Threshold"
                      onChange={(e) => handleMonitoringChange('alertThreshold')({ target: { value: e.target.value } } as any)}
                    >
                      <MenuItem value="low">Low Sensitivity</MenuItem>
                      <MenuItem value="medium">Medium Sensitivity</MenuItem>
                      <MenuItem value="high">High Sensitivity</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.monitoring.autoBackup}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          monitoring: { ...prev.monitoring, autoBackup: e.target.checked }
                        }))}
                      />
                    }
                    label="Automatic Data Backup"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </TabPanel>

          {/* System Tab */}
          <TabPanel value={tabValue} index={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Configuration
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={settings.system.language}
                      label="Language"
                      onChange={(e) => handleSystemChange('language')({ target: { value: e.target.value } } as any)}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.system.timezone}
                      label="Timezone"
                      onChange={(e) => handleSystemChange('timezone')({ target: { value: e.target.value } } as any)}
                    >
                      <MenuItem value="UTC">UTC</MenuItem>
                      <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
                      <MenuItem value="America/New_York">America/New_York</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={settings.system.theme}
                      label="Theme"
                      onChange={(e) => handleSystemChange('theme')({ target: { value: e.target.value } } as any)}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.system.debugMode}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          system: { ...prev.system, debugMode: e.target.checked }
                        }))}
                      />
                    }
                    label="Debug Mode"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </TabPanel>

          {/* Data Management Tab */}
          <TabPanel value={tabValue} index={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Management
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                Data management operations affect system performance. Schedule during low activity periods.
              </Alert>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Database Backup
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Create a backup of all system data
                      </Typography>
                      <Button variant="outlined" fullWidth>
                        Create Backup
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Data Export
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Export sensor data for analysis
                      </Typography>
                      <Button variant="outlined" fullWidth>
                        Export Data
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Clean Old Data
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Remove data older than retention period
                      </Typography>
                      <Button variant="outlined" color="warning" fullWidth>
                        Clean Data
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        System Reset
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Reset system to default settings
                      </Typography>
                      <Button variant="outlined" color="error" fullWidth>
                        Reset System
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </TabPanel>

          {/* Device Manager Tab */}
          <TabPanel value={tabValue} index={4}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Device Manager
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor and manage all connected devices across different areas • Real-time status monitoring
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="View Mode">
                    <IconButton onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}>
                      {viewMode === 'cards' ? <TableIcon /> : <ViewIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Summary Statistics */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {deviceCategories.reduce((acc, cat) => acc + cat.devices.filter(d => d.status === 'online').length, 0)}
                    </Typography>
                    <Typography variant="caption">Online</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {deviceCategories.reduce((acc, cat) => acc + cat.devices.filter(d => d.status === 'warning').length, 0)}
                    </Typography>
                    <Typography variant="caption">Warning</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">
                      {deviceCategories.reduce((acc, cat) => acc + cat.devices.filter(d => d.status === 'error').length, 0)}
                    </Typography>
                    <Typography variant="caption">Error</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="grey.500">
                      {deviceCategories.reduce((acc, cat) => acc + cat.devices.filter(d => d.status === 'offline').length, 0)}
                    </Typography>
                    <Typography variant="caption">Offline</Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              {deviceCategories.map((category) => (
                <Accordion key={category.id} defaultExpanded={expandedCategories.includes(category.id)}>
                  <AccordionSummary 
                    expandIcon={category.icon}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                      <Box>
                        <Typography variant="h6" component="div">
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.description} • {category.devices.length} devices
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.devices.map(device => (
                          <Tooltip key={device.id} title={`${device.name}: ${device.status}`}>
                            <Badge 
                              badgeContent={device.enabled ? <SignalIcon sx={{ fontSize: 12 }} /> : <NoSignalIcon sx={{ fontSize: 12 }} />}
                              color={device.enabled ? 'primary' : 'default'}
                              sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}
                            >
                              <Chip
                                size="small"
                                icon={getStatusIcon(device.status)}
                                label={device.status}
                                color={getStatusColor(device.status) as any}
                                variant="outlined"
                              />
                            </Badge>
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  
                  <AccordionDetails>
                    {viewMode === 'cards' ? (
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 3,
                        justifyContent: 'flex-start',
                        alignItems: 'stretch'
                      }}>
                        {category.devices.map((device) => (
                          <Card 
                            key={device.id}
                            elevation={2} 
                            sx={{ 
                              height: 320,
                              width: 400,
                              minWidth: 380,
                              maxWidth: 420,
                              border: device.status === 'error' ? '2px solid' : '1px solid',
                              borderColor: device.status === 'error' ? 'error.main' : 'grey.200',
                              borderRadius: 2,
                              position: 'relative',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              cursor: 'pointer',
                              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                '&:hover': {
                                  elevation: 8,
                                  transform: 'translateY(-4px)',
                                  borderColor: 'primary.main',
                                  '& .device-actions': {
                                    opacity: 1,
                                    transform: 'translateY(0)'
                                  }
                                }
                              }}
                            >
                              {/* Device Header */}
                              <CardContent sx={{ p: 3, pb: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                                    <Box sx={{ 
                                      fontSize: 32, 
                                      display: 'flex', 
                                      alignItems: 'center',
                                      p: 1.5,
                                      borderRadius: 2,
                                      backgroundColor: device.status === 'online' ? 'success.light' : 
                                                      device.status === 'warning' ? 'warning.light' : 
                                                      device.status === 'error' ? 'error.light' : 'grey.200',
                                      color: device.status === 'online' ? 'success.dark' : 
                                             device.status === 'warning' ? 'warning.dark' : 
                                             device.status === 'error' ? 'error.dark' : 'grey.600'
                                    }}>
                                      {device.icon}
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                      <Typography 
                                        variant="h6" 
                                        component="div" 
                                        sx={{ 
                                          fontWeight: 700, 
                                          fontSize: '1.1rem',
                                          lineHeight: 1.3,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          mb: 0.5
                                        }}
                                      >
                                        {device.name}
                                      </Typography>
                                      <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                          display: 'block',
                                          fontSize: '0.85rem',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          mb: 0.25
                                        }}
                                      >
                                        📍 {device.location}
                                      </Typography>
                                      <Typography 
                                        variant="caption" 
                                        color="text.secondary" 
                                        sx={{ 
                                          display: 'block',
                                          fontSize: '0.75rem'
                                        }}
                                      >
                                        ID: {device.id}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                      size="medium"
                                      icon={getStatusIcon(device.status)}
                                      label={device.status.toUpperCase()}
                                      color={getStatusColor(device.status) as any}
                                      sx={{ 
                                        height: 28, 
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        minWidth: 80
                                      }}
                                    />
                                    <Switch
                                      checked={device.enabled}
                                      size="medium"
                                      onChange={() => handleDeviceAction(device.id, device.enabled ? 'disable' : 'enable')}
                                    />
                                  </Box>
                                </Box>

                                {/* Compact Metrics */}
                                <Box sx={{ mb: 2, flex: '0 0 auto' }}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                          Uptime
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <LinearProgress 
                                            variant="determinate" 
                                            value={device.metrics.uptime} 
                                            sx={{ flex: 1, height: 6, borderRadius: 3 }}
                                            color={getMetricColor(device.metrics.uptime, 'uptime') as any}
                                          />
                                          <Typography variant="body2" sx={{ fontSize: '0.8rem', minWidth: 40 }}>
                                            {device.metrics.uptime.toFixed(0)}%
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                          Data Quality
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <LinearProgress 
                                            variant="determinate" 
                                            value={device.metrics.dataQuality} 
                                            sx={{ flex: 1, height: 6, borderRadius: 3 }}
                                            color={getMetricColor(device.metrics.dataQuality, 'quality') as any}
                                          />
                                          <Typography variant="body2" sx={{ fontSize: '0.8rem', minWidth: 40 }}>
                                            {device.metrics.dataQuality.toFixed(0)}%
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
                                        {device.metrics.totalReadings.toLocaleString()}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                        Total Readings
                                      </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: device.metrics.errorRate > 5 ? 'error.main' : 'text.primary' }}>
                                        {device.metrics.errorRate}%
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                        Error Rate
                                      </Typography>
                                    </Box>
                                    {device.metrics.signalStrength && (
                                      <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
                                          {device.metrics.signalStrength}%
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                          Signal Strength
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                </Box>

                                {/* Key Readings */}
                                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
                                    📈 Live Readings
                                  </Typography>
                                  <Box sx={{ maxHeight: 100, overflow: 'auto' }}>
                                    {device.fields.slice(0, 4).map((field, index) => (
                                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, borderBottom: index < 3 ? '1px solid' : 'none', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                          {field.name.length > 18 ? field.name.substring(0, 18) + '...' : field.name}
                                        </Typography>
                                        <Typography 
                                          variant="body2" 
                                          sx={{ 
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: field.threshold && typeof field.currentValue === 'number' ? 
                                              (field.currentValue > (field.threshold.critical || Infinity) ? 'error.main' :
                                               field.currentValue > (field.threshold.max || Infinity) ? 'warning.main' : 'success.main')
                                              : 'primary.main'
                                          }}
                                        >
                                          {field.currentValue} {field.unit}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                </Box>

                                {/* Output Formats */}
                                <Box sx={{ mt: 1.5, flex: '0 0 auto' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
                                    💾 Output Formats
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {device.outputFormat.slice(0, 4).map((format, index) => (
                                      <Chip 
                                        key={index} 
                                        label={format} 
                                        size="small" 
                                        variant="outlined" 
                                        sx={{ 
                                          height: 24, 
                                          fontSize: '0.7rem',
                                          fontWeight: 500,
                                          '& .MuiChip-label': { px: 1 }
                                        }}
                                      />
                                    ))}
                                    {device.outputFormat.length > 4 && (
                                      <Chip 
                                        label={`+${device.outputFormat.length - 4} more`}
                                        size="small" 
                                        variant="filled"
                                        color="primary"
                                        sx={{ 
                                          height: 24, 
                                          fontSize: '0.7rem',
                                          '& .MuiChip-label': { px: 1 }
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Box>
                              </CardContent>

                              {/* Hover Actions */}
                              <Box 
                                className="device-actions"
                                sx={{ 
                                  position: 'absolute',
                                  bottom: 8,
                                  left: 8,
                                  right: 8,
                                  display: 'flex',
                                  gap: 0.5,
                                  opacity: 0,
                                  transform: 'translateY(10px)',
                                  transition: 'all 0.3s ease',
                                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                  borderRadius: 1,
                                  p: 0.5,
                                  backdropFilter: 'blur(10px)'
                                }}
                              >
                                <Tooltip title="View Details" arrow>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => openDeviceDetails(device)}
                                    color="primary"
                                    sx={{ p: 0.5 }}
                                  >
                                    <ViewIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="View Chart" arrow>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => openDeviceChart(device)}
                                    color="primary"
                                    disabled={device.status === 'offline'}
                                    sx={{ p: 0.5 }}
                                  >
                                    <ChartIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Configure" arrow>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeviceAction(device.id, 'configure')}
                                    disabled={device.status === 'offline'}
                                    sx={{ p: 0.5 }}
                                  >
                                    <ConfigureIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Restart" arrow>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeviceAction(device.id, 'restart')}
                                    disabled={device.status === 'offline'}
                                    sx={{ p: 0.5 }}
                                  >
                                    <RefreshIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="API Test" arrow>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => checkDeviceAPI(device)}
                                    color="secondary"
                                    sx={{ p: 0.5 }}
                                  >
                                    <SignalIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>

                              {/* Live Status Indicator */}
                              <Box 
                                sx={{ 
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: device.status === 'online' ? 'success.main' : 
                                                  device.status === 'warning' ? 'warning.main' : 
                                                  device.status === 'error' ? 'error.main' : 'grey.500',
                                  boxShadow: device.status === 'online' ? '0 0 8px rgba(76, 175, 80, 0.6)' : 
                                             device.status === 'warning' ? '0 0 8px rgba(255, 152, 0, 0.6)' : 
                                             device.status === 'error' ? '0 0 8px rgba(244, 67, 54, 0.6)' : 'none',
                                  animation: device.status === 'online' ? 'pulse 2s infinite' : 'none',
                                  '@keyframes pulse': {
                                    '0%': {
                                      boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)'
                                    },
                                    '70%': {
                                      boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)'
                                    },
                                    '100%': {
                                      boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)'
                                    }
                                  }
                                }}
                              />

                              {/* Last Update Badge */}
                              <Box 
                                sx={{ 
                                  position: 'absolute',
                                  top: 8,
                                  left: 8,
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                  color: 'white',
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: 1,
                                  fontSize: '0.6rem',
                                  fontWeight: 500
                                }}
                              >
                                🕒 {device.lastUpdate}
                              </Box>
                            </Card>
                        ))}
                      </Box>
                    ) : (
                      /* Table View */
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Device</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Location</TableCell>
                              <TableCell>Uptime</TableCell>
                              <TableCell>Quality</TableCell>
                              <TableCell>Last Update</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {category.devices.map((device) => (
                              <TableRow key={device.id}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {device.icon}
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        {device.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {device.id}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    icon={getStatusIcon(device.status)}
                                    label={device.status}
                                    color={getStatusColor(device.status) as any}
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell>{device.location}</TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={device.metrics.uptime} 
                                      sx={{ width: 50, height: 4 }}
                                      color={getMetricColor(device.metrics.uptime, 'uptime') as any}
                                    />
                                    <Typography variant="caption">
                                      {device.metrics.uptime.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={device.metrics.dataQuality} 
                                      sx={{ width: 50, height: 4 }}
                                      color={getMetricColor(device.metrics.dataQuality, 'quality') as any}
                                    />
                                    <Typography variant="caption">
                                      {device.metrics.dataQuality.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption">{device.lastUpdate}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="View Details">
                                      <IconButton size="small" onClick={() => openDeviceDetails(device)}>
                                        <ViewIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Configure">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleDeviceAction(device.id, 'configure')}
                                        disabled={device.status === 'offline'}
                                      >
                                        <ConfigureIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
              
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  🔄 Device status is updated in real-time via WebSocket connection • 
                  📊 Click chart icons to view detailed analytics • 
                  ⚙️ Use controls to manage device operations • 
                  🔧 API health checks verify data connectivity
                </Typography>
              </Alert>
            </CardContent>

            {/* Device Details Dialog */}
            <Dialog 
              open={deviceDialogOpen} 
              onClose={() => setDeviceDialogOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {selectedDevice?.icon}
                  <Box>
                    <Typography variant="h6">{selectedDevice?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedDevice?.id} • {selectedDevice?.location}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                {selectedDevice && (
                  <Box>
                    {/* Device Status and Controls */}
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>Device Status</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Chip
                                icon={getStatusIcon(selectedDevice.status)}
                                label={selectedDevice.status.toUpperCase()}
                                color={getStatusColor(selectedDevice.status) as any}
                              />
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={selectedDevice.enabled}
                                    onChange={() => handleDeviceAction(selectedDevice.id, selectedDevice.enabled ? 'disable' : 'enable')}
                                  />
                                }
                                label="Enabled"
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Last Update: {selectedDevice.lastUpdate}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>Performance</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="caption" sx={{ minWidth: 60 }}>Uptime:</Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={selectedDevice.metrics.uptime} 
                                sx={{ flex: 1, height: 8, borderRadius: 4 }}
                                color={getMetricColor(selectedDevice.metrics.uptime, 'uptime') as any}
                              />
                              <Typography variant="caption">{selectedDevice.metrics.uptime.toFixed(1)}%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ minWidth: 60 }}>Quality:</Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={selectedDevice.metrics.dataQuality} 
                                sx={{ flex: 1, height: 8, borderRadius: 4 }}
                                color={getMetricColor(selectedDevice.metrics.dataQuality, 'quality') as any}
                              />
                              <Typography variant="caption">{selectedDevice.metrics.dataQuality.toFixed(1)}%</Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Data Fields Table */}
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Field Name</TableCell>
                            <TableCell>Current Value</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Threshold</TableCell>
                            <TableCell>Formula</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedDevice.fields.map((field, index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ fontWeight: 'medium' }}>{field.name}</TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  color={
                                    field.threshold && typeof field.currentValue === 'number' ? 
                                      (field.currentValue > (field.threshold.critical || Infinity) ? 'error.main' :
                                       field.currentValue > (field.threshold.max || Infinity) ? 'warning.main' : 'success.main')
                                      : 'text.primary'
                                  }
                                >
                                  {field.currentValue}
                                </Typography>
                              </TableCell>
                              <TableCell>{field.unit || '-'}</TableCell>
                              <TableCell>
                                {field.threshold ? (
                                  <Typography variant="caption">
                                    Max: {field.threshold.max || 'N/A'} | 
                                    Critical: {field.threshold.critical || 'N/A'}
                                  </Typography>
                                ) : '-'}
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                                  {field.formula || '-'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Device Metrics */}
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Device Metrics</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6">{selectedDevice.metrics.totalReadings.toLocaleString()}</Typography>
                            <Typography variant="caption" color="text.secondary">Total Readings</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color={getMetricColor(selectedDevice.metrics.errorRate, 'error')}>
                              {selectedDevice.metrics.errorRate}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Error Rate</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6">
                              {selectedDevice.metrics.signalStrength || 'N/A'}
                              {selectedDevice.metrics.signalStrength ? '%' : ''}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Signal Strength</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6">{selectedDevice.outputFormat.length}</Typography>
                            <Typography variant="caption" color="text.secondary">Output Formats</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeviceDialogOpen(false)}>Close</Button>
                <Button 
                  variant="contained" 
                  onClick={() => selectedDevice && handleDeviceAction(selectedDevice.id, 'configure')}
                  disabled={selectedDevice?.status === 'offline'}
                >
                  Configure Device
                </Button>
              </DialogActions>
            </Dialog>

            {/* Chart Dialog */}
            <Dialog 
              open={chartDialogOpen} 
              onClose={() => setChartDialogOpen(false)}
              maxWidth="lg"
              fullWidth
            >
              <DialogTitle>
                Device Analytics - {selectedDeviceChart?.name}
              </DialogTitle>
              <DialogContent>
                {selectedDeviceChart && (
                  <Box sx={{ height: 400, mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Real-time data visualization for the last 24 hours
                    </Typography>
                    {/* Placeholder for chart - In real implementation, use Recharts or Chart.js */}
                    <Paper 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: 'grey.50'
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <ChartIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          Real-time Chart View
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Chart component would display {selectedDeviceChart.chartData?.length} data points
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Latest value: {selectedDeviceChart.fields[0]?.currentValue} {selectedDeviceChart.fields[0]?.unit}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setChartDialogOpen(false)}>Close</Button>
                <Button variant="outlined">Export Data</Button>
                <Button variant="contained">Full Screen</Button>
              </DialogActions>
            </Dialog>
          </TabPanel>

          <Divider />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined">
                Reset to Defaults
              </Button>
              <Button variant="contained" onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Settings;

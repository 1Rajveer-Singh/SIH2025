import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Terrain,
  Water,
  Engineering,
  Construction,
  Warning,
  CheckCircle,
  Error,
  Info,
  Refresh,
  Timeline,
  Speed,
  ShowChart,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, Cell } from 'recharts';

// Types for our data structures
interface SensorReading {
  timestamp: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

interface SlopeFaceData {
  ssrDisplacement: SensorReading[];
  ssrVelocity: SensorReading[];
  lidarIntensity: SensorReading[];
  extensometerDisplacement: SensorReading[];
  calculatedStrain: number;
  slopeAngle: number;
}

interface HydrogeologicalData {
  porePressure: SensorReading[];
  rainfall: SensorReading[];
  effectiveStress: number;
  cumulativeRainfall: number;
}

interface GeologicalData {
  discontinuityOrientation: number;
  spacing: number;
  persistence: number;
  roughness: number;
  factorOfSafety: number;
  kinematicAnalysis: string;
}

interface OperationalData {
  ppv: SensorReading[];
  vibrationFrequency: SensorReading[];
  blastLocation: string;
  explosiveVolume: number;
  scaledDistance: number;
}

const RockfallAnalysis: React.FC = () => {
  const [slopeFaceData, setSlopeFaceData] = useState<SlopeFaceData | null>(null);
  const [hydroData, setHydroData] = useState<HydrogeologicalData | null>(null);
  const [geoData, setGeoData] = useState<GeologicalData | null>(null);
  const [operationalData, setOperationalData] = useState<OperationalData | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Generate mock data for demonstration
  const generateMockData = () => {
    const now = new Date();
    const timestamps = Array.from({ length: 24 }, (_, i) => {
      const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      return time.toISOString();
    });

    // Slope Face Data
    setSlopeFaceData({
      ssrDisplacement: timestamps.map((ts, i) => ({
        timestamp: ts,
        value: 0.5 + Math.sin(i * 0.3) * 0.3 + Math.random() * 0.1,
        unit: 'mm',
        status: i > 20 ? 'warning' : 'normal'
      })),
      ssrVelocity: timestamps.map((ts, i) => ({
        timestamp: ts,
        value: 1.2 + Math.cos(i * 0.2) * 0.5 + Math.random() * 0.2,
        unit: 'mm/day',
        status: 'normal'
      })),
      lidarIntensity: timestamps.map((ts, i) => ({
        timestamp: ts,
        value: 85 + Math.sin(i * 0.4) * 10 + Math.random() * 5,
        unit: 'intensity',
        status: 'normal'
      })),
      extensometerDisplacement: timestamps.map((ts, i) => ({
        timestamp: ts,
        value: 0.3 + Math.sin(i * 0.5) * 0.2 + Math.random() * 0.05,
        unit: 'mm',
        status: i > 22 ? 'critical' : 'normal'
      })),
      calculatedStrain: 0.0023,
      slopeAngle: 67.5
    });

    // Hydrogeological Data
    setHydroData({
      porePressure: timestamps.map((ts, i) => ({
        timestamp: ts,
        value: 45 + Math.sin(i * 0.3) * 15 + Math.random() * 5,
        unit: 'kPa',
        status: i > 18 ? 'warning' : 'normal'
      })),
      rainfall: timestamps.map((ts, i) => ({
        timestamp: ts,
        value: Math.max(0, Math.sin(i * 0.2) * 5 + Math.random() * 3),
        unit: 'mm/hour',
        status: 'normal'
      })),
      effectiveStress: 156.7,
      cumulativeRainfall: 23.4
    });

    // Geological Data
    setGeoData({
      discontinuityOrientation: 125,
      spacing: 0.8,
      persistence: 2.3,
      roughness: 0.6,
      factorOfSafety: 1.45,
      kinematicAnalysis: 'Planar failure possible'
    });

    // Operational Data
    setOperationalData({
      ppv: timestamps.map((ts, i) => ({
        timestamp: ts,
        value: 15 + Math.sin(i * 0.6) * 8 + Math.random() * 3,
        unit: 'mm/s',
        status: 'normal'
      })),
      vibrationFrequency: timestamps.map((ts, i) => ({
        timestamp: ts,
        value: 25 + Math.cos(i * 0.4) * 10 + Math.random() * 5,
        unit: 'Hz',
        status: 'normal'
      })),
      blastLocation: 'Sector 7-A, Bench 215',
      explosiveVolume: 450,
      scaledDistance: 12.8
    });

    setLastUpdate(new Date());
  };

  useEffect(() => {
    generateMockData();
    
    if (realTimeUpdates) {
      const interval = setInterval(generateMockData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [realTimeUpdates]);

  const getRiskLevel = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return { level: 'critical', color: '#f44336' };
    if (value >= thresholds.warning) return { level: 'warning', color: '#ff9800' };
    return { level: 'normal', color: '#4caf50' };
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Box 
      sx={{ 
        py: { xs: 1, sm: 2, md: 3 }, 
        px: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        height: '100%',
        overflowY: 'auto', /* Enable scrolling within the container */
        '&::-webkit-scrollbar': {
          width: '12px',
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
      {/* Header */}
      <Box sx={{ mb: { xs: 2, md: 4 } }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          fontWeight="bold"
          sx={{ 
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          🏔️ Rockfall Risk Analysis - Open-Pit Mine
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Comprehensive real-time monitoring and analysis system
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 }, 
          mt: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          <FormControlLabel
            control={
              <Switch 
                checked={realTimeUpdates} 
                onChange={(e) => setRealTimeUpdates(e.target.checked)}
                color="primary"
                size={window.innerWidth < 600 ? 'small' : 'medium'}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Real-time Updates
              </Typography>
            }
          />
          <Chip 
            icon={<Refresh />} 
            label={`Last Update: ${lastUpdate.toLocaleTimeString()}`}
            variant="outlined"
            size={window.innerWidth < 600 ? 'small' : 'medium'}
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          />
          <IconButton 
            onClick={generateMockData} 
            size={window.innerWidth < 600 ? 'small' : 'medium'}
          >
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* 1. SLOPE FACE ANALYSIS */}
        <Grid item xs={12}>
          <Card sx={{ mb: { xs: 2, md: 3 } }}>
            <CardHeader
              avatar={<Terrain sx={{ color: '#1976d2', fontSize: { xs: 30, sm: 40 } }} />}
              title="1. The Slope Face Analysis"
              subheader="Critical area monitoring - Movement and geological structure"
              titleTypographyProps={{
                variant: 'h5',
                sx: { fontSize: { xs: '1.1rem', sm: '1.5rem' } }
              }}
              subheaderTypographyProps={{
                sx: { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
              }}
              sx={{ bgcolor: '#f5f5f5' }}
            />
            <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {/* SSR Displacement Chart */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: { xs: 1, sm: 2 } }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      <Speed sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Slope Stability Radar - Displacement
                    </Typography>
                    <ResponsiveContainer 
                      width="100%" 
                      height={window.innerWidth < 600 ? 150 : 200}
                    >
                      <LineChart data={slopeFaceData?.ssrDisplacement || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={formatTime}
                          interval="preserveStartEnd"
                          fontSize={window.innerWidth < 600 ? 10 : 12}
                        />
                        <YAxis fontSize={window.innerWidth < 600 ? 10 : 12} />
                        <RechartsTooltip 
                          labelFormatter={(value) => `Time: ${formatTime(value)}`}
                          formatter={(value) => [`${value} mm`, 'Displacement']}
                          contentStyle={{
                            fontSize: window.innerWidth < 600 ? '0.8rem' : '0.875rem'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#1976d2" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Velocity Chart */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Velocity Analysis
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={slopeFaceData?.ssrVelocity || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={formatTime}
                          interval="preserveStartEnd"
                        />
                        <YAxis />
                        <RechartsTooltip 
                          labelFormatter={(value) => `Time: ${formatTime(value)}`}
                          formatter={(value) => [`${value} mm/day`, 'Velocity']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#ff9800" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Calculated Values */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      📊 Calculated Parameters & Formulas
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                          <Typography variant="h4" color="primary" fontWeight="bold">
                            {slopeFaceData?.calculatedStrain.toFixed(4) || '0.0000'}
                          </Typography>
                          <Typography variant="body2">
                            Strain (ε) = ΔLength / Original Length
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
                          <Typography variant="h4" color="primary" fontWeight="bold">
                            {slopeFaceData?.slopeAngle.toFixed(1) || '0.0'}°
                          </Typography>
                          <Typography variant="body2">
                            Slope Angle (θ) = arctan(√((Δx)²+(Δy)²)/Δz)
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f3e5f5', borderRadius: 1 }}>
                          <Typography variant="h4" color="primary" fontWeight="bold">
                            {slopeFaceData?.ssrVelocity[slopeFaceData.ssrVelocity.length - 1]?.value.toFixed(2) || '0.00'}
                          </Typography>
                          <Typography variant="body2">
                            Velocity = ΔDisplacement / ΔTime (mm/day)
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 2. HYDROGEOLOGICAL ANALYSIS */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              avatar={<Water sx={{ color: '#0277bd', fontSize: 40 }} />}
              title="2. The Hydrogeological Area"
              subheader="Water influence analysis - Primary trigger monitoring"
              sx={{ bgcolor: '#e1f5fe' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                {/* Pore Pressure */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      💧 Pore Pressure Monitoring
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={hydroData?.porePressure.slice(-12) || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={formatTime}
                          interval="preserveStartEnd"
                        />
                        <YAxis />
                        <RechartsTooltip 
                          labelFormatter={(value) => `Time: ${formatTime(value)}`}
                          formatter={(value) => [`${value} kPa`, 'Pore Pressure']}
                        />
                        <Bar dataKey="value" fill="#0277bd" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Rainfall */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      🌧️ Rainfall Intensity
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={hydroData?.rainfall.slice(-12) || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={formatTime}
                          interval="preserveStartEnd"
                        />
                        <YAxis />
                        <RechartsTooltip 
                          labelFormatter={(value) => `Time: ${formatTime(value)}`}
                          formatter={(value) => [`${value} mm/hour`, 'Rainfall']}
                        />
                        <Bar dataKey="value" fill="#4fc3f7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Hydrogeological Calculations */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      🧮 Hydrogeological Calculations
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Alert 
                          severity={(hydroData?.effectiveStress || 0) > 150 ? 'warning' : 'success'}
                          icon={<Info />}
                          sx={{ mb: 2 }}
                        >
                          <Typography variant="h6">
                            Effective Stress: {hydroData?.effectiveStress?.toFixed(1) || '0.0'} kPa
                          </Typography>
                          <Typography variant="body2">
                            Formula: σ′ = σ − u (Total Stress - Pore Pressure)
                          </Typography>
                        </Alert>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Alert 
                          severity={(hydroData?.cumulativeRainfall || 0) > 20 ? 'warning' : 'info'}
                          icon={<Info />}
                          sx={{ mb: 2 }}
                        >
                          <Typography variant="h6">
                            Cumulative Rainfall: {hydroData?.cumulativeRainfall?.toFixed(1) || '0.0'} mm
                          </Typography>
                          <Typography variant="body2">
                            Formula: Σ Rainfall(t) from t=0 to T
                          </Typography>
                        </Alert>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 3. GEOLOGICAL AND STRUCTURAL ANALYSIS */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<Engineering sx={{ color: '#5d4037', fontSize: 40 }} />}
              title="3. Geological & Structural Area"
              subheader="Static rock weakness analysis"
              sx={{ bgcolor: '#efebe9' }}
            />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Parameter</strong></TableCell>
                      <TableCell align="right"><strong>Value</strong></TableCell>
                      <TableCell align="right"><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Discontinuity Orientation</TableCell>
                      <TableCell align="right">{geoData?.discontinuityOrientation}°</TableCell>
                      <TableCell align="right">
                        <Chip size="small" label="Normal" color="success" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Spacing</TableCell>
                      <TableCell align="right">{geoData?.spacing} m</TableCell>
                      <TableCell align="right">
                        <Chip size="small" label="Normal" color="success" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Persistence</TableCell>
                      <TableCell align="right">{geoData?.persistence} m</TableCell>
                      <TableCell align="right">
                        <Chip size="small" label="Monitor" color="warning" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Roughness</TableCell>
                      <TableCell align="right">{geoData?.roughness}</TableCell>
                      <TableCell align="right">
                        <Chip size="small" label="Normal" color="success" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Factor of Safety: {geoData?.factorOfSafety || 0}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((geoData?.factorOfSafety || 0) * 50, 100)} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    bgcolor: '#ffebee',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: (geoData?.factorOfSafety || 0) > 1.3 ? '#4caf50' : (geoData?.factorOfSafety || 0) > 1.1 ? '#ff9800' : '#f44336'
                    }
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Formula: FS = Shear Strength / Shear Stress
                </Typography>
                <Alert severity={(geoData?.factorOfSafety || 0) > 1.3 ? 'success' : 'warning'} sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Kinematic Analysis:</strong> {geoData?.kinematicAnalysis || 'Analysis pending...'}
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 4. OPERATIONAL ANALYSIS */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<Construction sx={{ color: '#f57c00', fontSize: 40 }} />}
              title="4. The Operational Area"
              subheader="Human activity impact analysis"
              sx={{ bgcolor: '#fff8e1' }}
            />
            <CardContent>
              <Grid container spacing={2}>
                {/* PPV Chart */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      📊 Peak Particle Velocity (PPV)
                    </Typography>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={operationalData?.ppv.slice(-8) || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={formatTime}
                          interval="preserveStartEnd"
                        />
                        <YAxis />
                        <RechartsTooltip 
                          labelFormatter={(value) => `Time: ${formatTime(value)}`}
                          formatter={(value) => [`${value} mm/s`, 'PPV']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#f57c00" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Operational Data */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      🧨 Current Blast Operations
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Location:</strong> {operationalData?.blastLocation}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Explosive Volume:</strong> {operationalData?.explosiveVolume} kg
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Scaled Distance:</strong> {operationalData?.scaledDistance}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                      <Typography variant="caption" display="block">
                        <strong>Formula:</strong> Scaled Distance (SD) = Distance / √Explosive Weight
                      </Typography>
                      <Typography variant="caption" display="block">
                        <strong>Formula:</strong> PPV = k(W/D)^(-b)
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Summary */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={<Warning sx={{ color: '#d32f2f', fontSize: 40 }} />}
              title="🚨 Overall Risk Assessment"
              subheader="Integrated analysis of all monitoring areas"
              sx={{ bgcolor: '#ffebee' }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h6" color="success.main">
                      Slope Face
                    </Typography>
                    <Typography variant="body2">Stable</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
                    <Warning sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                    <Typography variant="h6" color="warning.main">
                      Hydro Conditions
                    </Typography>
                    <Typography variant="body2">Monitor</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h6" color="success.main">
                      Geological
                    </Typography>
                    <Typography variant="body2">Acceptable</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h6" color="success.main">
                      Operations
                    </Typography>
                    <Typography variant="body2">Normal</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RockfallAnalysis;
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface SensorReading {
  id: number;
  site_id: number;
  sensor_type: string;
  value: number;
  unit: string;
  timestamp: string;
  status: string;
}

const Monitoring: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<number>(1);
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedSite) {
      fetchSensorData(selectedSite);
    }
  }, [selectedSite]);

  const fetchSensorData = async (siteId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/monitoring/sensors/${siteId}/readings`);
      if (response.ok) {
        const data = await response.json();
        setSensorData(data);
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const processChartData = () => {
    const grouped = sensorData.reduce((acc, reading) => {
      const time = new Date(reading.timestamp).toLocaleTimeString();
      if (!acc[time]) {
        acc[time] = { time };
      }
      acc[time][reading.sensor_type] = reading.value;
      return acc;
    }, {} as any);

    return Object.values(grouped).slice(-10); // Last 10 readings
  };

  const chartData = processChartData();

  const getSensorTypeColor = (type: string) => {
    const colors = {
      accelerometer: '#8884d8',
      strain_gauge: '#82ca9d',
      tiltmeter: '#ffc658',
      temperature: '#ff7300',
      moisture: '#00ff88',
    };
    return colors[type as keyof typeof colors] || '#8884d8';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100%', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 2, sm: 3, md: 4 }, 
        width: '100%',
        height: '100%',
        overflowY: 'scroll', /* Always show vertical scrollbar */
        overflowX: 'auto',
        maxHeight: '100vh',
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
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: { xs: 3, sm: 4 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' }
            }}>
              Real-time Monitoring
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              Live sensor data and geological monitoring
            </Typography>
          </Box>
          <FormControl sx={{ 
            minWidth: { xs: '100%', sm: 200 },
            maxWidth: { xs: '100%', sm: 'auto' }
          }}>
            <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Select Site
            </InputLabel>
            <Select
              value={selectedSite}
              label="Select Site"
              onChange={(e) => setSelectedSite(e.target.value as number)}
              size="small"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              <MenuItem value={1}>Mount Hazard Site A</MenuItem>
              <MenuItem value={2}>Valley Watch Point B</MenuItem>
              <MenuItem value={3}>Coastal Cliff Monitor C</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Sensor Status Cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography color="text.secondary" gutterBottom variant="body2" sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  Accelerometer
                </Typography>
                <Typography variant="h5" sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                }}>
                  12.3 m/s²
                </Typography>
                <Chip 
                  label="Normal" 
                  color="success" 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography color="text.secondary" gutterBottom variant="body2" sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  Strain Gauge
                </Typography>
                <Typography variant="h5" sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                }}>
                  45.7 µε
                </Typography>
                <Chip 
                  label="Warning" 
                  color="warning" 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography color="text.secondary" gutterBottom variant="body2" sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  Tiltmeter
                </Typography>
                <Typography variant="h5" sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                }}>
                  2.1°
                </Typography>
                <Chip 
                  label="Normal" 
                  color="success" 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography color="text.secondary" gutterBottom variant="body2" sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  Temperature
                </Typography>
                <Typography variant="h5" sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                }}>
                  23.5°C
                </Typography>
                <Chip 
                  label="Normal" 
                  color="success" 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography color="text.secondary" gutterBottom variant="body2" sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  Moisture
                </Typography>
                <Typography variant="h5" sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                }}>
                  65%
                </Typography>
                <Chip 
                  label="Normal" 
                  color="success" 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                }}>
                  Accelerometer Readings
                </Typography>
                <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : window.innerWidth < 1024 ? 300 : 350}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem' 
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem' 
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accelerometer"
                      stroke="#8884d8"
                      strokeWidth={window.innerWidth < 768 ? 1.5 : 2}
                      dot={{ r: window.innerWidth < 768 ? 3 : 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                }}>
                  Temperature & Moisture
                </Typography>
                <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : window.innerWidth < 1024 ? 300 : 350}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem' 
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem' 
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      stackId="1"
                      stroke="#ff7300"
                      fill="#ff7300"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="moisture"
                      stackId="2"
                      stroke="#00ff88"
                      fill="#00ff88"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Readings Table */}
        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
            }}>
              Recent Sensor Readings
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ 
              overflowX: 'auto',
              '& .MuiTable-root': {
                minWidth: { xs: 650, sm: 750 }
              }
            }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold'
                    }}>
                      Sensor Type
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold'
                    }}>
                      Value
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold'
                    }}>
                      Unit
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold'
                    }}>
                      Timestamp
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold'
                    }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sensorData.slice(0, 10).map((reading) => (
                    <TableRow key={reading.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ 
                          textTransform: 'capitalize',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          {reading.sensor_type.replace('_', ' ')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          {reading.value}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {reading.unit}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{
                          fontSize: { xs: '0.7rem', sm: '0.8rem' }
                        }}>
                          {new Date(reading.timestamp).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reading.status}
                          color={getStatusColor(reading.status) as any}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Monitoring;

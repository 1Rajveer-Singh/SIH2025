import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

interface AlertData {
  id: number;
  site_id: number;
  alert_type: string;
  severity: string;
  message: string;
  timestamp: string;
  status: string;
}

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);

  useEffect(() => {
    fetchAlerts();
    // Set up polling for new alerts
    const interval = setInterval(fetchAlerts, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return <ErrorIcon color="error" />;
      case 'MEDIUM':
        return <WarningIcon color="warning" />;
      case 'LOW':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'error';
      case 'acknowledged':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, alert: AlertData) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlert(alert);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAlert(null);
  };

  const handleAcknowledge = () => {
    // TODO: Implement acknowledge functionality
    console.log('Acknowledging alert:', selectedAlert?.id);
    handleMenuClose();
  };

  const handleResolve = () => {
    // TODO: Implement resolve functionality
    console.log('Resolving alert:', selectedAlert?.id);
    handleMenuClose();
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'acknowledged');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

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
              Alerts & Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              Monitor and manage system alerts and warnings
            </Typography>
          </Box>
          <Badge badgeContent={activeAlerts.length} color="error">
            <NotificationsIcon sx={{ 
              fontSize: { xs: 28, sm: 32 },
              color: { xs: 'primary.main', sm: 'inherit' }
            }} />
          </Badge>
        </Box>

        {/* Alert Summary Cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              bgcolor: 'error.light', 
              color: 'error.contrastText',
              height: '100%'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}>
                  <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                    <Typography variant="h4" sx={{
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                    }}>
                      {activeAlerts.length}
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}>
                      Active Alerts
                    </Typography>
                  </Box>
                  <ErrorIcon sx={{ 
                    fontSize: { xs: 32, sm: 40 }, 
                    opacity: 0.8,
                    mt: { xs: 1, sm: 0 }
                  }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              bgcolor: 'warning.light', 
              color: 'warning.contrastText',
              height: '100%'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}>
                  <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                    <Typography variant="h4" sx={{
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                    }}>
                      {acknowledgedAlerts.length}
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}>
                      Acknowledged
                    </Typography>
                  </Box>
                  <WarningIcon sx={{ 
                    fontSize: { xs: 32, sm: 40 }, 
                    opacity: 0.8,
                    mt: { xs: 1, sm: 0 }
                  }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              bgcolor: 'success.light', 
              color: 'success.contrastText',
              height: '100%'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}>
                  <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                    <Typography variant="h4" sx={{
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                    }}>
                      {resolvedAlerts.length}
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}>
                      Resolved
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ 
                    fontSize: { xs: 32, sm: 40 }, 
                    opacity: 0.8,
                    mt: { xs: 1, sm: 0 }
                  }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}>
                  <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                    <Typography variant="h4" sx={{
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                    }}>
                      {alerts.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}>
                      Total Alerts
                    </Typography>
                  </Box>
                  <NotificationsIcon sx={{ 
                    fontSize: { xs: 32, sm: 40 }, 
                    color: 'text.secondary',
                    mt: { xs: 1, sm: 0 }
                  }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Critical Alerts */}
        {activeAlerts.length > 0 && (
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" gutterBottom sx={{
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
            }}>
              Critical Active Alerts
            </Typography>
            {activeAlerts.filter(alert => alert.severity === 'HIGH').map((alert) => (
              <Alert
                key={alert.id}
                severity="error"
                sx={{ 
                  mb: { xs: 1.5, sm: 2 },
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
                action={
                  <Button 
                    color="inherit" 
                    size={window.innerWidth < 768 ? "small" : "medium"}
                    onClick={() => handleAcknowledge()}
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      minWidth: { xs: 'auto', sm: 'unset' }
                    }}
                  >
                    ACKNOWLEDGE
                  </Button>
                }
              >
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: { xs: 'flex-start', sm: 'space-between' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  width: '100%'
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold'
                    }}>
                      {alert.alert_type.replace('_', ' ').toUpperCase()}
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      mt: 0.5
                    }}>
                      {alert.message}
                    </Typography>
                  </Box>
                  <Typography variant="caption" display="block" sx={{ 
                    mt: { xs: 1, sm: 0 },
                    ml: { xs: 0, sm: 2 },
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    flexShrink: 0
                  }}>
                    {new Date(alert.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Alert>
            ))}
          </Box>
        )}

        {/* Alerts Table */}
        <Card>
          <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              px: { xs: 1, sm: 0 }
            }}>
              All Alerts
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{
              overflowX: 'auto',
              '& .MuiTable-root': {
                minWidth: { xs: 800, sm: 900 }
              }
            }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold',
                      py: { xs: 1, sm: 2 }
                    }}>
                      Alert Type
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold',
                      py: { xs: 1, sm: 2 }
                    }}>
                      Site
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold',
                      py: { xs: 1, sm: 2 }
                    }}>
                      Severity
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold',
                      py: { xs: 1, sm: 2 }
                    }}>
                      Message
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold',
                      py: { xs: 1, sm: 2 }
                    }}>
                      Timestamp
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold',
                      py: { xs: 1, sm: 2 }
                    }}>
                      Status
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: 'bold',
                      py: { xs: 1, sm: 2 }
                    }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id} hover>
                      <TableCell sx={{ py: { xs: 1, sm: 2 } }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          flexDirection: { xs: 'column', sm: 'row' },
                          textAlign: { xs: 'center', sm: 'left' }
                        }}>
                          <Box sx={{ 
                            fontSize: { xs: 16, sm: 20 },
                            mb: { xs: 0.5, sm: 0 },
                            mr: { xs: 0, sm: 1 }
                          }}>
                            {getSeverityIcon(alert.severity)}
                          </Box>
                          <Typography variant="subtitle2" sx={{ 
                            textTransform: 'capitalize',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}>
                            {alert.alert_type.replace('_', ' ')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 2 } }}>
                        <Typography variant="body2" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          Site {alert.site_id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 2 } }}>
                        <Chip
                          label={alert.severity}
                          color={getSeverityColor(alert.severity) as any}
                          size="small"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 2 } }}>
                        <Typography variant="body2" sx={{ 
                          maxWidth: { xs: 200, sm: 300 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          lineHeight: 1.4
                        }}>
                          {alert.message}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 2 } }}>
                        <Typography variant="body2" sx={{
                          fontSize: { xs: '0.7rem', sm: '0.8rem' }
                        }}>
                          {new Date(alert.timestamp).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 2 } }}>
                        <Chip
                          label={alert.status}
                          color={getStatusColor(alert.status) as any}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: { xs: 1, sm: 2 } }}>
                        <IconButton
                          size={window.innerWidth < 768 ? "small" : "medium"}
                          onClick={(e) => handleMenuClick(e, alert)}
                        >
                          <MoreVertIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleAcknowledge}>Acknowledge</MenuItem>
          <MenuItem onClick={handleResolve}>Resolve</MenuItem>
          <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Alerts;

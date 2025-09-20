import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Box,
  Chip,
  Tooltip,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { webSocketService } from '../services/websocket';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

interface Alert {
  id: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  is_active: boolean;
  acknowledged_at?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    // Connect to WebSocket for real-time alerts
    const connectWebSocket = async () => {
      try {
        await webSocketService.connect();
        setConnectionStatus('connected');
        
        // Subscribe to alerts
        webSocketService.subscribeToAlerts();
        
        // Listen for alerts
        webSocketService.on('alert', (alertData: Alert) => {
          setAlerts(prev => [alertData, ...prev.slice(0, 9)]); // Keep last 10 alerts
        });

      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setConnectionStatus('error');
      }
    };

    connectWebSocket();

    // Check connection status periodically
    const statusInterval = setInterval(() => {
      const status = webSocketService.getConnectionStatus();
      setConnectionStatus(status);
    }, 5000);

    return () => {
      clearInterval(statusInterval);
      webSocketService.disconnect();
    };
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'high': return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'medium': return <InfoIcon sx={{ color: theme.palette.info.main }} />;
      case 'low': return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      default: return <InfoIcon />;
    }
  };

  const activeAlerts = alerts.filter(alert => alert.is_active && !alert.acknowledged_at);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            fontSize: '1.25rem'
          }}
        >
          Rockfall Prediction System
        </Typography>

        {/* Connection Status */}
        <Chip
          icon={connectionStatus === 'connected' ? <CheckCircleIcon /> : <ErrorIcon />}
          label={getConnectionStatusText()}
          color={getConnectionStatusColor()}
          size="small"
          sx={{ mr: 2 }}
        />

        {/* Real-time Alerts */}
        <Tooltip title="Alerts">
          <IconButton
            color="inherit"
            onClick={handleNotificationsClick}
            sx={{ mr: 1 }}
          >
            <Badge 
              badgeContent={activeAlerts.length} 
              color={criticalAlerts.length > 0 ? "error" : "secondary"}
              max={99}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {user?.full_name || user?.username}
          </Typography>
          <Tooltip title="Account">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.common.white, 0.2) }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Menu Dropdown */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: {
              maxHeight: 400,
              width: 360,
              mt: 1
            }
          }}
        >
          {activeAlerts.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2">No active alerts</Typography>
            </MenuItem>
          ) : (
            activeAlerts.map((alert) => (
              <MenuItem key={alert.id} sx={{ whiteSpace: 'normal', maxWidth: 360 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Box sx={{ mr: 1, mt: 0.5 }}>
                    {getSeverityIcon(alert.severity)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {alert.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {alert.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(alert.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))
          )}
          {activeAlerts.length > 0 && (
            <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
              <Button fullWidth size="small" onClick={handleNotificationsClose}>
                View All Alerts
              </Button>
            </Box>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

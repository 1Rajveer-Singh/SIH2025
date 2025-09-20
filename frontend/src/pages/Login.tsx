import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(credentials.username, credentials.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Use demo admin credentials for instant access
      const success = await login('admin@example.com', 'admin123');
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Demo login failed');
      }
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100%', 
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#f5f5f5',
      px: { xs: 1, sm: 2 }
    }}>
      <Container maxWidth="sm" sx={{ 
        p: { xs: 1, sm: 2 }, 
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
        <Card sx={{ 
          width: '100%', 
          maxWidth: { xs: '100%', sm: 400 },
          mx: 'auto'
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mb: { xs: 2, sm: 3 }
            }}>
              <Avatar sx={{ 
                m: 1, 
                bgcolor: 'primary.main',
                width: { xs: 40, sm: 56 },
                height: { xs: 40, sm: 56 }
              }}>
                <LockOutlined sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
              <Typography 
                component="h1" 
                variant="h4" 
                fontWeight="bold"
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2.125rem' },
                  textAlign: 'center'
                }}
              >
                Rockfall Prediction System
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 1,
                  textAlign: 'center',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Sign in to access the monitoring dashboard
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: { xs: 1, sm: 2 } }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: { xs: 1, sm: 2 } }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email or Username"
                name="username"
                autoComplete="email"
                autoFocus
                value={credentials.username}
                onChange={handleInputChange}
                disabled={loading}
                size={window.innerWidth < 600 ? 'small' : 'medium'}
                sx={{ 
                  mb: { xs: 1, sm: 2 },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleInputChange}
                disabled={loading}
                size={window.innerWidth < 600 ? 'small' : 'medium'}
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: { xs: 2, sm: 3 }, 
                  mb: { xs: 1, sm: 2 }, 
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                sx={{ 
                  mb: { xs: 1, sm: 2 }, 
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
                disabled={loading}
                onClick={handleDemoLogin}
              >
                {loading ? 'Accessing Demo...' : '🚀 Try Demo (No Login Required)'}
              </Button>
            </Box>

            <Divider sx={{ my: { xs: 2, sm: 3 } }} />

            <Box sx={{ mt: { xs: 1, sm: 2 } }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/home')}
                sx={{ mb: 2 }}
              >
                ← Back to Home
              </Button>
              <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                <strong>Quick Access Options:</strong>
              </Typography>
              <Typography variant="body2" color="primary" align="center" sx={{ mb: 2 }}>
                Use the "Try Demo" button above for instant access, or login with credentials below:
              </Typography>
              <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Administrator:</strong> admin@rockfall.system / admin123
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Field Worker:</strong> field.worker@rockfall.system / demo123
                </Typography>
                <Typography variant="body2">
                  <strong>Data Analyst:</strong> analyst@rockfall.system / analyst123
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;

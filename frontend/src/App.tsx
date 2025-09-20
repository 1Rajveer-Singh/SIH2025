import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Import Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Sites from './pages/Sites';
import Monitoring from './pages/Monitoring';
import Alerts from './pages/Alerts';
import Predictions from './pages/Predictions';
import Settings from './pages/Settings';
import Home from './pages/Home';
import RockfallAnalysis from './pages/RockfallAnalysis';

// Import Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingScreen from './components/LoadingScreen';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#42A5F5',
      dark: '#0D47A1',
    },
    secondary: {
      main: '#F57C00',
      light: '#FFB74D',
      dark: '#E65100',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#F57C00',
      light: '#FF9800',
      dark: '#E65100',
    },
    success: {
      main: '#388E3C',
      light: '#66BB6A',
      dark: '#2E7D32',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component - Redirects to login if not authenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // If not authenticated, redirect to login page
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main Layout Component
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <Header onMenuToggle={handleSidebarToggle} isMenuOpen={sidebarOpen} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8, // Account for header height
          pl: sidebarOpen ? 30 : 1, // Simplified sidebar padding
          pr: 1, // Minimal right padding for full width usage
          transition: (theme) =>
            theme.transitions.create(['padding-left'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          backgroundColor: (theme) => theme.palette.background.default,
          minHeight: '100vh',
          height: '100vh', // Fixed height to enable scrolling
          overflowY: 'scroll', // Always show vertical scrollbar
          overflowX: 'auto', // Horizontal scroll when needed
          width: '100%', // Ensure full width usage
          maxWidth: '100vw', // Ensure full viewport width coverage
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// App Component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <AuthProvider>
            <Router 
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <Routes>
                {/* Public routes */}
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sites"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Sites />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/monitoring"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Monitoring />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/alerts"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Alerts />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/predictions"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Predictions />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/rockfall-analysis"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <RockfallAnalysis />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Settings />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                {/* Default route - redirect to home page */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

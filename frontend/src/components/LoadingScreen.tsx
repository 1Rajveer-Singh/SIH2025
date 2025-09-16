import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading Rockfall Prediction System...' 
}) => {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: 'white',
            mb: 3,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            mb: 1,
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          Initializing AI-powered geological monitoring system...
        </Typography>
      </Box>
    </Fade>
  );
};

export default LoadingScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Analytics as PredictiveAnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface RiskAssessment {
  site_id: number;
  risk_score: number;
  risk_level: string;
  prediction_confidence: number;
  factors: Array<{
    name: string;
    impact: number;
    value: string;
  }>;
  recommendations: string[];
  timestamp: string;
}

const Predictions: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<number>(1);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePrediction = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/predictions/risk-assessment/${selectedSite}`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        setRiskAssessment(data);
      }
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSite]);

  useEffect(() => {
    generatePrediction();
  }, [generatePrediction]);

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH':
        return '#f44336';
      case 'MEDIUM':
        return '#ff9800';
      case 'LOW':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH':
        return <ErrorIcon color="error" />;
      case 'MEDIUM':
        return <WarningIcon color="warning" />;
      case 'LOW':
        return <CheckCircleIcon color="success" />;
      default:
        return <CheckCircleIcon />;
    }
  };

  const pieData = riskAssessment ? [
    { name: 'Risk Score', value: riskAssessment.risk_score * 100, fill: getRiskLevelColor(riskAssessment.risk_level) },
    { name: 'Safety Margin', value: (1 - riskAssessment.risk_score) * 100, fill: '#e0e0e0' },
  ] : [];

  const factorsData = riskAssessment?.factors.map(factor => ({
    name: factor.name.replace('_', ' '),
    impact: factor.impact * 100,
    value: factor.value,
  })) || [];

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
        <Box sx={{ py: { xs: 1, sm: 2 } }}>
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
                AI Predictions & Risk Analysis
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Advanced geological risk assessment using machine learning
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <FormControl sx={{ 
                minWidth: { xs: '100%', sm: 200 },
                mb: { xs: 1, sm: 0 }
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
              <Button
                variant="contained"
                startIcon={<PsychologyIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                onClick={generatePrediction}
                disabled={loading}
                size={window.innerWidth < 768 ? "small" : "medium"}
                fullWidth={window.innerWidth < 768}
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {loading ? 'Analyzing...' : 'Generate Prediction'}
              </Button>
            </Box>
          </Box>

          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              py: { xs: 3, sm: 4 },
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <CircularProgress size={window.innerWidth < 768 ? 40 : 60} />
              <Typography variant="body2" sx={{ 
                mt: 2, 
                fontSize: { xs: '0.8rem', sm: '0.875rem' } 
              }}>
                Analyzing geological data...
              </Typography>
            </Box>
          )}

          {riskAssessment && !loading && (
            <>
              {/* Risk Overview */}
              <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
                <Grid item xs={12} lg={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ 
                      textAlign: 'center',
                      p: { xs: 2, sm: 3 }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        mb: { xs: 1, sm: 2 },
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}>
                        {getRiskIcon(riskAssessment.risk_level)}
                        <Typography variant="h6" sx={{ 
                          ml: { xs: 0, sm: 1 },
                          mt: { xs: 1, sm: 0 },
                          fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                        }}>
                          Risk Level
                        </Typography>
                      </Box>
                      <Chip
                        label={riskAssessment.risk_level}
                        color={riskAssessment.risk_level === 'HIGH' ? 'error' : riskAssessment.risk_level === 'MEDIUM' ? 'warning' : 'success'}
                        sx={{ 
                          fontSize: { xs: '0.9rem', sm: '1.2rem' }, 
                          px: { xs: 1.5, sm: 2 }, 
                          py: { xs: 0.5, sm: 1 }
                        }}
                      />
                      <Typography variant="h3" sx={{ 
                        mt: { xs: 1.5, sm: 2 }, 
                        fontWeight: 'bold',
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                      }}>
                        {(riskAssessment.risk_score * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                      }}>
                        Risk Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="h6" gutterBottom sx={{
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                      }}>
                        Risk Distribution
                      </Typography>
                      <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 150 : 200}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={window.innerWidth < 768 ? 40 : 60}
                            outerRadius={window.innerWidth < 768 ? 60 : 80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem' 
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="h6" gutterBottom sx={{
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                      }}>
                        Prediction Confidence
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mt: { xs: 1.5, sm: 2 },
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}>
                        <CircularProgress
                          variant="determinate"
                          value={riskAssessment.prediction_confidence * 100}
                          size={window.innerWidth < 768 ? 60 : 80}
                          thickness={4}
                          sx={{ color: 'primary.main' }}
                        />
                        <Typography variant="h4" sx={{ 
                          ml: { xs: 0, sm: 2 },
                          mt: { xs: 1, sm: 0 }, 
                          fontWeight: 'bold',
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                        }}>
                          {(riskAssessment.prediction_confidence * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mt: 1,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        textAlign: { xs: 'center', sm: 'left' }
                      }}>
                        Model confidence in prediction accuracy
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Risk Factors Analysis */}
              <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
                <Grid item xs={12} lg={8}>
                  <Card>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="h6" gutterBottom sx={{
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                      }}>
                        Risk Factors Impact Analysis
                      </Typography>
                      <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                        <BarChart data={factorsData} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            type="number" 
                            domain={[0, 100]}
                            tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                          />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={window.innerWidth < 768 ? 80 : 120}
                            tick={{ fontSize: window.innerWidth < 768 ? 8 : 11 }}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Impact']}
                            contentStyle={{ 
                              fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem' 
                            }}
                          />
                          <Bar dataKey="impact" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="h6" gutterBottom sx={{
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                      }}>
                        Factor Details
                      </Typography>
                      <List dense>
                        {riskAssessment.factors.map((factor, index) => (
                          <React.Fragment key={index}>
                            <ListItem sx={{ px: { xs: 0, sm: 2 } }}>
                              <ListItemIcon sx={{ minWidth: { xs: 32, sm: 56 } }}>
                                <TrendingUpIcon 
                                  color="primary" 
                                  sx={{ fontSize: { xs: 16, sm: 20 } }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={factor.name.replace('_', ' ').toUpperCase()}
                                secondary={`${factor.value} (${(factor.impact * 100).toFixed(1)}% impact)`}
                                primaryTypographyProps={{
                                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                  fontWeight: 'medium'
                                }}
                                secondaryTypographyProps={{
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                }}
                              />
                            </ListItem>
                            {index < riskAssessment.factors.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Recommendations */}
              <Card>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" gutterBottom sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                  }}>
                    AI Recommendations
                  </Typography>
                  {riskAssessment.risk_level === 'HIGH' && (
                    <Alert severity="error" sx={{ 
                      mb: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}>
                      High risk detected! Immediate action required.
                    </Alert>
                  )}
                  {riskAssessment.risk_level === 'MEDIUM' && (
                    <Alert severity="warning" sx={{ 
                      mb: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}>
                      Moderate risk level. Enhanced monitoring recommended.
                    </Alert>
                  )}
                  <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                    {riskAssessment.recommendations.map((recommendation, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Paper sx={{ 
                          p: { xs: 1.5, sm: 2 }, 
                          bgcolor: 'background.default' 
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            flexDirection: { xs: 'column', sm: 'row' }
                          }}>
                            <PredictiveAnalyticsIcon 
                              color="primary" 
                              sx={{ 
                                mr: { xs: 0, sm: 1 }, 
                                mb: { xs: 1, sm: 0 },
                                mt: 0.5,
                                fontSize: { xs: 16, sm: 20 }
                              }} 
                            />
                            <Typography variant="body2" sx={{
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              lineHeight: 1.5
                            }}>
                              {recommendation}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    mt: { xs: 1.5, sm: 2 }, 
                    display: 'block',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    textAlign: { xs: 'center', sm: 'left' }
                  }}>
                    Analysis generated on {new Date(riskAssessment.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Predictions;

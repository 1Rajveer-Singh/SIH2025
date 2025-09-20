import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
  Chip,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating
} from '@mui/material';
import {
  PlayArrow,
  Analytics,
  Terrain,
  Sensors,
  Warning,
  CloudQueue,
  ExpandMore,
  Shield,
  Timeline,
  Computer
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface TestimonialCard {
  name: string;
  role: string;
  company: string;
  rating: number;
  comment: string;
  avatar: string;
}

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features: FeatureCard[] = [
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning algorithms analyze geological data to predict rockfall events with 95% accuracy.",
      color: theme.palette.primary.main
    },
    {
      icon: <Sensors sx={{ fontSize: 40 }} />,
      title: "Real-time Monitoring",
      description: "24/7 sensor network monitoring slope stability, weather conditions, and geological changes.",
      color: theme.palette.success.main
    },
    {
      icon: <Warning sx={{ fontSize: 40 }} />,
      title: "Early Warning System",
      description: "Instant alerts and emergency notifications to prevent casualties and property damage.",
      color: theme.palette.warning.main
    },
    {
      icon: <CloudQueue sx={{ fontSize: 40 }} />,
      title: "Edge Computing",
      description: "Local data processing for immediate threat detection even without internet connectivity.",
      color: theme.palette.info.main
    },
    {
      icon: <Timeline sx={{ fontSize: 40 }} />,
      title: "Trend Analysis",
      description: "Historical data analysis and predictive modeling for long-term geological assessment.",
      color: theme.palette.secondary.main
    },
    {
      icon: <Shield sx={{ fontSize: 40 }} />,
      title: "Enterprise Security",
      description: "Military-grade encryption and secure data transmission for critical infrastructure protection.",
      color: theme.palette.error.main
    }
  ];

  const testimonials: TestimonialCard[] = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Geologist",
      company: "Mountain Safety Institute",
      rating: 5,
      comment: "This system has revolutionized our geological monitoring capabilities. The accuracy is incredible.",
      avatar: "SC"
    },
    {
      name: "Mark Johnson",
      role: "Safety Director",
      company: "Alpine Mining Corp",
      rating: 5,
      comment: "The early warning system saved our operations from a major rockfall incident. Highly recommended.",
      avatar: "MJ"
    },
    {
      name: "Prof. Elena Rodriguez",
      role: "Geological Engineering",
      company: "University of Technology",
      rating: 5,
      comment: "The AI predictions are remarkably accurate. A game-changer for geological risk assessment.",
      avatar: "ER"
    }
  ];

  const stats = [
    { value: "95%", label: "Prediction Accuracy" },
    { value: "24/7", label: "Real-time Monitoring" },
    { value: "500+", label: "Sites Protected" },
    { value: "<5s", label: "Alert Response Time" }
  ];

  const heroSlides = [
    {
      title: "Predict. Protect. Prevent.",
      subtitle: "Advanced AI-powered rockfall prediction system",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Real-time Geological Monitoring",
      subtitle: "24/7 sensor network for comprehensive safety",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Emergency Response System",
      subtitle: "Instant alerts when it matters most",
      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100%',
      overflowY: 'scroll', /* Always show vertical scrollbar */
      overflowX: 'auto',
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
      {/* Navigation */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          color: theme.palette.text.primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Terrain sx={{ 
              mr: { xs: 1, sm: 2 }, 
              color: theme.palette.primary.main,
              fontSize: { xs: 24, sm: 28 }
            }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              RockGuard AI
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center'
          }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
              sx={{ 
                borderRadius: 3,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                px: { xs: 2, sm: 3 }
              }}
              size={window.innerWidth < 600 ? 'small' : 'medium'}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: heroSlides[currentSlide].background,
              zIndex: 1
            }}
          />
        </AnimatePresence>
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
                transition={{ duration: 0.8 }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: 900,
                    color: 'white',
                    mb: 2,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {heroSlides[currentSlide].title}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: alpha('#fff', 0.9),
                    mb: 4,
                    fontWeight: 400
                  }}
                >
                  {heroSlides[currentSlide].subtitle}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={() => navigate('/login')}
                    sx={{
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.3)'
                      }
                    }}
                  >
                    Start Monitoring
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.5)',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Paper
                  elevation={20}
                  sx={{
                    p: 3,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 4
                  }}
                >
                  <Grid container spacing={2}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <Box sx={{ textAlign: 'center', color: 'white' }}>
                          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Slide Indicators */}
        <Box sx={{ 
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 3
        }}>
          {heroSlides.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: currentSlide === index ? 30 : 10,
                height: 4,
                borderRadius: 2,
                background: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </Box>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Cutting-Edge Technology
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Our advanced AI-powered system combines multiple technologies to provide unparalleled geological monitoring and prediction capabilities.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <Box sx={{ color: feature.color, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ py: 8, background: alpha(theme.palette.primary.main, 0.05) }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
              How It Works
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Our comprehensive monitoring process in three simple steps
            </Typography>
          </Box>
          
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    background: theme.palette.primary.main
                  }}
                >
                  <Sensors sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  1. Data Collection
                </Typography>
                <Typography color="text.secondary">
                  Advanced sensor networks continuously monitor geological conditions, weather patterns, and environmental factors.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    background: theme.palette.success.main
                  }}
                >
                  <Computer sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  2. AI Analysis
                </Typography>
                <Typography color="text.secondary">
                  Machine learning algorithms analyze patterns and predict potential rockfall events with high accuracy.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    background: theme.palette.warning.main
                  }}
                >
                  <Warning sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  3. Alert & Response
                </Typography>
                <Typography color="text.secondary">
                  Instant notifications and emergency alerts enable rapid response to prevent casualties and damage.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Trusted by Experts
          </Typography>
          <Typography variant="h6" color="text.secondary">
            See what industry professionals say about our system
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, background: theme.palette.primary.main }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role} • {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography color="text.secondary">
                    "{testimonial.comment}"
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ py: 8, background: alpha(theme.palette.background.paper, 0.5) }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Frequently Asked Questions
            </Typography>
          </Box>
          
          <Box>
            {[
              {
                question: "How accurate are the rockfall predictions?",
                answer: "Our AI system achieves 95% accuracy in predicting rockfall events through advanced machine learning algorithms and comprehensive sensor data analysis."
              },
              {
                question: "What types of sensors are used?",
                answer: "We use accelerometers, tiltmeters, weather stations, seismometers, and visual monitoring systems to provide comprehensive geological monitoring."
              },
              {
                question: "How quickly are alerts sent?",
                answer: "Emergency alerts are sent within 5 seconds of threat detection, ensuring rapid response times for critical situations."
              },
              {
                question: "Can the system work offline?",
                answer: "Yes, our edge computing modules provide local processing capabilities, ensuring continuous monitoring even without internet connectivity."
              }
            ].map((faq, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        py: 8,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Protect Your Site?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join hundreds of organizations using our AI-powered rockfall prediction system
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': {
                background: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            Start Free Trial
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, background: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Terrain sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  RockGuard AI
                </Typography>
              </Box>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Advanced AI-powered rockfall prediction and geological monitoring system.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="AI Powered" size="small" />
                <Chip label="24/7 Monitoring" size="small" />
                <Chip label="95% Accurate" size="small" />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Product
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemText primary="Features" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Pricing" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Demo" />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Support
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemText primary="Documentation" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Help Center" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText primary="Contact" />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Stay Updated
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Get the latest updates on geological monitoring technology.
              </Typography>
              <Button variant="outlined" fullWidth>
                Subscribe to Newsletter
              </Button>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography color="text.secondary">
              © 2025 RockGuard AI. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">Privacy Policy</Typography>
              <Typography variant="body2" color="text.secondary">Terms of Service</Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
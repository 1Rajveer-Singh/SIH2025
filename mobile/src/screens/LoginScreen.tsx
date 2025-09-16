import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  TextInput,
  Button,
  Surface,
  Paragraph,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../services/AuthContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Surface style={styles.surface}>
        <View style={styles.content}>
          {/* Logo/Header */}
          <View style={styles.header}>
            <Title style={styles.title}>Rockfall Prediction</Title>
            <Paragraph style={styles.subtitle}>
              Field Worker Mobile App
            </Paragraph>
          </View>

          {/* Login Form */}
          <Card style={styles.loginCard}>
            <Card.Content style={styles.cardContent}>
              <Title style={styles.cardTitle}>Sign In</Title>
              
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  'Sign In'
                )}
              </Button>

              <View style={styles.forgotPassword}>
                <Button
                  mode="text"
                  onPress={() => {}}
                  compact
                >
                  Forgot Password?
                </Button>
              </View>
            </Card.Content>
          </Card>

          {/* Demo Credentials */}
          <Card style={styles.demoCard}>
            <Card.Content>
              <Title style={styles.demoTitle}>Demo Credentials</Title>
              <Paragraph style={styles.demoText}>
                Email: field.worker@example.com{'\n'}
                Password: demo123
              </Paragraph>
              <Button
                mode="outlined"
                onPress={() => {
                  setEmail('field.worker@example.com');
                  setPassword('demo123');
                }}
                compact
                style={styles.demoButton}
              >
                Use Demo Credentials
              </Button>
            </Card.Content>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Paragraph style={styles.footerText}>
              Secure geological monitoring platform
            </Paragraph>
          </View>
        </View>
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1565C0',
  },
  surface: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
    marginTop: 8,
  },
  loginCard: {
    borderRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  cardContent: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#1565C0',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 8,
  },
  demoCard: {
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 24,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 12,
  },
  demoText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  demoButton: {
    borderColor: '#1565C0',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#E3F2FD',
    textAlign: 'center',
  },
});

export default LoginScreen;

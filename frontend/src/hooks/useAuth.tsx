import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService } from '../services/api';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        // No auto-login - let user start from home page
        console.log('No token found, user needs to login');
        setIsLoading(false);
        return;
      }

      // If we have a token, create a demo user object
      setUser({
        id: 1,
        username: 'admin@example.com',
        email: 'admin@example.com',
        full_name: 'Demo Administrator',
        role: 'administrator',
        is_active: true,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      // Don't auto-login on error - let user go through proper flow
      console.log('Auth check failed, user needs to login');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await apiService.login(email, password);
      if (response.success && response.data) {
        // Create a proper user object for demo mode
        const demoUser: User = {
          id: 1,
          username: email,
          email: email,
          full_name: 'Demo User',
          role: response.data.user?.role || 'administrator',
          is_active: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        };
        setUser(demoUser);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await apiService.register(userData);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

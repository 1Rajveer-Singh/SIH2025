import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(email: string, password: string) {
    try {
      const response = await this.client.post('/api/auth/login', { username: email, password });
      
      // Handle demo backend response format
      if (response.data && response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        return { 
          success: true, 
          data: { 
            user: { 
              email: email, 
              role: response.data.user_type || 'administrator'
            }, 
            access_token: response.data.access_token 
          } 
        };
      }
      return { success: false, message: 'Login failed - no access token received' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || error.message || 'Login failed' 
      };
    }
  }

  async register(userData: any) {
    const response = await this.client.post('/api/auth/register', userData);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/api/auth/me');
    return response.data;
  }

  // Geological Sites
  async getGeologicalSites(params?: any) {
    const response = await this.client.get('/api/geological/sites', { params });
    return response.data;
  }

  async getGeologicalSite(siteId: number) {
    const response = await this.client.get(`/api/geological/sites/${siteId}`);
    return response.data;
  }

  async createGeologicalSite(siteData: any) {
    const response = await this.client.post('/api/geological/sites', siteData);
    return response.data;
  }

  async updateGeologicalSite(siteId: number, siteData: any) {
    const response = await this.client.put(`/api/geological/sites/${siteId}`, siteData);
    return response.data;
  }

  async deleteGeologicalSite(siteId: number) {
    const response = await this.client.delete(`/api/geological/sites/${siteId}`);
    return response.data;
  }

  // Rock Properties
  async getRockProperties(siteId: number) {
    const response = await this.client.get(`/api/geological/sites/${siteId}/rock-properties`);
    return response.data;
  }

  async createRockProperties(siteId: number, rockData: any) {
    const response = await this.client.post(`/api/geological/sites/${siteId}/rock-properties`, rockData);
    return response.data;
  }

  // Sensors
  async getSensors(params?: any) {
    const response = await this.client.get('/api/monitoring/sensors', { params });
    return response.data;
  }

  async getSensor(sensorId: number) {
    const response = await this.client.get(`/api/monitoring/sensors/${sensorId}`);
    return response.data;
  }

  async createSensor(sensorData: any) {
    const response = await this.client.post('/api/monitoring/sensors', sensorData);
    return response.data;
  }

  async updateSensor(sensorId: number, sensorData: any) {
    const response = await this.client.put(`/api/monitoring/sensors/${sensorId}`, sensorData);
    return response.data;
  }

  // Sensor Readings
  async getSensorReadings(sensorId: number, params?: any) {
    const response = await this.client.get(`/api/monitoring/sensors/${sensorId}/readings`, { params });
    return response.data;
  }

  async addSensorReading(sensorId: number, readingData: any) {
    const response = await this.client.post(`/api/monitoring/sensors/${sensorId}/readings`, readingData);
    return response.data;
  }

  async getLatestReading(sensorId: number) {
    const response = await this.client.get(`/api/monitoring/sensors/${sensorId}/latest`);
    return response.data;
  }

  async getLiveData(siteId?: number) {
    const response = await this.client.get('/api/monitoring/live-data', { 
      params: siteId ? { site_id: siteId } : undefined 
    });
    return response.data;
  }

  // Alerts
  async getAlerts(params?: any) {
    const response = await this.client.get('/api/alerts/alerts', { params });
    return response.data;
  }

  async getAlert(alertId: number) {
    const response = await this.client.get(`/api/alerts/alerts/${alertId}`);
    return response.data;
  }

  async createAlert(alertData: any) {
    const response = await this.client.post('/api/alerts/alerts', alertData);
    return response.data;
  }

  async acknowledgeAlert(alertId: number) {
    const response = await this.client.put(`/api/alerts/alerts/${alertId}/acknowledge`);
    return response.data;
  }

  async resolveAlert(alertId: number) {
    const response = await this.client.put(`/api/alerts/alerts/${alertId}/resolve`);
    return response.data;
  }

  async getActiveAlerts(params?: any) {
    const response = await this.client.get('/api/alerts/alerts/active', { params });
    return response.data;
  }

  async getAlertStatistics(params?: any) {
    const response = await this.client.get('/api/alerts/alerts/stats', { params });
    return response.data;
  }

  // Predictions
  async getPredictions(params?: any) {
    const response = await this.client.get('/api/predictions/predictions', { params });
    return response.data;
  }

  async getPrediction(predictionId: number) {
    const response = await this.client.get(`/api/predictions/predictions/${predictionId}`);
    return response.data;
  }

  async getLatestPrediction(siteId: number) {
    const response = await this.client.get(`/api/predictions/predictions/latest/${siteId}`);
    return response.data;
  }

  async generatePrediction(siteId: number, predictionHorizon?: number) {
    const response = await this.client.post(`/api/predictions/predictions/generate/${siteId}`, {
      prediction_horizon: predictionHorizon || 24
    });
    return response.data;
  }

  async getRiskTrends(siteId: number, days?: number) {
    const response = await this.client.get(`/api/predictions/predictions/risk-trends/${siteId}`, {
      params: { days: days || 30 }
    });
    return response.data;
  }

  // System Health
  async getSystemHealth() {
    const response = await this.client.get('/api/health');
    return response.data;
  }

  // File Upload
  async uploadFile(file: File, siteId: number, fileType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('site_id', siteId.toString());
    formData.append('file_type', fileType);

    const response = await this.client.post('/api/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;

import { io, Socket } from 'socket.io-client';

const WS_URL = 'http://localhost:8000'; // Direct URL since backend may not be running

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: string;
}

export interface LiveData {
  timestamp: string;
  slope_stability: {
    displacement_rate: number;
    safety_factor: number;
    risk_level: string;
  };
  environmental: {
    pore_pressure: number;
    rainfall: number;
    temperature: number;
  };
  seismic: {
    peak_acceleration: number;
    frequency: number;
  };
}

export interface Alert {
  id: number;
  type: string;
  severity: string;
  title: string;
  message: string;
  timestamp: string;
  site_id: number;
}

class WebSocketService {
  private socket: Socket | null = null;
  private clientId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.clientId = this.generateClientId();
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem('access_token');
        
        this.socket = io(WS_URL, {
          transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
          auth: {
            token: token
          },
          query: {
            clientId: this.clientId
          },
          timeout: 20000, // 20 second timeout
          forceNew: true, // Force new connection
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
          console.log('✅ WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('❌ WebSocket disconnected:', reason);
          // Don't attempt reconnect if disconnected manually
          if (reason !== 'io client disconnect') {
            this.handleReconnect();
          }
        });

        this.socket.on('connect_error', (error) => {
          console.warn('⚠️ WebSocket connection error (this is expected if backend is not running):', error.message);
          // Don't reject immediately, let it try fallback transports
          setTimeout(() => reject(error), 5000);
        });

        this.socket.on('error', (error) => {
          console.warn('⚠️ WebSocket error:', error);
        });

        // Handle incoming messages
        this.socket.on('message', (message: WebSocketMessage) => {
          this.handleMessage(message);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'live_data':
        this.emit('liveData', message.data);
        break;
      case 'alert':
      case 'critical_alert':
        this.emit('alert', message.data);
        break;
      case 'prediction_update':
        this.emit('predictionUpdate', message.data);
        break;
      case 'sensor_status':
        this.emit('sensorStatus', message.data);
        break;
      case 'system_status':
        this.emit('systemStatus', message.data);
        break;
      default:
        console.log('📨 Unknown message type:', message.type);
    }
  }

  subscribeToAlerts(): void {
    if (this.socket?.connected) {
      this.socket.emit('message', JSON.stringify({
        type: 'subscribe_alerts'
      }));
    }
  }

  subscribeToLiveData(siteId?: number): void {
    if (this.socket?.connected) {
      this.socket.emit('message', JSON.stringify({
        type: 'subscribe_live_data',
        site_id: siteId
      }));
    }
  }

  subscribeToPredictions(siteId?: number): void {
    if (this.socket?.connected) {
      this.socket.emit('message', JSON.stringify({
        type: 'subscribe_predictions',
        site_id: siteId
      }));
    }
  }

  requestLiveData(siteId?: number): void {
    if (this.socket?.connected) {
      this.socket.emit('message', JSON.stringify({
        type: 'get_live_data',
        site_id: siteId
      }));
    }
  }

  // Event handling
  private eventListeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data: any): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getConnectionStatus(): string {
    if (!this.socket) return 'disconnected';
    if (this.socket.connected) return 'connected';
    // Use socket.io property check instead of connecting
    if (this.socket.disconnected === false && !this.socket.connected) return 'connecting';
    return 'disconnected';
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;

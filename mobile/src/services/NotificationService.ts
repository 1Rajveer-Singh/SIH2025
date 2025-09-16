import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-push-notification/ios';
import { Platform } from 'react-native';

interface NotificationData {
  title: string;
  message: string;
  data?: any;
  type: 'alert' | 'warning' | 'info';
}

class NotificationService {
  private configured = false;

  configure() {
    if (this.configured) return;

    PushNotification.configure({
      onRegister: (token) => {
        console.log('TOKEN:', token);
        // Send token to server for push notifications
        this.sendTokenToServer(token.token);
      },

      onNotification: (notification) => {
        console.log('NOTIFICATION:', notification);
        
        // Handle notification tap
        if (notification.userInteraction) {
          this.handleNotificationTap(notification);
        }
        
        // Required on iOS only
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      onAction: (notification) => {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      onRegistrationError: (err) => {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });

    // Create default channels for Android
    if (Platform.OS === 'android') {
      this.createChannels();
    }

    this.configured = true;
  }

  private createChannels() {
    PushNotification.createChannel(
      {
        channelId: 'rockfall-alerts',
        channelName: 'Rockfall Alerts',
        channelDescription: 'Emergency rockfall alerts',
        importance: 4,
        vibrate: true,
        sound: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );

    PushNotification.createChannel(
      {
        channelId: 'rockfall-warnings',
        channelName: 'Rockfall Warnings',
        channelDescription: 'Rockfall warning notifications',
        importance: 3,
        vibrate: true,
        sound: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );

    PushNotification.createChannel(
      {
        channelId: 'rockfall-info',
        channelName: 'Rockfall Information',
        channelDescription: 'General rockfall information',
        importance: 2,
        vibrate: false,
        sound: false,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }

  private async sendTokenToServer(token: string) {
    try {
      // Send FCM token to backend for push notifications
      const response = await fetch('http://localhost:8000/api/notifications/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token from AsyncStorage
        },
        body: JSON.stringify({
          token,
          platform: Platform.OS,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to register token');
      }
    } catch (error) {
      console.error('Error sending token to server:', error);
    }
  }

  private handleNotificationTap(notification: any) {
    // Navigate to appropriate screen based on notification data
    const { data } = notification;
    
    if (data?.screen) {
      // Use navigation service to navigate
      // NavigationService.navigate(data.screen, data.params);
    }
  }

  showLocalNotification(notificationData: NotificationData) {
    const { title, message, data, type } = notificationData;
    
    let channelId = 'rockfall-info';
    let priority = 'default';
    
    switch (type) {
      case 'alert':
        channelId = 'rockfall-alerts';
        priority = 'high';
        break;
      case 'warning':
        channelId = 'rockfall-warnings';
        priority = 'high';
        break;
      case 'info':
        channelId = 'rockfall-info';
        priority = 'default';
        break;
    }

    PushNotification.localNotification({
      title,
      message,
      channelId,
      priority,
      userInfo: data,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: message,
      color: type === 'alert' ? '#D32F2F' : type === 'warning' ? '#F57C00' : '#1565C0',
      vibrate: type === 'alert' || type === 'warning',
      playSound: type === 'alert' || type === 'warning',
      soundName: type === 'alert' ? 'emergency.mp3' : 'default',
    });
  }

  cancelAllLocalNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  cancelNotification(id: string) {
    PushNotification.cancelLocalNotifications({ id });
  }

  setBadgeCount(count: number) {
    PushNotification.setApplicationIconBadgeNumber(count);
  }

  clearBadge() {
    PushNotification.setApplicationIconBadgeNumber(0);
  }

  // Check if notifications are enabled
  checkPermissions(): Promise<any> {
    return new Promise((resolve) => {
      PushNotification.checkPermissions(resolve);
    });
  }

  // Request notification permissions
  requestPermissions() {
    PushNotification.requestPermissions();
  }
}

export default new NotificationService();

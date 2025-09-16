// Global type declarations for React Native dependencies

declare module 'react-native' {
  export * from 'react-native/types';
}

declare module 'react-native-paper' {
  export * from 'react-native-paper/types';
}

declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  
  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: any;
  }
  
  export default class Icon extends Component<IconProps> {}
}

declare module '@react-navigation/native' {
  export * from '@react-navigation/native/types';
}

declare module '@react-navigation/bottom-tabs' {
  export * from '@react-navigation/bottom-tabs/types';
}

declare module '@react-navigation/stack' {
  export * from '@react-navigation/stack/types';
}

declare module 'react-native-safe-area-context' {
  export * from 'react-native-safe-area-context/types';
}

declare module 'react-native-chart-kit' {
  import { Component } from 'react';
  
  export interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    decimalPlaces?: number;
    color?: (opacity?: number) => string;
    style?: any;
  }
  
  export interface LineChartProps {
    data: any;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    bezier?: boolean;
    style?: any;
  }
  
  export interface PieChartProps {
    data: any[];
    width: number;
    height: number;
    chartConfig: ChartConfig;
    accessor: string;
    backgroundColor?: string;
    paddingLeft?: string;
    style?: any;
  }
  
  export class LineChart extends Component<LineChartProps> {}
  export class PieChart extends Component<PieChartProps> {}
}

declare module '@react-native-async-storage/async-storage' {
  interface AsyncStorageStatic {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    getAllKeys(): Promise<readonly string[]>;
    multiGet(keys: readonly string[]): Promise<readonly [string, string | null][]>;
    multiSet(keyValuePairs: readonly [string, string][]): Promise<void>;
    multiRemove(keys: readonly string[]): Promise<void>;
  }
  
  const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
}

declare module 'react-native-push-notification' {
  interface PushNotificationPermissions {
    alert?: boolean;
    badge?: boolean;
    sound?: boolean;
  }
  
  interface PushNotificationOptions {
    onRegister?: (token: { token: string; os: string }) => void;
    onNotification?: (notification: any) => void;
    onAction?: (notification: any) => void;
    onRegistrationError?: (err: any) => void;
    permissions?: PushNotificationPermissions;
    popInitialNotification?: boolean;
    requestPermissions?: boolean;
  }
  
  interface LocalNotificationOptions {
    id?: string;
    title?: string;
    message: string;
    channelId?: string;
    priority?: string;
    userInfo?: any;
    largeIcon?: string;
    smallIcon?: string;
    bigText?: string;
    color?: string;
    vibrate?: boolean;
    playSound?: boolean;
    soundName?: string;
  }
  
  interface ChannelOptions {
    channelId: string;
    channelName: string;
    channelDescription?: string;
    importance?: number;
    vibrate?: boolean;
    sound?: boolean;
  }
  
  interface PushNotificationStatic {
    configure(options: PushNotificationOptions): void;
    localNotification(options: LocalNotificationOptions): void;
    createChannel(options: ChannelOptions, callback?: (created: boolean) => void): void;
    cancelAllLocalNotifications(): void;
    cancelLocalNotifications(options: { id: string }): void;
    setApplicationIconBadgeNumber(number: number): void;
    checkPermissions(callback: (permissions: any) => void): void;
    requestPermissions(): void;
  }
  
  const PushNotification: PushNotificationStatic;
  export default PushNotification;
}

declare module '@react-native-push-notification/ios' {
  export enum FetchResult {
    NoData = 'noData',
    NewData = 'newData',
    ResultFailed = 'resultFailed',
  }
  
  const PushNotificationIOS: {
    FetchResult: typeof FetchResult;
  };
  
  export default PushNotificationIOS;
}

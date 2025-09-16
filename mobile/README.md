# React Native Mobile App for Rockfall Prediction System

This is the mobile application component of the Rockfall Prediction System, built with React Native for cross-platform deployment on iOS and Android devices.

## Features

- **Real-time Dashboard**: Live monitoring of geological sites and sensor data
- **Site Management**: View and manage geological monitoring sites
- **Alert System**: Receive and manage rockfall alerts and warnings
- **Data Collection**: Field data collection tools for geologists and field workers
- **Camera Integration**: Capture and analyze geological formations
- **Offline Support**: Work offline and sync when connection is available
- **Push Notifications**: Instant alerts for critical situations

## Technology Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **React Navigation**: Navigation between screens
- **React Native Paper**: Material Design UI components
- **React Native Vector Icons**: Icon library
- **React Native Chart Kit**: Data visualization
- **Async Storage**: Local data persistence
- **Push Notifications**: Real-time alert system
- **React Native Maps**: Geolocation and mapping
- **React Native Camera**: Camera integration

## Prerequisites

Before running this mobile app, ensure you have:

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Java Development Kit (JDK 11)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install iOS dependencies (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Setup environment configuration:**
   - Create `.env` file based on `.env.example`
   - Configure API endpoints and keys

## Development

### Start Metro bundler:
```bash
npm start
```

### Run on Android:
```bash
npm run android
```

### Run on iOS (macOS only):
```bash
npm run ios
```

### Type checking:
```bash
npm run type-check
```

### Run tests:
```bash
npm test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── services/           # API services and utilities
├── types/             # TypeScript type definitions
├── utils/             # Helper functions
└── App.tsx            # Main application component
```

## Key Screens

1. **Dashboard**: Overview of all geological sites and recent alerts
2. **Sites**: List and manage geological monitoring sites
3. **Monitoring**: Real-time sensor data visualization
4. **Alerts**: View and manage active alerts
5. **Settings**: App configuration and user preferences
6. **Login**: User authentication
7. **Site Detail**: Detailed information about specific sites
8. **Data Collection**: Field data input interface
9. **Camera**: Geological formation capture and analysis

## API Integration

The mobile app integrates with the backend FastAPI server:

- **Authentication**: JWT-based user authentication
- **Real-time Updates**: WebSocket connections for live data
- **Data Sync**: RESTful API for data operations
- **File Upload**: Image and data file upload capabilities

## Permissions

The app requires the following permissions:

### Android
- Camera access
- Location services
- Network access
- External storage
- Notifications

### iOS
- Camera and Photo Library access
- Location services
- Network access
- Notifications

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```
API_BASE_URL=http://localhost:8000
WEBSOCKET_URL=ws://localhost:8000/ws
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
ENABLE_NOTIFICATIONS=true
```

### Push Notifications

Configure push notifications for your platform:

1. **Firebase (Android)**: Add `google-services.json` to `android/app/`
2. **APNs (iOS)**: Configure certificates in Apple Developer Console

## Building for Production

### Android APK:
```bash
cd android
./gradlew assembleRelease
```

### iOS (macOS only):
```bash
npx react-native run-ios --configuration Release
```

## Testing

The app includes comprehensive testing:

- Unit tests for components and utilities
- Integration tests for API services
- End-to-end tests for critical user flows

Run tests with:
```bash
npm test                 # Unit tests
npm run test:e2e        # End-to-end tests
npm run test:coverage   # Coverage report
```

## Deployment

### App Store (iOS)
1. Build for release
2. Archive in Xcode
3. Upload to App Store Connect
4. Submit for review

### Google Play Store (Android)
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Submit for review

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **Android build errors**: Clean with `cd android && ./gradlew clean`
3. **iOS build errors**: Clean build folder in Xcode
4. **Dependency conflicts**: Delete `node_modules` and reinstall

### Debug Tools

- React Native Debugger
- Flipper for advanced debugging
- Chrome DevTools for JavaScript debugging

## Contributing

1. Follow the existing code style and structure
2. Add tests for new features
3. Update documentation as needed
4. Test on both iOS and Android platforms

## Security

- All API communications use HTTPS
- Sensitive data is encrypted in local storage
- User authentication with secure token management
- Regular security updates and dependency patches

## Performance

- Optimized for smooth scrolling and navigation
- Efficient memory management
- Lazy loading for large datasets
- Image optimization and caching

## License

This project is part of the Rockfall Prediction System and follows the same licensing terms.

## Support

For technical support or questions:
- Check the troubleshooting section
- Review the API documentation
- Contact the development team

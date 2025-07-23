# RiggerHub Mobile App

Enterprise-grade construction workforce management mobile application built with React Native and Expo.

## 🏗️ Features

### Core Features
- **Job Discovery**: Browse available construction jobs with advanced filtering
- **Smart Matching**: AI-powered job recommendations based on skills and location
- **Real-time Updates**: Live job availability and application status updates
- **Location-based Search**: Find jobs near your location with distance calculation
- **Application Management**: Track all job applications in one place
- **Profile Management**: Comprehensive worker/company profiles
- **Secure Authentication**: JWT-based authentication with token refresh

### Enterprise Features
- **Multi-role Support**: Workers, Companies, and Administrators
- **Advanced Filtering**: Filter by category, experience, salary, shift type
- **Real-time Notifications**: Push notifications for job matches and updates
- **Offline Support**: Core functionality works offline
- **Analytics Integration**: Track user behavior and job performance
- **Security**: Enterprise-grade security and data protection

### UI/UX Features
- **Modern Design**: Clean, professional interface inspired by leading job apps
- **Dark Mode Support**: Automatic theme switching
- **Accessibility**: WCAG 2.1 AA compliant
- **Responsive Layout**: Optimized for all screen sizes
- **Smooth Animations**: 60fps animations and transitions
- **Pull-to-Refresh**: Intuitive refresh gestures

## 🚀 Tech Stack

### Frontend
- **React Native** 0.74.5 - Cross-platform mobile development
- **Expo** ~51.0.0 - Development platform and tools
- **TypeScript** - Type safety and developer experience
- **React Navigation** 6.x - Navigation and routing
- **React Native Paper** - Material Design components
- **Expo Linear Gradient** - Advanced styling
- **React Native Maps** - Location and mapping features

### Backend Integration
- **Axios** - HTTP client for API communication
- **React Query** - Server state management
- **AsyncStorage** - Local data persistence
- **Expo SecureStore** - Secure credential storage

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Jest** - Unit and integration testing
- **TypeScript** - Static type checking
- **Expo CLI** - Development workflow

## 📱 Screenshots

The app design is inspired by modern job platforms with construction industry-specific features:

### Available Jobs Screen
- Clean job cards with company branding
- Distance calculation and location info
- Experience level and shift type indicators
- Salary information prominently displayed
- Apply buttons with smooth animations
- Advanced filtering and search

### Key Design Elements
- **Primary Colors**: Blue (#1890ff) and Cyan (#13c2c2)
- **Construction Theme**: Orange and yellow accent colors
- **Professional Typography**: Clear, readable fonts
- **Card-based Layout**: Easy to scan job information
- **Status Indicators**: Visual cues for job urgency and type

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio

### Setup
```bash
# Clone the repository
cd apps/riggerhub-mobile

# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web (for testing)
npm run web
```

### Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=https://rigger-platform-api-j6smnmk4oa-uc.a.run.app
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_VERSION=1.0.0
```

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── JobCard/        # Job listing card component
│   ├── SearchBar/      # Search input component
│   ├── FilterChips/    # Filter selection chips
│   └── common/         # Common UI components
├── screens/            # Screen components
│   ├── JobsScreen/     # Available jobs listing
│   ├── JobDetailScreen/ # Individual job details
│   ├── ProfileScreen/  # User profile management
│   └── auth/           # Authentication screens
├── hooks/              # Custom React hooks
│   ├── useJobs.ts      # Job data management
│   ├── useAuth.ts      # Authentication state
│   └── useLocation.ts  # Location services
├── services/           # API and external services
│   ├── api.ts          # Main API service
│   ├── auth.ts         # Authentication service
│   └── location.ts     # Location services
├── types/              # TypeScript type definitions
├── theme/              # Design system and colors
├── utils/              # Utility functions
└── navigation/         # Navigation configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: #1890ff (Professional blue)
- **Secondary**: #13c2c2 (Construction cyan)
- **Success**: #52c41a (Job available)
- **Warning**: #faad14 (Application pending)
- **Error**: #f5222d (Urgent jobs)
- **Construction Orange**: #ff7f00
- **Safety Yellow**: #ffd700

### Typography
- **Headers**: 28px, Bold, Primary color
- **Body**: 16px, Regular, Dark gray
- **Captions**: 12px, Medium, Light gray
- **Buttons**: 14px, SemiBold, White/Primary

### Components
- **Cards**: 16px border radius, subtle shadow
- **Buttons**: 24px border radius, gradient backgrounds
- **Inputs**: 12px border radius, focused states
- **Chips**: 20px border radius, category colors

## 🔧 Configuration

### Expo Configuration (app.json)
```json
{
  "expo": {
    "name": "RiggerHub",
    "slug": "riggerhub-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "plugins": [
      "expo-location",
      "expo-camera",
      "expo-notifications"
    ]
  }
}
```

### API Integration
The app integrates with the RiggerHub production API:
- **Base URL**: https://rigger-platform-api-j6smnmk4oa-uc.a.run.app
- **Authentication**: JWT Bearer tokens
- **Endpoints**: RESTful API with standard HTTP methods
- **Real-time**: WebSocket connections for live updates

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Build & Deployment

### Development Build
```bash
# Create development build
eas build --profile development

# Install on device
eas build --profile development --platform android --local
```

### Production Build
```bash
# Build for app stores
eas build --profile production

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and builds
- **EAS Build**: Cloud-based building service
- **CodePush**: Over-the-air updates
- **Sentry**: Error monitoring and crash reporting

## 🌟 Key Features Implementation

### Job Search & Filtering
- Real-time search with debouncing
- Advanced filtering by multiple criteria
- Location-based distance calculation
- Saved search preferences

### User Experience
- Smooth scroll animations
- Pull-to-refresh functionality
- Infinite scroll pagination
- Optimistic UI updates
- Offline data caching

### Security
- JWT token management with refresh
- Biometric authentication support
- Secure storage for sensitive data
- API request encryption

### Performance
- Image lazy loading and caching
- Virtual list rendering for large datasets
- Background data synchronization
- Memory optimization

## 📈 Analytics & Monitoring

- **User Behavior**: Job views, application rates, search patterns
- **Performance**: App startup time, screen load times, API response times
- **Errors**: Crash reporting, API error tracking, user feedback
- **Business Metrics**: Job match rates, application success, user retention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 NGO Integration

10% of platform profits support ChaseWhiteRabbit NGO initiatives:
- **Worker Training Programs**: Free certification courses
- **Safety Equipment Grants**: PPE for underserved workers  
- **Indigenous Employment**: Specialized job placement programs
- **Community Building**: Professional networking events

---

**Built with ❤️ for the construction industry by the RiggerHub team**
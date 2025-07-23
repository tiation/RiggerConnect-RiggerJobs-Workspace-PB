# RiggerHire Android - Enterprise Mobile Platform

<div align="center">
  <img src="assets/logo.png" alt="RiggerHire Logo" width="200">
  
  # 🏗️ Australia's Premier Rigging Jobs Platform
  
  [![Android](https://img.shields.io/badge/Android-API%2024+-brightgreen.svg)](https://android-arsenal.com/api?level=24)
  [![Kotlin](https://img.shields.io/badge/Kotlin-1.9.20-blue.svg)](https://kotlinlang.org)
  [![Jetpack Compose](https://img.shields.io/badge/Jetpack%20Compose-2024.06-green.svg)](https://developer.android.com/jetpack/compose)
  [![Material Design 3](https://img.shields.io/badge/Material%20Design-3.0-purple.svg)](https://material.io/design)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![Feature Parity](https://img.shields.io/badge/iOS%20Parity-47%20Screens-cyan.svg)](https://github.com/tiation/RiggerHireApp)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  
  **🎯 Comprehensive 47-Screen Android App with Full Feature Parity to iOS**  
  **💼 Enterprise-Grade • 📱 Mobile-First • 🔐 Industry-Specific Security**  
  **Connecting certified riggers with mining, construction, and industrial projects across Western Australia**
</div>

## 📱 Screenshots

<div align="center">
  <img src="assets/screenshots/main_screen.png" alt="Main Screen" width="250">
  <img src="assets/screenshots/jobs_list.png" alt="Jobs List" width="250">
  <img src="assets/screenshots/profile.png" alt="Profile" width="250">
</div>

## 📱 Complete 47-Screen Feature Set

### 🎯 **Full iOS Feature Parity Achieved**
The Android app implements all 47 screens from the iOS version with identical functionality and enterprise-grade quality.

| Category | Screens | Features |
|----------|---------|----------|
| **🔐 Authentication** | 5 screens | Login, Register, Forgot Password, Password Reset, Splash |
| **🎓 Onboarding** | 4 screens | Welcome, Permissions, Skills Setup, Preferences |
| **💼 Jobs Management** | 8 screens | Browse, Search, Filters, Details, Apply, Saved, Applied, Status |
| **👤 Profile Management** | 8 screens | View, Edit, Documents, Certifications, Skills, Experience, Portfolio, Reviews |
| **💳 Payments & Billing** | 6 screens | Overview, History, Billing Info, Subscription, Add/Edit Payment Methods |
| **📊 Analytics & Insights** | 3 screens | Career Analytics, Earnings Analytics, Application Analytics |
| **⚙️ Settings & Config** | 6 screens | Overview, Notifications, Privacy, Security, Billing, Account |
| **🔔 Notifications** | 1 screen | Notification Details |
| **🆘 Support & Help** | 4 screens | Overview, Contact Support, FAQ, Feedback |
| **📱 Navigation & Utils** | 2 screens | Main Tab Navigation, Profile Details |

### 🚀 Core Features

#### **For Riggers** 👷‍♂️
- **🔍 Smart Job Matching** - AI-powered algorithm matches you with relevant jobs based on certifications, location, and experience
- **📍 GPS-Based Discovery** - Find jobs near your current location with real-time distance calculations
- **💰 Transparent Pricing** - See hourly rates upfront, no hidden fees
- **📋 Certification Management** - Upload and verify your rigging certifications digitally
- **⚡ Instant Notifications** - Get notified immediately when matching jobs are posted
- **💳 Fast Payment** - Automated payment processing via Stripe upon job completion
- **📊 Career Analytics** - Track your application success rates, earnings, and career progression
- **🏆 Skills Portfolio** - Showcase your expertise with verified skills and work history

#### **For Businesses** 🏢
- **✅ Verified Professionals** - All riggers are verified with valid certifications and insurance
- **🎯 Targeted Posting** - Your jobs reach qualified riggers instantly
- **📊 Real-time Tracking** - Monitor job progress with GPS tracking and status updates
- **🔐 Secure Platform** - Enterprise-grade security with JWT authentication
- **📈 Analytics Dashboard** - Track spending, job completion rates, and rigger performance
- **🌐 Multi-site Support** - Manage jobs across multiple locations from one account
- **💼 Applicant Management** - Review, filter, and manage job applications efficiently
- **📋 Compliance Tracking** - Ensure all workers meet safety and certification requirements

#### **Shared Enterprise Features** ⭐
- **🌙 Dark Neon Theme** - Eye-catching cyan/magenta gradient design optimized for outdoor visibility
- **🔐 Biometric Security** - Face ID/Fingerprint authentication for quick, secure access
- **📱 Offline Functionality** - Core features work without internet connection
- **🔄 Real-time Sync** - Instant updates across all platforms and devices
- **📍 Location Services** - GPS tracking, geofencing, and proximity-based job matching
- **📸 Document Scanning** - Built-in camera integration for certification uploads
- **💬 In-app Messaging** - Direct communication between riggers and employers
- **📊 Advanced Analytics** - Comprehensive insights with interactive charts and reports

## 🛠 Technical Stack

- **Language**: Kotlin 1.9.20
- **UI Framework**: Jetpack Compose 1.5.4
- **Architecture**: MVVM with Android Architecture Components
- **Minimum Android**: API 24 (Android 7.0)
- **Target Android**: API 34 (Android 14)
- **Design System**: Material Design 3 with custom dark neon theme
- **Networking**: Retrofit 2.9.0 with OkHttp
- **Authentication**: JWT tokens with encrypted storage
- **Location Services**: Android Location API
- **Push Notifications**: Firebase Cloud Messaging
- **Analytics**: Firebase Analytics
- **Crash Reporting**: Firebase Crashlytics
- **Payment Processing**: Stripe SDK integration
- **CI/CD**: GitHub Actions + Fastlane

## 🎨 Dark Neon Theme

The app features a custom dark neon theme optimized for mining industry professionals:

- **Primary Colors**: Cyan (#00FFFF) and Magenta (#FF00FF) gradients
- **Background**: Deep black (#0D0D0D) for reduced eye strain
- **Surface**: Dark grey (#1A1A1A) for card components
- **Text**: White (#FFFFFF) primary, grey (#B3B3B3) secondary
- **Status Colors**: Neon green for success, neon red for errors
- **Mobile-optimized**: High contrast for outdoor visibility

## 📋 Requirements

- **Development**: Android Studio Flamingo 2022.2.1 or later
- **Runtime**: Android 7.0 (API level 24) or higher
- **RAM**: 4GB+ recommended for development
- **Storage**: 2GB+ available space
- **Network**: Internet connection required for API calls

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/tiation/RiggerHireApp-Android.git
cd RiggerHireApp-Android
```

### 2. Open in Android Studio
1. Launch Android Studio
2. Click "Open an Existing Project"
3. Navigate to the cloned directory
4. Wait for Gradle sync to complete

### 3. Configure API Settings
1. Copy the example configuration:
```bash
cp app/src/main/assets/config.example.json app/src/main/assets/config.json
```

2. Update the configuration with your API settings:
```json
{
  "apiBaseUrl": "https://your-api-endpoint.com",
  "stripePublishableKey": "pk_test_your_stripe_key",
  "googleMapsApiKey": "your_google_maps_key"
}
```

### 4. Firebase Setup (Optional)
1. Add your `google-services.json` file to the `app/` directory
2. Configure Firebase in the [Firebase Console](https://console.firebase.google.com)

## 🏗 Project Structure

```
RiggerHireApp-Android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/tiation/riggerhire/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── MainActivity.kt
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── jobs/
│   │   │   │   │   └── profile/
│   │   │   │   ├── data/
│   │   │   │   │   ├── api/
│   │   │   │   │   ├── models/
│   │   │   │   │   └── repositories/
│   │   │   │   ├── utils/
│   │   │   │   └── RiggerHireApplication.kt
│   │   │   ├── res/
│   │   │   │   ├── values/
│   │   │   │   │   ├── colors.xml (Dark Neon Theme)
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   └── styles.xml
│   │   │   │   ├── layout/
│   │   │   │   └── drawable/
│   │   │   └── AndroidManifest.xml
│   │   └── test/
│   ├── build.gradle
│   └── proguard-rules.pro
├── build.gradle
├── gradle/wrapper/
├── settings.gradle
└── README.md
```

## 🧪 Testing

### Unit Tests
```bash
./gradlew test
```

### Instrumented Tests
```bash
./gradlew connectedAndroidTest
```

### UI Tests with Compose
```bash
./gradlew app:connectedDebugAndroidTest
```

## 📦 Building & Deployment

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
```bash
./gradlew assembleRelease
```

### Using Fastlane (Recommended)
```bash
# Install Fastlane
sudo gem install fastlane

# Build and deploy to Play Store Internal Testing
fastlane android beta

# Deploy to Production
fastlane android production
```

## 🔐 Security Features

- **Authentication**: JWT token-based authentication with automatic refresh
- **Data Encryption**: All sensitive data encrypted using Android Keystore
- **Certificate Pinning**: Prevents man-in-the-middle attacks
- **Biometric Authentication**: Fingerprint/Face unlock support
- **Secure Storage**: SharedPreferences encryption for local data
- **Network Security**: TLS 1.3 enforcement and certificate validation

## 🌏 Localization

Currently supported languages:
- 🇦🇺 English (Australia) - Default
- 🇪🇸 Spanish - For international workers
- 🇫🇷 French - Mining industry requirement
- 🇨🇳 Mandarin (Simplified) - Asian market expansion

## 📊 Analytics & Monitoring

- **User Analytics**: Firebase Analytics for user behavior tracking
- **Crash Reporting**: Firebase Crashlytics for stability monitoring
- **Performance Monitoring**: Firebase Performance for app optimization
- **Custom Events**: Job applications, completion rates, user engagement
- **Real-time Dashboard**: Monitor app health and user metrics

## 🗺 Architecture Diagram

```
┌─────────────────────────────────────────┐
│                UI Layer                 │
│  (Jetpack Compose + Material Design 3) │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│             ViewModel                   │
│        (MVVM Architecture)              │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│           Repository                    │
│     (Data Abstraction Layer)           │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│          Data Sources                   │
│  • Remote API (Retrofit)               │
│  • Local Database (Room)               │
│  • SharedPreferences                   │
└─────────────────────────────────────────┘
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow [Kotlin coding conventions](https://kotlinlang.org/docs/coding-conventions.html)
- Use [ktlint](https://ktlint.github.io/) for formatting
- Write comprehensive unit tests for new features
- Update documentation for API changes

## 🐛 Bug Reports

Please use the [GitHub Issues](https://github.com/tiation/RiggerHireApp-Android/issues) page to report bugs. Include:

- Device model and Android version
- App version and build number
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or screen recordings (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mining Industry Partners** - For domain expertise and requirements
- **Open Source Community** - For the amazing libraries and tools
- **Android Team** - For Jetpack Compose and Material Design
- **Firebase Team** - For backend services and analytics

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/tiation/RiggerHireApp-Android/wiki)
- **Issues**: [GitHub Issues](https://github.com/tiation/RiggerHireApp-Android/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tiation/RiggerHireApp-Android/discussions)
- **Email**: tiatheone@protonmail.com

---

<div align="center">

**🏗️ Built for the Mining Industry • 📱 Mobile-first • 🎯 Enterprise-grade**

*Connecting Australia's riggers with their next opportunity*

</div>

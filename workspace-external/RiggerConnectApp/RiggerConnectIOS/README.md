# RiggerConnect iOS

<div align="center">
  <img src="assets/logo.png" alt="RiggerConnect Logo" width="200">
  
  # Australia's Premier Rigging Jobs Platform
  
  [![Swift](https://img.shields.io/badge/Swift-5.9-orange.svg)](https://swift.org)
  [![iOS](https://img.shields.io/badge/iOS-16.0+-blue.svg)](https://developer.apple.com/ios/)
  [![SwiftUI](https://img.shields.io/badge/SwiftUI-5.0-green.svg)](https://developer.apple.com/xcode/swiftui/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  
  **Connecting certified riggers with mining, construction, and industrial projects across the Pilbara region**
</div>

## 📱 Screenshots

<div align="center">
  <img src="assets/screenshots/login.png" alt="Login Screen" width="250">
  <img src="assets/screenshots/jobs-list.png" alt="Jobs List" width="250">
  <img src="assets/screenshots/job-detail.png" alt="Job Detail" width="250">
</div>

## 🚀 Features

### For Riggers
- **🔍 Smart Job Matching** - AI-powered algorithm matches you with relevant jobs based on certifications, location, and experience
- **📍 GPS-Based Discovery** - Find jobs near your current location with real-time distance calculations
- **💰 Transparent Pricing** - See hourly rates upfront, no hidden fees
- **📋 Certification Management** - Upload and verify your rigging certifications digitally
- **⚡ Instant Notifications** - Get notified immediately when matching jobs are posted
- **💳 Fast Payment** - Automated payment processing via Stripe upon job completion

### For Businesses
- **✅ Verified Professionals** - All riggers are verified with valid certifications and insurance
- **🎯 Targeted Posting** - Your jobs reach qualified riggers instantly
- **📊 Real-time Tracking** - Monitor job progress with GPS tracking and status updates
- **🔐 Secure Platform** - Enterprise-grade security with JWT authentication
- **📈 Analytics Dashboard** - Track spending, job completion rates, and rigger performance
- **🌐 Multi-site Support** - Manage jobs across multiple locations from one account

## 🛠 Technical Stack

- **Frontend**: SwiftUI 5.0
- **Language**: Swift 5.9
- **Minimum iOS**: 16.0
- **Architecture**: MVVM with Combine
- **Networking**: URLSession with async/await
- **Authentication**: JWT tokens with Keychain storage
- **Location Services**: Core Location
- **Push Notifications**: Firebase Cloud Messaging
- **Analytics**: Firebase Analytics
- **Crash Reporting**: Crashlytics
- **CI/CD**: GitHub Actions + Fastlane

## 📋 Requirements

- Xcode 15.0+
- iOS 16.0+
- Swift 5.9+
- CocoaPods or Swift Package Manager

## 🔧 Installation

### Clone the Repository
```bash
git clone https://github.com/your-org/RiggerConnectIOS.git
cd RiggerConnectIOS
```

### Install Dependencies

#### Using Swift Package Manager (Recommended)
```bash
xed .
# In Xcode: File → Add Package Dependencies
```

#### Using CocoaPods
```bash
pod install
open RiggerConnectIOS.xcworkspace
```

### Configure Environment

1. Copy the example configuration:
```bash
cp Config/Config.example.swift Config/Config.swift
```

2. Add your API keys:
```swift
struct Config {
    static let apiBaseURL = "https://api.riggerconnect.com.au"
    static let googleMapsAPIKey = "YOUR_GOOGLE_MAPS_KEY"
    static let stripePublishableKey = "YOUR_STRIPE_KEY"
}
```

## 🏗 Project Structure

```
RiggerConnectIOS/
├── RiggerConnectIOS/
│   ├── App/
│   │   ├── RiggerConnectIOSApp.swift
│   │   └── ContentView.swift
│   ├── Models/
│   │   ├── Job.swift
│   │   ├── User.swift
│   │   └── Certification.swift
│   ├── Views/
│   │   ├── Authentication/
│   │   │   ├── LoginView.swift
│   │   │   └── RegistrationView.swift
│   │   ├── Jobs/
│   │   │   ├── JobsListView.swift
│   │   │   ├── JobDetailView.swift
│   │   │   └── JobRowView.swift
│   │   ├── Profile/
│   │   │   └── ProfileView.swift
│   │   └── Components/
│   │       └── FilterChip.swift
│   ├── ViewModels/
│   │   ├── AuthViewModel.swift
│   │   └── JobsViewModel.swift
│   ├── Services/
│   │   ├── AuthenticationManager.swift
│   │   ├── JobManager.swift
│   │   ├── LocationService.swift
│   │   └── APIService.swift
│   ├── Utils/
│   │   ├── Extensions/
│   │   └── Constants.swift
│   └── Resources/
│       ├── Assets.xcassets
│       └── Localizable.strings
└── RiggerConnectIOSTests/
```

## 🧪 Testing

### Run Unit Tests
```bash
xcodebuild test -scheme RiggerConnectIOS -destination 'platform=iOS Simulator,name=iPhone 15'
```

### Run UI Tests
```bash
xcodebuild test -scheme RiggerConnectIOSUITests -destination 'platform=iOS Simulator,name=iPhone 15'
```

## 📦 Building & Deployment

### Development Build
```bash
fastlane ios development
```

### TestFlight Build
```bash
fastlane ios beta
```

### App Store Release
```bash
fastlane ios release
```

## 🔐 Security

- **Authentication**: JWT tokens with automatic refresh
- **Data Encryption**: All sensitive data encrypted using AES-256
- **Certificate Pinning**: Prevents MITM attacks
- **Biometric Login**: Face ID/Touch ID support
- **Secure Storage**: Keychain integration for credentials

## 🌏 Localization

Currently supported languages:
- 🇦🇺 English (Australia) - Default
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇨🇳 Mandarin (Simplified)

## 📊 Analytics & Monitoring

- **User Analytics**: Firebase Analytics
- **Crash Reporting**: Crashlytics
- **Performance Monitoring**: Firebase Performance
- **Custom Events**: Job applications, completion rates, user engagement

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow [Swift API Design Guidelines](https://swift.org/documentation/api-design-guidelines/)
- Use SwiftLint for code formatting
- Write unit tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [https://riggerconnect.com.au](https://riggerconnect.com.au)
- **API Documentation**: [https://docs.riggerconnect.com.au](https://docs.riggerconnect.com.au)
- **Support**: support@riggerconnect.com.au
- **Android App**: [RiggerConnect Android](https://github.com/your-org/RiggerConnectAndroid)

## 👥 Team

- **Product Owner**: John Smith
- **iOS Lead**: Jane Doe
- **Backend Team**: RiggerConnect API Team
- **Design**: RiggerConnect Design Team

## 🙏 Acknowledgments

- Thanks to all the riggers and businesses in the Pilbara region
- Mining companies for their valuable feedback
- Open source community for amazing tools and libraries

---

<div align="center">
  Made with ❤️ in Western Australia
  
  Copyright © 2024 RiggerConnect Pty Ltd. All rights reserved.
</div>

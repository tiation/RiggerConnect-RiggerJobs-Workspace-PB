# RiggerHub - Mobile Job Platform for Rigging Professionals

[![iOS](https://img.shields.io/badge/iOS-15.0+-blue.svg)](https://developer.apple.com/ios/)
[![Swift](https://img.shields.io/badge/Swift-5.9-orange.svg)](https://swift.org/)
[![SwiftUI](https://img.shields.io/badge/SwiftUI-4.0-blue.svg)](https://developer.apple.com/swiftui/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🏗️ Overview

RiggerHub is a comprehensive dual-platform mobile application ecosystem designed specifically for the rigging and construction industry in Western Australia. The platform consists of two complementary applications:

- **RiggerHireApp**: For employers to post jobs and manage hiring
- **RiggerHubApp**: For workers (riggers, crane operators, construction staff) to find and apply for jobs

This repository contains both applications, featuring enterprise-grade architecture, modern UI/UX design with a dark neon theme, and robust backend integration using Supabase.

![RiggerHub Apps](https://via.placeholder.com/800x400/0a0f1c/00ccff?text=RiggerHub+Mobile+Apps)

## ✨ Key Features

### For Workers (RiggerHubApp)
- 🔍 **Advanced Job Search** - Filter by location, job type, salary, and industry
- 📝 **Profile Management** - Comprehensive professional profiles with skills and certifications
- 📱 **Real-time Applications** - Apply to jobs instantly with custom cover letters
- 💬 **Messaging System** - Direct communication with employers
- 📊 **Application Tracking** - Monitor application status and progress
- 🏆 **Rating System** - Build reputation through work history and reviews
- 📍 **Location Services** - GPS-based job matching and distance calculations

### For Employers (RiggerHireApp)
- 📋 **Job Posting Management** - Create detailed job listings with requirements
- 👥 **Candidate Review** - Browse and evaluate worker profiles
- 💰 **Payment Integration** - Stripe/Supabase-powered billing and subscriptions
- 📈 **Analytics Dashboard** - Track job performance and hiring metrics
- 🔔 **Notification System** - Real-time updates on applications

### Shared Features
- 🌙 **Dark Neon UI Theme** - Eye-catching cyan/magenta gradient design
- 🔐 **Enterprise Security** - End-to-end encryption and secure authentication
- 📱 **Mobile-First Design** - Optimized for iOS with responsive layouts
- 🏢 **Industry-Specific** - Tailored for mining, construction, and industrial sectors
- 🔄 **Real-time Sync** - Instant updates across all platforms

## 🏗️ Architecture

### Technology Stack
- **Frontend**: SwiftUI, iOS 15+, Combine
- **Backend**: Supabase (PostgreSQL, Real-time, Auth)
- **Payment Processing**: Stripe API
- **Architecture**: MVVM with Combine
- **Theme**: Custom dark neon design system

### Project Structure
```
RiggerHireApp/
├── RiggerHireApp/              # Employer-focused app
│   ├── Models/                 # Data models (User, Job)
│   ├── Views/                  # SwiftUI views
│   ├── Services/              # Network and business logic
│   └── Utils/                 # Helper utilities
├── RiggerHubApp/              # Worker-focused app
│   ├── Models/                # Data models (Worker, JobListing)
│   │   ├── Worker.swift       # Worker profile model
│   │   └── JobListing.swift   # Job listing model
│   ├── Views/                 # SwiftUI views
│   │   ├── ContentView.swift  # Main tabbed interface
│   │   ├── AuthenticationView.swift # Login/signup
│   │   ├── JobSearchView.swift # Job browsing
│   │   ├── JobDetailView.swift # Job details
│   │   ├── JobFiltersView.swift # Advanced filtering
│   │   └── PlaceholderViews.swift # Profile, messages, settings
│   ├── Services/              # Network and business logic
│   │   ├── AuthenticationManager.swift # Auth management
│   │   └── SupabaseService.swift # Backend integration
│   └── Utils/                 # Helper utilities
│       └── ThemeManager.swift # Dark neon theme system
└── Utils/                     # Shared utilities
```

## 🚀 Getting Started

### Prerequisites
- Xcode 15.0+
- iOS 15.0+ deployment target
- Swift 5.9+
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tiation/RiggerHireApp.git
   cd RiggerHireApp
   ```

2. **Open in Xcode**
   ```bash
   open RiggerHireApp.xcodeproj
   ```

3. **Configure Supabase**
   - Create a new Supabase project
   - Update `SupabaseService.swift` with your credentials:
   ```swift
   private let baseURL = "YOUR_SUPABASE_URL"
   private let apiKey = "YOUR_SUPABASE_ANON_KEY"
   ```

4. **Set up database schema**
   Execute the SQL schema in your Supabase project:
   ```sql
   -- Workers table
   CREATE TABLE workers (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       first_name TEXT NOT NULL,
       last_name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL,
       phone_number TEXT,
       years_of_experience INTEGER DEFAULT 0,
       hourly_rate DECIMAL(8,2) DEFAULT 0,
       is_active BOOLEAN DEFAULT true,
       is_verified BOOLEAN DEFAULT false,
       profile_completeness DECIMAL(3,2) DEFAULT 0,
       average_rating DECIMAL(3,2) DEFAULT 0,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Job listings table
   CREATE TABLE job_listings (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       title TEXT NOT NULL,
       company_name TEXT NOT NULL,
       description TEXT NOT NULL,
       job_type TEXT NOT NULL,
       industry TEXT NOT NULL,
       is_urgent BOOLEAN DEFAULT false,
       is_remote BOOLEAN DEFAULT false,
       posted_date TIMESTAMPTZ DEFAULT NOW(),
       is_active BOOLEAN DEFAULT true
   );
   
   -- Job applications table
   CREATE TABLE job_applications (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       job_id UUID REFERENCES job_listings(id),
       worker_id UUID REFERENCES workers(id),
       cover_letter TEXT,
       proposed_rate DECIMAL(8,2),
       application_date TIMESTAMPTZ DEFAULT NOW(),
       status TEXT DEFAULT 'pending'
   );
   ```

5. **Configure Stripe (Optional)**
   - Add your Stripe keys to the payment integration

6. **Build and Run**
   - Select your target device/simulator
   - Choose either RiggerHireApp or RiggerHubApp scheme
   - Press `Cmd+R` to build and run

## 🎨 Design System

### Dark Neon Theme
The application features a custom dark neon theme with:
- **Primary Colors**: Cyan (#00CCFF) and Magenta (#FF00FF)
- **Background**: Deep dark blue gradients
- **Accents**: Bright neon highlights
- **Typography**: SF Pro with various weights
- **Interactive Elements**: Glowing buttons and borders

### Component Examples
```swift
// Neon button style
Button("Apply Now") {
    // Action
}
.neonButtonStyle(themeManager)

// Card with glow effect
VStack {
    // Content
}
.cardStyle(themeManager)
```

## 📱 Screenshots

| Job Search | Job Details | Profile | Applications |
|------------|-------------|---------|--------------|
| ![Search](https://via.placeholder.com/200x400/0a0f1c/00ccff?text=Job+Search) | ![Details](https://via.placeholder.com/200x400/0a0f1c/ff00ff?text=Job+Details) | ![Profile](https://via.placeholder.com/200x400/0a0f1c/00ccff?text=Profile) | ![Apps](https://via.placeholder.com/200x400/0a0f1c/ff00ff?text=Applications) |

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
xcodebuild test -scheme RiggerHubApp -destination 'platform=iOS Simulator,name=iPhone 15'
```

### Manual Testing Checklist
- [ ] User registration and authentication
- [ ] Job search and filtering
- [ ] Application submission
- [ ] Profile management
- [ ] Dark theme consistency
- [ ] Offline functionality
- [ ] Push notifications

## 🚀 Deployment

### App Store Deployment
1. **Archive the app**
   - Product → Archive in Xcode
2. **Upload to App Store Connect**
   - Use Xcode Organizer or Transporter
3. **Submit for Review**
   - Complete App Store Connect metadata
   - Submit for Apple review

### Enterprise Distribution
- Configure enterprise provisioning profiles
- Use Apple Business Manager for internal distribution

## 🔧 Configuration

### Environment Variables
Create a `Config.swift` file:
```swift
struct Config {
    static let supabaseURL = "YOUR_SUPABASE_URL"
    static let supabaseKey = "YOUR_SUPABASE_ANON_KEY"
    static let stripePublishableKey = "YOUR_STRIPE_KEY"
}
```

### Build Configurations
- **Debug**: Development environment with logging
- **Release**: Production environment optimized for performance
- **Staging**: Testing environment with beta features

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow Swift style guidelines
   - Add unit tests for new features
   - Update documentation
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style Guidelines
- Use SwiftLint for code formatting
- Follow MVVM architecture patterns
- Comment complex business logic
- Use descriptive variable names

## 📈 Roadmap

### Version 1.1
- [ ] Real-time chat messaging
- [ ] Push notifications
- [ ] Offline job caching
- [ ] Advanced analytics

### Version 1.2
- [ ] Video application submissions
- [ ] Skills assessment tests
- [ ] Calendar integration
- [ ] Apple Pay integration

### Version 2.0
- [ ] iPad support
- [ ] watchOS companion app
- [ ] AR job site visualization
- [ ] AI-powered job matching

## 🐛 Known Issues

- Search performance may be slow with large datasets
- Some animations may not render correctly on older devices
- Offline mode is limited to cached data only

## 📞 Support

For technical support or questions:

- **Email**: support@riggerhub.com
- **GitHub Issues**: [Report a bug](https://github.com/tiation/RiggerHireApp/issues)
- **Documentation**: [Wiki](https://github.com/tiation/RiggerHireApp/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Apple** - for SwiftUI and iOS development tools
- **Supabase** - for backend-as-a-service platform
- **Stripe** - for payment processing infrastructure
- **The Rigging Community** - for industry insights and feedback

---

**Built with ❤️ for the rigging industry by Tiation**

*Connecting skilled riggers with opportunities across Western Australia*

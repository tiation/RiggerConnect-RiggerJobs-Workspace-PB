# 🏗️ RiggerHub - Complete Construction Workforce Ecosystem

> **The all-in-one platform connecting construction workers with companies while prioritizing safety and compliance**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/turborepo-1.10%2B-orange.svg)](https://turbo.build/repo)

## 🌟 **Platform Overview**

RiggerHub is a comprehensive construction workforce management platform that connects skilled workers (riggers, doggers, crane operators, safety officers) with construction companies across Australia. Built with a focus on safety, compliance, and efficiency.

### **🎯 Key Features**
- **AI-Powered Job Matching**: Smart algorithms connect the right workers with the right jobs
- **Automated Compliance**: WorkSafe WA integration and automatic safety reporting
- **Multi-Platform Access**: Web portals, iOS/Android apps, and React Native
- **Payment Processing**: Secure payment handling with Stripe integration
- **Social Impact**: 10% of profits support ChaseWhiteRabbit NGO initiatives

---

## 📁 **Repository Structure**

```
tiation-rigger-workspace/
├── apps/                              # Applications
│   ├── marketing-web/                 # Next.js marketing website
│   ├── business-web/                  # Business portal (companies)
│   ├── worker-web/                    # Worker portal (staff)
│   ├── jobs-portal/                   # Job management portal
│   ├── connect-app/                   # RiggerConnect social platform
│   ├── mobile-ai-dashboard/           # AI monitoring dashboard (React Native)
│   ├── mobile-ios/                    # Native iOS app (standard)
│   ├── mobile-ios-enhanced/           # Enhanced dual iOS apps (RiggerHire + RiggerHub)
│   ├── mobile-android/                # Native Android app
│   └── mobile-react-native/           # Cross-platform React Native app
│
├── packages/                          # Shared packages
│   ├── ui-components/                 # Reusable UI components
│   ├── design-system/                 # Design tokens and themes
│   └── types/                         # Shared TypeScript types
│
├── services/                          # Backend microservices
│   ├── api-gateway/                   # Main API gateway
│   ├── connect-api/                   # RiggerConnect API services
│   ├── automation-server/             # AI automation and monitoring
│   ├── auth/                          # Authentication service
│   ├── jobs/                          # Job management service
│   ├── workers/                       # Worker profile service
│   ├── matching/                      # AI job matching engine
│   ├── ai/                            # AI resume/job generation
│   ├── payments/                      # Payment processing
│   └── compliance/                    # WorkSafe WA integration
│
├── docs/                              # Comprehensive documentation
├── database/                          # Database schemas and migrations
├── infrastructure/                    # Infrastructure as Code
└── scripts/                           # Automation scripts
```

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and pnpm 8+
- Docker and Docker Compose
- Git

### **1. Clone and Setup**
```bash
git clone https://github.com/tiation/tiation-rigger-workspace.git
cd tiation-rigger-workspace
pnpm install
```

### **2. Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration values
```

### **3. Development Mode**
```bash
# Start all services with Docker
pnpm docker:up

# Or run specific applications
pnpm dev:web          # Marketing website
pnpm dev:business     # Business portal
pnpm dev:worker       # Worker portal
pnpm dev:jobs         # Jobs portal
pnpm dev:connect      # RiggerConnect platform
pnpm dev:ai-dashboard # AI monitoring dashboard
pnpm dev:automation   # Automation server
```

### **4. Build for Production**
```bash
pnpm build:all
```

---

## 🏗️ **Applications Overview**

### **🌐 Web Applications**

#### **Marketing Website** (`apps/marketing-web/`)
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Purpose**: Public-facing marketing and information site
- **Live URL**: [https://riggerhub.com.au](https://riggerhub.com.au)
- **Features**: Company information, worker onboarding, pricing, contact forms

#### **Business Portal** (`apps/business-web/`)
- **Tech Stack**: Next.js 14, TypeScript, Supabase, Stripe
- **Purpose**: Company registration, job posting, and worker management
- **Features**: 
  - Multi-step company registration with ABN verification
  - AI-powered job posting generation
  - Worker search and filtering
  - Payment processing integration

#### **Worker Portal** (`apps/worker-web/`)
- **Tech Stack**: Next.js 14, TypeScript, Supabase
- **Purpose**: Worker registration and job search interface
- **Features**:
  - Worker profile creation
  - Job browsing and application
  - Certification management
  - Safety record tracking

#### **Jobs Portal** (`apps/jobs-portal/`)
- **Tech Stack**: Next.js 14, TypeScript, Prisma, PostgreSQL
- **Purpose**: Advanced job management and analytics
- **Features**:
  - Job posting management
  - Application tracking
  - Analytics and reporting
  - Team collaboration tools

#### **RiggerConnect Platform** (`apps/connect-app/`)
- **Tech Stack**: Next.js 14, TypeScript, Social Features
- **Purpose**: Professional networking and community platform
- **Features**:
  - Social networking for construction professionals
  - Industry connections and networking
  - Community forums and discussions
  - Professional development resources

#### **AI Monitoring Dashboard** (`apps/mobile-ai-dashboard/`)
- **Tech Stack**: React Native, Expo, TypeScript
- **Purpose**: Real-time AI agent monitoring interface
- **Features**:
  - Live agent status tracking (12 Active Agents, 2847 Tasks)
  - System performance metrics (CPU, Memory, Load)
  - Real-time error monitoring and alerts
  - Professional dark theme interface

### **📱 Mobile Applications**

#### **iOS App** (`apps/mobile-ios/`)
- **Tech Stack**: SwiftUI, Swift 5+
- **Purpose**: Standard native iOS experience for workers
- **Features**: 
  - Push notifications for job matches
  - Camera integration for document upload
  - Location-based job discovery
  - Offline capability

#### **Enhanced iOS Apps** (`apps/mobile-ios-enhanced/`)
- **Tech Stack**: SwiftUI, Swift 5.9+, Supabase, Stripe
- **Purpose**: Enterprise dual-app system (RiggerHire + RiggerHub)
- **Features**:
  - Dual-app architecture for employers and workers
  - Dark neon UI theme with cyan/magenta gradients
  - Advanced job matching and payment processing
  - Real-time messaging and application tracking
  - Professional enterprise-grade functionality

#### **Android App** (`apps/mobile-android/`)
- **Tech Stack**: Kotlin, Android SDK, Jetpack Compose
- **Purpose**: Native Android experience for workers
- **Features**:
  - Material Design 3 interface
  - Background location updates
  - Biometric authentication
  - Deep linking support

#### **React Native App** (`apps/mobile-react-native/`)
- **Tech Stack**: React Native, TypeScript, Expo
- **Purpose**: Cross-platform mobile solution
- **Features**:
  - Unified codebase for iOS/Android
  - Hot reload development
  - OTA updates capability
  - Native module integration

---

## ⚙️ **Backend Services**

### **🛡️ Core Services**

#### **API Gateway** (`services/api-gateway/`)
- **Purpose**: Central entry point for all API requests
- **Features**: Rate limiting, authentication, routing, logging

#### **Authentication Service** (`services/auth/`)
- **Purpose**: User authentication and authorization
- **Features**: JWT tokens, role-based access, OAuth integration

#### **Job Matching Engine** (`services/matching/`)
- **Purpose**: AI-powered worker-job matching
- **Features**: ML algorithms, scoring system, preference learning

#### **AI Service** (`services/ai/`)
- **Purpose**: AI-powered content generation
- **Features**: Resume generation, job posting creation, content optimization

### **🔧 Supporting Services**

#### **Payment Service** (`services/payments/`)
- **Integration**: Stripe payment processing
- **Features**: Subscription management, payment methods, invoicing

#### **RiggerConnect API** (`services/connect-api/`)
- **Purpose**: Social platform API endpoints
- **Features**: User connections, community features, networking APIs

#### **Automation Server** (`services/automation-server/`)
- **Purpose**: AI agent orchestration and monitoring
- **Features**: Agent lifecycle management, task automation, performance monitoring

#### **Compliance Service** (`services/compliance/`)
- **Integration**: WorkSafe WA API
- **Features**: Incident reporting, certification verification, audit trails

#### **Notification Service** (`services/notifications/`)
- **Purpose**: Multi-channel communication
- **Features**: Email, SMS, push notifications, real-time updates

---

## 📊 **Key Integrations**

### **🏛️ Government & Compliance**
- **WorkSafe WA**: Incident reporting and safety compliance
- **Australian Business Register**: ABN verification
- **Privacy Act 1988**: Data protection compliance

### **💳 Payment & Financial**
- **Stripe**: Payment processing and subscription management
- **Xero**: Accounting integration (planned)
- **SuperStream**: Superannuation compliance (planned)

### **🤖 AI & Technology**
- **OpenAI GPT-4**: Resume and job posting generation
- **Google Maps**: Location services and geocoding
- **Firebase**: Push notifications and analytics

---

## 🌱 **Social Impact Integration**

### **ChaseWhiteRabbit NGO Partnership**
- **Mission**: 10% of platform profits support social impact programs
- **Focus Areas**:
  - **Worker Empowerment**: Free training and certification programs
  - **Indigenous Employment**: Specialized pathways for Indigenous Australians  
  - **Safety Excellence**: Industry safety improvements and research
  - **Community Building**: Connecting workers with support networks

### **Impact Metrics**
- Workers supported with free training
- Safety incident reduction rates
- Indigenous employment participation
- Community volunteer hours generated

---

## 🛠️ **Development & Deployment**

### **Technology Stack**
```yaml
Frontend:
  - Next.js 14 (App Router, TypeScript)
  - React Native (Expo, TypeScript)
  - Tailwind CSS (Design System)
  - Framer Motion (Animations)

Backend:
  - Node.js 18+ (Express, TypeScript)
  - PostgreSQL (Primary Database)
  - Redis (Caching & Sessions)
  - Prisma (ORM & Migrations)

Infrastructure:
  - Docker & Docker Compose
  - AWS/GCP (Cloud Deployment)
  - Vercel (Frontend Hosting)
  - Supabase (Auth & Realtime)

DevOps:
  - Turborepo (Monorepo Management)
  - GitHub Actions (CI/CD)
  - ESLint & Prettier (Code Quality)
  - Jest (Testing)
```

### **Monorepo Management**
```bash
# Install dependencies across all packages
pnpm install

# Run all applications in development mode
pnpm dev

# Build all packages for production
pnpm build

# Run tests across all packages
pnpm test

# Lint all code
pnpm lint

# Type check all TypeScript
pnpm type-check

# Mobile development
pnpm mobile:android  # Build Android app
pnpm mobile:ios      # Build iOS app
```

### **Docker Development**
```bash
# Start full development environment
docker-compose up -d

# View logs from all services
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start services
docker-compose up -d --build
```

---

## 📖 **Documentation**

### **📚 Available Documentation**
- **[API Specification](docs/API-SPECIFICATION.md)**: Complete API documentation
- **[Backend Implementation](docs/BACKEND-IMPLEMENTATION.md)**: Server architecture guide
- **[Mobile App Specifications](docs/RIGGERHUB-MOBILE-SPECS.md)**: Mobile development guide
- **[Ecosystem Overview](docs/RIGGERHUB-ECOSYSTEM.md)**: Platform architecture
- **[NGO Integration](docs/CHASEWHITERABBIT-INTEGRATION.md)**: Social impact details
- **[Consolidation Plan](docs/CONSOLIDATION-PLAN.md)**: Repository migration guide

### **🔗 External Links**
- **Live Website**: [https://riggerhub.com.au](https://riggerhub.com.au)
- **Documentation Site**: [https://docs.riggerhub.com.au](https://docs.riggerhub.com.au)
- **API Documentation**: [https://api.riggerhub.com.au/docs](https://api.riggerhub.com.au/docs)
- **ChaseWhiteRabbit NGO**: [https://chasewhiterabbit.org](https://chasewhiterabbit.org)

---

## 🤝 **Contributing**

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Pull request process
- Code style requirements

### **Getting Started with Development**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Construction Industry**: For inspiration and requirements
- **ChaseWhiteRabbit NGO**: For social impact partnership
- **Open Source Community**: For amazing tools and libraries
- **WorkSafe WA**: For safety standards and compliance support

---

## 📞 **Contact & Support**

- **Website**: [https://riggerhub.com.au](https://riggerhub.com.au)
- **Email**: [support@riggerhub.com.au](mailto:support@riggerhub.com.au)
- **Issues**: [GitHub Issues](https://github.com/tiation/tiation-rigger-workspace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tiation/tiation-rigger-workspace/discussions)

---

<div align="center">

**🏗️ Building the future of construction workforce management**

*Made with ❤️ by the Tiation Team*

</div>
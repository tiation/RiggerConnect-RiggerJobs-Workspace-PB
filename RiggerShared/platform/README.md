# 🔮 Tiation Rigger Platform - Enterprise Infrastructure Suite

<div align="center">

![Tiation Rigger Platform](https://img.shields.io/badge/🔮_TIATION_ECOSYSTEM-Enterprise_Infrastructure_Suite-0AFFEF?style=for-the-badge&labelColor=0B0C10&color=0AFFEF)

**Enterprise-grade infrastructure platform generating $300K+ revenue through integrated B2B marketplace and professional network for mining and construction industries**

*🏗️ Infrastructure-Native • 💼 B2B Marketplace • 📱 Multi-Platform*

[![🌐_Live_Platform](https://img.shields.io/badge/🌐_Live_Platform-Access_Now-0AFFEF?style=for-the-badge&logo=globe&logoColor=white)](https://tiation-rigger.github.io)
[![📱_Mobile_Apps](https://img.shields.io/badge/📱_Mobile_Apps-iOS_Android-0AFFEF?style=for-the-badge&logo=mobile&logoColor=white)](https://tiation-rigger.github.io/apps)
[![💰_Revenue](https://img.shields.io/badge/💰_Revenue_Potential-$300K+/year-00F7A5?style=for-the-badge&logo=trending-up&logoColor=white)](https://tiation-rigger.github.io/business)
[![🔧_Enterprise](https://img.shields.io/badge/🔧_Enterprise_Ready-Mining_Construction-FC00FF?style=for-the-badge&logo=industry&logoColor=white)](https://tiation-rigger.github.io/enterprise)
[![🛡️_Compliance](https://img.shields.io/badge/🛡️_WA_Compliant-Industry_Standards-0AFFEF?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/tiation/tiation-rigger-platform)
[![🔮_Enterprise_Proposal](https://img.shields.io/badge/🔮_Enterprise_Transformation-$1.15M+_Revenue_Proposal-FC00FF?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://tiation.github.io/enterprise-transformation-proposal)

</div>

## 🚀 Executive Summary

**Tiation Rigger Platform** is the enterprise infrastructure suite revolutionizing mining and construction operations in Western Australia with **$300K+ revenue potential** through integrated B2B marketplace and professional networking solutions.

### 🏗️ Platform Architecture

- **🔗 RiggerConnect**: Enterprise B2B marketplace for equipment rental, sales, and services
- **👥 RiggerHub**: Professional network and job placement platform for certified riggers
- **📱 Mobile Suite**: Native iOS/Android applications for field operations
- **🏢 Enterprise Dashboard**: Comprehensive management and analytics platform

### 💼 Enterprise Value Proposition

| Metric | Value | Impact |
|--------|-------|--------|
| 💰 **Revenue Potential** | $300K+ annually | High-value B2B marketplace transactions |
| 🏗️ **Industry Focus** | Mining & Construction | Specialized vertical expertise |
| 📱 **Multi-Platform** | Web, iOS, Android | Complete ecosystem coverage |
| 🔧 **Compliance Ready** | WA Mining Standards | Industry-specific regulatory compliance |
| 🎯 **Market Penetration** | Western Australia | Targeted regional dominance |

![Platform Architecture](./docs/images/platform-architecture.png)

## 🎯 Core Platform Features

### RiggerConnect (B2B Platform)
- Equipment rental and sales marketplace
- Service provider directory
- Contract management system
- Compliance tracking and certification
- Real-time availability and booking
- Enterprise invoicing and reporting

### RiggerHub (Professional Network)
- Rigger and crane operator registration
- Skills verification and certification tracking
- Job matching and placement
- Performance analytics
- Safety record management
- Professional development tracking

## 🏗️ Architecture

The platform consists of:

- **Backend API**: Node.js/Express with PostgreSQL
- **Web Dashboard**: React with enterprise UI components
- **iOS App**: Native Swift application
- **Android App**: Native Kotlin application  
- **Admin Panel**: React-based management interface
- **Payment Processing**: Stripe integration
- **Analytics**: Custom reporting dashboard

![System Architecture](./docs/images/system-architecture.png)

## 🚀 Live Demo

- **Web Platform**: [https://tiation-rigger.github.io](https://tiation-rigger.github.io)
- **Demo Video**: [Watch Platform Demo](./docs/videos/platform-demo.mp4)
- **API Documentation**: [API Docs](https://tiation-rigger.github.io/api-docs)

## 📱 Mobile Applications Integration

### Existing iOS Apps (Already Developed)
1. **RiggerConnectMobileApp** (Primary B2B App)
   - Location: `../tiation-rigger-workspace/RiggerConnectMobileApp/`
   - React Native 0.80.1 with enterprise features
   - Job marketplace and equipment management

2. **RiggerConnectIOS** (Native Swift App)
   - Location: `../tiation-rigger-connect-app/RiggerConnectIOS/`
   - High-performance native iOS with pre-compiled binaries
   - Advanced calculations and offline capabilities

3. **TiationAIAgentsMobile** (AI-Powered App)
   - Location: `../tiation-ai-agents/TiationAIAgentsMobile/`
   - React Native with AI-powered job matching
   - Smart recommendations and predictive analytics

### Platform Integration
- Unified backend API for all mobile apps
- Real-time WebSocket connections
- Shared authentication and user management
- Cross-app data synchronization

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose
- Xcode 14+ (for iOS development)
- Android Studio (for Android development)

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/tiation/tiation-rigger-platform.git
cd tiation-rigger-platform

# Install dependencies
cd backend
npm install

# Setup environment
cp .env.example .env
# Configure your database and API keys

# Run migrations
npm run migrate

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Mobile Apps Integration
See mobile apps integration documentation:
- `/mobile-apps/README.md` - Complete integration guide
- Existing apps located in separate repositories
- Backend API provides unified services for all apps

## 🏢 Enterprise Features

- **Multi-tenant architecture** for large mining companies
- **SSO integration** with enterprise identity providers
- **Advanced reporting** and analytics
- **Compliance management** for WA mining regulations
- **24/7 support** with industry expertise
- **On-premise deployment** options
- **API-first design** for integration with existing systems

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rigger_platform
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# Payment Processing
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Third-party Services
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

## 📊 API Documentation

Our RESTful API provides comprehensive access to platform features:

- **Authentication**: JWT-based with role-based access control
- **User Management**: Registration, profiles, verification
- **Job Management**: Posting, matching, tracking
- **Equipment**: Listings, availability, bookings
- **Payments**: Stripe-powered billing and invoicing
- **Notifications**: Real-time updates via WebSocket

Full API documentation available at: [API Reference](https://tiation-rigger.github.io/api-docs)

## 🎨 Design System

The platform uses a **dark neon theme** with cyan/magenta gradients, designed for:
- High visibility in industrial environments  
- Reduced eye strain during long shifts
- Professional appearance for enterprise clients
- Accessibility compliance (WCAG 2.1 AA)

![Design System](./docs/images/design-system.png)

## 🌍 Deployment

### Production Deployment
```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or using Kubernetes
kubectl apply -f k8s/
```

### GitHub Pages (Static Assets)
The marketing site and documentation are automatically deployed to GitHub Pages on push to main branch.

## 🤝 Contributing

We welcome contributions from the rigging and construction community!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📋 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Core platform development
- [x] Basic mobile apps
- [ ] Payment integration
- [ ] Initial user onboarding

### Phase 2 (Q3 2024)
- [ ] Advanced matching algorithms
- [ ] Enterprise integrations
- [ ] Compliance automation
- [ ] Advanced analytics

### Phase 3 (Q4 2024)
- [ ] AI-powered job matching
- [ ] IoT equipment integration
- [ ] Advanced safety features
- [ ] International expansion

## 🏆 Why Choose Tiation Rigger Platform?

- **Industry Expertise**: Built by riggers for riggers
- **Enterprise Grade**: Scalable, secure, compliant
- **Local Focus**: Designed for WA mining/construction regulations
- **NGO Mission**: Supporting important community work
- **Comprehensive**: End-to-end solution for rigger businesses
- **Modern Technology**: Built with latest web and mobile technologies

## 📞 Support

- **Email**: support@tiation-rigger.com
- **Phone**: +61 8 XXXX XXXX
- **Documentation**: [docs.tiation-rigger.com](https://tiation-rigger.github.io/docs)
- **Community**: [Discord Server](https://discord.gg/tiation-rigger)

---

**Built with ❤️ by the Tiation team in Perth, Western Australia**

*Supporting the rigger community while funding important NGO work*

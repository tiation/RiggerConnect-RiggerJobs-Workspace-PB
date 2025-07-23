# RiggerHub Ecosystem - Repository Consolidation Plan

## 🎯 **Consolidation Overview**

### **Current State:**
- **rigger-connect-marketing**: Marketing website with business portal (Next.js)
- **riggerhireapp**: Complete multi-platform ecosystem (iOS, Android, Web, Backend)
- **tiation-rigger-platform**: Additional platform components and infrastructure

### **Target:**
- **tiation-rigger-workspace**: Unified monorepo containing all RiggerHub components

---

## 📁 **Proposed Directory Structure**

```
tiation-rigger-workspace/
├── README.md                           # Unified project overview
├── CONTRIBUTING.md                     # Contributing guidelines
├── LICENSE                             # Project license
├── .github/                            # GitHub workflows and templates
│   ├── workflows/                      # CI/CD pipelines
│   └── ISSUE_TEMPLATE/                 # Issue templates
│
├── docs/                              # Comprehensive documentation
│   ├── API-SPECIFICATION.md          # From rigger-connect-marketing
│   ├── BACKEND-IMPLEMENTATION.md     # From rigger-connect-marketing
│   ├── CHASEWHITERABBIT-INTEGRATION.md
│   ├── RIGGERHUB-ECOSYSTEM.md
│   ├── RIGGERHUB-MOBILE-SPECS.md
│   ├── DEPLOYMENT.md                  # Unified deployment guide
│   ├── ARCHITECTURE.md                # System architecture overview
│   └── GETTING_STARTED.md             # Quick start guide
│
├── apps/                              # Applications
│   ├── marketing-web/                 # From rigger-connect-marketing
│   │   ├── src/
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── README.md
│   │
│   ├── business-web/                  # From riggerhireapp/B2B-web
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── worker-web/                    # From riggerhireapp/Staff-web
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── jobs-portal/                   # From tiation-rigger-platform/jobs-web
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── mobile-ios/                    # From riggerhireapp/ios
│   │   ├── RiggerHireApp.xcodeproj/
│   │   ├── RiggerHireApp/
│   │   └── README.md
│   │
│   ├── mobile-android/                # From riggerhireapp/android
│   │   ├── app/
│   │   ├── build.gradle
│   │   └── README.md
│   │
│   └── mobile-react-native/           # From tiation-rigger-platform/apps/mobile
│       ├── App.tsx
│       ├── package.json
│       └── README.md
│
├── services/                          # Backend services
│   ├── api-gateway/                   # Main API gateway
│   ├── auth-service/                  # Authentication service
│   ├── job-service/                   # Job management service
│   ├── worker-service/                # Worker profile service
│   ├── matching-service/              # Job matching engine
│   ├── ai-service/                    # AI resume/job generation
│   ├── payment-service/               # Payment processing
│   ├── notification-service/          # Push notifications
│   ├── compliance-service/            # WorkSafe WA integration
│   └── analytics-service/             # Analytics and reporting
│
├── packages/                          # Shared packages
│   ├── ui-components/                 # Shared React components
│   ├── design-system/                 # Design tokens and themes
│   ├── types/                         # Shared TypeScript types
│   ├── utils/                         # Common utilities
│   ├── api-client/                    # API client library
│   └── config/                        # Shared configuration
│
├── infrastructure/                    # Infrastructure as Code
│   ├── docker/                        # Docker configurations
│   ├── k8s/                          # Kubernetes manifests
│   ├── terraform/                     # Terraform configurations
│   ├── nginx/                         # Nginx configurations
│   └── ci-cd/                        # CI/CD scripts
│
├── database/                          # Database schemas and migrations
│   ├── migrations/
│   ├── seeds/
│   └── schema.prisma
│
├── scripts/                           # Automation scripts
│   ├── setup.sh                      # Development setup
│   ├── deploy.sh                      # Deployment scripts
│   ├── test.sh                        # Testing scripts
│   └── build.sh                       # Build scripts
│
├── tools/                             # Development tools
│   ├── codegen/                       # Code generation
│   ├── linting/                       # Linting configurations
│   └── testing/                       # Testing utilities
│
├── package.json                       # Root package.json (monorepo)
├── turbo.json                         # Turborepo configuration
├── pnpm-workspace.yaml               # PNPM workspace configuration
├── tsconfig.json                      # Root TypeScript config
├── .gitignore                        # Git ignore rules
└── docker-compose.yml                # Local development environment
```

---

## 🔄 **Migration Strategy**

### **Phase 1: Repository Setup**
1. Create new `tiation-rigger-workspace` repository
2. Initialize monorepo structure with Turborepo
3. Set up basic CI/CD workflows
4. Configure development environment

### **Phase 2: Core Migration**
1. **Marketing Website** (`rigger-connect-marketing` → `apps/marketing-web/`)
   - Migrate all Next.js components and pages
   - Update package.json and dependencies
   - Preserve all documentation files in `/docs`

2. **Business Portal** (`riggerhireapp/B2B-web` → `apps/business-web/`)
   - Migrate business registration and dashboard
   - Integrate with unified design system
   - Update Supabase configurations

3. **Worker Portal** (`riggerhireapp/Staff-web` → `apps/worker-web/`)
   - Migrate worker interface
   - Consolidate authentication system
   - Update API endpoints

### **Phase 3: Mobile Applications**
1. **iOS App** (`riggerhireapp/ios` → `apps/mobile-ios/`)
   - Migrate Xcode project structure
   - Update build configurations
   - Consolidate Swift services

2. **Android App** (`riggerhireapp/android` → `apps/mobile-android/`)
   - Migrate Gradle project structure
   - Update build configurations
   - Consolidate Kotlin services

3. **React Native App** (`tiation-rigger-platform/apps/mobile` → `apps/mobile-react-native/`)
   - Migrate cross-platform components
   - Update navigation structure
   - Consolidate shared services

### **Phase 4: Backend Services**
1. **API Services** (Multiple sources → `services/`)
   - Extract and modularize backend services
   - Implement microservices architecture
   - Set up service-to-service communication

2. **Database Schema** (Multiple sources → `database/`)
   - Consolidate Prisma schemas
   - Merge migration files
   - Unify seed data

### **Phase 5: Infrastructure & DevOps**
1. **Containerization** (Multiple sources → `infrastructure/docker/`)
   - Consolidate Docker configurations
   - Create multi-stage builds
   - Set up development containers

2. **Orchestration** (Multiple sources → `infrastructure/k8s/`)
   - Merge Kubernetes manifests
   - Set up service mesh
   - Configure ingress and networking

---

## 🛠️ **Technical Implementation**

### **Monorepo Setup**
```json
{
  "name": "tiation-rigger-workspace",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "services/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "@typescript-eslint/parser": "^6.0.0",
    "prettier": "^3.0.0"
  }
}
```

### **Turborepo Configuration**
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

---

## 📋 **File Migration Mapping**

### **Documentation Files**
| Source | Destination |
|--------|-------------|
| `rigger-connect-marketing/API-SPECIFICATION.md` | `docs/API-SPECIFICATION.md` |
| `rigger-connect-marketing/BACKEND-IMPLEMENTATION.md` | `docs/BACKEND-IMPLEMENTATION.md` |
| `rigger-connect-marketing/CHASEWHITERABBIT-INTEGRATION.md` | `docs/CHASEWHITERABBIT-INTEGRATION.md` |
| `rigger-connect-marketing/RIGGERHUB-ECOSYSTEM.md` | `docs/RIGGERHUB-ECOSYSTEM.md` |
| `rigger-connect-marketing/RIGGERHUB-MOBILE-SPECS.md` | `docs/RIGGERHUB-MOBILE-SPECS.md` |
| `riggerhireapp/DEPLOYMENT.md` | `docs/DEPLOYMENT.md` (merge) |
| `tiation-rigger-platform/DEPLOYMENT.md` | `docs/DEPLOYMENT.md` (merge) |

### **Application Files**
| Source | Destination |
|--------|-------------|
| `rigger-connect-marketing/src/` | `apps/marketing-web/src/` |
| `riggerhireapp/B2B-web/` | `apps/business-web/` |
| `riggerhireapp/Staff-web/` | `apps/worker-web/` |
| `tiation-rigger-platform/jobs-web/` | `apps/jobs-portal/` |
| `riggerhireapp/ios/` | `apps/mobile-ios/` |
| `riggerhireapp/android/` | `apps/mobile-android/` |
| `tiation-rigger-platform/apps/mobile/` | `apps/mobile-react-native/` |

### **Backend Files**
| Source | Destination |
|--------|-------------|
| `riggerhireapp/backend/` | `services/` (restructured) |
| `tiation-rigger-platform/apps/api/` | `services/api-gateway/` |
| `riggerhireapp/services/` | `services/` (merged) |

---

## 🔧 **Post-Migration Tasks**

### **Code Updates Required**
1. **Import Path Updates**: Update all import statements to use monorepo paths
2. **API Endpoint Updates**: Consolidate and standardize API endpoints
3. **Configuration Updates**: Merge and standardize configuration files
4. **Environment Variables**: Consolidate environment variable management
5. **Build Scripts**: Update all build and deployment scripts

### **Integration Tasks**
1. **Shared Components**: Extract common components to `packages/ui-components`
2. **Design System**: Create unified design system in `packages/design-system`
3. **Type Definitions**: Consolidate TypeScript types in `packages/types`
4. **API Client**: Create unified API client in `packages/api-client`

### **Testing & Quality**
1. **Test Suite Integration**: Merge and update all test suites
2. **Linting Configuration**: Unified ESLint and Prettier configuration
3. **CI/CD Pipeline**: Create comprehensive CI/CD pipeline for monorepo
4. **Documentation Updates**: Update all README files and documentation

---

## 🚀 **Benefits of Consolidation**

### **Development Benefits**
- **Simplified Dependency Management**: Single package.json for shared dependencies
- **Code Sharing**: Easy sharing of components, utilities, and types
- **Consistent Tooling**: Unified linting, testing, and build processes
- **Atomic Commits**: Changes across multiple packages in single commits

### **Operational Benefits**
- **Simplified CI/CD**: Single pipeline for entire ecosystem
- **Easier Deployment**: Coordinated deployments across services
- **Better Documentation**: Centralized documentation and guides
- **Reduced Maintenance**: Single repository to maintain and secure

### **Team Benefits**
- **Better Collaboration**: Single source of truth for all code
- **Easier Onboarding**: New developers only need to clone one repo
- **Consistent Standards**: Unified code standards across all projects
- **Simplified Reviews**: Code reviews across related changes

---

This consolidation plan provides a comprehensive roadmap for merging all RiggerHub-related repositories into a single, well-organized monorepo that will be easier to maintain, develop, and deploy.
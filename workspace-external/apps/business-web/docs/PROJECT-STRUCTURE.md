# Standardized Project Structure

```
project-root/
├── src/
│   ├── assets/                 # Static assets (images, fonts, etc.)
│   ├── components/            # Reusable UI components
│   │   ├── common/           # Shared components
│   │   ├── features/         # Feature-specific components
│   │   └── layouts/          # Layout components
│   ├── config/               # Configuration files
│   ├── constants/            # Constants and enums
│   ├── hooks/                # Custom React hooks
│   ├── interfaces/           # TypeScript interfaces
│   ├── pages/                # Page components
│   ├── services/             # API and external service integrations
│   │   ├── api/             # API clients
│   │   ├── stripe/          # Stripe integration
│   │   └── supabase/        # Supabase integration
│   ├── store/                # State management
│   ├── styles/               # Global styles and themes
│   │   ├── themes/          # Theme configurations
│   │   └── variables/       # CSS variables
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── tests/
│   ├── e2e/                 # End-to-end tests
│   ├── integration/         # Integration tests
│   └── unit/                # Unit tests
├── docs/                    # Documentation
│   ├── api/                 # API documentation
│   ├── architecture/        # Architecture diagrams
│   └── assets/             # Documentation assets
├── public/                  # Public assets
├── scripts/                 # Build and utility scripts
├── .github/                 # GitHub workflows and templates
│   ├── workflows/          # CI/CD workflows
│   └── ISSUE_TEMPLATE/     # Issue templates
├── .vscode/                # VS Code configuration
├── .eslintrc.js            # ESLint configuration
├── .prettierrc            # Prettier configuration
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest configuration
├── package.json           # Project dependencies
└── README.md              # Project documentation

Key Configuration Files:
------------------------
1. tsconfig.json:
   - Strict mode enabled
   - ES6+ features enabled
   - Path aliases configured

2. .eslintrc.js:
   - TypeScript rules
   - React best practices
   - Accessibility rules
   - Security rules

3. package.json Scripts:
   - dev: Development server
   - build: Production build
   - test: Run tests
   - lint: Code linting
   - format: Code formatting
   - e2e: E2E tests
   - analyze: Bundle analysis

4. .env Structure:
   NODE_ENV=development
   REACT_APP_API_URL=
   REACT_APP_SUPABASE_URL=
   REACT_APP_SUPABASE_KEY=
   REACT_APP_STRIPE_PUBLIC_KEY=

5. CI/CD Workflow Stages:
   - Lint
   - Type Check
   - Test
   - Build
   - Security Scan
   - Deploy

Theme Configuration:
-------------------
/styles/themes/
├── dark.ts         # Dark neon theme
├── light.ts        # Light theme
└── variables.ts    # Shared variables

State Management:
----------------
/store/
├── slices/         # Feature slices
├── hooks.ts        # Custom hooks
└── index.ts        # Store configuration

Security:
---------
- Environment variable validation
- API request/response interceptors
- Authentication middleware
- Error boundary implementation
- Security headers configuration

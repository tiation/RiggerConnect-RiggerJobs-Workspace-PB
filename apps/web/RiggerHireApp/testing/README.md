# RiggerHireApp Testing Infrastructure

## Overview

This directory contains all testing-related code and configurations for the RiggerHireApp ecosystem:

```
testing/
├── unit/                 # Unit tests for all components
├── integration/          # Integration tests between services
└── e2e/                 # End-to-end testing suites
```

## Test Categories

### Unit Tests
- Individual component testing
- Service function testing
- Model validation testing
- Utility function testing

### Integration Tests
- API endpoint testing
- Service-to-service communication
- Database integration testing
- Cache integration testing

### End-to-End Tests
- User flow testing
- Mobile app workflows
- Web app workflows
- Payment processing flows
- Compliance verification flows

## Running Tests

```bash
# Run all tests
npm run test

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests for specific platforms
npm run test:ios
npm run test:android
npm run test:web
```

## Test Coverage Requirements

- Unit Tests: 90% coverage
- Integration Tests: 80% coverage
- E2E Tests: Critical path coverage

## CI/CD Integration

Tests are automatically run in the CI/CD pipeline:
- On pull requests
- Before deployment to staging
- Before deployment to production

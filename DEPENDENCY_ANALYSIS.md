# Dependency Management Analysis

## Overview
This document outlines the dependency management strategy for the RiggerConnect-RiggerJobs-Workspace monorepo.

## Workspace Structure
```
RiggerConnect-RiggerJobs-Workspace-PB/
├── package.json                    # Root workspace manager
├── AutomationServer/
│   └── package.json                # Backend dependencies
├── RiggerConnectApp/
│   └── package.json                # Business app dependencies
├── RiggerJobsApp/
│   └── package.json                # Worker app dependencies
├── RiggerConnectMobileApp/
│   └── package.json                # Legacy mobile app
├── Infrastructure/
│   └── package.json                # DevOps tools
└── ios/
    └── package.json                # iOS-specific dependencies
```

## Shared Dependencies

### Common Development Dependencies
These are shared across all workspaces and managed at the root level:

```json
{
  "eslint": "^8.47.0",
  "prettier": "^3.0.1",
  "typescript": "^5.1.6",
  "@types/node": "^20.5.0",
  "@types/jest": "^29.5.4",
  "jest": "^29.6.2",
  "husky": "^8.0.3",
  "lint-staged": "^13.2.3"
}
```

### Backend-Specific Dependencies (AutomationServer)
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "redis": "^4.6.7",
  "socket.io": "^4.7.2",
  "stripe": "^12.18.0",
  "firebase-admin": "^13.4.0",
  "aws-sdk": "^2.1440.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "winston": "^3.10.0"
}
```

### Mobile App Dependencies (Both Apps)
```json
{
  "react": "19.1.0",
  "react-native": "0.80.1",
  "@react-navigation/native": "^6.1.7",
  "react-native-screens": "^3.22.1",
  "react-native-safe-area-context": "^4.7.1",
  "react-native-gesture-handler": "^2.12.1",
  "react-native-reanimated": "^3.4.2",
  "@react-native-firebase/app": "^18.3.0",
  "axios": "^1.5.0",
  "lodash": "^4.17.21",
  "moment": "^2.29.4"
}
```

### Infrastructure Dependencies
```json
{
  "docker-compose": "^0.24.2",
  "kubernetes": "^0.14.0"
}
```

## Dependency Deduplication Strategy

### 1. Workspace Hoisting
NPM workspaces automatically hoists common dependencies to the root `node_modules`. This includes:
- All shared development tools (ESLint, Prettier, TypeScript)
- Common runtime dependencies where versions align

### 2. Version Alignment
Ensure consistent versions across workspaces for:
- React and React Native versions
- TypeScript and related @types packages
- Testing frameworks (Jest, testing libraries)
- Linting and formatting tools

### 3. Peer Dependencies
Some packages should be peer dependencies:
- React in React Native libraries
- TypeScript in type definition packages

## Commands for Dependency Management

### Installation Commands
```bash
# Install all dependencies across workspaces
npm run install:all

# Install dependencies for specific workspace
npm install --workspace=riggerconnect-automation-server

# Install dependency to specific workspace
npm install express --workspace=riggerconnect-automation-server
```

### Audit and Security
```bash
# Audit all workspaces
npm run security-audit

# Audit specific workspace
npm audit --workspace=riggerconnect-automation-server
```

### Cleaning and Resetting
```bash
# Clean all workspaces
npm run clean

# Complete reset
npm run reset
```

## Benefits of This Structure

1. **Reduced Duplication**: Shared dependencies are hoisted to root level
2. **Version Consistency**: Common tools use same versions across all packages
3. **Easier Maintenance**: Central management of shared dependencies
4. **Faster Installs**: Reduced download and disk usage
5. **Better Caching**: CI/CD can cache root node_modules more effectively

## Migration Steps

1. ✅ Create individual package.json files for each component
2. ✅ Update root package.json to use workspaces
3. ✅ Configure TypeScript for each workspace
4. ⏳ Remove old node_modules and reinstall
5. ⏳ Update CI/CD pipelines to use workspace commands
6. ⏳ Test all workspace commands

## Next Steps

1. **Remove Legacy Dependencies**: Clean up unused dependencies from the transition
2. **Update CI/CD**: Modify build pipelines to work with workspace structure
3. **Documentation**: Update development guides for new workspace structure
4. **Testing**: Ensure all workspace commands work correctly
5. **Performance**: Monitor build times and optimize as needed

## Common Issues and Solutions

### Issue: Version Conflicts
**Solution**: Use `npm ls` to identify conflicts and align versions

### Issue: Peer Dependency Warnings
**Solution**: Install peer dependencies at the appropriate workspace level

### Issue: Build Failures
**Solution**: Ensure all TypeScript paths are correctly configured

### Issue: Missing Dependencies
**Solution**: Check if dependencies need to be moved between workspaces

## Monitoring

Regular tasks to maintain dependency health:
- Weekly dependency audits
- Monthly dependency updates
- Quarterly major version updates
- Continuous vulnerability scanning

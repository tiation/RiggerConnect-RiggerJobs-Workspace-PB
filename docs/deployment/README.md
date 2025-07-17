# Deployment Guide

## Overview

This guide provides the steps necessary to deploy the RiggerConnect-RiggerJobs-Workspace to different environments including development, staging, and production.

## Prerequisites

Ensure you have all the required tools and accounts set up before starting the deployment process:

- AWS Account with permissions for deploying services
- Terraform installed on your system
- GitHub account for accessing CI/CD pipelines
- Node.js and npm installed locally

## Deployment Steps

### Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tiation/RiggerConnect-RiggerJobs-Workspace-PB.git
   cd RiggerConnect-RiggerJobs-Workspace-PB
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and configure the necessary environment variables as specified in `.env.example`.
   
4. **Run the server**:
   ```bash
   npm run dev
   ```
   
### Staging Environment

The staging environment is intended for pre-production testing and requires a full setup of infrastructure components.

1. **Deploy infrastructure using Terraform**:
   - Navigate to the `Infrastructure` directory:
     ```bash
     cd Infrastructure
     ```
   - Initialize Terraform:
     ```bash
     terraform init
     ```
   - Apply the configuration (ensure `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` are set in your environment):
     ```bash
     terraform apply
     ```

2. **Deploy application**:
   - Use GitHub Actions set up in the repository to trigger a deployment to the staging environment by merging to the `staging` branch.

### Production Environment

When deploying to production, ensure all changes have been thoroughly tested in the staging environment.

1. **Infrastructure Management**:
   - Similar to staging, but ensure you are targeting the production configuration in Terraform.

2. **Deploy application**:
   - Use GitHub Actions to trigger a deployment to the production environment by merging changes to the `main` branch.

3. **Monitor Deployment**:
   - After deployment, monitor application performance using integrated tools such as AWS CloudWatch and Sentry.

4. **Continuation**:
   - Regularly update dependencies and review logs for errors or issues.

## Rollback Procedures

In case a deployment to production causes issues, you should:

1. **Identify the issue** in the production environment via logs and error tracking.
2. **Initiate a rollback** using the last known good configuration.
3. **Monitor** the application's performance post-rollback to ensure stability.

## Quick Reference for Commands

- **Start Development Server**:
  ```bash
  npm run dev
  ```

- **Run Tests**:
  ```bash
  npm test
  ```

- **Build for Production**:
  ```bash
  npm run build
  ```

- **Deploy using Terraform**:
  ```bash
  terraform apply
  ```

## Additional Resources

- [RiggerConnect System Architecture](../architecture/README.md)
- [Full API Documentation](../api/README.md)

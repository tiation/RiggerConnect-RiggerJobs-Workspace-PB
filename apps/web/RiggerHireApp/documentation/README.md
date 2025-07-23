# RiggerHireApp Documentation

## Overview
RiggerHireApp is an enterprise-grade platform designed for the construction and mining industries in Western Australia. The platform facilitates efficient hiring of riggers, doggers, and crane operators while ensuring compliance with WorkSafe WA regulations.

## Architecture
![Architecture Diagram](./assets/architecture.png)

### Microservices
- **Authentication Service**: Handles user authentication and authorization
- **Document Processing Service**: Manages document verification and WorkSafe WA compliance
- **Notification Service**: Handles multi-channel communications
- **Analytics Service**: Provides safety and compliance analytics

## Documentation Sections

### [API Documentation](./api/README.md)
- Complete API reference
- Request/response examples
- Authentication details
- Error handling

### [Deployment Guide](./deployment/README.md)
- Environment setup
- Configuration
- Scaling guidelines
- Monitoring and maintenance

### [Integration Examples](./integration/README.md)
- Code samples
- Common use cases
- Best practices
- Testing examples

## Technology Stack

### Backend Services
- Node.js with TypeScript
- PostgreSQL with Supabase
- Redis for caching
- RabbitMQ for message queuing
- Elasticsearch for analytics

### Infrastructure
- Docker containers
- Kubernetes orchestration
- AWS cloud infrastructure
- ELK stack for logging

### Security
- JWT authentication
- Role-based access control
- Data encryption
- Audit logging

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/RiggerHireApp.git
```

2. Install dependencies:
```bash
cd RiggerHireApp
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start services:
```bash
docker-compose up -d
```

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write unit tests
- Document all public APIs

### Git Workflow
- Feature branches
- Pull request reviews
- Semantic versioning
- Automated CI/CD

### Testing
- Unit tests with Jest
- Integration tests
- E2E testing
- Performance testing

## Support and Contact

For technical support or inquiries:
- Email: support@riggerhireapp.com
- Documentation Issues: Create a GitHub issue
- Security Concerns: security@riggerhireapp.com

## License
Proprietary software. All rights reserved.

## Changelog
See [CHANGELOG.md](../CHANGELOG.md) for detailed version history.

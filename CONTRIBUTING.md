# Contributing to RiggerConnect-RiggerJobs-Workspace

Thank you for your interest in contributing to the RiggerConnect-RiggerJobs-Workspace! This guide will help you understand how to contribute effectively to this enterprise-grade construction job matching platform.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v5 or higher)
- **Redis** (v6 or higher)
- **Git**

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/RiggerConnect-RiggerJobs-Workspace-PB.git
   cd RiggerConnect-RiggerJobs-Workspace-PB
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📋 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our code of conduct:

- **Be respectful** and inclusive in all interactions
- **Be collaborative** and constructive in discussions
- **Be patient** with newcomers and help them learn
- **No harassment** or discrimination will be tolerated

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Clear description** of the problem
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, Node version, etc.)
5. **Screenshots** if applicable

Use our [issue templates](https://github.com/tiation/RiggerConnect-RiggerJobs-Workspace-PB/issues/new/choose) to ensure all necessary information is provided.

## 💡 Feature Requests

We welcome feature requests! Please:

1. **Check existing issues** to avoid duplicates
2. **Use our feature request template**
3. **Provide detailed use cases** and rationale
4. **Include mockups** or examples if helpful

## 🔧 Development Guidelines

### Code Standards

- **Language**: TypeScript for all new code
- **Style**: Follow our ESLint and Prettier configurations
- **Testing**: Write tests for all new features and bug fixes
- **Documentation**: Update documentation for any API changes

### Code Quality

Before submitting code:

```bash
# Run linting
npm run lint

# Run tests
npm test

# Run type checking
npm run type-check

# Format code
npm run format
```

### Git Workflow

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with clear, descriptive commits:
   ```bash
   git commit -m \"feat: add worker certification validation\"\n   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a pull request** to the `main` branch

### Commit Message Convention

We use [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No merge conflicts exist
- [ ] Branch is up-to-date with `main`

### Pull Request Template

When creating a pull request, please include:

1. **Description** of changes made
2. **Issue reference** (if applicable)
3. **Testing** performed
4. **Breaking changes** (if any)
5. **Screenshots** (for UI changes)

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least two maintainers
3. **Testing** in staging environment
4. **Approval** from a core team member

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Writing Tests

- **Unit tests**: Test individual functions/components
- **Integration tests**: Test API endpoints
- **E2E tests**: Test complete user workflows

Example test structure:
```typescript
describe('JobService', () => {
  it('should create a new job', async () => {
    // Test implementation
  });
});
```

## 📚 Documentation

### API Documentation

- Update OpenAPI specs for API changes
- Include examples for new endpoints
- Document breaking changes

### README Updates

- Keep installation instructions current
- Update feature lists for new functionality
- Add screenshots for UI changes

### Architecture Documentation

- Document new services or components
- Update system diagrams
- Explain design decisions

## 🚀 Deployment

### Staging Deployment

Pull requests are automatically deployed to staging for testing.

### Production Deployment

Only maintainers can deploy to production via:
```bash
npm run deploy:production
```

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### High Priority
- **Security improvements**
- **Performance optimizations**
- **Bug fixes**
- **Test coverage improvements**

### Medium Priority
- **New features** (see roadmap)
- **Documentation improvements**
- **Code refactoring**
- **UI/UX enhancements**

### Low Priority
- **Developer tooling**
- **CI/CD improvements**
- **Example applications**

## 📞 Getting Help

If you need help:

1. **Check documentation** first
2. **Search existing issues** and discussions
3. **Ask questions** in GitHub Discussions
4. **Join our Slack** workspace: [riggerconnect.slack.com](https://riggerconnect.slack.com)

## 🏆 Recognition

Contributors will be recognized in:

- **README contributors section**
- **Release notes** for significant contributions
- **Hall of Fame** on our website

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You

Thank you for contributing to RiggerConnect! Your efforts help make construction job matching more efficient and accessible for everyone.

For questions about contributing, please reach out to our maintainers:

- **Email**: contributors@riggerconnect.com
- **Slack**: [#contributors](https://riggerconnect.slack.com/channels/contributors)
- **GitHub**: [@riggerconnect-team](https://github.com/riggerconnect-team)

Happy coding! 🚀

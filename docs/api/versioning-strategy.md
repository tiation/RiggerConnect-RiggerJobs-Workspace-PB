# API Versioning Strategy & Testing

## 📋 Overview

This document outlines the comprehensive API versioning strategy and testing approach for the RiggerConnect API, ensuring backward compatibility, smooth migrations, and robust testing practices.

## 🔢 Versioning Strategy

### Version Numbering

We follow **Semantic Versioning (SemVer)** principles:

```
MAJOR.MINOR.PATCH (e.g., 1.2.3)
```

- **MAJOR**: Breaking changes, incompatible API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Version Implementation

#### 1. URL Path Versioning (Current)
```
/api/v1/jobs
/api/v2/jobs
/api/v3/jobs
```

**Advantages:**
- Clear and explicit
- Easy to cache
- Simple routing

**Usage:**
```bash
curl https://api.riggerconnect.com/v1/jobs
```

#### 2. Header Versioning (Future)
```http
API-Version: v1
Accept: application/vnd.riggerconnect.v1+json
```

**Advantages:**
- Cleaner URLs
- More flexible
- Content negotiation

**Usage:**
```bash
curl -H "API-Version: v1" https://api.riggerconnect.com/jobs
```

#### 3. Query Parameter Versioning (Backup)
```
/api/jobs?version=v1
```

**Usage:**
```bash
curl https://api.riggerconnect.com/jobs?version=v1
```

## 🎯 Version Lifecycle Management

### Version Support Matrix

| Version | Status | Release Date | Support Until | End of Life |
|---------|--------|--------------|---------------|-------------|
| v3.0    | Planning | 2024-Q3     | TBD          | TBD         |
| v2.0    | Development | 2024-Q2   | 2025-Q4      | 2026-Q2     |
| v1.0    | **Current** | 2024-Q1   | 2025-Q1     | 2025-Q3     |
| v0.9    | **Deprecated** | 2023-Q4 | 2024-Q2     | 2024-Q4     |

### Support Phases

#### 1. **Current Phase** (18 months)
- Full feature support
- Bug fixes and security updates
- New feature development
- Full documentation

#### 2. **Maintenance Phase** (12 months)
- Security updates only
- Critical bug fixes
- No new features
- Limited support

#### 3. **Deprecated Phase** (6 months)
- Security updates only
- Migration guidance
- Sunset warnings
- End-of-life preparation

## 📊 Breaking Changes Policy

### What Constitutes a Breaking Change

#### ❌ **Breaking Changes** (Major Version)
- Removing endpoints or fields
- Changing field types
- Modifying response structure
- Changing authentication requirements
- Altering error codes/messages
- Changing URL structure

#### ✅ **Non-Breaking Changes** (Minor/Patch)
- Adding new endpoints
- Adding optional fields
- Adding new response fields
- Improving error messages
- Performance optimizations
- Documentation updates

### Change Communication Process

1. **Announcement** (90 days prior)
   - Developer newsletter
   - API documentation updates
   - Dashboard notifications

2. **Deprecation** (60 days prior)
   - Deprecation headers
   - Warning logs
   - Migration guides

3. **Sunset** (30 days prior)
   - Final warnings
   - Support cutoff notices
   - Alternative solutions

## 🔄 Migration Strategy

### Migration Planning

#### 1. **Assessment Phase**
- Identify affected endpoints
- Analyze usage patterns
- Estimate migration effort
- Plan rollback procedures

#### 2. **Preparation Phase**
- Create migration guides
- Develop compatibility layers
- Prepare test environments
- Update documentation

#### 3. **Execution Phase**
- Gradual rollout
- Monitor error rates
- Provide support
- Gather feedback

#### 4. **Validation Phase**
- Verify functionality
- Performance testing
- User acceptance
- Documentation review

### Migration Tools

#### API Diff Tool
```bash
# Compare API versions
npm run api-diff v1 v2

# Output format
Added endpoints: 5
Modified endpoints: 3
Removed endpoints: 1
Breaking changes: 2
```

#### Migration Helper
```bash
# Generate migration guide
npm run migration-guide v1 v2

# Validate API compatibility
npm run api-validate --from=v1 --to=v2
```

## 🧪 Testing Strategy

### Test Types

#### 1. **Unit Tests**
- Individual endpoint testing
- Request/response validation
- Error handling
- Business logic validation

```javascript
describe('Jobs API v1', () => {
  it('should create a job successfully', async () => {
    const response = await request(app)
      .post('/api/v1/jobs')
      .send(validJobData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
  });
});
```

#### 2. **Integration Tests**
- End-to-end workflows
- Database interactions
- External service integration
- Real-world scenarios

```javascript
describe('Job Matching Flow', () => {
  it('should match worker to job', async () => {
    // Create job
    const job = await createJob(jobData);
    
    // Create worker
    const worker = await createWorker(workerData);
    
    // Trigger matching
    const match = await triggerMatching(job.id, worker.id);
    
    expect(match.success).toBe(true);
  });
});
```

#### 3. **Contract Tests**
- API contract validation
- Schema compliance
- Backward compatibility
- Version compatibility

```javascript
describe('API Contract v1', () => {
  it('should comply with OpenAPI schema', async () => {
    const response = await request(app)
      .get('/api/v1/jobs')
      .expect(200);
    
    const validation = validateSchema(response.body, jobsSchema);
    expect(validation.valid).toBe(true);
  });
});
```

#### 4. **Performance Tests**
- Load testing
- Stress testing
- Latency testing
- Throughput testing

```javascript
describe('Performance Tests', () => {
  it('should handle 1000 concurrent requests', async () => {
    const requests = Array(1000).fill().map(() => 
      request(app).get('/api/v1/jobs')
    );
    
    const responses = await Promise.all(requests);
    const avgResponseTime = calculateAverage(responses);
    
    expect(avgResponseTime).toBeLessThan(200);
  });
});
```

### Test Automation

#### CI/CD Pipeline
```yaml
# .github/workflows/api-tests.yml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        api-version: [v1, v2]
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run unit tests
        run: npm run test:unit:${{ matrix.api-version }}
      
      - name: Run integration tests
        run: npm run test:integration:${{ matrix.api-version }}
      
      - name: Run contract tests
        run: npm run test:contract:${{ matrix.api-version }}
      
      - name: Run performance tests
        run: npm run test:performance:${{ matrix.api-version }}
```

#### Test Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:contract": "jest --testPathPattern=contract",
    "test:performance": "jest --testPathPattern=performance",
    "test:v1": "jest --testPathPattern=v1",
    "test:v2": "jest --testPathPattern=v2",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

### Test Coverage Requirements

#### Coverage Targets
- **Unit Tests**: 90% line coverage
- **Integration Tests**: 80% endpoint coverage
- **Contract Tests**: 100% schema coverage
- **Performance Tests**: Critical paths only

#### Coverage Reporting
```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

## 📈 Monitoring & Analytics

### Version Usage Analytics

#### Metrics Collection
```javascript
// Track API version usage
app.use((req, res, next) => {
  const version = extractVersion(req);
  
  metrics.increment('api.version.usage', {
    version,
    endpoint: req.route.path,
    method: req.method
  });
  
  next();
});
```

#### Dashboard Metrics
- Version adoption rates
- Deprecated version usage
- Migration progress
- Error rates by version

### Performance Monitoring

#### Response Time Tracking
```javascript
// Track response times by version
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const version = extractVersion(req);
    
    metrics.timing('api.response_time', duration, {
      version,
      endpoint: req.route.path
    });
  });
  
  next();
});
```

## 🔧 Developer Experience

### Version Discovery

#### API Version Endpoint
```bash
GET /api/versions

{
  "versions": [
    {
      "version": "v1",
      "status": "current",
      "deprecated": false,
      "sunset_date": null,
      "documentation": "https://docs.riggerconnect.com/api/v1"
    },
    {
      "version": "v2",
      "status": "beta",
      "deprecated": false,
      "sunset_date": null,
      "documentation": "https://docs.riggerconnect.com/api/v2"
    }
  ]
}
```

### SDK Version Management

#### JavaScript SDK
```javascript
import RiggerConnect from '@riggerconnect/sdk';

// Specify version
const client = new RiggerConnect({
  apiKey: 'your-key',
  version: 'v1'
});

// Auto-detect latest
const client = new RiggerConnect({
  apiKey: 'your-key',
  version: 'latest'
});
```

#### Version Compatibility Matrix
```javascript
// SDK version compatibility
const compatibility = {
  '@riggerconnect/sdk': {
    '1.0.0': ['v1'],
    '2.0.0': ['v1', 'v2'],
    '3.0.0': ['v2', 'v3']
  }
};
```

## 📋 Documentation Standards

### Version-Specific Documentation

#### Structure
```
docs/
├── api/
│   ├── v1/
│   │   ├── README.md
│   │   ├── endpoints/
│   │   └── examples/
│   ├── v2/
│   │   ├── README.md
│   │   ├── endpoints/
│   │   └── examples/
│   └── migration/
│       ├── v1-to-v2.md
│       └── v2-to-v3.md
```

#### Documentation Requirements
- Complete endpoint documentation
- Request/response examples
- Error handling examples
- Migration guides
- Change logs

### OpenAPI Specification

#### Version Management
```yaml
# openapi-v1.yaml
openapi: 3.0.0
info:
  title: RiggerConnect API
  version: 1.0.0
  description: Version 1 of the RiggerConnect API

# openapi-v2.yaml
openapi: 3.0.0
info:
  title: RiggerConnect API
  version: 2.0.0
  description: Version 2 of the RiggerConnect API
```

## 🎯 Best Practices

### Version Design
1. **Design for Change**: Plan for future modifications
2. **Backward Compatibility**: Maintain compatibility when possible
3. **Clear Communication**: Provide clear migration paths
4. **Gradual Rollout**: Implement changes gradually
5. **Monitor Usage**: Track version adoption and usage

### Testing Practices
1. **Automated Testing**: Comprehensive test automation
2. **Contract Testing**: Validate API contracts
3. **Performance Testing**: Regular performance validation
4. **Security Testing**: Security vulnerability testing
5. **User Acceptance**: Validate with real users

### Documentation Practices
1. **Version-Specific Docs**: Separate documentation per version
2. **Migration Guides**: Clear migration instructions
3. **Change Logs**: Detailed change documentation
4. **Examples**: Comprehensive code examples
5. **Interactive Docs**: Interactive API documentation

---

*This document is maintained by the RiggerConnect API Team*  
*Last updated: January 2024*  
*Version: 1.0.0*

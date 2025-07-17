# RiggerConnect API Documentation

<div align="center">
  <img src="../../assets/logos/riggerconnect-logo.svg" alt="RiggerConnect Logo" width="200"/>
  <h2>Enterprise-Grade API Documentation</h2>
  <p><strong>Version 1.0.0</strong></p>
</div>

---

## 📋 Overview

The RiggerConnect API provides a comprehensive set of RESTful endpoints for managing jobs, workers, payments, and automation in the construction industry job matching platform. Built with enterprise-grade security, scalability, and performance in mind.

### Key Features
- **RESTful Architecture**: Clean, predictable API design
- **JWT Authentication**: Secure token-based authentication
- **Real-time Communication**: WebSocket support for live updates
- **Comprehensive Validation**: Input validation and sanitization
- **Rate Limiting**: Protection against abuse
- **OpenAPI 3.0**: Full specification available

## 🌐 Base URLs

| Environment | Base URL | Purpose |
|-------------|----------|----------|
| **Production** | `https://api.riggerconnect.com/v1` | Live production environment |
| **Staging** | `https://staging-api.riggerconnect.com/v1` | Pre-production testing |
| **Development** | `http://localhost:3000/v1` | Local development |

## Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Rate Limiting

- **Standard**: 100 requests per minute per IP
- **Authenticated**: 1000 requests per minute per user
- **Premium**: 5000 requests per minute per user

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "role": "business",
    "profile": {...}
  }
}
```

#### POST /auth/register
Register a new user

#### POST /auth/refresh
Refresh JWT token

### Jobs

#### GET /jobs
Get list of jobs with filtering and pagination

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20)
- `location` (string): Filter by location
- `category` (string): Filter by job category
- `status` (string): Filter by status

**Response:**
```json
{
  "jobs": [
    {
      "id": "job123",
      "title": "Tower Crane Operator",
      "description": "Experienced tower crane operator needed...",
      "location": {
        "address": "123 Construction Ave",
        "city": "Seattle",
        "state": "WA",
        "coordinates": [47.6062, -122.3321]
      },
      "requirements": [
        "Valid crane operator certification",
        "5+ years experience"
      ],
      "compensation": {
        "rate": 45.00,
        "type": "hourly"
      },
      "schedule": {
        "start": "2024-01-15T08:00:00Z",
        "end": "2024-03-15T17:00:00Z"
      },
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

#### POST /jobs
Create a new job posting

#### GET /jobs/:id
Get job details by ID

#### PUT /jobs/:id
Update job details

#### DELETE /jobs/:id
Delete job posting

### Workers

#### GET /workers
Get list of workers with filtering

**Query Parameters:**
- `skills` (array): Filter by skills
- `location` (string): Filter by location
- `availability` (string): Filter by availability
- `certification` (string): Filter by certification

#### GET /workers/:id
Get worker profile details

#### PUT /workers/:id/profile
Update worker profile

#### GET /workers/:id/certifications
Get worker certifications

#### POST /workers/:id/compliance-check
Perform compliance verification

### Payments

#### POST /payments/charge
Create payment charge

#### GET /payments/:id
Get payment details

#### POST /payments/payout
Process worker payout

#### GET /payments/history
Get payment history

### Notifications

#### GET /notifications
Get user notifications

#### POST /notifications
Send notification

#### PUT /notifications/:id/read
Mark notification as read

### Analytics

#### GET /analytics/dashboard
Get dashboard statistics

#### GET /analytics/jobs
Get job analytics

#### GET /analytics/workers
Get worker analytics

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Webhooks

RiggerConnect supports webhooks for real-time notifications:

### Supported Events

- `job.created`
- `job.updated`
- `job.completed`
- `worker.matched`
- `payment.processed`
- `compliance.verified`

### Webhook Payload

```json
{
  "event": "job.created",
  "data": {
    "job": {...}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## SDK Examples

### JavaScript/Node.js

```javascript
const RiggerConnect = require('@riggerconnect/sdk');

const client = new RiggerConnect({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.riggerconnect.com/v1'
});

// Get jobs
const jobs = await client.jobs.list({
  location: 'Seattle, WA',
  limit: 10
});

// Create job
const job = await client.jobs.create({
  title: 'Tower Crane Operator',
  location: 'Seattle, WA',
  // ... other fields
});
```

### Python

```python
from riggerconnect import RiggerConnect

client = RiggerConnect(api_key='your-api-key')

# Get jobs
jobs = client.jobs.list(location='Seattle, WA', limit=10)

# Create job
job = client.jobs.create(
    title='Tower Crane Operator',
    location='Seattle, WA'
)
```

## Testing

Use our testing environment for development:

- **Base URL**: `https://api-test.riggerconnect.com/v1`
- **Test API Key**: Available in your developer dashboard
- **Test Data**: Pre-populated with sample jobs and workers

For more detailed examples and advanced usage, visit our [Developer Portal](https://developers.riggerconnect.com).

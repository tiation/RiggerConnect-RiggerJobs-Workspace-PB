# RiggerHireApp API Documentation

## API Overview

The RiggerHireApp API is organized around REST principles, with some real-time features implemented using WebSockets. All data is sent and received as JSON.

## Base URL

```
Production: https://api.riggerhireapp.com/v1
Development: https://dev-api.riggerhireapp.com/v1
```

## Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication

```http
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

### Jobs

```http
GET /jobs
POST /jobs
GET /jobs/{id}
PUT /jobs/{id}
DELETE /jobs/{id}
```

### Workers

```http
GET /workers
POST /workers
GET /workers/{id}
PUT /workers/{id}
DELETE /workers/{id}
```

### Companies

```http
GET /companies
POST /companies
GET /companies/{id}
PUT /companies/{id}
DELETE /companies/{id}
```

### Payments

```http
POST /payments/create
GET /payments/{id}
GET /payments/history
```

### Compliance

```http
POST /compliance/verify
GET /compliance/status/{id}
PUT /compliance/update/{id}
```

## WebSocket Events

```javascript
// Job status updates
socket.on('job:status', (data) => {
    // Handle job status change
});

// Worker availability updates
socket.on('worker:availability', (data) => {
    // Handle worker availability change
});
```

## Error Handling

All errors follow this format:

```json
{
    "error": {
        "code": "error_code",
        "message": "Human readable message",
        "details": {}
    }
}
```

## Rate Limiting

- 1000 requests per hour for authenticated users
- 60 requests per hour for unauthenticated users

## Documentation Tools

- Full API documentation available via Swagger UI at `/docs`
- OpenAPI specification available at `/docs/openapi.json`

## SDK Support

- JavaScript/TypeScript
- Swift
- Kotlin

[Additional documentation to be added]

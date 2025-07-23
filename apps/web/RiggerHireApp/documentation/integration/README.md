# RiggerHireApp Integration Examples

## Overview
This section provides examples of how to integrate with the RiggerHireApp microservices.

## Example 1: User Registration and Login
```javascript
const axios = require('axios');

// Register a new user
async function registerUser() {
  const response = await axios.post('http://localhost:3000/auth/register', {
    email: 'user@example.com',
    password: 'securepassword',
    role: 'RIGGER'
  });
  console.log('User registered:', response.data);
}

// Login
async function loginUser() {
  const response = await axios.post('http://localhost:3000/auth/login', {
    email: 'user@example.com',
    password: 'securepassword'
  });
  console.log('Tokens:', response.data);
}
```

## Example 2: Document Verification
```javascript
// Verify a document
async function verifyDocument() {
  const response = await axios.post('http://localhost:3000/documents/verify', {
    documentNumber: '12345',
    documentType: 'HIGH_RISK_WORK_LICENSE',
    licenseClass: 'DG'
  });
  console.log('Verification Details:', response.data);
}
```

## Example 3: Sending Notifications
```javascript
// Send a notification
async function sendNotification() {
  const response = await axios.post('http://localhost:3000/notifications/send', {
    recipientId: 'user-id',
    content: 'You have a new job match!',
    channel: 'EMAIL'
  });
  console.log('Notification Status:', response.data);
}
```

## Example 4: Fetching Safety Metrics
```javascript
// Fetch safety metrics
async function fetchSafetyMetrics() {
  const response = await axios.get('http://localhost:3000/analytics/safety-metrics', {
    params: {
      start: '2025-01-01',
      end: '2025-06-30'
    }
  });
  console.log('Safety Metrics:', response.data);
}
```

## Running Examples
- Ensure all services are running using Docker Compose or Kubernetes.
- Replace "localhost" with the appropriate service endpoints if deployed on remote servers.

## Notes
- Refer to API and Deployment documentation for more details on requests and responses.
- Secure sensitive data using environment variables or secrets management solutions.

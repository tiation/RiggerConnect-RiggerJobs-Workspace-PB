const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'rigger-platform-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RiggerHub API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    description: 'Construction workforce management platform API'
  });
});

// Demo endpoints
app.get('/api/v1/jobs', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        title: 'Tower Crane Operator',
        location: 'Perth, WA',
        company: 'RiggerConnect Demo',
        salary: '$45/hour',
        description: 'Experienced tower crane operator needed for construction project'
      },
      {
        id: '2',
        title: 'Rigger Specialist',
        location: 'Sydney, NSW',
        company: 'BuildTech Solutions',
        salary: '$38/hour',
        description: 'Skilled rigger required for high-rise building construction'
      }
    ],
    total: 2,
    message: 'Demo endpoint - ChaseWhiteRabbit NGO supported platform'
  });
});

app.get('/api/v1/workers', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'John Smith',
        skills: ['Tower Crane', 'Mobile Crane'],
        location: 'Perth, WA',
        experience: '8 years',
        rating: 4.8
      },
      {
        id: '2',
        name: 'Maria Rodriguez',
        skills: ['Rigging', 'Signal Person'],
        location: 'Sydney, NSW',
        experience: '5 years',
        rating: 4.9
      }
    ],
    total: 2,
    message: 'Demo endpoint - Supporting workforce development'
  });
});

// Authentication endpoints
app.post('/api/v1/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    token: 'demo-jwt-token-123',
    user: {
      id: '1',
      email: 'demo@riggerhub.com',
      role: 'business',
      name: 'Demo User'
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 RiggerHub API Server running on port ${port}`);
  console.log(`🏗️ Supporting ChaseWhiteRabbit NGO initiatives`);
});

module.exports = app;
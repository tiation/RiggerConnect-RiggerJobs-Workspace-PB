const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'riggerhub-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    message: 'RiggerHub Production API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🏗️ RiggerHub API - Live on Google Cloud!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    description: 'Construction workforce management platform',
    status: 'Production Ready',
    ngo_support: 'Supporting ChaseWhiteRabbit NGO with 10% of profits'
  });
});

// Jobs API
app.get('/api/v1/jobs', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        title: 'Tower Crane Operator',
        location: 'Perth, WA',
        company: 'Construction Corp',
        salary: '$45/hour',
        description: 'Experienced tower crane operator needed'
      },
      {
        id: '2', 
        title: 'Rigger Specialist',
        location: 'Sydney, NSW',
        company: 'BuildTech Solutions',
        salary: '$38/hour',
        description: 'Skilled rigger for high-rise construction'
      }
    ],
    total: 2,
    message: 'Production API - Supporting NGO initiatives'
  });
});

// Workers API
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
      }
    ],
    total: 1
  });
});

app.listen(port, () => {
  console.log(`🚀 RiggerHub API running on port ${port}`);
});
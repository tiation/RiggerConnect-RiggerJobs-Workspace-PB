const express = require('express');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());

console.log('Loading routes one by one...');

try {
  console.log('1. Loading auth routes...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✓ Auth routes loaded');
} catch (e) {
  console.log('✗ Auth routes failed:', e.message);
  process.exit(1);
}

try {
  console.log('2. Loading user routes...');
  const userRoutes = require('./routes/users');
  app.use('/api/users', userRoutes);
  console.log('✓ User routes loaded');
} catch (e) {
  console.log('✗ User routes failed:', e.message);
  process.exit(1);
}

try {
  console.log('3. Loading job routes...');
  const jobRoutes = require('./routes/jobs');
  app.use('/api/jobs', jobRoutes);
  console.log('✓ Job routes loaded');
} catch (e) {
  console.log('✗ Job routes failed:', e.message);
  process.exit(1);
}

try {
  console.log('4. Loading application routes...');
  const applicationRoutes = require('./routes/applications');
  app.use('/api/applications', applicationRoutes);
  console.log('✓ Application routes loaded');
} catch (e) {
  console.log('✗ Application routes failed:', e.message);
  process.exit(1);
}

try {
  console.log('5. Loading payment routes...');
  const paymentRoutes = require('./routes/payments');
  app.use('/api/payments', paymentRoutes);
  console.log('✓ Payment routes loaded');
} catch (e) {
  console.log('✗ Payment routes failed:', e.message);
  process.exit(1);
}

console.log('All routes loaded successfully!');

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

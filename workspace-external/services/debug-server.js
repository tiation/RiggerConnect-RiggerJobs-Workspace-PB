const express = require('express');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

console.log('1. Starting basic Express app...');

// Security middleware
console.log('1.1. Adding helmet...');
app.use(helmet());
console.log('✓ Helmet added');

// Basic middleware
app.use(express.json());

console.log('2. Added basic middleware');

try {
  console.log('3. Loading auth routes...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✓ Auth routes loaded');

  console.log('4. Loading user routes...');
  const userRoutes = require('./routes/users');
  app.use('/api/users', userRoutes);
  console.log('✓ User routes loaded');

  console.log('5. Loading job routes...');
  const jobRoutes = require('./routes/jobs');
  app.use('/api/jobs', jobRoutes);
  console.log('✓ Job routes loaded');

  console.log('6. Loading application routes...');
  const applicationRoutes = require('./routes/applications');
  app.use('/api/applications', applicationRoutes);
  console.log('✓ Application routes loaded');

  console.log('7. Loading payment routes...');
  const paymentRoutes = require('./routes/payments');
  app.use('/api/payments', paymentRoutes);
  console.log('✓ Payment routes loaded');

  console.log('8. Adding error handling middleware...');
  const { errorHandler } = require('./middleware/errorHandler');
  app.use(errorHandler);
  console.log('✓ Error handler added');

  console.log('9. Adding logger middleware...');
  const logger = require('./middleware/logger');
  app.use(logger);
  console.log('✓ Logger added');

  console.log('10. Starting server...');
  app.listen(3001, () => {
    console.log('✓ Debug server running on port 3001');
  });

} catch (error) {
  console.error('❌ Error during setup:', error);
}

# RiggerHireApp Website

Enterprise-grade labour hire platform website connecting Western Australian businesses with certified riggers, doggers, and crane operators.

![RiggerHire Banner](https://via.placeholder.com/1200x400/0a0a0a/00d4ff?text=RiggerHire+Enterprise+Labour+Solutions)

## 🚀 Features

### 🏗️ **Industry-Specific Solutions**
- **Crane Operators**: Mobile and tower crane operators with HR/HC licenses
- **Riggers**: Advanced rigging specialists with height safety certifications  
- **Doggers**: Load calculation experts with current safety tickets

### 💼 **Enterprise-Grade Platform**
- **Business Registration**: ABN validation and compliance verification
- **Advanced Screening**: Comprehensive certification and safety record checks
- **Real-time Matching**: AI-powered candidate matching system
- **Integrated Payments**: Stripe integration for seamless transactions

### 🎨 **Modern Dark Neon Theme**
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Performance**: Optimized for fast loading and smooth interactions
- **Visual Appeal**: Cyan/magenta gradient accents with enterprise styling

## 🏗️ Architecture

### Frontend Stack
- **HTML5**: Semantic markup with Schema.org structured data
- **CSS3**: Custom properties with dark neon theme variables
- **JavaScript ES6+**: Modular architecture with async/await patterns
- **Bootstrap 5**: Responsive grid system and components
- **Font Awesome**: Professional icon library

### Backend Integration
- **Node.js API**: RESTful API with Express.js framework
- **MongoDB**: Document database for user profiles and job data
- **JWT Authentication**: Secure token-based authentication
- **Stripe Payments**: PCI-compliant payment processing
- **Email Services**: Automated notifications with Nodemailer

### Security Features
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Configured cross-origin resource sharing
- **Rate Limiting**: API endpoint protection
- **Helmet.js**: Security headers and XSS protection

## 🚦 Getting Started

### Prerequisites
```bash
# Node.js 16+ and npm
node --version
npm --version

# MongoDB (local or cloud)
mongod --version
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tiation/RiggerHireApp-Website.git
cd RiggerHireApp-Website
```

2. **Install dependencies**
```bash
# Backend dependencies
npm install

# Frontend is vanilla JS - no additional installation needed
```

3. **Environment Configuration**
```bash
# Copy example environment file
cp .env.example .env

# Configure environment variables
nano .env
```

Required environment variables:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/riggerhire

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# CORS and Security
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Start the Application**
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

5. **Access the Application**
- **Website**: http://localhost:3000
- **API Health**: http://localhost:3000/health
- **API Documentation**: http://localhost:3000/api

## 📱 Usage

### Business Registration
1. Click "Register Business" button
2. Complete company verification with ABN
3. Set up user profile and preferences
4. Choose subscription plan

### Posting Job Requirements
1. Navigate to dashboard after login
2. Create new job posting with requirements
3. Specify certifications and experience needed
4. Set location, duration, and budget

### Candidate Selection
1. Review matched candidate profiles
2. Check certifications and safety records
3. Contact candidates directly
4. Manage hiring process through platform

## 🎨 Customization

### Theme Colors
Update CSS custom properties in `assets/css/style.css`:
```css
:root {
    --primary-cyan: #00d4ff;      /* Main brand color */
    --primary-magenta: #ff0080;   /* Accent color */
    --bg-primary: #0a0a0a;        /* Background */
    --text-primary: #ffffff;      /* Text color */
}
```

### API Configuration
Modify API endpoints in `assets/js/app.js`:
```javascript
const API_BASE_URL = 'https://your-api-domain.com';
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Business registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify JWT token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Job Management
- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job posting
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id` - Update application status

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment
- `POST /api/payments/confirm-payment` - Confirm payment

## 🧪 Testing

### Frontend Testing
```bash
# Run validation tests
npm run test:frontend

# Check accessibility compliance
npm run test:a11y

# Performance testing
npm run test:lighthouse
```

### Backend Testing
```bash
# Unit tests
npm run test

# Integration tests  
npm run test:integration

# API endpoint tests
npm run test:api
```

## 🚀 Deployment

### GitHub Pages (Frontend Only)
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy:github
```

### Heroku (Full Stack)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create riggerhire-app

# Configure environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret

# Deploy application
git push heroku main
```

### Docker Deployment
```bash
# Build Docker image
docker build -t riggerhire .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongo:27017/riggerhire \
  -e JWT_SECRET=your-secret \
  riggerhire
```

## 📊 Monitoring

### Health Checks
- Application health: `/health`
- Database connectivity: Automatic monitoring
- API response times: Built-in logging

### Analytics Integration
```javascript
// Google Analytics 4
gtag('config', 'GA_MEASUREMENT_ID');

// Custom event tracking
gtag('event', 'business_registration', {
    'event_category': 'user_engagement',
    'event_label': 'new_business'
});
```

## 🔐 Security Considerations

### Data Protection
- **Encryption**: All sensitive data encrypted at rest
- **HTTPS**: SSL/TLS for data in transit  
- **Input Sanitization**: XSS and injection prevention
- **Password Hashing**: bcrypt with salt rounds

### Compliance
- **GDPR**: User data privacy and deletion rights
- **Australian Privacy Act**: Local compliance requirements
- **PCI DSS**: Payment card data security standards

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **ESLint**: JavaScript linting with Airbnb config
- **Prettier**: Code formatting consistency  
- **JSDoc**: Comprehensive function documentation
- **Git Hooks**: Pre-commit validation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Reference**: [/docs/api.md](./docs/api.md)
- **User Guide**: [/docs/user-guide.md](./docs/user-guide.md)
- **Deployment Guide**: [/docs/deployment.md](./docs/deployment.md)

### Contact Support
- **Email**: support@riggerhire.com.au
- **Phone**: +61 8 1234 5678
- **GitHub Issues**: [Create Issue](https://github.com/tiation/RiggerHireApp-Website/issues)

---

**Built with ❤️ for Western Australia's mining and construction workforce**

**[Live Demo](https://tiation.github.io/RiggerHireApp-Website) | [API Documentation](https://riggerhire-api.herokuapp.com/docs) | [GitHub Repository](https://github.com/tiation/RiggerHireApp-Website)**

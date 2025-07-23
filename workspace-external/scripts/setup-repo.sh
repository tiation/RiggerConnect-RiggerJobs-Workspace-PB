#!/bin/bash

# Setup script for RiggerConnect-RiggerJobs-Workspace-PB
# This script configures the repository for enterprise-grade development

echo "🚀 Setting up RiggerConnect-RiggerJobs-Workspace-PB repository..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Configure git hooks
echo "⚙️ Setting up git hooks..."
npx husky install

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "chore: initial commit with enterprise-grade setup"
fi

# Add remote if it doesn't exist
if ! git remote get-url origin &> /dev/null; then
    echo "🌐 Adding remote repository..."
    git remote add origin https://github.com/tiation/RiggerConnect-RiggerJobs-Workspace-PB.git
fi

# Create main branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/main; then
    echo "🔄 Creating main branch..."
    git checkout -b main
fi

# Set up development environment
echo "🛠️ Setting up development environment..."

# Check if .env exists, if not create from example
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "📝 Created .env file from .env.example"
        echo "⚠️  Please update .env with your configuration"
    else
        echo "⚠️  No .env.example found. Creating basic .env file..."
        cat > .env << EOF
# Environment Configuration
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/riggerconnect
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRE=7d

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-west-2
AWS_S3_BUCKET=rigger-documents

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY=your-firebase-private-key

# External APIs
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
SENDGRID_API_KEY=your-sendgrid-api-key
EOF
        echo "📝 Created basic .env file"
    fi
fi

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Generate assets
echo "🎨 Generating assets..."
node scripts/generate-assets.js

# Run initial validation
echo "🔍 Running initial validation..."
npm run lint
npm run type-check

# Display setup completion
echo ""
echo "✅ Repository setup complete!"
echo ""
echo "🚀 Quick start commands:"
echo "  npm run dev              # Start development server"
echo "  npm test                 # Run tests"
echo "  npm run build            # Build for production"
echo ""
echo "📚 Documentation:"
echo "  README.md                # Main documentation"
echo "  CONTRIBUTING.md          # Contributing guide"
echo "  docs/                    # Additional documentation"
echo ""
echo "🌐 Links:"
echo "  Repository: https://github.com/tiation/RiggerConnect-RiggerJobs-Workspace-PB"
echo "  GitHub Pages: https://tiation.github.io/RiggerConnect-RiggerJobs-Workspace-PB"
echo ""
echo "⚠️  Next steps:"
echo "  1. Update .env with your configuration"
echo "  2. Review and customize the documentation"
echo "  3. Set up your development database"
echo "  4. Start contributing!"
echo ""
echo "🎉 Happy coding!"

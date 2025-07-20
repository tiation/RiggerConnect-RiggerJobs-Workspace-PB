#!/bin/bash

# Rigger Connect Marketing Site - Deployment Script
# This script builds and deploys the marketing site to Vercel

set -e

echo "🚀 Starting deployment for Rigger Connect Marketing..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    log_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if node_modules exists, if not install dependencies
if [[ ! -d "node_modules" ]]; then
    log_info "Installing dependencies..."
    npm install
    log_success "Dependencies installed"
fi

# Run linting
log_info "Running ESLint..."
npm run lint
log_success "Linting passed"

# Build the project
log_info "Building project..."
npm run build
log_success "Build completed successfully"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    log_warning "Vercel CLI not found. Installing globally..."
    npm install -g vercel
    log_success "Vercel CLI installed"
fi

# Deploy to Vercel
log_info "Deploying to Vercel..."
if [[ "$1" == "--production" ]]; then
    log_info "Deploying to production..."
    vercel --prod
    log_success "🎉 Deployed to production!"
else
    log_info "Deploying to preview..."
    vercel
    log_success "🎉 Deployed to preview!"
    log_info "Use --production flag to deploy to production"
fi

log_success "🚀 Deployment completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Test your deployment"
echo "2. Configure custom domain (if needed)"
echo "3. Set up analytics and monitoring"
echo ""
echo "🔗 Useful links:"
echo "   • Vercel Dashboard: https://vercel.com/dashboard"
echo "   • Project Analytics: https://vercel.com/analytics"
echo "   • Domain Settings: https://vercel.com/domains"
#\!/bin/bash

echo "🏗️ Deploying Complete Rigger Connect Ecosystem"

# Install dependencies if not installed
if \! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Install all dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build all applications
echo "🔨 Building all applications..."
pnpm build:all

echo "✅ Local build complete\!"
echo "📋 Next steps:"
echo "  1. Deploy API Gateway and microservices"  
echo "  2. Deploy web applications to VPS"
echo "  3. Configure routing and load balancing"
echo "  4. Connect marketing site to deployed apps"

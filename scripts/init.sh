
#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting initialization process..."

# Create logs directory
mkdir -p logs

# Create required directories if they don't exist
mkdir -p apps/frontend apps/backend

# Frontend initialization
echo "🔄 Initializing Frontend..."
cd apps/frontend || {
    echo "❌ Failed to enter frontend directory"
    exit 1
}

if [ -f "package.json" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install 2>&1 | tee ../../logs/frontend-install.log || {
        echo "❌ Frontend installation failed"
        exit 1
    }
    
    echo "🔍 Running frontend lint check..."
    npm run lint 2>&1 | tee ../../logs/frontend-lint.log || true
else
    echo "❌ Frontend package.json not found"
    exit 1
fi

cd ../.. || exit 1

# Backend initialization
echo "🔄 Initializing Backend..."
cd apps/backend || {
    echo "❌ Failed to enter backend directory"
    exit 1
}

if [ -f "package.json" ]; then
    echo "📦 Installing backend dependencies..."
    npm install 2>&1 | tee ../../logs/backend-install.log || {
        echo "❌ Backend installation failed"
        exit 1
    }
    
    echo "🔍 Running backend lint check..."
    npm run lint 2>&1 | tee ../../logs/backend-lint.log || true
else
    echo "❌ Backend package.json not found"
    exit 1
fi

cd ../.. || exit 1

# Create secrets template if it doesn't exist
echo "🔑 Setting up secrets management..."
if [ ! -f "~/.secrets/HomerConnect/secrets.json" ]; then
    bash scripts/load_secrets.sh
fi

# Final health check
if [ -d "apps/frontend/node_modules" ] && [ -d "apps/backend/node_modules" ]; then
    echo "✅ Project initialized successfully!"
    echo "💡 Use the following commands to start development:"
    echo "   - npm run dev          - Start both frontend and backend"
    echo "   - npm run supabase:start - Start Supabase local development"
    echo "   - npm run load-secrets - Manually refresh environment variables"
else
    echo "❌ Project initialization incomplete"
    exit 1
fi

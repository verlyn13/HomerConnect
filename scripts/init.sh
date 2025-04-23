
#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting initialization process..."

# Setup directories
echo "📁 Creating directory structure..."
mkdir -p apps/frontend/src apps/backend/src || { echo "❌ ERROR: Failed to create directory structure"; exit 1; }

# Frontend setup
echo "⚛️ Setting up frontend..."
if ! cd apps/frontend; then
    echo "❌ ERROR: Failed to enter frontend directory - directory may not exist"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json not found in frontend directory ($(pwd))"
    echo "💡 TIP: Ensure package.json exists in apps/frontend/"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
if ! npm install; then
    echo "❌ ERROR: Frontend npm install failed"
    echo "💡 TIP: Check package.json for invalid dependencies"
    exit 1
fi

if ! cd ../..; then
    echo "❌ ERROR: Failed to return to root directory"
    exit 1
fi

# Backend setup
echo "🔧 Setting up backend..."
if ! cd apps/backend; then
    echo "❌ ERROR: Failed to enter backend directory - directory may not exist"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json not found in backend directory ($(pwd))"
    echo "💡 TIP: Ensure package.json exists in apps/backend/"
    exit 1
fi

echo "📦 Installing backend dependencies..."
if ! npm install; then
    echo "❌ ERROR: Backend npm install failed"
    echo "💡 TIP: Check package.json for invalid dependencies"
    exit 1
fi

if ! cd ../..; then
    echo "❌ ERROR: Failed to return to root directory"
    exit 1
fi

echo "✅ Init Stage completed successfully!"

#!/bin/bash

# Base directory
BASE_DIR="/home/verlyn13/Projects/HomerConnect"

# Load secrets first
echo "Loading environment secrets..."
cd "$BASE_DIR"
bash scripts/load_secrets.sh

# Kill any running Next.js and NestJS processes
echo "Stopping any running servers..."
pkill -f "next" || echo "No Next.js servers found running"
pkill -f "nest" || echo "No NestJS servers found running"

# Start Supabase if not running
if ! pgrep -f "supabase" > /dev/null; then
  echo "Starting Supabase local development..."
  supabase start
fi

# Start backend in background
echo "Starting NestJS backend server..."
cd "$BASE_DIR/apps/backend"
npm run start:dev &
BACKEND_PID=$!

# Start frontend
echo "Starting Next.js frontend server on port 3005..."
cd "$BASE_DIR/apps/frontend"
PORT=3005 npm run dev

# When frontend exits, kill backend too
kill $BACKEND_PID

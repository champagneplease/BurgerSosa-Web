#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting application..."
node dist/main.js

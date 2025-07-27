#!/bin/bash

# Zwiggy Deployment Script
echo "🚀 Starting Zwiggy deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your actual values before proceeding."
    echo "   Especially update the STRIPE_SECRET_KEY and JWT_SECRET."
    read -p "Press Enter to continue once you've updated the .env file..."
fi

# Create uploads directory if it doesn't exist
mkdir -p backend/uploads

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start the application
echo "🔨 Building and starting the application..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Show access information
echo ""
echo "✅ Deployment completed!"
echo ""
echo "🌐 Your Zwiggy application is now running at:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:4000"
echo "   Database: mongodb://localhost:27017"
echo ""
echo "📊 To view logs, run: docker-compose logs -f"
echo "🛑 To stop the application, run: docker-compose down"
echo "🔄 To restart the application, run: docker-compose restart"
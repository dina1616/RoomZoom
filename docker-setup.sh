#!/bin/bash

# Make the script exit on error
set -e

echo "🚀 Setting up RoomZoom development environment with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and Docker Compose first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "🐳 Starting Docker containers..."
docker-compose up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

echo "🔧 Running database migrations..."
docker-compose exec web npx prisma migrate dev --name init

echo "🌱 Seeding the database..."
docker-compose exec web npx prisma db seed

echo "✅ Setup complete! The application is running at http://localhost:3000"
echo "📊 PostgreSQL is available at localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "  - Start containers:    docker-compose up -d"
echo "  - Stop containers:     docker-compose down"
echo "  - View logs:           docker-compose logs -f"
echo "  - Access database:     docker-compose exec postgres psql -U postgres -d roomzoom"
echo "  - Run Prisma Studio:   docker-compose exec web npx prisma studio" 
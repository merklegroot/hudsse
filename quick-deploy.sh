#!/bin/bash

# Quick Docker Deployment Script
# Simple script for quick rebuild and deploy

set -e

echo "🚀 Quick Deploy - Hudsse App"
echo "================================"

# Clean up existing containers
echo "🧹 Cleaning up..."
docker compose down 2>/dev/null || true

# Build and start
echo "🔨 Building and starting container..."
docker compose up --build -d

# Check status
echo "📊 Container status:"
docker ps --filter "name=hudsse-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Application available at: http://localhost:3005"
echo ""
echo "📝 Useful commands:"
echo "   View logs:    docker logs -f hudsse-app"
echo "   Stop app:     docker compose down"
echo "   Restart:      ./quick-deploy.sh"

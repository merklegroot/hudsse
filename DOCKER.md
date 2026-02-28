# Docker Setup

This project can be run in Docker containers for both development and production environments.

## Quick Start

### Using Deployment Scripts (Recommended)
```bash
# Quick deployment (production mode)
./quick-deploy.sh

# Full deployment script with options
./deploy.sh                    # Production mode
./deploy.sh dev                # Development mode
./deploy.sh --status           # Check status
./deploy.sh --logs             # View logs
./deploy.sh --restart          # Restart container
```

### Manual Docker Compose
```bash
# Production Build
docker compose up --build

# Or run in detached mode
docker compose up -d --build

# Development Mode
docker compose -f docker-compose.dev.yml up --build
```

## Available Commands

### Production
- `docker-compose up` - Start the production container
- `docker-compose up --build` - Rebuild and start the container
- `docker-compose down` - Stop and remove the container
- `docker-compose logs` - View container logs
- `docker-compose logs -f` - Follow container logs

### Development
- `docker-compose -f docker-compose.dev.yml up` - Start the development container
- `docker-compose -f docker-compose.dev.yml up --build` - Rebuild and start the development container
- `docker-compose -f docker-compose.dev.yml down` - Stop and remove the development container
- `docker-compose -f docker-compose.dev.yml logs` - View development container logs

## Manual Docker Commands

### Build the image
```bash
# Production
docker build -t hudsse-app .

# Development
docker build -f Dockerfile.dev -t hudsse-app-dev .
```

### Run the container
```bash
# Production
docker run -p 3000:3000 hudsse-app

# Development
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules hudsse-app-dev
```

## Accessing the Application

Once the container is running, you can access the application at:
- http://localhost:3005

## Troubleshooting

### Port Already in Use
If port 3005 is already in use, you can change the port mapping in the docker-compose.yml file:
```yaml
ports:
  - "3006:3000"  # Maps host port 3006 to container port 3000
```

### Container Won't Start
1. Check the logs: `docker-compose logs`
2. Ensure no other service is using port 3000
3. Try rebuilding: `docker-compose up --build --force-recreate`

### Development Hot Reload Not Working
1. Ensure you're using the development docker-compose file
2. Check that volumes are properly mounted
3. Verify the Dockerfile.dev is being used


#!/bin/bash

# Docker Deployment Script for Hudsse App
# This script rebuilds and deploys the Docker container

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="hudsse-app"
CONTAINER_NAME="hudsse-app"
NETWORK_NAME="hudsse_hudsse-network"
HOST_PORT="3005"
CONTAINER_PORT="3002"
COMPOSE_FILE="docker-compose.yml"
DEV_COMPOSE_FILE="docker-compose.dev.yml"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to stop and remove existing containers
cleanup() {
    print_status "Cleaning up existing containers and networks..."
    
    # Stop and remove containers
    if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        print_status "Stopping container: ${CONTAINER_NAME}"
        docker stop ${CONTAINER_NAME} > /dev/null 2>&1 || true
        docker rm ${CONTAINER_NAME} > /dev/null 2>&1 || true
    fi
    
    # Remove network if it exists
    if docker network ls --format "table {{.Name}}" | grep -q "^${NETWORK_NAME}$"; then
        print_status "Removing network: ${NETWORK_NAME}"
        docker network rm ${NETWORK_NAME} > /dev/null 2>&1 || true
    fi
    
    print_success "Cleanup completed"
}

# Function to build and deploy
deploy() {
    local mode=${1:-"production"}
    local compose_file=$COMPOSE_FILE
    
    if [ "$mode" = "dev" ]; then
        compose_file=$DEV_COMPOSE_FILE
        print_status "Deploying in DEVELOPMENT mode"
    else
        print_status "Deploying in PRODUCTION mode"
    fi
    
    print_status "Building and starting container with ${compose_file}..."
    
    # Build and start the container
    docker compose -f ${compose_file} up --build -d
    
    if [ $? -eq 0 ]; then
        print_success "Container built and started successfully!"
        print_status "Application is available at: http://localhost:${HOST_PORT}"
    else
        print_error "Failed to build or start container"
        exit 1
    fi
}

# Function to show container status
show_status() {
    print_status "Container Status:"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    print_status "Container Logs (last 20 lines):"
    docker logs --tail 20 ${CONTAINER_NAME} 2>/dev/null || print_warning "No logs available"
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTIONS] [MODE]"
    echo ""
    echo "OPTIONS:"
    echo "  -h, --help     Show this help message"
    echo "  -s, --status   Show container status and logs"
    echo "  -c, --clean    Clean up containers and networks only"
    echo "  -l, --logs     Show container logs"
    echo "  -r, --restart  Restart the container"
    echo ""
    echo "MODE:"
    echo "  production     Deploy in production mode (default)"
    echo "  dev           Deploy in development mode"
    echo ""
    echo "Examples:"
    echo "  $0                    # Deploy in production mode"
    echo "  $0 dev               # Deploy in development mode"
    echo "  $0 --status          # Show container status"
    echo "  $0 --clean           # Clean up containers"
    echo "  $0 --restart dev     # Restart in development mode"
}

# Function to show logs
show_logs() {
    print_status "Showing container logs (press Ctrl+C to exit):"
    docker logs -f ${CONTAINER_NAME}
}

# Function to restart container
restart() {
    local mode=${1:-"production"}
    print_status "Restarting container in ${mode} mode..."
    cleanup
    deploy $mode
}

# Main script logic
main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -s|--status)
                show_status
                exit 0
                ;;
            -c|--clean)
                cleanup
                exit 0
                ;;
            -l|--logs)
                show_logs
                exit 0
                ;;
            -r|--restart)
                restart $2
                exit 0
                ;;
            production|dev)
                MODE=$1
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Set default mode if not specified
    MODE=${MODE:-"production"}
    
    # Check prerequisites
    check_docker
    
    # Clean up and deploy
    cleanup
    deploy $MODE
    
    # Show status
    echo ""
    show_status
    
    print_success "Deployment completed! Visit http://localhost:${HOST_PORT} to access the application."
}

# Run main function with all arguments
main "$@"

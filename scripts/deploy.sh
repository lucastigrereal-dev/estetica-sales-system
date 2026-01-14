#!/bin/bash

###############################################################################
# CRM Tigre - Production Deployment Script
# Description: Automated deployment with zero-downtime
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$PROJECT_DIR/backups"
LOG_FILE="$PROJECT_DIR/logs/deploy-$(date +%Y%m%d-%H%M%S).log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Pre-flight checks
preflight_checks() {
    log "Running pre-flight checks..."

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi

    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi

    # Check if .env file exists
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        error ".env file not found. Please create it from .env.example"
    fi

    # Check if .env.production exists
    if [ ! -f "$PROJECT_DIR/backend/.env.production" ]; then
        error "backend/.env.production file not found."
    fi

    log "Pre-flight checks passed ✓"
}

# Backup database
backup_database() {
    log "Creating database backup..."

    mkdir -p "$BACKUP_DIR"

    BACKUP_FILE="$BACKUP_DIR/db-backup-$(date +%Y%m%d-%H%M%S).sql"

    docker-compose exec -T postgres pg_dump -U crm_user crm_tigre > "$BACKUP_FILE" 2>> "$LOG_FILE"

    if [ $? -eq 0 ]; then
        log "Database backed up to: $BACKUP_FILE ✓"
        # Compress backup
        gzip "$BACKUP_FILE"
        log "Backup compressed: ${BACKUP_FILE}.gz ✓"
    else
        warning "Database backup failed (might be first deployment)"
    fi
}

# Pull latest code
pull_code() {
    log "Pulling latest code..."

    cd "$PROJECT_DIR"

    if [ -d ".git" ]; then
        git pull origin main || git pull origin master
        log "Code updated ✓"
    else
        warning "Not a git repository. Skipping code pull."
    fi
}

# Build Docker images
build_images() {
    log "Building Docker images..."

    cd "$PROJECT_DIR"

    docker-compose build --no-cache backend frontend

    if [ $? -eq 0 ]; then
        log "Docker images built successfully ✓"
    else
        error "Failed to build Docker images"
    fi
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."

    # Wait for database to be ready
    sleep 5

    docker-compose exec -T backend python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"

    if [ $? -eq 0 ]; then
        log "Database migrations completed ✓"
    else
        error "Database migrations failed"
    fi
}

# Deploy with zero downtime
deploy() {
    log "Starting deployment..."

    cd "$PROJECT_DIR"

    # Start new containers
    docker-compose up -d --remove-orphans

    if [ $? -eq 0 ]; then
        log "Containers started successfully ✓"
    else
        error "Failed to start containers"
    fi

    # Wait for health checks
    log "Waiting for health checks..."
    sleep 10

    # Check backend health
    for i in {1..30}; do
        if curl -f http://localhost:8000/health &> /dev/null; then
            log "Backend is healthy ✓"
            break
        fi

        if [ $i -eq 30 ]; then
            error "Backend health check failed after 30 attempts"
        fi

        sleep 2
    done

    # Check frontend health
    if curl -f http://localhost:80 &> /dev/null; then
        log "Frontend is healthy ✓"
    else
        warning "Frontend health check failed"
    fi
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."

    docker image prune -f

    log "Cleanup completed ✓"
}

# Show deployment info
show_info() {
    log "========================================="
    log "Deployment completed successfully! 🚀"
    log "========================================="
    log ""
    log "Services:"
    log "  Frontend: http://localhost:80"
    log "  Backend API: http://localhost:8000"
    log "  API Docs: http://localhost:8000/docs"
    log "  n8n: http://localhost:5678"
    log "  PostgreSQL: localhost:5432"
    log "  Redis: localhost:6379"
    log ""
    log "Logs:"
    log "  Backend: docker-compose logs -f backend"
    log "  Frontend: docker-compose logs -f frontend"
    log "  All: docker-compose logs -f"
    log ""
    log "Management:"
    log "  Stop: docker-compose stop"
    log "  Restart: docker-compose restart"
    log "  Status: docker-compose ps"
    log "========================================="
}

# Main execution
main() {
    log "========================================="
    log "CRM Tigre - Production Deployment"
    log "========================================="

    cd "$PROJECT_DIR"

    preflight_checks
    backup_database
    pull_code
    build_images
    deploy
    run_migrations
    cleanup
    show_info

    log "Deployment process completed successfully! ✓"
}

# Run main function
main "$@"

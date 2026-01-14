#!/bin/bash

###############################################################################
# CRM Tigre - Restore Script
# Description: Restore database, Redis, and uploaded files from backup
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
LOG_FILE="$PROJECT_DIR/logs/restore-$(date +%Y%m%d-%H%M%S).log"

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

# List available backups
list_backups() {
    log "Available backups:"
    log "========================================="

    if [ ! -d "$BACKUP_DIR" ]; then
        error "Backup directory not found: $BACKUP_DIR"
    fi

    cd "$BACKUP_DIR"

    # List full backups
    echo ""
    echo "Full Backups:"
    ls -lh full-backup-*.tar.gz 2>/dev/null | awk '{print $9, "("$5")"}'

    # List individual backups
    echo ""
    echo "Database Backups:"
    ls -lh postgres-*.sql.gz 2>/dev/null | awk '{print $9, "("$5")"}'

    echo ""
    echo "Redis Backups:"
    ls -lh redis-*.rdb.gz 2>/dev/null | awk '{print $9, "("$5")"}'

    echo ""
    echo "Uploads Backups:"
    ls -lh uploads-*.tar.gz 2>/dev/null | awk '{print $9, "("$5")"}'

    log "========================================="
}

# Confirm restore operation
confirm_restore() {
    echo ""
    read -p "⚠️  WARNING: This will OVERWRITE current data. Continue? (yes/no): " confirmation

    if [ "$confirmation" != "yes" ]; then
        log "Restore cancelled by user"
        exit 0
    fi
}

# Restore PostgreSQL database
restore_postgres() {
    local BACKUP_FILE=$1

    log "Restoring PostgreSQL database from: $BACKUP_FILE"

    # Decompress if needed
    if [[ $BACKUP_FILE == *.gz ]]; then
        gunzip -k "$BACKUP_FILE"
        BACKUP_FILE="${BACKUP_FILE%.gz}"
    fi

    # Stop backend to prevent connections
    docker-compose stop backend

    # Drop and recreate database
    docker-compose exec -T postgres psql -U crm_user -d postgres -c "DROP DATABASE IF EXISTS crm_tigre;" 2>> "$LOG_FILE"
    docker-compose exec -T postgres psql -U crm_user -d postgres -c "CREATE DATABASE crm_tigre;" 2>> "$LOG_FILE"

    # Restore from backup
    cat "$BACKUP_FILE" | docker-compose exec -T postgres psql -U crm_user -d crm_tigre 2>> "$LOG_FILE"

    if [ $? -eq 0 ]; then
        log "PostgreSQL database restored successfully ✓"
    else
        error "PostgreSQL restore failed"
    fi

    # Start backend again
    docker-compose start backend
}

# Restore Redis data
restore_redis() {
    local BACKUP_FILE=$1

    log "Restoring Redis data from: $BACKUP_FILE"

    # Decompress if needed
    if [[ $BACKUP_FILE == *.gz ]]; then
        gunzip -k "$BACKUP_FILE"
        BACKUP_FILE="${BACKUP_FILE%.gz}"
    fi

    # Stop Redis
    docker-compose stop redis

    # Copy backup to Redis container
    docker cp "$BACKUP_FILE" crm_tigre_redis:/data/dump.rdb

    # Start Redis
    docker-compose start redis

    sleep 2

    log "Redis data restored successfully ✓"
}

# Restore uploaded files
restore_uploads() {
    local BACKUP_FILE=$1

    log "Restoring uploaded files from: $BACKUP_FILE"

    # Create backup of current uploads
    if [ -d "$PROJECT_DIR/backend/uploads" ]; then
        mv "$PROJECT_DIR/backend/uploads" "$PROJECT_DIR/backend/uploads.old.$(date +%Y%m%d-%H%M%S)"
        log "Current uploads backed up"
    fi

    # Extract backup
    tar -xzf "$BACKUP_FILE" -C "$PROJECT_DIR/backend" 2>> "$LOG_FILE"

    if [ $? -eq 0 ]; then
        log "Uploaded files restored successfully ✓"
    else
        error "Uploads restore failed"
    fi
}

# Restore certificates
restore_certs() {
    local BACKUP_FILE=$1

    log "Restoring certificates from: $BACKUP_FILE"

    # Create backup of current certs
    if [ -d "$PROJECT_DIR/backend/certs" ]; then
        mv "$PROJECT_DIR/backend/certs" "$PROJECT_DIR/backend/certs.old.$(date +%Y%m%d-%H%M%S)"
        log "Current certificates backed up"
    fi

    # Extract backup
    tar -xzf "$BACKUP_FILE" -C "$PROJECT_DIR/backend" 2>> "$LOG_FILE"

    if [ $? -eq 0 ]; then
        log "Certificates restored successfully ✓"
    else
        error "Certificates restore failed"
    fi
}

# Restore from full backup
restore_full_backup() {
    local FULL_BACKUP=$1

    log "Restoring from full backup: $FULL_BACKUP"

    # Create temp directory
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT

    # Extract full backup
    tar -xzf "$FULL_BACKUP" -C "$TEMP_DIR" 2>> "$LOG_FILE"

    # Restore each component
    restore_postgres "$TEMP_DIR/postgres-*.sql.gz"
    restore_redis "$TEMP_DIR/redis-*.rdb.gz"
    restore_uploads "$TEMP_DIR/uploads-*.tar.gz"
    restore_certs "$TEMP_DIR/certs-*.tar.gz"

    log "Full backup restored successfully ✓"
}

# Restore specific backup
restore_specific() {
    local BACKUP_TYPE=$1
    local BACKUP_FILE=$2

    if [ ! -f "$BACKUP_FILE" ]; then
        error "Backup file not found: $BACKUP_FILE"
    fi

    case $BACKUP_TYPE in
        postgres)
            restore_postgres "$BACKUP_FILE"
            ;;
        redis)
            restore_redis "$BACKUP_FILE"
            ;;
        uploads)
            restore_uploads "$BACKUP_FILE"
            ;;
        certs)
            restore_certs "$BACKUP_FILE"
            ;;
        full)
            restore_full_backup "$BACKUP_FILE"
            ;;
        *)
            error "Invalid backup type: $BACKUP_TYPE"
            ;;
    esac
}

# Main execution
main() {
    log "========================================="
    log "CRM Tigre - Restore Process"
    log "========================================="

    cd "$PROJECT_DIR"

    # Check if Docker is running
    if ! docker-compose ps | grep -q "Up"; then
        error "Docker containers are not running. Start them with: docker-compose up -d"
    fi

    # If no arguments, list backups
    if [ $# -eq 0 ]; then
        list_backups
        echo ""
        echo "Usage:"
        echo "  ./restore.sh full <backup_file>      - Restore full backup"
        echo "  ./restore.sh postgres <backup_file>  - Restore only database"
        echo "  ./restore.sh redis <backup_file>     - Restore only Redis"
        echo "  ./restore.sh uploads <backup_file>   - Restore only uploads"
        echo "  ./restore.sh certs <backup_file>     - Restore only certificates"
        exit 0
    fi

    local BACKUP_TYPE=$1
    local BACKUP_FILE=$2

    if [ -z "$BACKUP_FILE" ]; then
        error "Backup file not specified"
    fi

    # Convert to absolute path if relative
    if [[ ! "$BACKUP_FILE" = /* ]]; then
        BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
    fi

    confirm_restore
    restore_specific "$BACKUP_TYPE" "$BACKUP_FILE"

    log "========================================="
    log "Restore completed successfully! ✓"
    log "========================================="
    log ""
    log "Next steps:"
    log "  1. Restart all containers: docker-compose restart"
    log "  2. Verify application: http://localhost:80"
    log "  3. Check logs: docker-compose logs -f"
}

# Run main function
main "$@"

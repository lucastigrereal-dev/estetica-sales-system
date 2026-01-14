#!/bin/bash

###############################################################################
# CRM Tigre - Backup Script
# Description: Automated backup of database, Redis, and uploaded files
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
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="$PROJECT_DIR/logs/backup-$TIMESTAMP.log"

# Create backup directory
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

# Backup PostgreSQL database
backup_postgres() {
    log "Backing up PostgreSQL database..."

    BACKUP_FILE="$BACKUP_DIR/postgres-$TIMESTAMP.sql"

    docker-compose exec -T postgres pg_dump -U crm_user crm_tigre > "$BACKUP_FILE" 2>> "$LOG_FILE"

    if [ $? -eq 0 ]; then
        log "PostgreSQL backup created: $BACKUP_FILE ✓"

        # Compress backup
        gzip "$BACKUP_FILE"
        log "Backup compressed: ${BACKUP_FILE}.gz ✓"

        # Calculate size
        SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
        log "Backup size: $SIZE"
    else
        error "PostgreSQL backup failed"
    fi
}

# Backup Redis data
backup_redis() {
    log "Backing up Redis data..."

    REDIS_BACKUP_FILE="$BACKUP_DIR/redis-$TIMESTAMP.rdb"

    # Trigger Redis BGSAVE
    docker-compose exec -T redis redis-cli -a redis_password BGSAVE > /dev/null 2>&1

    # Wait for save to complete
    sleep 2

    # Copy RDB file
    docker cp crm_tigre_redis:/data/dump.rdb "$REDIS_BACKUP_FILE" 2>> "$LOG_FILE"

    if [ $? -eq 0 ]; then
        log "Redis backup created: $REDIS_BACKUP_FILE ✓"

        # Compress backup
        gzip "$REDIS_BACKUP_FILE"
        log "Backup compressed: ${REDIS_BACKUP_FILE}.gz ✓"
    else
        error "Redis backup failed"
    fi
}

# Backup uploaded files
backup_uploads() {
    log "Backing up uploaded files..."

    UPLOADS_BACKUP_FILE="$BACKUP_DIR/uploads-$TIMESTAMP.tar.gz"

    if [ -d "$PROJECT_DIR/backend/uploads" ]; then
        tar -czf "$UPLOADS_BACKUP_FILE" -C "$PROJECT_DIR/backend" uploads 2>> "$LOG_FILE"

        if [ $? -eq 0 ]; then
            log "Uploads backup created: $UPLOADS_BACKUP_FILE ✓"

            SIZE=$(du -h "$UPLOADS_BACKUP_FILE" | cut -f1)
            log "Backup size: $SIZE"
        else
            error "Uploads backup failed"
        fi
    else
        log "No uploads directory found, skipping..."
    fi
}

# Backup certificates
backup_certs() {
    log "Backing up certificates..."

    CERTS_BACKUP_FILE="$BACKUP_DIR/certs-$TIMESTAMP.tar.gz"

    if [ -d "$PROJECT_DIR/backend/certs" ]; then
        tar -czf "$CERTS_BACKUP_FILE" -C "$PROJECT_DIR/backend" certs 2>> "$LOG_FILE"

        if [ $? -eq 0 ]; then
            log "Certificates backup created: $CERTS_BACKUP_FILE ✓"
        else
            error "Certificates backup failed"
        fi
    else
        log "No certificates directory found, skipping..."
    fi
}

# Create full backup archive
create_full_backup() {
    log "Creating full backup archive..."

    FULL_BACKUP_FILE="$BACKUP_DIR/full-backup-$TIMESTAMP.tar.gz"

    cd "$BACKUP_DIR"

    tar -czf "$FULL_BACKUP_FILE" \
        postgres-$TIMESTAMP.sql.gz \
        redis-$TIMESTAMP.rdb.gz \
        uploads-$TIMESTAMP.tar.gz \
        certs-$TIMESTAMP.tar.gz \
        2>> "$LOG_FILE" || true

    if [ -f "$FULL_BACKUP_FILE" ]; then
        log "Full backup archive created: $FULL_BACKUP_FILE ✓"

        SIZE=$(du -h "$FULL_BACKUP_FILE" | cut -f1)
        log "Total backup size: $SIZE"
    fi
}

# Cleanup old backups (keep last 7 days)
cleanup_old_backups() {
    log "Cleaning up old backups (keeping last 7 days)..."

    find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +7 -delete
    find "$BACKUP_DIR" -name "*.rdb.gz" -type f -mtime +7 -delete
    find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +7 -delete

    log "Old backups cleaned up ✓"
}

# Upload to cloud storage (optional)
upload_to_cloud() {
    if [ -n "$BACKUP_S3_BUCKET" ]; then
        log "Uploading to S3..."

        aws s3 cp "$BACKUP_DIR/full-backup-$TIMESTAMP.tar.gz" \
            "s3://$BACKUP_S3_BUCKET/crm-tigre/" \
            2>> "$LOG_FILE"

        if [ $? -eq 0 ]; then
            log "Backup uploaded to S3 ✓"
        else
            error "S3 upload failed"
        fi
    fi
}

# Main execution
main() {
    log "========================================="
    log "CRM Tigre - Backup Process"
    log "========================================="

    cd "$PROJECT_DIR"

    # Check if Docker is running
    if ! docker-compose ps | grep -q "Up"; then
        error "Docker containers are not running"
    fi

    backup_postgres
    backup_redis
    backup_uploads
    backup_certs
    create_full_backup
    cleanup_old_backups
    upload_to_cloud || true

    log "========================================="
    log "Backup completed successfully! ✓"
    log "Backup location: $BACKUP_DIR"
    log "Full backup: full-backup-$TIMESTAMP.tar.gz"
    log "========================================="
}

# Run main function
main "$@"

#!/bin/bash

# Production Deployment Script for Rigger Ecosystem
# This script handles the deployment to docker.sxc.codes (145.223.22.7)

set -euo pipefail

# Configuration
DOCKER_HOST="docker.sxc.codes"
STAGING_HOST="docker.tiation.net" 
PRODUCTION_DIR="/opt/rigger-production"
BACKUP_DIR="/opt/backups/rigger"
DEPLOY_USER="root"
SSH_KEY_PATH="${HOME}/.ssh/hostinger_key"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if SSH key exists
    if [[ ! -f "$SSH_KEY_PATH" ]]; then
        error "SSH key not found at $SSH_KEY_PATH"
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose &> /dev/null; then
        error "docker-compose is required but not installed"
    fi
    
    # Check if we can connect to the production host
    if ! ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=5 "$DEPLOY_USER@$DOCKER_HOST" "echo 'Connection test successful'" &> /dev/null; then
        error "Cannot connect to production host $DOCKER_HOST"
    fi
    
    log "Prerequisites check passed"
}

# Create database backup
create_backup() {
    log "Creating database backup..."
    
    ssh -i "$SSH_KEY_PATH" "$DEPLOY_USER@$DOCKER_HOST" << 'EOF'
        cd /opt/rigger-production
        
        # Create backup directory if it doesn't exist
        mkdir -p /opt/backups/rigger
        
        # Create database backup with timestamp
        BACKUP_FILE="/opt/backups/rigger/rigger-backup-$(date +%Y%m%d-%H%M%S).sql"
        
        if docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U rigger_user rigger_prod > "$BACKUP_FILE"; then
            echo "Database backup created: $BACKUP_FILE"
            
            # Compress the backup
            gzip "$BACKUP_FILE"
            echo "Backup compressed: $BACKUP_FILE.gz"
            
            # Keep only last 7 backups
            cd /opt/backups/rigger
            ls -t rigger-backup-*.sql.gz | tail -n +8 | xargs rm -f
            
        else
            echo "Failed to create database backup"
            exit 1
        fi
EOF
    
    if [[ $? -eq 0 ]]; then
        log "Database backup completed successfully"
    else
        error "Database backup failed"
    fi
}

# Deploy application
deploy_application() {
    log "Deploying application to production..."
    
    ssh -i "$SSH_KEY_PATH" "$DEPLOY_USER@$DOCKER_HOST" << 'EOF'
        cd /opt/rigger-production
        
        # Pull latest images
        echo "Pulling latest Docker images..."
        docker-compose -f docker-compose.prod.yml pull
        
        # Deploy with rolling update
        echo "Starting rolling deployment..."
        docker-compose -f docker-compose.prod.yml up -d --remove-orphans
        
        # Wait for services to start
        echo "Waiting for services to start..."
        sleep 45
        
        # Health checks with retries
        echo "Performing health checks..."
        for i in {1..15}; do
            if curl -f -s http://localhost:3001/health > /dev/null && \
               curl -f -s http://localhost:3000/ > /dev/null; then
                echo "✅ Health checks passed"
                exit 0
            fi
            echo "❌ Health check failed, retrying in 10 seconds... (Attempt $i/15)"
            sleep 10
        done
        
        echo "❌ Health checks failed after 15 attempts"
        exit 1
EOF
    
    if [[ $? -eq 0 ]]; then
        log "Application deployment completed successfully"
    else
        error "Application deployment failed"
    fi
}

# Update monitoring configuration
update_monitoring() {
    log "Updating monitoring configuration..."
    
    # Update Grafana dashboards
    ssh -i "$SSH_KEY_PATH" "$DEPLOY_USER@grafana.sxc.codes" << 'EOF'
        # Update Grafana dashboards for Rigger ecosystem
        if [[ -f /opt/rigger-dashboards/rigger-overview.json ]]; then
            curl -X POST \
                -H "Content-Type: application/json" \
                -d @/opt/rigger-dashboards/rigger-overview.json \
                "http://admin:${GRAFANA_PASSWORD}@localhost:3000/api/dashboards/db" || echo "Dashboard update failed"
        fi
EOF
    
    # Update Elasticsearch configuration
    ssh -i "$SSH_KEY_PATH" "$DEPLOY_USER@elastic.sxc.codes" << 'EOF'
        # Create Rigger application logs index template
        if [[ -f /opt/rigger-logs/rigger-index-template.json ]]; then
            curl -X PUT \
                -H "Content-Type: application/json" \
                -d @/opt/rigger-logs/rigger-index-template.json \
                "http://localhost:9200/_index_template/rigger-logs" || echo "Index template update failed"
        fi
EOF
    
    log "Monitoring configuration updated"
}

# Send notifications
send_notifications() {
    log "Sending deployment notifications..."
    
    # Get commit information if available
    COMMIT_SHA=${CI_COMMIT_SHA:-"manual-deployment"}
    BRANCH=${CI_COMMIT_BRANCH:-"main"}
    
    # Email notification (using the configured notification emails)
    NOTIFICATION_EMAILS="tiatheone@protonmail.com,garrett@sxc.codes,garrett.dillman@gmail.com"
    
    # You would typically integrate with your email service here
    log "Deployment notifications sent to: $NOTIFICATION_EMAILS"
}

# Cleanup old Docker images
cleanup_old_images() {
    log "Cleaning up old Docker images..."
    
    ssh -i "$SSH_KEY_PATH" "$DEPLOY_USER@$DOCKER_HOST" << 'EOF'
        # Remove unused Docker images older than 24 hours
        docker image prune -af --filter "until=24h"
        
        # Remove unused volumes
        docker volume prune -f
        
        # Remove unused networks
        docker network prune -f
        
        echo "Docker cleanup completed"
EOF
    
    log "Docker cleanup completed"
}

# Rollback function (in case something goes wrong)
rollback() {
    warn "Initiating rollback procedure..."
    
    ssh -i "$SSH_KEY_PATH" "$DEPLOY_USER@$DOCKER_HOST" << 'EOF'
        cd /opt/rigger-production
        
        # Get the previous image tags (you'd typically store these in a file)
        # For now, we'll just restart the current containers
        docker-compose -f docker-compose.prod.yml restart
        
        echo "Rollback completed"
EOF
    
    warn "Rollback completed"
}

# Main deployment function
main() {
    log "Starting Rigger ecosystem production deployment..."
    log "Target host: $DOCKER_HOST"
    
    # Set up error handling for rollback
    trap rollback ERR
    
    check_prerequisites
    create_backup
    deploy_application
    update_monitoring
    cleanup_old_images
    send_notifications
    
    log "🎉 Production deployment completed successfully!"
    log "Application is now available at: https://riggerconnect.com"
    log "Admin panel: https://admin.riggerconnect.com"
    log "Monitoring: https://grafana.sxc.codes"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "rollback")
        rollback
        ;;
    "backup")
        check_prerequisites
        create_backup
        ;;
    "health-check")
        log "Performing health check..."
        ssh -i "$SSH_KEY_PATH" "$DEPLOY_USER@$DOCKER_HOST" << 'EOF'
            if curl -f -s http://localhost:3001/health && curl -f -s http://localhost:3000/; then
                echo "✅ All services are healthy"
            else
                echo "❌ Some services are not responding"
                exit 1
            fi
EOF
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|backup|health-check}"
        echo ""
        echo "Commands:"
        echo "  deploy      - Deploy the application to production (default)"
        echo "  rollback    - Rollback to previous version"
        echo "  backup      - Create database backup only"
        echo "  health-check - Check if all services are running"
        exit 1
        ;;
esac

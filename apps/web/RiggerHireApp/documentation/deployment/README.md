# RiggerHireApp Deployment Guide

## Overview
This guide details the deployment process for RiggerHireApp microservices, including environment setup, configuration, and monitoring.

## Prerequisites
- Docker v20.10+
- Kubernetes v1.20+
- Node.js v18+
- PostgreSQL v14+
- Redis v6+
- Elasticsearch v7.14+

## Environment Setup

### 1. Infrastructure Requirements
```bash
# Minimum recommended resources per service
Authentication Service: 2 CPU, 4GB RAM
Document Service: 2 CPU, 4GB RAM
Notification Service: 2 CPU, 4GB RAM
Analytics Service: 4 CPU, 8GB RAM
```

### 2. Environment Variables
Create a `.env` file for each service:

```env
# Authentication Service
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:password@localhost:5432/riggerhire

# Document Service
WORKSAFE_API_KEY=your-api-key
WORKSAFE_API_ENDPOINT=https://api.commerce.wa.gov.au/worksafe/v1

# Notification Service
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token

# Analytics Service
ELASTICSEARCH_URL=http://localhost:9200
CLICKHOUSE_URL=http://localhost:8123
```

## Deployment Steps

### 1. Database Setup
```bash
# Initialize PostgreSQL
psql -U postgres -f ./scripts/init-db.sql

# Run migrations
npm run migrate
```

### 2. Docker Deployment
```bash
# Build services
docker-compose build

# Start services
docker-compose up -d
```

### 3. Kubernetes Deployment
```bash
# Apply configurations
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/config-maps.yaml
kubectl apply -f k8s/secrets.yaml

# Deploy services
kubectl apply -f k8s/services/
```

## Monitoring & Maintenance

### Health Checks
Each service exposes a health endpoint:
```
GET /health
Response: {"status": "healthy", "version": "1.0.0"}
```

### Logging
Logs are centralized using ELK stack:
- Elasticsearch: Store logs
- Logstash: Process logs
- Kibana: Visualize logs

### Backup Strategy
```bash
# Database backup
pg_dump -U postgres riggerhire > backup.sql

# Document storage backup
aws s3 sync /data/documents s3://backup-bucket/
```

## Scaling

### Horizontal Scaling
```bash
# Scale services
kubectl scale deployment auth-service --replicas=3
kubectl scale deployment doc-service --replicas=3
```

### Resource Limits
```yaml
resources:
  limits:
    cpu: "2"
    memory: "4Gi"
  requests:
    cpu: "1"
    memory: "2Gi"
```

## Troubleshooting

### Common Issues

1. Service Connection Issues
```bash
# Check service status
kubectl get pods
kubectl logs pod-name

# Check network connectivity
kubectl exec pod-name -- curl service-name:port
```

2. Database Issues
```bash
# Check database connectivity
pg_isready -h localhost -p 5432

# Check database logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

3. Cache Issues
```bash
# Clear Redis cache
redis-cli
> FLUSHALL

# Check Redis info
redis-cli INFO
```

## Security Considerations

### 1. Network Security
- Enable network policies
- Use TLS for all communications
- Implement rate limiting

### 2. Data Security
- Encrypt sensitive data at rest
- Regular security audits
- Access control monitoring

### 3. Compliance
- WorkSafe WA compliance checks
- Regular security updates
- Audit logging

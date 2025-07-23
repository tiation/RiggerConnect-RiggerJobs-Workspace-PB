# Multi-stage build for RiggerConnect Web App
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for B2B web app
COPY apps/web/RiggerHireApp/B2B-web/package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY apps/web/RiggerHireApp/B2B-web/ ./

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:1.25-alpine AS production

# Install security updates
RUN apk --no-cache upgrade

# Copy built application
COPY --from=builder /app/.next/standalone /usr/share/nginx/html
COPY --from=builder /app/.next/static /usr/share/nginx/html/_next/static
COPY --from=builder /app/public /usr/share/nginx/html/public

# Copy nginx configuration
COPY devops/nginx/rigger-connect.conf /etc/nginx/conf.d/default.conf

# Create non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -S rigger -u 1001 -G nginx

# Set proper permissions
RUN chown -R rigger:nginx /usr/share/nginx/html && \
    chown -R rigger:nginx /var/cache/nginx && \
    chown -R rigger:nginx /var/log/nginx && \
    chown -R rigger:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown rigger:nginx /var/run/nginx.pid

# Switch to non-root user
USER rigger

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

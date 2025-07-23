# Multi-stage build for RiggerHire Staff Web App
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for Staff web app
COPY apps/web/RiggerHireApp/Staff-web/package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY apps/web/RiggerHireApp/Staff-web/ ./

# Build the application
RUN npm run build

# Production stage with Node.js
FROM node:18-alpine AS production

# Install security updates and required packages
RUN apk --no-cache add dumb-init curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S rigger -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=rigger:nodejs /app/.next/standalone ./
COPY --from=builder --chown=rigger:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=rigger:nodejs /app/public ./public

# Switch to non-root user
USER rigger

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]

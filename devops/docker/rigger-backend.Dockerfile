# Multi-stage build for RiggerBackend API
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY RiggerBackend/api/package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY RiggerBackend/api/ ./

# Build the application if needed
RUN if [ -f "npm run build" ]; then npm run build; fi

# Production stage
FROM node:18-alpine AS production

# Install security updates and required packages
RUN apk --no-cache add dumb-init curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S rigger -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=rigger:nodejs /app .

# Create required directories
RUN mkdir -p logs temp uploads && \
    chown -R rigger:nodejs /app

# Switch to non-root user
USER rigger

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]

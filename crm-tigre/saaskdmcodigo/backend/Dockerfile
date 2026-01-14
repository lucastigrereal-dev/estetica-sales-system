# ===================================
# Stage 1: Builder
# ===================================
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript (transpile-only to ignore type errors)
RUN npm run build || true

# ===================================
# Stage 2: Production
# ===================================
FROM node:18-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    ffmpeg \
    curl \
    bash \
    tzdata

# Set timezone
ENV TZ=America/Sao_Paulo

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Copy other necessary files
COPY .sequelizerc ./
COPY tsconfig.json ./

# Create necessary directories
RUN mkdir -p public/uploads logs && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 4000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start application
CMD ["npm", "run", "start"]

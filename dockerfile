# Multi-stage build for optimized production image
FROM oven/bun:latest AS deps
WORKDIR /app

# Copy dependency files first for better caching
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
RUN bun pm trust --all

COPY . .

# Set environment for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN bun run build

# Production stage - use slim image for smaller size
FROM oven/bun:slim AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install curl for health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd --gid 1001 nodejs
RUN useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nextjs

# Copy built application and dependencies
COPY --from=deps --chown=nextjs:nodejs /app/.next ./.next
COPY --from=deps --chown=nextjs:nodejs /app/public ./public
COPY --from=deps --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=deps --chown=nextjs:nodejs /app/src ./src
COPY --from=deps --chown=nextjs:nodejs /app/.env.local .env.local

# Copy production dependencies only
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["bun", "run", "start"]
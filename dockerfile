# Multi-stage build for optimized production image
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency files and install all dependencies (including dev dependencies for build)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY ./src /app/src
COPY ./public /app/public
COPY .env /app/.env
COPY .eslintrc.json /app/.eslintrc.json
COPY ./tailwind.config.ts /app/tailwind.config.ts
COPY ./postcss.config.mjs /app/postcss.config.mjs
COPY ./tsconfig.json /app/tsconfig.json
COPY ./next.config.mjs /app/next.config.mjs

# Set environment for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Install only production dependencies for the final image
RUN npm prune --omit=dev --legacy-peer-deps

# Production stage - use slim image for smaller size
FROM node:22-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install curl for health check
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application and dependencies from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy other necessary files
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/.env .env

USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
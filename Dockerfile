FROM node:20-slim AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=google_client_id \
    --mount=type=secret,id=google_client_secret \
    --mount=type=secret,id=nextauth_secret \
    --mount=type=secret,id=nextauth_url \
    GOOGLE_CLIENT_ID="$(cat /run/secrets/google_client_id)" \
    GOOGLE_CLIENT_SECRET="$(cat /run/secrets/google_client_secret)" \
    NEXTAUTH_SECRET="$(cat /run/secrets/nextauth_secret)" \
    NEXTAUTH_URL="$(cat /run/secrets/nextauth_url)" \
    npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
CMD ["npm", "start"]

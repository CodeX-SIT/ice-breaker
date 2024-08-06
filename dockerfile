# FROM oven/bun:1.1.21-alpine AS base

# WORKDIR /ice-breaker

# # COPY . /ice-breaker
# COPY . .

# RUN apk add mysql mysql-client

# RUN bun run build
# EXPOSE 3000/tcp
# ENTRYPOINT [ "bun", "run", "start" ]

FROM node:20

WORKDIR /ice-breaker

COPY package*.json ./
# RUN npm install
RUN npm install --legacy-peer-deps
COPY . .

# Build the application
# ARG GOOGLE_CLIENT_ID
# ARG GOOGLE_CLIENT_SECRET
# ARG NEXTAUTH_SECRET
# ARG AUTH_TRUST_HOST
# ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
# ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
# ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
# ENV AUTH_TRUST_HOST=${AUTH_TRUST_HOST}

# RUN npm install --force
RUN npm run build

EXPOSE 3000/tcp
#npm run start:dev
CMD ["npm", "run", "start"]
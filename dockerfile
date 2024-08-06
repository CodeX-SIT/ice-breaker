FROM oven/bun:1.1.21-alpine AS base

WORKDIR /ice-breaker

COPY . /ice-breaker

RUN apk add mysql mysql-client

RUN bun run build
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
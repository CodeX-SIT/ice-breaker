FROM oven/bun:latest AS base

COPY . .
RUN bun install \
    && bun run build

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
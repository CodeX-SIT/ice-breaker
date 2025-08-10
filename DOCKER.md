# Docker Setup for Ice Breaker

This directory contains the Docker configuration for the Ice Breaker application with Nginx reverse proxy.

## Architecture

- **ice-breaker**: Next.js application running on port 3000 (internal)
- **nginx**: Reverse proxy serving on port 80 (external)
- **Network**: Custom bridge network for service communication
- **Database**: SQLite database mounted as volume for persistence

## Quick Start

1. **Build and start services:**

   ```bash
   make build
   make up
   ```

2. **View logs:**

   ```bash
   make logs
   ```

3. **Stop services:**
   ```bash
   make down
   ```

## Available Commands

- `make build` - Build the Docker images
- `make up` - Start all services in detached mode
- `make down` - Stop all services
- `make logs` - View logs from all services
- `make logs-app` - View logs from ice-breaker service only
- `make logs-nginx` - View logs from nginx service only
- `make rebuild` - Full rebuild and restart
- `make clean` - Clean up containers and images
- `make status` - Check service status
- `make shell` - Execute shell in ice-breaker container
- `make nginx-test` - Test nginx configuration
- `make nginx-reload` - Reload nginx configuration

## Manual Docker Compose Commands

If you prefer using docker-compose directly:

```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild specific service
docker-compose build ice-breaker
```

## Configuration Files

- `docker-compose.yml` - Main orchestration file
- `nginx/nginx.conf` - Nginx reverse proxy configuration
- `.env.docker` - Environment variables
- `dockerfile` - Application container definition

## Database Persistence

The SQLite database is mounted as a volume:

- Host: `./database.sqlite`
- Container: `/app/database.sqlite`

This ensures data persists between container restarts.

## Health Checks

Both services include health checks:

- **ice-breaker**: Checks `/api/health` endpoint
- **nginx**: Checks internal health endpoint

## Security Features

The Nginx configuration includes:

- Rate limiting (10 requests/second per IP)
- Security headers (XSS protection, content type validation)
- Gzip compression
- Static file caching
- Request size limits

## Troubleshooting

1. **Port conflicts**: Ensure port 80 is not in use
2. **Database permissions**: Check that `database.sqlite` is writable
3. **Build failures**: Run `make clean` then `make rebuild`
4. **Nginx config errors**: Run `make nginx-test`

## Production Considerations

- Use environment-specific `.env` files
- Implement HTTPS with SSL certificates
- Set up proper logging and monitoring
- Consider using Docker Swarm or Kubernetes for scaling

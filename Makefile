.PHONY: build up down logs clean rebuild build-nginx push-nginx

# Load environment variables
include .env.docker

# Build the application
build:
	docker compose build
	
# Build nginx image only
build-nginx:
	cd nginx && docker build -t matricaldefunkt/codex:ice-breaker-nginx .

# Push nginx image
push-nginx:
	docker push matricaldefunkt/codex:ice-breaker-nginx

# Start the services
up:
	docker compose up -d

# Stop the services
down:
	docker compose down

# View logs
logs:
	docker compose logs -f

# View logs for specific service
logs-app:
	docker compose logs -f ice-breaker

logs-nginx:
	docker compose logs -f nginx

# Clean up containers and images
clean:
	docker compose down -v --remove-orphans
	docker system prune -f

# Rebuild and restart everything
rebuild: down build up

# Check service status
status:
	docker compose ps

# Execute shell in ice-breaker container
shell:
	docker compose exec ice-breaker sh

# View nginx configuration
nginx-config:
	docker compose exec nginx cat /etc/nginx/nginx.conf

# Test nginx configuration
nginx-test:
	docker compose exec nginx nginx -t

# Reload nginx configuration
nginx-reload:
	docker compose exec nginx nginx -s reload

# Database commands
db-shell:
	docker compose exec postgres psql -U postgres -d ice-breaker

# View database logs
logs-db:
	docker compose logs -f postgres

# Reset database (WARNING: This will delete all data!)
db-reset:
	docker compose down postgres
	sudo rm -rf ./postgres-data/*
	docker compose up -d postgres

# Backup database
db-backup:
	docker compose exec postgres pg_dump -U postgres ice-breaker > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Restore database from backup (usage: make db-restore BACKUP_FILE=backup_20250812_120000.sql)
db-restore:
	docker compose exec -T postgres psql -U postgres -d ice-breaker < $(BACKUP_FILE)

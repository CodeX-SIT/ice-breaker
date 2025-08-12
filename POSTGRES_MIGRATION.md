# PostgreSQL Migration Guide

This document outlines the migration from SQLite to PostgreSQL for the ice-breaker application.

## What Changed

1. **Docker Compose**: Added PostgreSQL service with bind mount
2. **Sequelize Configuration**: Updated to use PostgreSQL instead of SQLite
3. **Environment Variables**: Added database configuration
4. **Dependencies**: Added `pg` driver for PostgreSQL

## Database Configuration

The following environment variables are used:

- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name (ice-breaker)
- `DB_USER`: Database user (postgres)
- `DB_PASSWORD`: Database password

## Local Development

1. Update your `.env.local` file with the database configuration
2. Run `docker-compose up postgres` to start the PostgreSQL service
3. Run your application normally

## Production Deployment

The PostgreSQL service is configured to:

- Use persistent storage with bind mount at `./postgres-data`
- Automatically create the `ice-breaker` database
- Include health checks for proper dependency management

## Migration Steps

1. **Backup existing SQLite data** (if any):

   ```bash
   cp database/database.sqlite database/database.sqlite.backup
   ```

2. **Start PostgreSQL service**:

   ```bash
   docker-compose up -d postgres
   ```

3. **Run your application** to automatically create tables:
   ```bash
   npm run dev
   ```

## Important Notes

- The `postgres-data` directory is excluded from version control
- The password is generated securely and stored in environment variables
- The application will automatically create tables on first run with PostgreSQL
- SQLite data will need to be manually migrated if you have existing data

## Data Migration (if needed)

If you have existing SQLite data, you'll need to export it and import it into PostgreSQL. This can be done using database export/import tools or by writing a migration script.

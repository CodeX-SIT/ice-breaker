# Database Migration from Sequelize to Prisma

## Overview

This document outlines the migration plan from Sequelize to Prisma for the Ice Breaker application. The current setup uses SQLite with NextAuth.js custom Sequelize adapter.

## Current Database Schema Analysis

- **User**: NextAuth.js user model with custom `actualName` field
- **GameCode**: Game session management with expiry and state tracking
- **AboutUser**: User profile information (hobbies, movies, etc.)
- **Avatar**: Avataaars configuration storage
- **Assigned**: Game assignment logic (who finds whom)
- **UserGame**: Many-to-many relationship between users and games
- **Selfie**: Photo storage for game completion

## Migration Action Items

### Phase 1: Setup and Schema Design

- [ ] Install Prisma dependencies (`prisma`, `@prisma/client`)
- [ ] Initialize Prisma in the project (`npx prisma init`)
- [ ] Configure Prisma to use SQLite (update `DATABASE_URL` in `.env`)
- [ ] Create initial Prisma schema (`schema.prisma`) based on current Sequelize models
- [ ] Design Prisma schema for all current models:
  - [ ] User model (compatible with NextAuth.js)
  - [ ] GameCode model with methods
  - [ ] AboutUser model
  - [ ] Avatar model
  - [ ] Assigned model
  - [ ] UserGame junction table
  - [ ] Selfie model
- [ ] Add proper relations between models in Prisma schema
- [ ] Review and optimize field types and constraints

### Phase 2: NextAuth.js Integration

- [ ] Install Prisma adapter for NextAuth.js (`@auth/prisma-adapter`)
- [ ] Update NextAuth.js configuration to use Prisma adapter
- [ ] Ensure compatibility with existing session/user data
- [ ] Test NextAuth.js authentication flow with Prisma
- [ ] Update auth models in `src/auth/models.ts` if needed
- [ ] Remove custom Sequelize adapter (`src/auth/adapter.ts`)

### Phase 3: Database Migration

- [ ] Generate Prisma migration from current database state
- [ ] Run introspection to validate schema matches current database
- [ ] Create backup of current `database.sqlite`
- [ ] Test migration on copy of production database
- [ ] Resolve any data type or constraint conflicts
- [ ] Verify all relationships are preserved

### Phase 4: Code Migration - Database Layer

- [ ] Create new Prisma client instance
- [ ] Replace Sequelize model exports in `src/database/index.ts`
- [ ] Update all model imports across the application
- [ ] Remove Sequelize-specific files:
  - [ ] `src/database/sequelize.ts`
  - [ ] `src/database/relations.ts`
  - [ ] Individual model files (User.ts, GameCode.ts, etc.)

### Phase 5: API Controllers Migration

- [ ] Update `src/app/api/controllers/createUserAssignment.ts`
  - [ ] Replace Sequelize queries with Prisma queries
  - [ ] Update transaction handling
  - [ ] Test assignment logic
- [ ] Update `src/app/api/controllers/getStats.ts`
  - [ ] Migrate aggregation queries to Prisma
  - [ ] Update relation queries
- [ ] Update `src/app/api/controllers/latestValidGameOfUser.ts`
  - [ ] Replace findOne/findAll with Prisma equivalents
  - [ ] Update include/join logic
- [ ] Update `src/app/api/controllers/polledExpiring.ts`
  - [ ] Migrate time-based queries
- [ ] Review all other API controllers for Sequelize usage

### Phase 6: API Routes Migration

- [ ] Update `/api/auth/[...nextauth]/route.ts` (already handled by adapter)
- [ ] Update `/api/avatar/route.ts`
- [ ] Update `/api/gamecode/route.ts` and related endpoints
- [ ] Update `/api/hobbies/route.ts`
- [ ] Update `/api/user/*` endpoints
- [ ] Update sample data endpoints if they exist

### Phase 7: Static Methods Migration

- [ ] Migrate `GameCode.validateGameCode()` static method
- [ ] Migrate `GameCode.endGame()` instance method
- [ ] Convert other custom model methods to Prisma equivalents
- [ ] Update any custom validation logic

### Phase 8: Frontend Integration

- [ ] Update type definitions for database models
- [ ] Ensure frontend components work with new data structure
- [ ] Update any direct model references in React components
- [ ] Test all user-facing functionality

### Phase 9: Development Workflow Updates

- [ ] Update database reset script (`clear_db.sql` → Prisma reset)
- [ ] Create new database seeding with Prisma
- [ ] Update development documentation
- [ ] Create new Prisma-based sample data generation
- [ ] Update `.gitignore` for Prisma-generated files

### Phase 10: Testing and Validation

- [ ] Test all authentication flows
- [ ] Test game creation and joining
- [ ] Test user assignment logic
- [ ] Test profile creation and avatar selection
- [ ] Test selfie upload and retrieval
- [ ] Test game statistics and results
- [ ] Verify data integrity after migration
- [ ] Performance testing and optimization

### Phase 11: Cleanup

- [ ] Remove Sequelize dependencies from `package.json`
- [ ] Remove unused Sequelize imports
- [ ] Clean up any remaining Sequelize configuration
- [ ] Update TypeScript types and interfaces
- [ ] Remove redundant model files

### Phase 12: Documentation and Deployment

- [ ] Update README.md with Prisma setup instructions
- [ ] Update development setup documentation
- [ ] Create migration guide for other developers
- [ ] Update deployment scripts if needed
- [ ] Document any breaking changes

## Migration Considerations

### Data Compatibility

- Ensure UUID handling is consistent between Sequelize and Prisma
- Verify BLOB handling for selfie images
- Check date/timestamp field compatibility
- Validate foreign key relationships

### Performance

- Review query performance with Prisma Client
- Optimize N+1 query issues with proper includes
- Consider connection pooling requirements

### NextAuth.js Compatibility

- Ensure session data structure remains compatible
- Verify user creation/update flows work correctly
- Test OAuth provider integration

### Development Workflow

- Update hot reload behavior with Prisma Client generation
- Ensure database schema changes are properly handled
- Consider migration rollback strategies

## Rollback Plan

- [ ] Keep Sequelize code in separate branch during migration
- [ ] Maintain database backup before migration
- [ ] Document rollback procedure if issues arise
- [ ] Test rollback process in development environment

## Success Criteria

- [ ] All existing functionality works without changes from user perspective
- [ ] No data loss during migration
- [ ] Performance is equal or better than Sequelize implementation
- [ ] Development workflow is improved or at least equivalent
- [ ] All tests pass with new implementation

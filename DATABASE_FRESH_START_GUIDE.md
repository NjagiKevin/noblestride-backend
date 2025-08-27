# Database Fresh Start Guide

## Overview

This guide provides the complete process for destroying the current database and starting fresh with the new consolidated migrations. This should **only be done in development environments**.

## ⚠️ **WARNING: DATA DESTRUCTION**

Following these steps will **permanently destroy all existing data**. This process is irreversible. Only proceed if you:

1. Are working in a development environment
2. Have confirmed you don't need existing data
3. Have backed up any data you might need later

## Prerequisites

- Node.js and npm installed
- PostgreSQL database running
- Sequelize CLI installed (`npm install -g sequelize-cli`)
- Environment variables properly configured

## Step-by-Step Fresh Start Process

### 1. Backup Current Data (Optional)

If you need to preserve any data for reference:

```bash
# Create database dump
pg_dump -h your_db_host -U your_db_user -d your_db_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Or backup specific tables you care about
pg_dump -h your_db_host -U your_db_user -d your_db_name -t users -t deals > important_data_backup.sql
```

### 2. Drop the Existing Database

```bash
# Connect to PostgreSQL as superuser
psql -h your_db_host -U postgres

# Drop the existing database
DROP DATABASE your_db_name;

# Create a fresh database
CREATE DATABASE your_db_name;

# Grant permissions to your app user
GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_db_user;

# Exit psql
\q
```

### 3. Reset Migration State

```bash
# Remove any existing migration tracking
rm -rf node_modules/.sequelize
rm -rf migrations_backup  # Optional: remove if you don't need old migrations reference
```

### 4. Run New Migrations

```bash
# Run all new consolidated migrations in order
npx sequelize-cli db:migrate

# Verify migrations were applied successfully
npx sequelize-cli db:migrate:status
```

### 5. Run Seeders (If Available)

```bash
# Run all seeders to populate initial data
npx sequelize-cli db:seed:all

# Or run specific seeders in order
npx sequelize-cli db:seed --seed 20250109080956-seed-roles.js
npx sequelize-cli db:seed --seed 20250109080956-seed-permissions.js
# ... continue with other seeders as needed
```

### 6. Verify Database Structure

```bash
# Connect to the database and verify tables
psql -h your_db_host -U your_db_user -d your_db_name

# List all tables
\dt

# Check specific table structure
\d users
\d deals
\d documents

# Verify foreign key constraints
\d+ table_name

# Check indexes
\di
```

### 7. Run Application Setup Scripts

```bash
# Run setup scripts to create initial data
chmod +x scripts/run-setup-scripts.sh
./scripts/run-setup-scripts.sh
```

## Docker Environment Fresh Start

If you're using Docker for the database:

### Option 1: Full Docker Reset

```bash
# Stop all containers
docker-compose down

# Remove volumes to destroy data
docker-compose down -v

# Remove database volume specifically
docker volume rm noblestride_node_backend-main_noblestrideservice-db-data

# Start fresh
docker-compose up -d noblestride-service-db

# Wait for database to be ready, then run migrations
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Option 2: Docker Database Reset Only

```bash
# Stop only the app service (keep db running)
docker-compose stop app

# Connect to database container
docker-compose exec noblestride-service-db psql -U your_db_user -d your_db_name

# Drop and recreate database (same as step 2 above)
DROP DATABASE your_db_name;
CREATE DATABASE your_db_name;
GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_db_user;

# Exit container
exit

# Run migrations
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# Restart app
docker-compose up -d app
```

## New Migration Structure

The new consolidated migrations are organized as follows:

1. **20250101000001-create-roles.js** - Core role system
2. **20250101000002-create-permissions.js** - Permission system
3. **20250101000003-create-role-permissions.js** - Role-permission relationships
4. **20250101000004-create-users.js** - User accounts with all fields
5. **20250101000005-create-continents.js** - Geographic: Continents
6. **20250101000006-create-regions.js** - Geographic: Regions
7. **20250101000007-create-countries.js** - Geographic: Countries
8. **20250101000008-create-sectors.js** - Business: Sectors
9. **20250101000009-create-subsectors.js** - Business: Subsectors
10. **20250101000010-create-deal-stages.js** - Deal workflow stages
11. **20250101000011-create-deals.js** - Core deals table with all fields
12. **20250101000012-create-folders.js** - Document folder system
13. **20250101000013-create-subfolders.js** - Document subfolder system
14. **20250101000014-create-document-types.js** - Document categorization
15. **20250101000015-create-documents.js** - Document storage with all fields
16. **20250101000016-create-milestone-system.js** - Milestones and tasks
17. **20250101000017-create-financial-system.js** - Investments, transactions, invoices
18. **20250101000018-create-preference-tables.js** - User preferences (sector, location, etc.)
19. **20250101000019-create-supporting-tables.js** - Notifications, audit logs, contacts, etc.
20. **20250101000020-create-advanced-features.js** - Access invites, signatures, geographic junctions
21. **20250101000021-create-pipeline-milestone-system.js** - Pipeline management and milestone tracking

## Key Improvements in New Structure

### 1. **Proper Dependency Order**
- Tables are created in dependency order
- Foreign key constraints work correctly
- No circular dependency issues

### 2. **Complete Column Definitions**
- All columns defined with proper types and constraints
- Default values specified
- Validation rules included
- Enum values properly defined

### 3. **Comprehensive Indexing**
- Foreign key indexes for performance
- Unique constraints where needed
- Search-optimized indexes
- Date-based indexes for reporting

### 4. **Clean Relationships**
- Proper CASCADE and RESTRICT rules
- Correct foreign key references
- Junction tables properly structured

### 5. **Data Integrity**
- NOT NULL constraints where appropriate
- UNIQUE constraints on business keys
- Proper enum definitions
- Validation rules in place

## Verification Checklist

After completing the fresh start, verify:

- [ ] All 21 migrations ran successfully
- [ ] No migration errors in the log
- [ ] All expected tables exist
- [ ] Foreign key constraints are in place
- [ ] Indexes are created properly
- [ ] Seeders populated initial data correctly
- [ ] Application starts without database errors
- [ ] Basic CRUD operations work
- [ ] User authentication works
- [ ] File uploads work (if applicable)

## Rollback Plan

If issues occur, you can:

1. **Restore from backup** (if you created one):
   ```bash
   psql -h your_db_host -U your_db_user -d your_db_name < backup_file.sql
   ```

2. **Restore old migrations** (emergency only):
   ```bash
   cp migrations_backup/* migrations/
   # Then run old migrations
   ```

3. **Start completely over** by repeating the fresh start process

## Environment Variables

Ensure these are properly set:

```bash
DB_HOST=your_database_host
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
NODE_ENV=development  # CRITICAL: Never do this in production
```

## Troubleshooting

### Migration Fails
- Check database connection
- Verify user permissions
- Check for syntax errors in migration files
- Ensure dependencies are met

### Seeder Fails
- Check if migrations completed successfully
- Verify foreign key data exists
- Check seeder syntax

### Application Won't Start
- Check database schema matches models
- Verify environment variables
- Check application logs for specific errors

## Support

If you encounter issues:

1. Check the application logs
2. Check database logs
3. Verify all prerequisites are met
4. Check that you're in development environment
5. Consider reaching out for support with specific error messages

---

**Remember: This process destroys all existing data. Only use in development!**
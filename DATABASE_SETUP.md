# Sankofa-Coin Database Setup Guide

## Current Status ✅

- **Supabase Connection:** ✅ Configured and working
- **Database Tables:** ❌ Need to be created
- **Environment:** Development

## Quick Start

### 1. Test Your Database Connection

```bash
npm run test:db
```

This will verify that your Supabase credentials are correct and show the connection status.

### 2. Create Database Tables

#### Option 1: Using Supabase Dashboard (Easiest) ⭐ RECOMMENDED

1. Go to https://app.supabase.com
2. Sign in and select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"+ New query"** button
5. Open the file `scripts/schema.sql` in your editor
6. Copy all the SQL content
7. Paste it into the Supabase SQL Editor
8. Click **"Run"** (or Cmd+Enter)
9. Wait for completion - you should see success messages

#### Option 2: Using Command Line (psql)

1. Get your connection string:
   - Go to Supabase Dashboard
   - Click **"Project Settings"** (bottom left)
   - Go to **"Database"** tab
   - Copy the connection string under "Connection string - psql"

2. Run the migration:
   ```bash
   psql "your-connection-string-here" < scripts/schema.sql
   ```

#### Option 3: Using Environment Variable

```bash
export DATABASE_URL="your-supabase-connection-string"
npm run migrate
```

## What Gets Created

The migration script creates the following tables:

### Core Tables
- **users** - User accounts and profiles
- **hubs** - Collection hubs/centers
- **collections** - Plastic collection records
- **donations** - Donation tracking
- **health_data** - Health and environmental data
- **ai_interactions** - AI conversation history
- **volunteer_opportunities** - Volunteer positions
- **volunteer_applications** - Volunteer sign-ups
- **payments** - Payment transactions

### Indexes
- Optimized indexes on frequently queried fields
- Geographic indexes for location-based queries
- Foreign key relationships

### Row Level Security (RLS)
- Basic RLS enabled on all tables (optional feature)

## Verify Installation

After running the migration, test again:

```bash
npm run test:db
```

You should see output listing all created tables.

## Environment Configuration

Your `.env` file contains:

```
SUPABASE_URL=https://dfclrrcfhvziogidvdcx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Server Commands

```bash
# Development with hot reload
npm run dev

# Production
npm start

# Test database connection
npm run test:db

# Run migrations
npm run migrate

# Run tests
npm test
```

## Troubleshooting

### Connection Failed

```
Error: Could not find the table 'public.users' in the schema cache
```

**Solution:** Your tables haven't been created yet. Follow Option 1 above.

### Permission Denied

```
Error: new row violates row-level security policy
```

**Solution:** You need to set up RLS policies or disable RLS on specific tables in Supabase.

### Authentication Errors

```
Error: Invalid API Key
```

**Solution:** Check that your `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are correct in `.env`

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Schema Location: `./scripts/schema.sql`
- Test Command: `npm run test:db`
- Migration Command: `npm run migrate`

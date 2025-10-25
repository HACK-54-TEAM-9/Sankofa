# Supabase Setup Guide for Sankofa-Coin Backend

This guide will help you set up Supabase as your database for the Sankofa-Coin backend application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your Sankofa-Coin backend project

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `sankofa-coin-backend`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - Keep this secret!

## Step 3: Configure Environment Variables

1. Copy your `.env` file and update it with Supabase credentials:

```bash
# Database - Supabase (PostgreSQL)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Legacy Database (commented out)
# MONGODB_URI=mongodb://localhost:27017/sankofa-coin
REDIS_URL=redis://localhost:6379
```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `database/schema.sql` from your project
4. Click "Run" to execute the schema

This will create:
- All necessary tables (users, hubs, collections, etc.)
- Indexes for performance
- Row Level Security (RLS) policies
- Helper functions
- Sample data for development

## Step 5: Configure Row Level Security (RLS)

The schema includes RLS policies, but you may need to adjust them based on your needs:

1. Go to **Authentication** → **Policies** in your Supabase dashboard
2. Review the policies for each table
3. Adjust permissions as needed for your application

## Step 6: Test the Connection

1. Start your backend server:
```bash
npm start
```

2. Check the logs for successful Supabase connection:
```
✅ Supabase database connected successfully
```

3. Test the health endpoint:
```bash
curl http://localhost:5000/health
```

## Step 7: Verify Database Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see all the tables created:
   - `users`
   - `hubs`
   - `collections`
   - `health_data`
   - `donations`
   - `payments`
   - `volunteers`
   - `ai_interactions`
   - `analytics_cache`
   - `notifications`

3. Check that sample data was inserted in the `users` and `hubs` tables

## Step 8: Configure Authentication (Optional)

If you want to use Supabase Auth instead of JWT:

1. Go to **Authentication** → **Settings**
2. Configure your site URL and redirect URLs
3. Enable/disable providers as needed
4. Update your backend to use Supabase Auth

## Database Schema Overview

### Core Tables

- **users**: User accounts and profiles
- **hubs**: Collection hubs for plastic waste
- **collections**: Plastic waste collection records
- **health_data**: Health intelligence and environmental data
- **donations**: Donation records and recurring donations
- **payments**: Payment transactions
- **volunteers**: Volunteer applications and management
- **ai_interactions**: AI assistant chat history
- **notifications**: User notifications
- **analytics_cache**: Cached analytics data

### Key Features

- **UUID Primary Keys**: All tables use UUID for better security
- **JSONB Fields**: Flexible data storage for complex objects
- **Geospatial Support**: PostGIS extension for location data
- **Row Level Security**: Fine-grained access control
- **Automatic Timestamps**: Created/updated timestamps
- **Performance Indexes**: Optimized for common queries

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Public anon key for client operations | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations | Yes |

## Troubleshooting

### Connection Issues

1. **Check your credentials**: Ensure URL and keys are correct
2. **Check network**: Ensure you can reach Supabase from your server
3. **Check logs**: Look for specific error messages in your application logs

### Permission Issues

1. **RLS Policies**: Check that Row Level Security policies are correctly configured
2. **Service Role**: Use service role key for admin operations
3. **User Context**: Ensure user authentication is working properly

### Performance Issues

1. **Indexes**: Check that indexes are created for your query patterns
2. **Query Optimization**: Use Supabase's query analyzer
3. **Connection Pooling**: Consider using connection pooling for high traffic

## Security Best Practices

1. **Never expose service role key** in client-side code
2. **Use RLS policies** to control data access
3. **Validate all inputs** before database operations
4. **Use prepared statements** to prevent SQL injection
5. **Regular backups** of your database
6. **Monitor access logs** for suspicious activity

## Next Steps

1. **Test API endpoints** to ensure they work with Supabase
2. **Set up monitoring** and logging
3. **Configure backups** and disaster recovery
4. **Set up staging environment** for testing
5. **Document your specific use cases** and customizations

## Support

- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Community Forum**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)

## Migration from MongoDB

If you're migrating from MongoDB:

1. **Data Export**: Export your existing data from MongoDB
2. **Data Transformation**: Convert MongoDB documents to PostgreSQL format
3. **Data Import**: Use Supabase's import tools or custom scripts
4. **Testing**: Thoroughly test all functionality with the new database
5. **Rollback Plan**: Keep MongoDB running until migration is confirmed successful

---

**Last Updated**: October 25, 2025  
**Supabase Version**: Latest  
**Backend Version**: 1.0.0

# Complete Supabase Setup Guide for Sankofa-Coin Backend

This guide will help you set up your Supabase database with all the required tables and configurations for your Sankofa-Coin backend application.

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `sankofa-coin-backend`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for the project to be created (2-3 minutes)

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
   - **service_role secret key** (starts with `eyJ...`)

### 3. Update Environment Variables

Update your `.env` file with the real Supabase credentials:

```env
# Database - Supabase (PostgreSQL)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Apply Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `database/complete_schema.sql`
4. Click "Run" to execute the schema
5. Wait for all tables to be created

### 5. Test Your Setup

Run the test script to verify everything is working:

```bash
node src/scripts/test-supabase.js
```

## 📊 Database Schema Overview

Your Supabase database includes the following tables:

### Core Tables
- **`users`** - User accounts and profiles
- **`hubs`** - Collection hubs for plastic waste
- **`collections`** - Plastic waste collection records
- **`health_data`** - Health intelligence and environmental data
- **`donations`** - Donation records and recurring donations
- **`payments`** - Payment transactions
- **`volunteers`** - Volunteer applications and management
- **`ai_interactions`** - AI assistant interactions
- **`analytics_cache`** - Cached analytics data
- **`notifications`** - User notifications

### Key Features
- **Row Level Security (RLS)** - Users can only access their own data
- **Geospatial Support** - Location-based queries for hubs and collections
- **JSONB Fields** - Flexible data storage for complex objects
- **Automatic Timestamps** - Created/updated timestamps on all tables
- **Indexes** - Optimized for performance
- **Helper Functions** - Built-in functions for common operations

## 🔧 Configuration Details

### Environment Variables Required

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Database connection pooling
SUPABASE_DB_POOL_SIZE=10
SUPABASE_DB_TIMEOUT=30000
```

### Database Extensions Enabled
- **uuid-ossp** - For generating UUIDs
- **postgis** - For geospatial operations

### Custom Types Created
- `user_role` - User roles (collector, hub-manager, volunteer, donor, admin)
- `user_status` - User status (active, inactive, suspended, pending)
- `collection_status` - Collection status (pending, verified, processed, paid, rejected)
- `plastic_type` - Plastic types (PET, HDPE, LDPE, PP, PS, Other)
- `quality_rating` - Quality ratings (excellent, good, fair, poor)
- `hub_status` - Hub status (active, inactive, maintenance, closed)
- `donation_type` - Donation types (one-time, monthly, quarterly, yearly)
- `payment_method` - Payment methods (mobile_money, bank_transfer, credit_card, paypal, crypto)
- `payment_status` - Payment status (pending, processing, completed, failed, refunded)
- `volunteer_status` - Volunteer status (pending, approved, rejected, active, inactive)
- `risk_level` - Risk levels (low, medium, high, critical)
- `data_source` - Data sources (collection_data, health_records, environmental_monitoring, ai_prediction, manual_entry)
- `ai_interaction_type` - AI interaction types (chat, voice, query, insight_request, health_analysis)
- `ai_status` - AI status (processing, completed, failed, archived)

## 🔒 Security Configuration

### Row Level Security (RLS) Policies

The database includes comprehensive RLS policies:

- **Users**: Can view and update their own profile
- **Collections**: Can view and create their own collections
- **Donations**: Can view and create their own donations
- **Payments**: Can view and create their own payments
- **Volunteers**: Can view and create their own volunteer records
- **AI Interactions**: Can view and create their own AI interactions
- **Notifications**: Can view their own notifications
- **Hubs**: Public read access
- **Health Data**: Public read access
- **Service Role**: Full access to all tables

### Authentication Integration

The database is configured to work with Supabase Auth:

- User IDs are linked to Supabase Auth UIDs
- RLS policies use `auth.uid()` for user identification
- Service role has full access for backend operations

## 📈 Performance Optimizations

### Indexes Created
- **Users**: email, phone, role, status, created_at
- **Hubs**: manager, status, code, location (geospatial)
- **Collections**: collector, hub, status, plastic_type, created_at, location (geospatial), payment_status
- **Health Data**: location (geospatial), source, status, created_at
- **Donations**: donor, type, status, created_at
- **Payments**: user, status, method, created_at
- **Volunteers**: user, status, created_at
- **AI Interactions**: user, session, type, status, created_at, location (geospatial)
- **Analytics Cache**: cache_key, expires_at
- **Notifications**: user, is_read, created_at

### Helper Functions
- `get_user_stats()` - Get user statistics
- `get_collection_stats()` - Get collection statistics
- `cleanup_expired_cache()` - Clean up expired cache entries
- `update_updated_at_column()` - Automatic timestamp updates

## 🧪 Testing Your Setup

### 1. Run the Test Script

```bash
node src/scripts/test-supabase.js
```

This will test:
- ✅ Basic connection
- ✅ Health check
- ✅ User operations (CRUD)
- ✅ Hub operations (CRUD)
- ✅ Collection operations (CRUD)
- ✅ Database functions
- ✅ Pagination
- ✅ Error handling

### 2. Manual Testing

You can also test manually in the Supabase dashboard:

1. Go to **Table Editor**
2. Check that all tables are created
3. Try inserting sample data
4. Verify RLS policies are working

### 3. API Testing

Test your backend API endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Test with your backend running
curl http://localhost:5000/api/users
```

## 🔄 Migration from MongoDB

If you're migrating from MongoDB, here are the key differences:

### Data Type Changes
- **ObjectId** → **UUID** (PostgreSQL native UUIDs)
- **Date** → **TIMESTAMP WITH TIME ZONE**
- **Mixed** → **JSONB** (for flexible data)
- **GeoJSON** → **PostGIS** (for geospatial data)

### Query Changes
- **MongoDB queries** → **PostgreSQL queries**
- **Aggregation pipelines** → **SQL functions**
- **Geospatial queries** → **PostGIS functions**

### Model Changes
- **Mongoose schemas** → **Supabase client calls**
- **Virtual fields** → **Computed columns or functions**
- **Middleware** → **Database triggers or application logic**

## 🚨 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check your environment variables
   - Verify your Supabase project is active
   - Ensure your IP is not blocked

2. **RLS Policy Errors**
   - Check that RLS is enabled on tables
   - Verify policies are correctly configured
   - Test with service role key

3. **Schema Errors**
   - Check that all extensions are enabled
   - Verify custom types are created
   - Ensure all tables are created successfully

4. **Performance Issues**
   - Check that indexes are created
   - Monitor query performance
   - Consider connection pooling

### Debug Commands

```bash
# Test connection
node -e "require('./src/config/supabase').testConnection().then(console.log)"

# Check environment variables
node -e "console.log(process.env.SUPABASE_URL)"

# Test specific operations
node src/scripts/test-supabase.js
```

## 📚 Next Steps

1. **Set up your Supabase project** using the credentials above
2. **Apply the database schema** from `database/complete_schema.sql`
3. **Update your environment variables** with real credentials
4. **Test the connection** using the test script
5. **Start your backend server** and verify it works
6. **Begin development** with your new Supabase database!

## 🆘 Support

If you encounter any issues:

1. Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
2. Review the test script output for specific errors
3. Check your Supabase project logs in the dashboard
4. Verify your environment variables are correct

Your Supabase database is now ready for the Sankofa-Coin backend! 🎉

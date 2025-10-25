# Supabase Integration - Complete Setup Guide

## ✅ Current Status

- **Server**: Running and connected to Supabase ✅
- **Database Tables**: NOT YET CREATED ❌
- **Authentication**: New Supabase-specific controllers created ✅

## 🔴 Current Issue

```
Error: Could not find the 'location' column of 'users' in the schema cache
Code: PGRST204
```

**Why?** Your Supabase database tables haven't been created yet.

## 🚀 SOLUTION - Create Database Tables

You MUST do this FIRST before testing registration/login:

### Step 1: Go to Supabase Dashboard
1. Visit https://app.supabase.com
2. Select your project (dfclrrcfhvziogidvdcx)
3. Click **"SQL Editor"** in the left sidebar
4. Click **"+ New query"**

### Step 2: Copy the Schema
1. Open the file `scripts/schema.sql` in your editor
2. Copy ALL the contents (from `--` comment to the end)

### Step 3: Run the Migration
1. Paste the SQL into Supabase SQL Editor
2. Click **"RUN"** button (or Cmd+Enter)
3. Wait for completion - you should see green checkmarks

### Step 4: Verify Tables Created
In your terminal, run:
```bash
npm run test:db
```

You should see output listing all the created tables.

## 📋 What Gets Created

| Table | Purpose |
|-------|---------|
| `users` | User profiles with password field ✅ |
| `hubs` | Collection centers |
| `collections` | Plastic collection records |
| `donations` | Donation tracking |
| `health_data` | Health metrics |
| `ai_interactions` | Chat history |
| `volunteer_*` | Volunteer opportunities & applications |
| `payments` | Transaction records |

All tables include proper indexes and foreign key relationships.

## 🔑 Key Files Updated

### New Supabase Models
- `src/models/SupabaseUser.js` - Supabase-specific user model with all CRUD operations

### New Controllers
- `src/controllers/supabaseAuthController.js` - Authentication logic using bcrypt password hashing

### New Middleware
- `src/middleware/supabaseAuth.js` - JWT token verification and role-based access control

### Updated Routes
- `src/routes/auth.js` - Now uses Supabase controller instead of MongoDB

## ✨ Testing After Migration

Once tables are created, test the endpoints:

```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+233501234567",
    "password": "Password123!",
    "role": "collector"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'

# Get user profile (with token from login response)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔒 Password Handling

- Passwords are hashed using bcrypt (12 rounds)
- Never stored in plain text
- Always validated against hash on login
- 100% compatible with Supabase PostgreSQL

## ⚡ Performance Optimizations

- Indexes on: email, phone, role, status, creator IDs
- Geographic indexes (2dsphere) for location-based queries
- Composite indexes on frequently queried field combinations

## 🆘 Troubleshooting

### "Could not find 'users' table"
→ Run the migration first (see Step 1-3 above)

### "User with email already exists"
→ Delete test data from Supabase and try again

### "Invalid token"
→ Make sure you're using the token from login response in the Authorization header

### "Insufficient permissions"
→ Check the user's role and required role for that endpoint

## 📞 Need Help?

1. Check Supabase Dashboard for table creation status
2. Run `npm run test:db` to verify connection
3. Check server logs for detailed error messages
4. Verify `.env` file has correct Supabase credentials

## 🎯 Next Steps After Tables Are Created

1. ✅ Run the migration (create tables)
2. ✅ Test endpoints with sample data
3. ✅ Implement email/SMS verification (optional)
4. ✅ Set up Row Level Security (RLS) policies
5. ✅ Deploy to production

---

**Important**: Don't forget to create the tables first! Everything else is ready to go.

#!/bin/bash
# =============================================
# Sankofa Database Setup Script
# =============================================
# This script sets up the complete Sankofa database
# with schema and seed data
# =============================================

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║         SANKOFA DATABASE SETUP - Supabase PostgreSQL                ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if connection string is provided
if [ -z "$1" ]; then
    echo "❌ ERROR: Database connection string required!"
    echo ""
    echo "Usage:"
    echo "  ./scripts/setup-database.sh 'postgresql://user:pass@host:port/database'"
    echo ""
    echo "OR set SUPABASE_DB_URL environment variable:"
    echo "  export SUPABASE_DB_URL='postgresql://user:pass@host:port/database'"
    echo "  ./scripts/setup-database.sh"
    echo ""
    exit 1
fi

DB_URL="$1"

echo "📋 Setup Steps:"
echo "  1. Apply complete schema (tables, indexes, functions, policies)"
echo "  2. Populate with seed data (10 users, 5 hubs, 15 collections, etc.)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1: Applying schema..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if psql "$DB_URL" < database/complete_schema.sql; then
    echo "✅ Schema applied successfully"
else
    echo "❌ Schema application failed"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌱 Step 2: Loading seed data..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if psql "$DB_URL" < database/seed_data.sql; then
    echo "✅ Seed data loaded successfully"
else
    echo "❌ Seed data loading failed"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Step 3: Verifying setup..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

psql "$DB_URL" << 'EOF'
\echo ''
\echo '📊 Table Counts:'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
SELECT 
    table_name,
    to_char(n_live_tup, '999,999') as "Records"
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
    AND t.table_name IN ('users', 'hubs', 'collections', 'health_data', 'donations', 'payments', 'volunteers', 'ai_interactions', 'notifications', 'analytics_cache')
ORDER BY t.table_name;

\echo ''
\echo '👥 User Roles:'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
SELECT 
    role,
    COUNT(*) as count,
    SUM(points) as total_points
FROM users
GROUP BY role
ORDER BY role;

\echo ''
\echo '🏢 Hub Summary:'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
SELECT 
    name,
    ROUND((current_load::numeric / capacity * 100), 1) || '%' as "Capacity",
    status
FROM hubs
ORDER BY name;
EOF

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP COMPLETE!                                ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 Next Steps:"
echo ""
echo "  1. Test login with seed account:"
echo "     curl -X POST http://localhost:5000/api/auth/login \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"email\":\"kwame.mensah@example.com\",\"password\":\"password123\"}'"
echo ""
echo "  2. View all test accounts: cat SEED_DATA_GUIDE.md"
echo "  3. Read API docs: cat API_DOCUMENTATION.md"
echo "  4. Check route status: cat ROUTE_STATUS_REPORT.md"
echo ""
echo "🔑 All test accounts use password: password123"
echo ""

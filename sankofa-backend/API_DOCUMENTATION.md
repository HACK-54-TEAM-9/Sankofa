# Sankofa-Coin Backend API Documentation

## Overview

The Sankofa-Coin Backend API is a comprehensive RESTful API for managing plastic collection, health intelligence, and community impact tracking in Ghana. The API supports multiple user roles including collectors, hub managers, volunteers, donors, and administrators.

**Base URL:** `http://localhost:5000/api`  
**Version:** 1.0.0  
**Environment:** Development  
**Database:** Supabase (PostgreSQL)  
**Authentication:** Supabase Auth with JWT

### Quick Start

**All test users password**: `password123`

**⚠️ BEFORE TESTING**: You MUST run `database/fix_passwords.sql` and add auth columns (see Testing section below) or login will fail!

Test accounts available:
- **Collectors:** kwame.mensah@example.com, ama.osei@example.com, kofi.asante@example.com, abena.owusu@example.com
- **Hub Managers:** yaw.boateng@example.com, akosua.darko@example.com
- **Volunteers:** kwesi.appiah@example.com, efua.adjei@example.com
- **Donors:** samuel.nkrumah@example.com, adwoa.mensah@example.com

### API Module Status

| Module | Status | Notes |
|--------|--------|-------|
| ✅ Authentication | **FULLY WORKING** | 16 endpoints, JWT tokens, password hashing |
| ✅ Collections | **FULLY WORKING** | CRUD operations, 70/30 split, 15 seed records |
| ✅ Users | **FULLY WORKING** | User management, 10 seed users |
| ✅ Hubs | **FULLY WORKING** | Hub management, 5 seed hubs |
| ✅ Health Data | **MOSTLY WORKING** | 2 endpoints return 501 (impact-analysis, predictive) |
| ✅ Donations | **FULLY WORKING** | Donation tracking, 6 seed donations |
| ✅ Volunteers | **FULLY WORKING** | Application system, 5 seed applications |
| ⚠️ AI Assistant | **PARTIAL** | Needs OpenAI integration, voice is mocked |
| 🚧 Payments | **MOCK DATA** | All endpoints return fake data |
| 🚧 Analytics | **MOCK DATA** | All stats are hardcoded |

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Collections](#collections)
4. [Hubs](#hubs)
5. [Health Data](#health-data)
6. [AI Assistant](#ai-assistant)
7. [Donations](#donations)
8. [Volunteers](#volunteers)
9. [Analytics](#analytics)
10. [Payments](#payments)
11. [Error Handling](#error-handling)
12. [Rate Limiting](#rate-limiting)

---

## Authentication

### Base Endpoint: `/api/auth`

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+233123456789",
  "password": "password123",
  "role": "collector"
}
```

**Validation:**
- `name`: 2-100 characters (required)
- `email`: Valid email format (required)
- `phone`: Ghana phone number format +233XXXXXXXXX (required)
- `password`: Minimum 6 characters (required)
- `role`: One of: `collector`, `hub-manager`, `volunteer`, `donor` (optional, defaults to `collector`)

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+233123456789",
      "role": "collector",
      "status": "pending",
      "is_email_verified": false,
      "is_phone_verified": false,
      "points": 0,
      "level": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "success": false,
  "message": "Please provide name, email, phone, and password"
}

// 400 - Duplicate User
{
  "success": false,
  "message": "User with this email already exists"
}

// 400 - Duplicate Phone
{
  "success": false,
  "message": "User with this phone number already exists"
}
```

#### POST `/api/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "kwame.mensah@example.com",
  "password": "password123"
}
```

**Validation:**
- `email`: Valid email format (required)
- `password`: Non-empty string (required)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Kwame Mensah",
      "email": "kwame.mensah@example.com",
      "phone": "+233241234567",
      "role": "collector",
      "status": "active",
      "is_email_verified": true,
      "is_phone_verified": true,
      "points": 1250,
      "level": 5
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

**Error Responses:**
```json
// 401 - Invalid Credentials
{
  "success": false,
  "message": "Invalid email or password"
}

// 401 - Inactive Account
{
  "success": false,
  "message": "Account is inactive. Please contact support."
}
```

#### POST `/api/auth/logout`
Logout user and invalidate token.

**Headers:** `Authorization: Bearer <token>`

#### GET `/api/auth/me`
Get current authenticated user profile.

**Headers:** 
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Kwame Mensah",
      "email": "kwame.mensah@example.com",
      "phone": "+233241234567",
      "role": "collector",
      "status": "active",
      "is_email_verified": true,
      "is_phone_verified": true,
      "points": 1250,
      "level": 5,
      "created_at": "2025-04-26T12:00:00Z",
      "updated_at": "2025-10-26T10:30:00Z"
    }
  }
}
```

**Alias:** `/api/auth/profile` - Same endpoint, same response

#### PUT `/api/auth/profile`
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+233987654321"
}
```

#### PUT `/api/auth/password`
Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

#### POST `/api/auth/forgot-password`
Request password reset.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### POST `/api/auth/reset-password/:token`
Reset password with token.

**Request Body:**
```json
{
  "password": "new_password"
}
```

#### GET `/api/auth/verify-email/:token`
Verify email address.

#### POST `/api/auth/verify-phone`
Verify phone number with SMS code.

**Request Body:**
```json
{
  "code": "123456"
}
```

#### POST `/api/auth/refresh-token`
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

#### DELETE `/api/auth/account`
Delete user account.

**Headers:** `Authorization: Bearer <token>`

---

## Users

### Base Endpoint: `/api/users`

All routes require authentication.

#### GET `/api/users`
Get all users (Admin only).

**Headers:** `Authorization: Bearer <token>`

#### GET `/api/users/stats`
Get user statistics (Admin only).

#### GET `/api/users/top`
Get top performing users.

#### GET `/api/users/profile`
Get current user profile.

#### GET `/api/users/activity`
Get user activity history.

#### GET `/api/users/:id`
Get user by ID.

#### PUT `/api/users/profile`
Update current user profile.

#### PUT `/api/users/:id`
Update user by ID (Admin only).

#### PATCH `/api/users/change-password`
Change current user password.

#### DELETE `/api/users/:id`
Delete user by ID (Admin only).

---

## Collections

### Base Endpoint: `/api/collections`

All routes require authentication.

#### POST `/api/collections`
Create a new plastic collection record.

**Request Body:**
```json
{
  "hub": "hub_id",
  "plasticType": "PET",
  "weight": 5.5,
  "quantity": 10,
  "collectionLocation": {
    "coordinates": [5.6037, -0.1870],
    "address": "Accra, Ghana"
  }
}
```

**Validation:**
- `hub`: Valid MongoDB ObjectId
- `plasticType`: One of: `PET`, `HDPE`, `LDPE`, `PP`, `PS`, `Other`
- `weight`: Minimum 0.1 kg
- `quantity`: Minimum 1
- `collectionLocation.coordinates`: Array of 2 numbers [longitude, latitude]

#### GET `/api/collections`
Get collections with filtering and pagination.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status
- `plasticType`: Filter by plastic type
- `hub`: Filter by hub ID

#### GET `/api/collections/stats`
Get collection statistics (Admin/Hub Manager only).

#### GET `/api/collections/top-collectors`
Get top collectors by volume.

#### GET `/api/collections/location`
Get collections by location.

#### GET `/api/collections/user/:userId`
Get collections by user ID.

#### GET `/api/collections/hub/:hubId`
Get collections by hub ID (Hub Manager/Admin only).

#### GET `/api/collections/:id`
Get collection by ID.

#### PUT `/api/collections/:id`
Update collection.

**Request Body:**
```json
{
  "status": "verified",
  "quality": "excellent",
  "verificationNotes": "High quality plastic"
}
```

#### PATCH `/api/collections/:id/verify`
Verify collection (Hub Manager/Admin only).

#### DELETE `/api/collections/:id`
Delete collection.

---

## Hubs

### Base Endpoint: `/api/hubs`

All routes require authentication.

#### GET `/api/hubs`
Get all collection hubs.

#### GET `/api/hubs/nearby`
Get nearby hubs based on user location.

**Query Parameters:**
- `lat`: Latitude
- `lng`: Longitude
- `radius`: Search radius in km

#### GET `/api/hubs/stats`
Get hub statistics (Admin only).

#### GET `/api/hubs/top-performing`
Get top performing hubs.

#### GET `/api/hubs/:id`
Get hub by ID.

#### GET `/api/hubs/:id/collectors`
Get hub collectors (Hub Manager/Admin only).

#### GET `/api/hubs/:id/collections`
Get hub collections (Hub Manager/Admin only).

#### GET `/api/hubs/:id/analytics`
Get hub analytics (Hub Manager/Admin only).

#### POST `/api/hubs`
Create new hub (Admin only).

**Request Body:**
```json
{
  "name": "Accra Central Hub",
  "location": {
    "coordinates": [5.6037, -0.1870],
    "address": "Accra Central, Ghana"
  },
  "contact": {
    "phone": "+233123456789",
    "email": "accra@hub.com"
  },
  "manager": "manager_user_id"
}
```

#### PUT `/api/hubs/:id`
Update hub (Admin/Hub Manager only).

#### PATCH `/api/hubs/:id/status`
Update hub status (Admin/Hub Manager only).

#### DELETE `/api/hubs/:id`
Delete hub (Admin only).

---

## Health Data

### Base Endpoint: `/api/health`

Some routes are public with optional authentication for enhanced features.

#### GET `/api/health/insights`
Get location-based health insights (Public).

**Query Parameters:**
- `lat`: Latitude
- `lng`: Longitude
- `radius`: Search radius in km

#### GET `/api/health/trends`
Get health trends data (Public).

#### GET `/api/health/impact-analysis`
Get collection impact analysis (Public).

#### GET `/api/health/high-risk-areas`
Get high-risk health areas (Public).

#### GET `/api/health/disease-patterns`
Get disease pattern analysis (Public).

#### GET `/api/health/environmental`
Get environmental health data (Public).

#### GET `/api/health/predictive`
Get predictive health insights (Public).

#### GET `/api/health`
Get health data (Protected).

#### GET `/api/health/region/:region`
Get health data by region (Protected).

#### GET `/api/health/:id`
Get health data by ID (Protected).

#### POST `/api/health`
Create health data (Admin/Hub Manager only).

**Request Body:**
```json
{
  "location": {
    "coordinates": [5.6037, -0.1870],
    "address": "Accra, Ghana"
  },
  "source": "collection_data",
  "healthMetrics": {
    "riskAssessment": {
      "overallRisk": "medium",
      "factors": ["air_quality", "water_quality"]
    }
  }
}
```

#### PUT `/api/health/:id`
Update health data (Admin/Hub Manager only).

#### DELETE `/api/health/:id`
Delete health data (Admin only).

---

## AI Assistant

### Base Endpoint: `/api/ai`

**⚠️ PARTIALLY IMPLEMENTED: Needs OpenAI Integration**

The AI module has basic structure but requires OpenAI API integration for production use. Voice transcription is currently mocked. Chat endpoints work but return basic responses without actual AI processing.

See [src/controllers/aiController.js](src/controllers/aiController.js:1) for implementation details.

Some routes are public, others require authentication.

#### GET `/api/ai/insights`
Get AI insights (Public with optional auth).

#### GET `/api/ai/popular-queries`
Get popular AI queries (Public).

#### GET `/api/ai/performance`
Get AI performance metrics (Public).

#### POST `/api/ai/chat`
Chat with AI assistant (Protected).

**Request Body:**
```json
{
  "message": "What's the best way to collect plastic waste?",
  "type": "chat"
}
```

**Validation:**
- `message`: 1-1000 characters
- `type`: One of: `chat`, `voice`, `query`, `insight_request`, `health_analysis`

#### POST `/api/ai/voice`
Get voice response from AI (Protected).

#### GET `/api/ai/health-recommendations`
Get health recommendations (Protected).

#### GET `/api/ai/collection-advice`
Get collection advice (Protected).

#### GET `/api/ai/location-insights`
Get location-based insights (Protected).

#### GET `/api/ai/history`
Get AI interaction history (Protected).

#### POST `/api/ai/feedback/:interactionId`
Provide feedback on AI interaction (Protected).

**Request Body:**
```json
{
  "helpful": true,
  "accuracy": 4,
  "relevance": 5
}
```

---

## Donations

### Base Endpoint: `/api/donations`

All routes require authentication.

#### GET `/api/donations`
Get all donations (Admin only).

#### GET `/api/donations/stats`
Get donation statistics.

#### GET `/api/donations/top-donors`
Get top donors.

#### GET `/api/donations/recurring`
Get recurring donations (Admin only).

#### GET `/api/donations/history`
Get donor history.

#### GET `/api/donations/:id`
Get donation by ID.

#### GET `/api/donations/:id/impact-report`
Generate impact report for donation.

#### POST `/api/donations`
Create new donation.

**Request Body:**
```json
{
  "amount": 100.00,
  "type": "one-time",
  "payment": {
    "method": "mobile_money"
  }
}
```

**Validation:**
- `amount`: Minimum 1 GH₵
- `type`: One of: `one-time`, `monthly`, `quarterly`, `yearly`
- `payment.method`: One of: `mobile_money`, `bank_transfer`, `credit_card`, `paypal`, `crypto`

#### POST `/api/donations/:id/process`
Process donation payment.

**Request Body:**
```json
{
  "paymentData": {
    "transactionId": "txn_123456",
    "status": "completed"
  }
}
```

#### PUT `/api/donations/:id`
Update donation.

#### PATCH `/api/donations/:id/cancel-recurring`
Cancel recurring donation.

#### DELETE `/api/donations/:id`
Delete donation (Admin only).

---

## Volunteers

### Base Endpoint: `/api/volunteers`

All routes require authentication.

#### GET `/api/volunteers`
Get all volunteers (Admin/Hub Manager only).

#### GET `/api/volunteers/opportunities`
Get volunteer opportunities.

#### GET `/api/volunteers/applications`
Get volunteer applications (Admin/Hub Manager only).

#### GET `/api/volunteers/stats`
Get volunteer statistics (Admin only).

#### GET `/api/volunteers/:id`
Get volunteer by ID.

#### POST `/api/volunteers/apply`
Apply for volunteer opportunity.

**Request Body:**
```json
{
  "opportunityId": "opportunity_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+233123456789"
}
```

#### PUT `/api/volunteers/:id`
Update volunteer application.

#### PATCH `/api/volunteers/:id/approve`
Approve volunteer (Admin/Hub Manager only).

#### PATCH `/api/volunteers/:id/reject`
Reject volunteer (Admin/Hub Manager only).

#### PATCH `/api/volunteers/:id/status`
Update volunteer status (Admin/Hub Manager only).

#### PATCH `/api/volunteers/:id/assign`
Assign volunteer to opportunity (Admin/Hub Manager only).

#### DELETE `/api/volunteers/:id`
Delete volunteer application (Admin only).

---

## Analytics

### Base Endpoint: `/api/analytics`

**🚧 WARNING: ALL ANALYTICS ENDPOINTS RETURN HARDCODED DATA**

This module is NOT production-ready. All endpoints return static mock statistics and do not query the actual database. Real implementations need to aggregate data from collections, users, donations, and health_data tables.

See [src/controllers/analyticsController.js](src/controllers/analyticsController.js:1) for implementation details.

All routes require authentication.

#### GET `/api/analytics/dashboard`
Get dashboard statistics (RETURNS HARDCODED DATA).

#### GET `/api/analytics/collections`
Get collection analytics.

**Query Parameters:**
- `startDate`: ISO 8601 date
- `endDate`: ISO 8601 date
- `region`: Region filter

#### GET `/api/analytics/health`
Get health analytics.

#### GET `/api/analytics/users`
Get user analytics.

#### GET `/api/analytics/hubs`
Get hub analytics.

#### GET `/api/analytics/donations`
Get donation analytics.

#### GET `/api/analytics/ai`
Get AI analytics.

#### GET `/api/analytics/environmental-impact`
Get environmental impact analytics.

#### GET `/api/analytics/predictive-insights`
Get predictive insights.

#### GET `/api/analytics/performance`
Get performance metrics.

#### GET `/api/analytics/trends`
Get trend analysis.

#### GET `/api/analytics/geographic`
Get geographic analytics.

#### GET `/api/analytics/export`
Export analytics data (Admin only).

---

## Payments

### Base Endpoint: `/api/payments`

**🚧 WARNING: ALL PAYMENT ENDPOINTS RETURN MOCK DATA**

This module is NOT production-ready. All endpoints return simulated data and do not process real payments. Integration with actual payment gateways (Mobile Money, Bank APIs, Card processors) is required before production use.

See [src/controllers/paymentController.js](src/controllers/paymentController.js:1) for implementation details.

All routes require authentication.

#### GET `/api/payments/methods`
Get available payment methods (MOCK DATA).

#### GET `/api/payments/history`
Get payment history.

#### GET `/api/payments/stats`
Get payment statistics (Admin only).

#### GET `/api/payments/:paymentId/status`
Get payment status.

#### POST `/api/payments`
Process general payment.

**Request Body:**
```json
{
  "amount": 50.00,
  "currency": "GHS",
  "method": "mobile_money",
  "description": "Collection payment"
}
```

#### POST `/api/payments/mobile-money`
Process mobile money payment.

**Request Body:**
```json
{
  "amount": 50.00,
  "phoneNumber": "+233123456789",
  "network": "MTN"
}
```

#### POST `/api/payments/bank-transfer`
Process bank transfer.

**Request Body:**
```json
{
  "amount": 100.00,
  "accountNumber": "1234567890",
  "bankCode": "GTB",
  "accountName": "John Doe"
}
```

#### POST `/api/payments/card`
Process card payment.

#### POST `/api/payments/webhook`
Handle payment webhooks (No auth required).

#### PUT `/api/payments/methods/:methodId`
Update payment method.

#### POST `/api/payments/:paymentId/refund`
Process refund (Admin only).

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  },
  "timestamp": "2025-10-25T19:48:19.960Z",
  "path": "/api/endpoint"
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `429`: Too Many Requests
- `500`: Internal Server Error

### Validation Errors

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email",
      "value": "invalid-email"
    }
  ]
}
```

---

## Rate Limiting

- **Default Limit**: 100 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later.",
  "retryAfter": 900
}
```

---

## Authentication

### JWT Token

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Note: Authentication is handled via Supabase Auth in this project. When using Supabase-issued tokens, include the Supabase access token in the Authorization header as shown above. Token lifetimes and refresh behavior are governed by your Supabase project's authentication settings.

### Token Expiration

- **Access Token**: 7 days
- **Refresh Token**: 30 days

### Role-Based Access

- **collector**: Can create collections, view own data
- **hub-manager**: Can manage hub operations, verify collections
- **volunteer**: Can apply for opportunities, view volunteer data
- **donor**: Can make donations, view donation history
- **admin**: Full system access

---

## Development Notes

✅ **Current Status**: The API is running in development mode with full Supabase integration.

### Database Setup

1. **Schema Migration**
   ```bash
   # Run the complete schema (first time setup)
   psql <supabase-connection-string> < database/complete_schema.sql
   
   # Populate with dummy data (optional)
   psql <supabase-connection-string> < database/seed_data.sql
   ```

2. **Seed Data Included**
   - **10 Users** across all roles (collectors, hub managers, volunteers, donors)
   - **5 Collection Hubs** across Ghana (Accra, Kumasi, Takoradi, Tamale, Cape Coast)
   - **15 Collections** with varying statuses and plastic types
   - **8 Health Data** records across regions
   - **6 Donations** with payment records
   - **5 Volunteer Applications** with different statuses
   - **10 AI Interactions** showing chat history
   - **5 Notifications** for various events

   All test users use password: `password123`

### Configuration

- **Database**: Supabase (Postgres) - fully migrated from MongoDB
- **Authentication**: Supabase Auth with JWT tokens
  - Access tokens in Authorization header: `Bearer <token>`
  - Token lifetime: 7 days (configurable in Supabase)
  - Refresh tokens: 30 days
- **Migrations**: Helper scripts at `scripts/migrate-to-supabase.js`
- **Environment Variables**: 
  ```env
  SUPABASE_URL=your_supabase_project_url
  SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  JWT_SECRET=your_jwt_secret
  NODE_ENV=development
  PORT=5000
  ```

### Services Status

- ✅ **Database**: Supabase PostgreSQL (active)
- ✅ **Authentication**: Supabase Auth (active)
- ⚠️ **Redis**: Disabled in development
- ⚠️ **SMS**: Mock responses in development
- ⚠️ **Email**: Mock responses in development

### Implementation Status

#### ✅ FULLY IMPLEMENTED (Production Ready - 7/10 modules)
- **Authentication** ([src/controllers/supabaseAuthController.js](src/controllers/supabaseAuthController.js:1)) - All 16 endpoints working with JWT & Supabase
- **Collections** ([src/controllers/collectionController.js](src/controllers/collectionController.js:1)) - Complete CRUD with 70/30 cash-token split
- **Users** ([src/controllers/userController.js](src/controllers/userController.js:1)) - Full user management
- **Hubs** ([src/controllers/hubController.js](src/controllers/hubController.js:1)) - Collection hub management
- **Health Data** ([src/controllers/healthController.js](src/controllers/healthController.js:1)) - ~85% complete (2 endpoints return 501)
- **Donations** ([src/controllers/donationController.js](src/controllers/donationController.js:1)) - Complete donation tracking
- **Volunteers** ([src/controllers/volunteerController.js](src/controllers/volunteerController.js:1)) - Full volunteer system

#### ⚠️ PARTIALLY IMPLEMENTED (Needs OpenAI Integration)
- **AI Assistant** ([src/controllers/aiController.js](src/controllers/aiController.js:1)) - ~40% complete
  - Chat endpoint structure exists but needs OpenAI API
  - Voice response uses mock transcription
  - Missing real health recommendation engine

#### 🚧 MOCK IMPLEMENTATIONS (Returns Hardcoded Data)
- **Payments** ([src/controllers/paymentController.js](src/controllers/paymentController.js:1)) - All functions return mock data, no real payment gateway
- **Analytics** ([src/controllers/analyticsController.js](src/controllers/analyticsController.js:1)) - All statistics are hardcoded, no database queries

### Testing

**IMPORTANT**: Before testing, you MUST run these database setup scripts:

```bash
# 1. Clean slate
psql 'connection-string' < database/1_drop_all.sql

# 2. Create tables
psql 'connection-string' < database/2_create_tables.sql

# 3. Add seed data
psql 'connection-string' < database/3_seed_data.sql

# 4. Fix passwords (REQUIRED!)
psql 'connection-string' < database/fix_passwords.sql

# 5. Add auth columns (REQUIRED!)
# Run in Supabase SQL Editor:
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
```

Test protected routes:

```bash
# 1. Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kwame.mensah@example.com","password":"password123"}'

# Expected response:
# {"success":true,"data":{"user":{...},"accessToken":"eyJ...","refreshToken":"eyJ..."}}

# 2. Use returned token
TOKEN="<accessToken_from_above>"

# Test collections
curl http://localhost:5000/api/collections \
  -H "Authorization: Bearer $TOKEN"

# Test hubs
curl http://localhost:5000/api/hubs \
  -H "Authorization: Bearer $TOKEN"

# Test health insights (public, no auth needed)
curl "http://localhost:5000/api/health/insights?lat=5.6037&lng=-0.1870"
```

For detailed information, see:
- [DATABASE_ER_DIAGRAM.md](DATABASE_ER_DIAGRAM.md) - Complete database schema with relationships
- [SEED_DATA_GUIDE.md](SEED_DATA_GUIDE.md) - Seed data reference and test scenarios
- [CLAUDE.md](CLAUDE.md) - Complete developer onboarding guide
- `database/` - All SQL setup scripts

---

## Database Schema

### Tables Overview

| Table | Purpose | Records (Seed Data) |
|-------|---------|---------------------|
| `users` | User accounts and authentication | 10 users |
| `hubs` | Collection hub locations | 5 hubs |
| `collections` | Plastic collection records | 15 collections |
| `health_data` | Health intelligence data | 8 records |
| `donations` | Financial donations | 6 donations |
| `payments` | Payment transactions | 6 payments |
| `volunteers` | Volunteer applications | 5 applications |
| `ai_interactions` | AI chat history | 10 interactions |
| `analytics_cache` | Cached analytics data | 3 cache entries |
| `notifications` | User notifications | 5 notifications |

### Key Relationships

```
users
├── collections (as collector)
├── collections (as verifier)
├── hubs (as manager)
├── health_data (as creator)
├── donations (as donor)
├── payments
├── volunteers
├── ai_interactions
└── notifications

hubs
└── collections

collections
├── collector (user)
├── hub
├── created_by (user)
└── updated_by (user)

donations
├── donor (user)
└── payment

payments
├── user
└── donation
```

### Sample Data Overview

**Users by Role:**
- 4 Collectors (1,250 - 320 points, levels 2-5)
- 2 Hub Managers (managing 5 hubs)
- 2 Volunteers (1 approved, 1 pending)
- 2 Donors (3,800 GHS total donations)

**Collection Hubs:**
1. Accra Central Hub - 3,250/5,000 kg capacity
2. Kumasi Tech Hub - 2,100/4,000 kg capacity
3. Takoradi Coastal Hub - 1,800/3,500 kg capacity
4. Tamale Northern Hub - 950/3,000 kg capacity
5. Cape Coast University Hub - 1,200/2,500 kg capacity

**Collections Summary:**
- Total: 295.4 kg collected
- Status: 14 verified, 1 pending
- Types: PET (majority), HDPE, LDPE, PP, Mixed
- Quality: Excellent (8), Good (5), Fair (2)

**Health Data Coverage:**
- 8 locations across 5 regions
- Risk levels: 2 high, 4 medium, 2 low
- Top issues: Respiratory (67 cases), Diarrhea (34), Malaria (45)

## Testing Examples

### Complete User Journey

```bash
# 1. Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Collector",
    "email": "test.collector@example.com",
    "phone": "+233200000000",
    "password": "password123",
    "role": "collector"
  }'

# 2. Login with existing user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "kwame.mensah@example.com",
    "password": "password123"
  }'
# Save the token from response

# 3. Get user profile
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. View nearby hubs
curl -X GET "http://localhost:5000/api/hubs/nearby?lat=5.6037&lng=-0.1870&radius=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Create collection
curl -X POST http://localhost:5000/api/collections \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hub": "650e8400-e29b-41d4-a716-446655440001",
    "plasticType": "PET",
    "weight": 10.5,
    "quantity": 85,
    "collectionLocation": {
      "type": "Point",
      "coordinates": [-0.1870, 5.6037],
      "address": "Test Location, Accra"
    }
  }'

# 6. View collections
curl -X GET http://localhost:5000/api/collections \
  -H "Authorization: Bearer YOUR_TOKEN"

# 7. Get health insights
curl -X GET "http://localhost:5000/api/health/insights?lat=5.6037&lng=-0.1870"

# 8. Chat with AI
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the health benefits of collecting plastic?",
    "type": "chat"
  }'

# 9. Make donation
curl -X POST http://localhost:5000/api/donations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "type": "one-time",
    "payment": {
      "method": "mobile_money"
    }
  }'

# 10. View analytics
curl -X GET http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Hub Manager Actions

```bash
# Login as hub manager
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yaw.boateng@example.com",
    "password": "password123"
  }'

# Verify collection
curl -X PATCH http://localhost:5000/api/collections/COLLECTION_ID/verify \
  -H "Authorization: Bearer HUB_MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quality": "excellent",
    "verificationNotes": "High quality PET bottles"
  }'

# View hub analytics
curl -X GET http://localhost:5000/api/hubs/HUB_ID/analytics \
  -H "Authorization: Bearer HUB_MANAGER_TOKEN"
```

## Support

For API support and questions, please refer to:
- **Route Status:** `ROUTE_STATUS_REPORT.md` - Current route testing results
- **Setup Guide:** `SUPABASE_COMPLETE_SETUP.md` - Database setup instructions
- **Schema:** `database/complete_schema.sql` - Full database schema
- **Seed Data:** `database/seed_data.sql` - Test data population

**Repository:** HACK-54-TEAM-9/Sankofa  
**Last Updated**: October 26, 2025  
**API Version**: 1.0.0  
**Database**: Supabase PostgreSQL

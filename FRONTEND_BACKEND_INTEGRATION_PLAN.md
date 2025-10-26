# Frontend-Backend Integration Plan

## Overview
This document outlines the integration plan between the Sankofa frontend (React + TypeScript) and backend (Node.js + Express + Supabase).

**Priority**: Frontend pages take precedence - backend will be modified to match frontend needs.

---

## Current State Analysis

### Frontend Pages (sankofa-frontend/)

The frontend uses client-side routing with the following pages:

#### Public Pages
1. **HomePage** - Main landing page
2. **LocationInsightsPage** - Health insights by location
3. **AIAssistantPage** - AI chatbot interface
4. **AboutPage** - About the platform
5. **ContactPage** - Contact information
6. **BlogPage** - Blog/news
7. **DataInsightsPage** - Data visualizations
8. **VolunteerPage** - Volunteer opportunities
9. **DonationsPage** - Donation interface
10. **LoginPage** - Authentication

#### Collector Pages (Role: collector)
11. **CollectorPage** - Landing page for collectors
12. **CollectorDashboard** - Collector dashboard (authenticated)

#### Hub Manager Pages (Role: hub-manager)
13. **HubManagerPage** - Landing page for hub managers
14. **HubManagerDashboard** - Hub manager main dashboard (authenticated)
15. **HubTransactionFlow** - Process plastic collections
16. **CollectorRegistrationFlow** - Register new collectors
17. **RegisteredCollectorsList** - View all registered collectors
18. **HubTransactionsPage** - Transaction history
19. **HubSettingsPage** - Hub settings

#### Messaging
20. **MessagingPage** - In-app messaging

### Frontend API Calls (Current)

The frontend currently expects these endpoints (from `utils/api.tsx`):

```typescript
// Base URL: Supabase function (needs to be changed to backend server)
API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6c51ae02`

// Auth
POST   /signup
GET    /user

// Collector
GET    /collector/dashboard
POST   /collector/collect

// Hub Manager
GET    /hub/dashboard
GET    /hub/pending-collections
GET    /hub/search-collector/:phone
POST   /hub/register-collector
POST   /hub/register-collector-full
POST   /hub/process-transaction
GET    /hub/collectors

// Messaging
GET    /messages
POST   /messages
PUT    /messages/:id/read

// Donations
POST   /donations
GET    /donations/stats

// Volunteers
POST   /volunteers

// Health
GET    /health-insights/:location
```

### Backend API Routes (Current)

The backend provides these routes under `/api` prefix:

#### Auth Routes (`/api/auth`)
- POST   `/api/auth/register`
- POST   `/api/auth/login`
- POST   `/api/auth/logout`
- POST   `/api/auth/forgot-password`
- POST   `/api/auth/reset-password`
- GET    `/api/auth/verify-email`
- POST   `/api/auth/resend-verification`
- POST   `/api/auth/verify-phone`
- POST   `/api/auth/resend-phone-verification`
- POST   `/api/auth/refresh-token`
- GET    `/api/auth/me`
- GET    `/api/auth/profile`
- PUT    `/api/auth/profile`
- PUT    `/api/auth/password`
- DELETE `/api/auth/account`

#### Users Routes (`/api/users`)
- GET    `/api/users` (admin only)
- GET    `/api/users/:id`
- PUT    `/api/users/:id`
- DELETE `/api/users/:id`
- GET    `/api/users/stats`
- GET    `/api/users/collectors`
- GET    `/api/users/hub-managers`

#### Collections Routes (`/api/collections`)
- POST   `/api/collections`
- GET    `/api/collections`
- GET    `/api/collections/stats`
- GET    `/api/collections/top-collectors`
- GET    `/api/collections/location`
- GET    `/api/collections/user/:userId`
- GET    `/api/collections/hub/:hubId`
- GET    `/api/collections/:id`
- PUT    `/api/collections/:id`
- DELETE `/api/collections/:id`
- PATCH  `/api/collections/:id/verify`

#### Hubs Routes (`/api/hubs`)
- GET    `/api/hubs`
- GET    `/api/hubs/nearby`
- GET    `/api/hubs/stats`
- GET    `/api/hubs/top-performing`
- GET    `/api/hubs/:id`
- GET    `/api/hubs/:id/collectors`
- GET    `/api/hubs/:id/collections`
- GET    `/api/hubs/:id/analytics`
- POST   `/api/hubs`
- PUT    `/api/hubs/:id`
- PATCH  `/api/hubs/:id/status`
- DELETE `/api/hubs/:id`

#### Health Routes (`/api/health`)
- GET    `/api/health/insights`
- GET    `/api/health/trends`
- GET    `/api/health/high-risk-areas`
- GET    `/api/health/disease-patterns`
- GET    `/api/health/environmental`
- GET    `/api/health`
- GET    `/api/health/region/:region`
- GET    `/api/health/:id`
- POST   `/api/health`
- PUT    `/api/health/:id`
- DELETE `/api/health/:id`

#### AI Routes (`/api/ai`)
- POST   `/api/ai/chat`
- POST   `/api/ai/voice`
- GET    `/api/ai/insights`
- GET    `/api/ai/popular-queries`
- GET    `/api/ai/performance`
- GET    `/api/ai/health-recommendations`
- GET    `/api/ai/collection-advice`
- GET    `/api/ai/location-insights`
- GET    `/api/ai/history`
- POST   `/api/ai/feedback/:interactionId`

#### Donations Routes (`/api/donations`)
- GET    `/api/donations` (admin only)
- GET    `/api/donations/stats`
- GET    `/api/donations/top-donors`
- GET    `/api/donations/recurring`
- GET    `/api/donations/history`
- GET    `/api/donations/:id`
- GET    `/api/donations/:id/impact-report`
- POST   `/api/donations`
- POST   `/api/donations/:id/process`
- PUT    `/api/donations/:id`
- PATCH  `/api/donations/:id/cancel-recurring`
- DELETE `/api/donations/:id`

#### Volunteers Routes (`/api/volunteers`)
- GET    `/api/volunteers` (admin only)
- GET    `/api/volunteers/stats`
- GET    `/api/volunteers/opportunities`
- GET    `/api/volunteers/:id`
- POST   `/api/volunteers`
- PUT    `/api/volunteers/:id`
- PATCH  `/api/volunteers/:id/status`
- DELETE `/api/volunteers/:id`

#### Analytics Routes (`/api/analytics`)
- GET    `/api/analytics/dashboard`
- GET    `/api/analytics/collections`
- GET    `/api/analytics/health`
- GET    `/api/analytics/users`
- GET    `/api/analytics/hubs`
- GET    `/api/analytics/donations`
- GET    `/api/analytics/ai`
- GET    `/api/analytics/environmental-impact`
- GET    `/api/analytics/predictive-insights`
- GET    `/api/analytics/performance`
- GET    `/api/analytics/trends`
- GET    `/api/analytics/geographic`
- GET    `/api/analytics/export`

#### Payments Routes (`/api/payments`)
- GET    `/api/payments/methods`
- GET    `/api/payments/history`
- GET    `/api/payments/stats`
- GET    `/api/payments/:paymentId/status`
- POST   `/api/payments`
- POST   `/api/payments/mobile-money`
- POST   `/api/payments/bank-transfer`
- POST   `/api/payments/card`
- POST   `/api/payments/webhook`

---

## Integration Issues & Solutions

### 1. Base URL Mismatch

**Issue**: Frontend points to Supabase Function, backend is standalone Express server

**Solution**:
- Update `sankofa-frontend/utils/api.tsx` to point to backend server
- Change: `https://${projectId}.supabase.co/functions/v1/make-server-6c51ae02`
- To: `http://localhost:5000/api` (development) or production URL

### 2. Route Structure Differences

**Issue**: Frontend expects flat routes, backend uses nested `/api` prefix

**Solution**: Two options:
- Option A (Recommended): Update frontend API calls to include `/api` prefix
- Option B: Add route aliases in backend for backward compatibility

### 3. Missing Backend Routes

The following routes expected by frontend don't exist in backend:

#### Missing Collector Routes
- `GET /collector/dashboard` → Map to `/api/users/me` + `/api/collections/user/:userId`
- `POST /collector/collect` → Map to `/api/collections`

#### Missing Hub Manager Routes
- `GET /hub/dashboard` → Map to `/api/hubs/:id/analytics`
- `GET /hub/pending-collections` → Map to `/api/collections/hub/:hubId?status=pending`
- `GET /hub/search-collector/:phone` → **NEW ROUTE NEEDED**
- `POST /hub/register-collector` → **NEW ROUTE NEEDED** (simple registration)
- `POST /hub/register-collector-full` → **NEW ROUTE NEEDED** (full registration)
- `POST /hub/process-transaction` → Map to `/api/collections` + payment processing
- `GET /hub/collectors` → Map to `/api/hubs/:id/collectors`

#### Missing Health Routes
- `GET /health-insights/:location` → Map to `/api/health/region/:region`

### 4. Missing Messaging Routes

**Issue**: Frontend has MessagingPage but backend has no message routes

**Solution**: Create new `/api/messages` routes:
```javascript
GET    /api/messages
POST   /api/messages
PUT    /api/messages/:id/read
DELETE /api/messages/:id
```

---

## Implementation Plan

### Phase 1: Critical Routes (Week 1)

**Priority**: Get authentication and basic functionality working

1. **Update Frontend API Configuration**
   - File: `sankofa-frontend/utils/api.tsx`
   - Change `API_BASE_URL` to point to backend server
   - Add `/api` prefix to all routes

2. **Create Missing Hub Manager Routes**
   - File: `sankofa-backend/src/routes/hubs.js`
   - Add collector search by phone
   - Add collector registration endpoints
   - Add transaction processing endpoint

3. **Create Messaging Routes**
   - New file: `sankofa-backend/src/routes/messages.js`
   - Implement CRUD operations for messages
   - Add real-time notifications via Socket.IO

4. **Update Auth Routes**
   - Map `/signup` to `/api/auth/register`
   - Map `/user` to `/api/auth/me`

### Phase 2: Dashboard Integration (Week 2)

**Priority**: Connect dashboards to backend data

1. **Collector Dashboard**
   - Create composite endpoint that returns:
     - User profile
     - Collection history
     - Earnings summary
     - Health tokens balance

2. **Hub Manager Dashboard**
   - Create composite endpoint that returns:
     - Hub stats
     - Pending collections
     - Top collectors
     - Recent transactions

3. **Data Insights Page**
   - Connect to `/api/analytics` endpoints
   - Implement data visualization components

### Phase 3: Advanced Features (Week 3)

1. **AI Integration**
   - Connect AIAssistantPage to `/api/ai/chat`
   - Implement voice response feature
   - Add conversation history

2. **Location Insights**
   - Connect to `/api/health/insights`
   - Implement map visualization
   - Add risk area highlighting

3. **Real-time Updates**
   - Implement Socket.IO on frontend
   - Add real-time collection updates
   - Add real-time messaging

### Phase 4: Testing & Optimization (Week 4)

1. **End-to-End Testing**
   - Test all user flows
   - Verify data consistency
   - Check error handling

2. **Performance Optimization**
   - Implement caching
   - Optimize database queries
   - Add loading states

3. **Security Hardening**
   - Verify authentication on all routes
   - Add CSRF protection
   - Implement rate limiting

---

## New Backend Routes to Implement

### 1. Hub Manager Collector Management

```javascript
// sankofa-backend/src/routes/hubs.js

// Search for collector by phone number
GET /api/hubs/:hubId/search-collector?phone=:phone

// Simple collector registration (for quick onboarding)
POST /api/hubs/:hubId/register-collector
{
  phone: string,
  name: string,
  neighborhood: string
}

// Full collector registration (with all details)
POST /api/hubs/:hubId/register-collector-full
{
  collectorId: string,
  cardNumber: string,
  fullName: string,
  phoneNumber: string | null,
  hasPhone: 'yes' | 'no' | 'shared',
  emergencyContact: string | null,
  neighborhood: string,
  landmark: string | null,
  preferredLanguage: string,
  canRead: 'yes' | 'no',
  photo: string | null,
  physicalIdNumber: string | null,
  notes: string | null,
  registeredBy: string,
  registrationDate: string
}

// Process collection transaction
POST /api/hubs/:hubId/transactions
{
  collectorId: string,
  collectorPhone: string,
  plasticType: string,
  weight: number,
  location: { latitude: number, longitude: number } | null,
  totalValue: number,
  instantCash: number,
  savingsToken: number,
  timestamp: string
}

// Get pending collections for verification
GET /api/hubs/:hubId/pending-collections
```

### 2. Messaging System

```javascript
// sankofa-backend/src/routes/messages.js

// Get all messages for authenticated user
GET /api/messages

// Send a new message
POST /api/messages
{
  recipientId: string,
  subject: string,
  content: string
}

// Mark message as read
PUT /api/messages/:id/read

// Delete message
DELETE /api/messages/:id

// Get unread count
GET /api/messages/unread-count
```

### 3. Dashboard Composite Endpoints

```javascript
// sankofa-backend/src/routes/users.js

// Get collector dashboard data
GET /api/users/collector/dashboard
Returns:
{
  profile: {...},
  stats: {
    totalCollections: number,
    totalWeight: number,
    totalEarnings: number,
    healthTokens: number,
    rank: number
  },
  recentCollections: [...],
  achievements: [...]
}

// Get hub manager dashboard data
GET /api/hubs/:hubId/dashboard
Returns:
{
  hub: {...},
  stats: {
    todayCollections: number,
    weeklyCollections: number,
    monthlyCollections: number,
    activeCollectors: number,
    pendingVerifications: number
  },
  topCollectors: [...],
  recentTransactions: [...]
}
```

---

## Frontend Updates Required

### 1. API Configuration

**File**: `sankofa-frontend/utils/api.tsx`

```typescript
// OLD
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6c51ae02`;

// NEW
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

### 2. Environment Variables

**File**: `sankofa-frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Route Mappings

Update all API calls to use new backend routes:

```typescript
// Auth API
export const authAPI = {
  signup: (data) => fetchAPI('/auth/register', {...}),  // Changed from /signup
  login: (data) => fetchAPI('/auth/login', {...}),
  getUser: (token) => fetchAPI('/auth/me', {}, token),  // Changed from /user
};

// Collector API
export const collectorAPI = {
  getDashboard: (token) => fetchAPI('/users/collector/dashboard', {}, token),  // Changed
  submitCollection: (token, data) => fetchAPI('/collections', {...}, token),   // Changed
};

// Hub Manager API
export const hubAPI = {
  getDashboard: (hubId, token) => fetchAPI(`/hubs/${hubId}/dashboard`, {}, token),
  getPendingCollections: (hubId, token) => fetchAPI(`/hubs/${hubId}/pending-collections`, {}, token),
  searchCollector: (hubId, phone, token) => fetchAPI(`/hubs/${hubId}/search-collector?phone=${phone}`, {}, token),
  registerCollector: (hubId, data, token) => fetchAPI(`/hubs/${hubId}/register-collector`, {...}, token),
  registerCollectorFull: (hubId, data, token) => fetchAPI(`/hubs/${hubId}/register-collector-full`, {...}, token),
  processTransaction: (hubId, data, token) => fetchAPI(`/hubs/${hubId}/transactions`, {...}, token),
  getCollectors: (hubId, token) => fetchAPI(`/hubs/${hubId}/collectors`, {}, token),
};

// Health API
export const healthAPI = {
  getInsights: (location) => fetchAPI(`/health/region/${encodeURIComponent(location)}`),
};

// Messaging API
export const messagesAPI = {
  getMessages: (token) => fetchAPI('/messages', {}, token),
  sendMessage: (data, token) => fetchAPI('/messages', {method: 'POST', body: JSON.stringify(data)}, token),
  markAsRead: (messageId, token) => fetchAPI(`/messages/${messageId}/read`, {method: 'PUT'}, token),
  getUnreadCount: (token) => fetchAPI('/messages/unread-count', {}, token),
};

// Donations and Volunteers remain the same
```

---

## Backend CORS Configuration

**File**: `sankofa-backend/src/server.js`

Update CORS to allow frontend origin:

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',  // Add Vite default port
    'http://localhost:5174'   // Alternative port
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
```

---

## Database Schema Alignment

Ensure frontend data models match backend Supabase tables:

### Key Tables

1. **users** - User profiles (collectors, hub managers, admins)
2. **hubs** - Collection hub locations
3. **collections** - Plastic collection records
4. **transactions** - Financial transactions
5. **messages** - In-app messaging
6. **donations** - Donor contributions
7. **volunteers** - Volunteer applications
8. **health_data** - Health and disease data

---

## Testing Strategy

### 1. Unit Tests
- Test individual API endpoints
- Test frontend components in isolation
- Verify data transformations

### 2. Integration Tests
- Test full user flows
- Verify database transactions
- Check authentication flows

### 3. E2E Tests
- Collector registration flow
- Collection submission flow
- Hub manager verification flow
- Donation flow
- Messaging flow

---

## Deployment Considerations

### Frontend
- Build: `cd sankofa-frontend && npm run build`
- Serve static files via Nginx or Vercel
- Configure environment variables

### Backend
- Deploy to: Heroku, Railway, or DigitalOcean
- Set environment variables
- Configure Supabase connection
- Enable HTTPS

### Database
- Supabase (already configured)
- Run migrations
- Seed initial data

---

## Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| Week 1 | Critical Routes | Auth working, basic hub operations |
| Week 2 | Dashboard Integration | All dashboards connected to backend |
| Week 3 | Advanced Features | AI, location insights, real-time updates |
| Week 4 | Testing & Launch | Production-ready application |

---

## Next Steps

1. ✅ Review this integration plan
2. ⏳ Update frontend API configuration
3. ⏳ Implement missing backend routes
4. ⏳ Create messaging system
5. ⏳ Test authentication flow
6. ⏳ Connect dashboards
7. ⏳ Implement real-time features
8. ⏳ Deploy to production

---

## Notes

- Backend uses Supabase (PostgreSQL) - no Mongoose/MongoDB
- Frontend uses client-side routing (no React Router needed currently)
- Authentication uses Supabase Auth + JWT
- Real-time features use Socket.IO
- File uploads use Cloudinary (backend integrated)


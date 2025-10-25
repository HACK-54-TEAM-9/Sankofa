# Sankofa-Coin Backend API Documentation

## Overview

The Sankofa-Coin Backend API is a comprehensive RESTful API for managing plastic collection, health intelligence, and community impact tracking in Ghana. The API supports multiple user roles including collectors, hub managers, volunteers, donors, and administrators.

**Base URL:** `http://localhost:5000/api`  
**Version:** 1.0.0  
**Environment:** Development (External services disabled)

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
- `name`: 2-100 characters
- `email`: Valid email format
- `phone`: Ghana phone number format (+233XXXXXXXXX)
- `password`: Minimum 6 characters
- `role`: One of: `collector`, `hub-manager`, `volunteer`, `donor`

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "collector"
    },
    "token": "jwt_token"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "collector"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST `/api/auth/logout`
Logout user and invalidate token.

**Headers:** `Authorization: Bearer <token>`

#### GET `/api/auth/me`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

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

All routes require authentication.

#### GET `/api/analytics/dashboard`
Get dashboard statistics.

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

All routes require authentication.

#### GET `/api/payments/methods`
Get available payment methods.

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

⚠️ **Current Status**: The API is running in development mode with the following services disabled:

- **Database**: MongoDB operations are skipped
- **Redis**: Caching operations are skipped  
- **SMS**: Twilio SMS service returns mock responses
- **Email**: SMTP email service returns mock responses

All API endpoints are functional and return appropriate responses, but data persistence and external service integrations are disabled for development purposes.

---

## Support

For API support and questions, please refer to the project documentation or contact the development team.

**Last Updated**: October 25, 2025  
**API Version**: 1.0.0

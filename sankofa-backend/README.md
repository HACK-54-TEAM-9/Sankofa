# Sankofa-Coin Backend API

A comprehensive backend API for Sankofa-Coin, a platform that transforms plastic pollution into predictive health intelligence and healthcare access for Ghana.

## 🚀 Features

### Core Functionality
- **User Management**: Authentication, authorization, and profile management for collectors, hub managers, volunteers, and donors
- **Plastic Collection System**: Track collections, calculate rewards, and manage the dual split system (70% cash, 30% health tokens)
- **Health Intelligence**: AI-powered risk mapping, disease tracking, and location-based health insights
- **Hub Management**: Collection hub operations, verification, and analytics
- **Payment Processing**: Mobile money, bank transfer, and international payment integration
- **AI Assistant**: Chat interface, voice support, and health insights
- **Donation System**: Multiple tiers, impact tracking, and recurring donations
- **Volunteer Management**: Applications, opportunities, and tracking
- **Real-time Analytics**: Live metrics, predictive modeling, and performance tracking

### Technical Features
- **RESTful API**: Well-structured endpoints with proper HTTP methods
- **Real-time Communication**: WebSocket support for live updates
- **Caching**: Redis integration for performance optimization
- **Security**: JWT authentication, rate limiting, and input validation
- **Monitoring**: Comprehensive logging and error handling
- **Scalability**: Microservices-ready architecture

## 🏗️ Architecture

```
src/
├── controllers/     # Request handlers and business logic
├── middleware/      # Authentication, validation, and error handling
├── models/         # Database models and schemas
├── routes/         # API route definitions
├── services/       # External service integrations
├── utils/          # Utility functions and helpers
└── config/         # Configuration files
```

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **Email**: Nodemailer
- **SMS**: Twilio
- **AI**: OpenAI GPT-4
- **Payments**: Mobile Money, Bank Transfer APIs
- **File Storage**: Cloudinary
- **Logging**: Winston
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 4.4 or higher
- Redis 6.0 or higher
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sankofa-coin-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Configure the following environment variables:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   HOST=localhost

   # Database
   MONGODB_URI=mongodb://localhost:27017/sankofa-coin
   REDIS_URL=redis://localhost:6379

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d

   # API Keys
   OPENAI_API_KEY=your-openai-api-key
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   
   # Add other required environment variables...
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Collection Endpoints
- `POST /api/collections` - Create a new collection
- `GET /api/collections` - Get collections with filters
- `GET /api/collections/:id` - Get specific collection
- `PUT /api/collections/:id` - Update collection
- `PATCH /api/collections/:id/verify` - Verify collection
- `GET /api/collections/stats` - Get collection statistics

### Health Intelligence Endpoints
- `GET /api/health/insights` - Get location-based health insights
- `GET /api/health/trends` - Get health trend data
- `GET /api/health/high-risk-areas` - Get high-risk areas
- `POST /api/health` - Create health data entry
- `GET /api/health/region/:region` - Get health data by region

### AI Assistant Endpoints
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/voice` - Voice interaction with AI
- `GET /api/ai/health-recommendations` - Get health recommendations
- `GET /api/ai/collection-advice` - Get collection advice
- `GET /api/ai/history` - Get AI interaction history

### Hub Management Endpoints
- `GET /api/hubs` - Get all hubs
- `GET /api/hubs/nearby` - Get nearby hubs
- `POST /api/hubs` - Create new hub
- `PUT /api/hubs/:id` - Update hub
- `GET /api/hubs/:id/analytics` - Get hub analytics

### Donation Endpoints
- `POST /api/donations` - Create donation
- `GET /api/donations` - Get donations
- `POST /api/donations/:id/process` - Process donation payment
- `GET /api/donations/stats` - Get donation statistics
- `GET /api/donations/top-donors` - Get top donors

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/collections` - Get collection analytics
- `GET /api/analytics/health` - Get health analytics
- `GET /api/analytics/users` - Get user analytics
- `GET /api/analytics/trends` - Get trend analysis

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Data Models

### User Model
- Basic information (name, email, phone)
- Role-based profiles (collector, hub-manager, volunteer, donor)
- Location and preferences
- Activity tracking

### Collection Model
- Plastic details (type, weight, quantity)
- Location and quality assessment
- Financial calculations (70% cash, 30% health tokens)
- Status tracking and verification

### Health Data Model
- Location-based health metrics
- Disease tracking and risk assessment
- Environmental health indicators
- AI analysis and predictions

### Hub Model
- Location and contact information
- Operating hours and capacity
- Equipment and services
- Performance metrics

## 🔄 Real-time Features

The API supports real-time updates through WebSocket connections:

- Collection status updates
- Health alerts and notifications
- Hub notifications
- AI interaction updates
- Payment status updates
- System announcements

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Monitoring and Logging

- **Winston Logger**: Comprehensive logging with different levels
- **Error Tracking**: Centralized error handling and reporting
- **Performance Monitoring**: Request timing and performance metrics
- **Health Checks**: API health monitoring endpoints

## 🚀 Deployment

### Production Environment
1. Set `NODE_ENV=production`
2. Configure production database and Redis
3. Set up SSL certificates
4. Configure reverse proxy (nginx)
5. Set up monitoring and logging
6. Configure backup strategies

### Docker Deployment
```bash
# Build Docker image
docker build -t sankofa-coin-backend .

# Run with Docker Compose
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT signing secret
- `OPENAI_API_KEY`: OpenAI API key
- `TWILIO_*`: Twilio configuration
- `SMTP_*`: Email service configuration

### Feature Flags
- `ENABLE_AI_ASSISTANT`: Enable/disable AI features
- `ENABLE_VOICE_SUPPORT`: Enable/disable voice features
- `ENABLE_REAL_TIME_ANALYTICS`: Enable/disable real-time analytics
- `ENABLE_PUSH_NOTIFICATIONS`: Enable/disable push notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@sankofacoin.org
- Documentation: [API Docs](https://docs.sankofacoin.org)
- Issues: [GitHub Issues](https://github.com/sankofacoin/backend/issues)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core API functionality
- ✅ User management and authentication
- ✅ Collection and hub management
- ✅ Basic health intelligence

### Phase 2 (Next)
- 🔄 Advanced AI features
- 🔄 Mobile app integration
- 🔄 Payment gateway integration
- 🔄 Advanced analytics

### Phase 3 (Future)
- 📋 Blockchain integration
- 📋 IoT device integration
- 📋 Advanced ML models
- 📋 International expansion

---

**Sankofa-Coin Backend** - Transforming plastic pollution into predictive health intelligence for Ghana 🇬🇭

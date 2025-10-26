# Sankofa - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- Supabase account (database already configured)

---

## 🚀 Quick Start (2 minutes)

### Step 1: Start Backend Server

```bash
cd sankofa-backend
npm start
```

✅ Backend should now be running on **http://localhost:6000**

### Step 2: Start Frontend Server

Open a **new terminal**:

```bash
cd sankofa-frontend
npm run dev
```

✅ Frontend should now be running on **http://localhost:5173**

### Step 3: Access the Application

Open your browser and go to: **http://localhost:5173**

---

## ✅ Verify Integration

### Test Backend Health

```bash
curl http://localhost:6000/health
```

Expected: `{"status":"OK", ...}`

### Test Frontend to Backend Communication

1. Open http://localhost:5173 in your browser
2. Open DevTools (F12) → Network tab
3. Click on "Location Health Insights" or any page
4. Verify API calls go to `http://localhost:6000/api/*`
5. Check responses are successful (200 status)

---

## 📁 Project Structure

```
Sankofa/
├── sankofa-frontend/       # React + TypeScript + Vite
│   ├── .env               # ✅ Frontend configuration (created)
│   ├── utils/api.tsx      # ✅ API routes (updated)
│   └── ...
├── sankofa-backend/        # Node.js + Express + Supabase
│   ├── .env               # ✅ Backend configuration (updated)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── messages.js    # ✅ NEW: Messaging routes
│   │   │   └── hubs.js        # ✅ ENHANCED: Hub manager routes
│   │   └── controllers/
│   │       ├── messageController.js       # ✅ NEW
│   │       └── hubController.js           # ✅ ENHANCED
│   └── ...
└── INTEGRATION_COMPLETE.md    # ✅ Full integration documentation
```

---

## 🔑 Key Features Integrated

### ✅ Phase 1 Complete

- [x] Frontend API configuration
- [x] Backend CORS setup
- [x] Authentication routes
- [x] Collector routes
- [x] Hub manager routes (6 new endpoints)
- [x] Messaging system (5 new endpoints)
- [x] Health insights routes
- [x] AI assistant routes
- [x] Analytics routes
- [x] Donations & volunteers routes

---

## 🧪 Test User Flows

### 1. View Public Pages
- Home page
- Location Health Insights
- About page
- Donations page

### 2. Authentication (Once Database is Seeded)
- Register new user
- Login
- View profile
- Update profile

### 3. Collector Flow
- Login as collector
- View dashboard
- Submit collection
- View collection history

### 4. Hub Manager Flow
- Login as hub manager
- View dashboard
- Search for collector
- Register new collector
- Process transaction
- View pending collections

### 5. Messaging
- Send message
- View messages
- Mark as read
- Delete message

---

## 🗄️ Database Setup (Required)

The integration is complete, but you need to ensure Supabase tables exist:

### Required Tables

1. **users** - User accounts
2. **hubs** - Collection hubs
3. **collections** - Plastic collections
4. **messages** - In-app messaging (NEW)
5. **payments** - Transactions
6. **donations** - Donor contributions
7. **volunteers** - Volunteer applications
8. **health_data** - Health metrics

### Run Database Setup

```bash
cd sankofa-backend
npm run setup-db    # If setup script exists
# OR manually run SQL from database/ folder
```

---

## 🐛 Common Issues

### Backend won't start
- Check port 6000 is not in use: `lsof -i :6000`
- Verify `.env` file exists in `sankofa-backend/`
- Check Supabase credentials are correct

### Frontend won't start
- Check port 5173 is not in use: `lsof -i :5173`
- Verify `.env` file exists in `sankofa-frontend/`
- Run `npm install` if dependencies missing

### CORS Errors
- Ensure backend is running on port 6000
- Ensure frontend is running on port 5173
- Check `CORS_ORIGIN` in backend `.env`

### API 404 Errors
- Verify backend is running
- Check API routes have `/api` prefix
- Check backend console for route registration logs

---

## 📚 Documentation

- **Full Integration Details**: [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)
- **Integration Plan**: [FRONTEND_BACKEND_INTEGRATION_PLAN.md](FRONTEND_BACKEND_INTEGRATION_PLAN.md)
- **Backend API Documentation**: [sankofa-backend/API_DOCUMENTATION.md](sankofa-backend/API_DOCUMENTATION.md)
- **Database Schema**: [sankofa-backend/DATABASE_ER_DIAGRAM.md](sankofa-backend/DATABASE_ER_DIAGRAM.md)

---

## 🎯 Next Steps

### Immediate (Phase 2)
1. Seed database with test data
2. Test all user flows
3. Implement collector dashboard composite endpoint
4. Connect all frontend components to real API

### Soon (Phase 3)
1. Real-time messaging with Socket.IO
2. File upload for collector photos
3. AI assistant chat interface
4. Location-based features with maps

### Later (Phase 4)
1. Production deployment
2. Performance optimization
3. Security hardening
4. Monitoring and logging

---

## 💡 Tips

- **Hot Reload**: Both frontend and backend support hot reload - changes are reflected immediately
- **Logs**: Check backend terminal for API request logs
- **DevTools**: Use browser DevTools Network tab to debug API calls
- **Postman**: Use Postman/Insomnia to test API endpoints directly

---

## 🆘 Need Help?

1. Check [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) for detailed troubleshooting
2. Review backend logs in `sankofa-backend/logs/`
3. Check Supabase dashboard for database issues
4. Verify all environment variables are set correctly

---

**Status**: ✅ Phase 1 Complete - Ready for Testing

*Last Updated: January 27, 2025*

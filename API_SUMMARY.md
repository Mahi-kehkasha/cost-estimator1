# API Summary - Quick Reference

## 🌐 External APIs Used

### 1. **OpenAI API** (Primary)
- **Purpose**: AI-powered construction cost estimation
- **Location**: `src/components/DraftEstimateSpecifications/DraftEstimateSpecifications.jsx`
- **Key Required**: `VITE_OPENAI_API_KEY` in `.env`
- **Status**: ✅ Active
- **Usage**: Generates detailed material and cost breakdowns

### 2. **Unsplash Images** (Secondary)
- **Purpose**: Project type images
- **Location**: `src/components/ChatGPTInputSummary/ChatGPTInputSummary.jsx`
- **Key Required**: ❌ No API key needed (public images)
- **Status**: ✅ Active
- **Usage**: Displays images for Independent House, Apartment, Villa

---

## 🔧 Backend API Endpoints

**Base URL**: `http://localhost:3000`

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/health` | Health check | ✅ Active |
| `POST` | `/api/cache` | Create/retrieve cache entry | ✅ Active |
| `GET` | `/api/cache/stats` | Get cache statistics | ✅ Active |
| `GET` | `/api/cache/entries` | List all cache entries | ✅ Active |
| `DELETE` | `/api/cache/:id` | Delete specific entry | ✅ Active |
| `DELETE` | `/api/cache` | Clear all cache | ✅ Active |

---

## 📊 Database

- **Type**: MongoDB
- **Database Name**: `cache-api`
- **Collection**: `cacheentries`
- **Connection**: Configured in `server/config/database.js`
- **Status**: ✅ Ready (needs `.env` configuration)

---

## ⚙️ Required Environment Variables

Create a `.env` file in project root:

```env
# MongoDB (Required for backend)
MONGODB_URI=mongodb://localhost:27017/cache-api

# Server (Optional - defaults provided)
PORT=3000
NODE_ENV=development

# OpenAI (Required for cost estimation)
VITE_OPENAI_API_KEY=your_key_here
```

---

## 🚀 Quick Start

1. **Setup MongoDB**:
   ```bash
   # See MONGODB_SETUP.md for detailed instructions
   # Create .env file with MONGODB_URI
   ```

2. **Start Backend**:
   ```bash
   npm run server
   ```

3. **Start Frontend**:
   ```bash
   npm run dev
   ```

4. **Test APIs**:
   ```bash
   # Health check
   curl http://localhost:3000/health
   
   # Test cache
   curl -X POST http://localhost:3000/api/cache \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

---

## 📚 Documentation Files

- **API_DOCUMENTATION.md**: Complete API documentation
- **MONGODB_SETUP.md**: MongoDB connection guide
- **API_SUMMARY.md**: This file (quick reference)

---

## 🔍 API Usage in Code

### Frontend API Calls:
- **OpenAI**: `src/components/DraftEstimateSpecifications/DraftEstimateSpecifications.jsx`
- **Images**: `src/components/ChatGPTInputSummary/ChatGPTInputSummary.jsx`

### Backend API Routes:
- **Cache Routes**: `server/routes/cache.js`
- **Server Setup**: `server/index.js`
- **Database Config**: `server/config/database.js`

---

## ⚠️ Important Notes

1. **OpenAI API Key**: Currently exposed to frontend (security risk)
   - Consider moving to backend for production

2. **MongoDB**: Must be running before starting backend server

3. **CORS**: Currently enabled for all origins (restrict in production)

---

**Last Updated**: 2024


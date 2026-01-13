# API Documentation - BuilderBro Cost Estimator

This document lists all APIs used in the BuilderBro Cost Estimator project.

## 📋 Table of Contents
1. [External APIs](#external-apis)
2. [Backend API Endpoints](#backend-api-endpoints)
3. [API Configuration](#api-configuration)

---

## 🌐 External APIs

### 1. OpenAI API
**Purpose**: Generate construction cost estimates using AI-powered prompts

**Location**: `src/components/DraftEstimateSpecifications/DraftEstimateSpecifications.jsx`

**Usage**:
- **Endpoint**: OpenAI Responses API
- **Method**: `client.responses.parse()`
- **API Key**: Required via `VITE_OPENAI_API_KEY` environment variable
- **Prompt ID**: `pmpt_68fa258429388190915466521773cbfb0031ef9bf4dd0f6d`
- **Version**: 28

**Request Structure**:
```javascript
{
  prompt: {
    id: "pmpt_68fa258429388190915466521773cbfb0031ef9bf4dd0f6d",
    version: "28",
    variables: {
      builtuparea: "1200 sq.ft",
      rooms: "2",
      floors: "1",
      washrooms: "2",
      kitchens: "1",
      city: "Bengaluru",
      location_multiplier: "1.0",
      soil_type: "normal",
      finishing_quality: "basic",
      foundation_depth_ft: "5",
      include_labour: "true",
      tax_percent: "10",
      drawing_rooms: "1"
    }
  },
  text: {
    format: {
      type: "json_schema",
      name: "building_material_estimation",
      strict: true,
      schema: { /* Detailed JSON schema */ }
    }
  }
}
```

**Response**: Returns structured JSON with:
- `project_info`: Project details and parameters
- `area_breakdown`: Floor, roof, and wall areas
- `materials_and_labour_breakdown`: Detailed cost breakdown
- `thumb_rules_applied`: Calculation rules used
- `financial_summary`: Total costs and per-sqft pricing

**Configuration**:
- Environment Variable: `VITE_OPENAI_API_KEY`
- Package: `openai` (v6.6.0)
- Note: Uses `dangerouslyAllowBrowser: true` for browser-side API calls

---

### 2. Unsplash API (Images)
**Purpose**: Display project type images

**Location**: `src/components/ChatGPTInputSummary/ChatGPTInputSummary.jsx`

**Usage**:
- **Base URL**: `https://images.unsplash.com/`
- **Method**: Direct image URLs (no API key required for public images)
- **Images Used**:
  - Independent House: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80`
  - Apartment: `https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80`
  - Villa: `https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80`

**Note**: These are direct image URLs, not API calls. For production, consider using Unsplash API with proper attribution.

---

## 🔧 Backend API Endpoints

**Base URL**: `http://localhost:3000` (development)  
**Server**: Express.js with MongoDB

### 1. Health Check
**Endpoint**: `GET /health`

**Description**: Check if the API server is running

**Response**:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

---

### 2. Cache API - Create/Retrieve
**Endpoint**: `POST /api/cache`

**Description**: Accepts any JSON payload and returns cached response or generates a new one

**Request Body**: Any valid JSON object
```json
{
  "type": "user",
  "name": "John Doe",
  "data": { ... }
}
```

**Response (New Entry)**:
```json
{
  "cached": false,
  "data": {
    "success": true,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "received": { ... },
    "processed": true,
    "message": "Response generated successfully"
  },
  "metadata": {
    "createdAt": "2024-01-15T10:30:00.000Z",
    "accessCount": 0
  }
}
```

**Response (Cached Entry)**:
```json
{
  "cached": true,
  "data": { ... },
  "metadata": {
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastAccessedAt": "2024-01-15T11:00:00.000Z",
    "accessCount": 5
  }
}
```

**Status Codes**:
- `201`: New entry created
- `200`: Cached entry returned
- `400`: Invalid or empty request body
- `500`: Server error

---

### 3. Cache Statistics
**Endpoint**: `GET /api/cache/stats`

**Description**: Get statistics about cached entries

**Response**:
```json
{
  "totalEntries": 42,
  "totalAccesses": 156
}
```

---

### 4. List Cache Entries
**Endpoint**: `GET /api/cache/entries`

**Description**: Get all cached entries with pagination

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Entries per page (default: 10)

**Example**: `GET /api/cache/entries?page=1&limit=10`

**Response**:
```json
{
  "entries": [
    {
      "_id": "...",
      "key": { ... },
      "value": { ... },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "accessCount": 5,
      "lastAccessedAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

---

### 5. Delete Cache Entry
**Endpoint**: `DELETE /api/cache/:id`

**Description**: Delete a specific cache entry by ID

**Example**: `DELETE /api/cache/507f1f77bcf86cd799439011`

**Response**:
```json
{
  "message": "Cache entry deleted successfully"
}
```

**Status Codes**:
- `200`: Successfully deleted
- `404`: Entry not found
- `500`: Server error

---

### 6. Clear All Cache
**Endpoint**: `DELETE /api/cache`

**Description**: Clear all cache entries

**Response**:
```json
{
  "message": "All cache entries cleared",
  "deletedCount": 42
}
```

---

## ⚙️ API Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/cache-api
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cache-api?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development

# OpenAI API Key (for frontend)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### MongoDB Connection

**Location**: `server/config/database.js`

**Connection String Format**:
- **Local**: `mongodb://localhost:27017/cache-api`
- **Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/cache-api?retryWrites=true&w=majority`

**Connection Options**:
- `useNewUrlParser: true`
- `useUnifiedTopology: true`

---

## 📦 Dependencies

### Frontend API Packages
- `openai`: ^6.6.0 - OpenAI API client

### Backend API Packages
- `express`: ^4.18.2 - Web framework
- `mongoose`: ^8.0.3 - MongoDB ODM
- `cors`: ^2.8.5 - CORS middleware
- `dotenv`: ^16.4.5 - Environment variable management

---

## 🔐 Security Notes

1. **OpenAI API Key**: 
   - Stored in `.env` as `VITE_OPENAI_API_KEY`
   - Exposed to frontend (VITE_ prefix makes it available in browser)
   - ⚠️ **Security Risk**: Consider moving OpenAI calls to backend

2. **MongoDB Connection**:
   - Never commit `.env` file to version control
   - Use strong passwords for MongoDB Atlas
   - Enable IP whitelisting in production

3. **CORS**:
   - Currently enabled for all origins (`app.use(cors())`)
   - Restrict in production: `cors({ origin: 'https://yourdomain.com' })`

---

## 🚀 Testing APIs

### Test Backend Health
```bash
curl http://localhost:3000/health
```

### Test Cache API
```bash
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Test Cache Stats
```bash
curl http://localhost:3000/api/cache/stats
```

---

## 📝 Notes

1. **OpenAI API**: Currently called directly from frontend. For production, consider:
   - Moving to backend for security
   - Implementing rate limiting
   - Adding request caching

2. **Cache API**: Generic caching service that can be extended for:
   - Caching OpenAI responses
   - Storing user project data
   - Session management

3. **MongoDB**: Database is used for:
   - Storing cache entries
   - Tracking access statistics
   - Persistent data storage

---

## 🔄 Future API Integrations

Potential APIs to integrate:
- Material pricing APIs (real-time pricing)
- Location-based cost multipliers
- Weather APIs (for construction delays)
- Payment gateway APIs (for premium features)
- Email service APIs (for estimates delivery)

---

**Last Updated**: 2024
**Project**: BuilderBro Cost Estimator


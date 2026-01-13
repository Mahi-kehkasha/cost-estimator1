# Backend API - ChatGPT Caching Service

A production-ready Node.js/Express/MongoDB API that caches ChatGPT API responses to reduce costs and improve latency.

## Features

- **ChatGPT API Integration**: Calls OpenAI API with proper error handling
- **Intelligent Caching**: Hash-based duplicate detection using normalized JSON
- **Cost Optimization**: Avoids redundant API calls for identical inputs
- **Service Layer Architecture**: Clean separation of concerns
- **MongoDB Storage**: Persistent storage with timestamps and access tracking
- **Statistics & Management**: View cache stats and manage entries

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Install dependencies** (from project root):
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env` (if it exists) or create a `.env` file
   - Set your MongoDB connection string and OpenAI API key:
     ```env
     MONGODB_URI=mongodb://localhost:27017/cache-api
     PORT=3000
     NODE_ENV=development
     OPENAI_API_KEY=your_openai_api_key_here
     ```

3. **Start MongoDB** (if using local installation):
   ```bash
   # On Windows
   net start MongoDB

   # On macOS/Linux
   sudo systemctl start mongod
   ```

4. **Start the server**:
   ```bash
   npm run server
   ```

   For development with auto-reload:
   ```bash
   npm run server:dev
   ```

## API Endpoints

### POST /api/process

**Main endpoint for processing input JSON with ChatGPT API caching.**

This endpoint implements the core caching logic:
1. Receives `inputJson` from frontend
2. Normalizes and hashes `inputJson`
3. Checks MongoDB for existing record using hash
4. If found: Returns stored `outputJson` (no ChatGPT API call)
5. If not found: Calls ChatGPT API, saves to MongoDB, returns output

**Request:**
```bash
curl -X POST http://localhost:3000/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "inputJson": {
      "prompt": {
        "id": "pmpt_...",
        "version": "28",
        "variables": { ... }
      },
      "text": { ... }
    }
  }'
```

**Response (Cached - No API Call):**
```json
{
  "cached": true,
  "outputJson": { ... },
  "metadata": {
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastAccessedAt": "2024-01-15T11:00:00.000Z",
    "accessCount": 5
  }
}
```

**Response (New - API Call Made):**
```json
{
  "cached": false,
  "outputJson": { ... },
  "metadata": {
    "createdAt": "2024-01-15T10:30:00.000Z",
    "accessCount": 0
  }
}
```

**Status Codes:**
- `200`: Cached response returned
- `201`: New entry created (ChatGPT API called)
- `400`: Invalid request (missing or invalid inputJson)
- `429`: Rate limit exceeded
- `500`: Server error or missing OpenAI API key

### POST /api/cache

Accepts any JSON payload and returns cached response or generates a new one.

**Request:**
```bash
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{
    "type": "user",
    "name": "John Doe",
    "age": 30
  }'
```

**Response (New Entry):**
```json
{
  "cached": false,
  "data": {
    "success": true,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "received": {
      "type": "user",
      "name": "John Doe",
      "age": 30
    },
    "processed": true,
    "message": "Response generated successfully"
  },
  "metadata": {
    "createdAt": "2024-01-15T10:30:00.000Z",
    "accessCount": 0
  }
}
```

**Response (Cached Entry):**
```json
{
  "cached": true,
  "data": {
    "success": true,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "received": {
      "type": "user",
      "name": "John Doe",
      "age": 30
    },
    "processed": true,
    "message": "Response generated successfully"
  },
  "metadata": {
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastAccessedAt": "2024-01-15T11:00:00.000Z",
    "accessCount": 5
  }
}
```

### GET /api/cache/stats

Get statistics about cached entries.

**Response:**
```json
{
  "totalEntries": 42,
  "totalAccesses": 156
}
```

### GET /api/cache/entries

Get all cached entries with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Entries per page (default: 10)

**Example:**
```bash
curl http://localhost:3000/api/cache/entries?page=1&limit=10
```

**Response:**
```json
{
  "entries": [
    {
      "_id": "...",
      "key": { "type": "user", "name": "John" },
      "value": { "success": true, ... },
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

### DELETE /api/cache/:id

Delete a specific cache entry by ID.

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/cache/507f1f77bcf86cd799439011
```

### DELETE /api/cache

Clear all cache entries.

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/cache
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

## Caching Strategy

### How It Works

1. **Input Normalization**: Each input JSON is normalized to ensure consistent hashing:
   - Object keys are sorted alphabetically
   - Undefined values are removed
   - Nested objects are recursively normalized

2. **Hash-Based Lookup**: The normalized input is hashed using SHA-256, creating a unique identifier stored in MongoDB with an index for O(1) lookup.

3. **Cache Hit**: If a record exists with the same hash:
   - Stored `outputJson` is returned immediately
   - **No ChatGPT API call is made**
   - Access statistics are updated

4. **Cache Miss**: If no record exists:
   - ChatGPT API is called with the input
   - Both `inputJson` (normalized) and `outputJson` are saved as strings
   - Response is returned to the client

### Benefits

- **Cost Reduction**: Avoids redundant API calls for identical inputs
- **Latency Improvement**: Cached responses return instantly
- **Scalability**: Hash-based lookup is O(1) with proper indexing
- **Data Integrity**: Normalization ensures consistent matching

## Database Schema

The `CacheEntry` model stores:

- **inputHash**: SHA-256 hash of normalized inputJson (unique, indexed)
- **inputJson**: Normalized input JSON stored as string
- **outputJson**: ChatGPT API response stored as string
- **createdAt**: Timestamp when entry was created
- **updatedAt**: Timestamp when entry was last updated
- **accessCount**: Number of times this entry has been accessed
- **lastAccessedAt**: Timestamp of last access

## Customization

### Custom Response Generation

To customize how responses are generated, edit the `generateResponse()` function in `server/routes/cache.js`:

```javascript
function generateResponse(inputPayload) {
  // Your custom logic here
  return {
    // Your custom response structure
  };
}
```

### MongoDB Connection

Update the connection string in your `.env` file:

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/cache-api
```

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cache-api?retryWrites=true&w=majority
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid or empty request body
- **404 Not Found**: Route or resource not found
- **500 Internal Server Error**: Server-side errors

All errors return JSON responses with error messages.

## Development

### Project Structure

```
server/
├── index.js                    # Main server file
├── config/
│   └── database.js             # MongoDB connection
├── models/
│   └── CacheEntry.js           # MongoDB schema/model
├── routes/
│   ├── cache.js                # Legacy cache routes
│   └── process.js              # Main /api/process endpoint
├── services/
│   ├── jsonNormalizer.js       # JSON normalization and hashing
│   ├── chatgptService.js       # ChatGPT API integration
│   └── cacheService.js          # Caching logic orchestration
└── README.md                   # This file
```

### Service Layer

- **jsonNormalizer.js**: Handles JSON normalization and SHA-256 hashing
- **chatgptService.js**: Manages OpenAI API client and calls
- **cacheService.js**: Orchestrates the caching flow (check → call → save)

### Testing

Test the API using curl, Postman, or any HTTP client:

```bash
# Test POST endpoint
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Test GET stats
curl http://localhost:3000/api/cache/stats
```

## Notes

- The API uses hash-based comparison for efficient duplicate detection
- Input JSON is normalized before hashing to ensure consistent matching
- Both input and output JSON are stored as strings in MongoDB
- ChatGPT API is only called when cache miss occurs
- All timestamps are in ISO 8601 format
- The API is CORS-enabled for frontend integration
- OpenAI API key must be set in environment variables for ChatGPT calls


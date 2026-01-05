# Backend API - Payload Cache Service

A generic, reusable Node.js/Express/MongoDB API that caches request payloads and their corresponding responses.

## Features

- **Generic POST endpoint** that accepts any JSON payload
- **Automatic caching** of request/response pairs
- **MongoDB storage** with timestamps
- **Response generation** for new payloads
- **Cache lookup** for existing payloads

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend` directory:
```bash
cp backend/.env.example backend/.env
```

3. Update `.env` with your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/payload-cache
PORT=3000
```

### Running the Server

```bash
# Run the server
npm run server

# Run with auto-reload (requires Node.js 18+)
npm run server:dev
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### POST /api/cache

Accepts any JSON payload and returns a cached response if available, or generates and stores a new response.

**Request:**
```bash
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{"key": "value", "any": "data"}'
```

**Response (cached):**
```json
{
  "cached": true,
  "response": {
    "success": true,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "data": { ... },
    "metadata": { ... }
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastAccessedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response (new):**
```json
{
  "cached": false,
  "response": {
    "success": true,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "data": { ... },
    "metadata": { ... }
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastAccessedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/cache

Retrieve all cached entries (useful for debugging).

**Query Parameters:**
- `limit` (optional): Number of entries to return (default: 10)
- `skip` (optional): Number of entries to skip (default: 0)

**Request:**
```bash
curl http://localhost:3000/api/cache?limit=5&skip=0
```

**Response:**
```json
{
  "total": 100,
  "limit": 5,
  "skip": 0,
  "entries": [
    {
      "id": "...",
      "key": { ... },
      "value": { ... },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastAccessedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

## Database Schema

The `PayloadCache` collection stores:

- **key** (String, unique, indexed): Normalized JSON string of the input payload
- **value** (Mixed): The generated response object
- **createdAt** (Date, indexed): When the entry was first created
- **lastAccessedAt** (Date): When the entry was last accessed

## Customization

### Response Generation

Edit `backend/utils/responseGenerator.js` to customize how responses are generated based on input payloads.

### MongoDB Connection

Update the `MONGODB_URI` in `.env` to connect to:
- Local MongoDB: `mongodb://localhost:27017/payload-cache`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/payload-cache`

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (empty payload)
- `500`: Internal server error

## Notes

- Payloads are normalized (sorted keys) to ensure consistent caching
- The API supports any JSON structure as input
- Responses are stored as-is in MongoDB (supports nested objects, arrays, etc.)
- The cache lookup is case-sensitive and order-sensitive (after normalization)


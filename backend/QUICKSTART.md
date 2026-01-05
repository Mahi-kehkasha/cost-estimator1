# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/payload-cache
PORT=3000
```

See `ENV_SETUP.md` for detailed MongoDB setup instructions.

## 3. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
mongod
```

**Or use MongoDB Atlas** (cloud) - no local installation needed.

## 4. Start the Server

```bash
npm run server
```

The server will start on `http://localhost:3000`

## 5. Test the API

### Test with curl:

```bash
# POST a new payload
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "value": 123}'

# POST the same payload again (should return cached response)
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "value": 123}'

# Check health
curl http://localhost:3000/health

# View all cached entries
curl http://localhost:3000/api/cache?limit=5
```

### Test with JavaScript:

```javascript
// First request - generates new response
const response1 = await fetch('http://localhost:3000/api/cache', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data', number: 42 })
});
const data1 = await response1.json();
console.log('First request:', data1.cached); // false

// Second request - returns cached response
const response2 = await fetch('http://localhost:3000/api/cache', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data', number: 42 })
});
const data2 = await response2.json();
console.log('Second request:', data2.cached); // true
```

## API Endpoints

- **POST /api/cache** - Cache a payload and get response
- **GET /api/cache** - View all cached entries
- **GET /health** - Health check

See `README.md` for full API documentation.


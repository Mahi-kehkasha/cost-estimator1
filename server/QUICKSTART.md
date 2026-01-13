# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up MongoDB

### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string

## 3. Configure Environment

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cache-api
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cache-api?retryWrites=true&w=majority
```

## 4. Start the Server

```bash
npm run server
```

You should see:
```
MongoDB Connected: localhost:27017
Server is running on port 3000
Health check: http://localhost:3000/health
API endpoint: http://localhost:3000/api/cache
```

## 5. Test the API

### Test with curl:

```bash
# First request (will generate new response)
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "age": 30}'

# Second request with same payload (will return cached response)
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "age": 30}'

# Check stats
curl http://localhost:3000/api/cache/stats
```

### Test with JavaScript (fetch):

```javascript
// First request
const response1 = await fetch('http://localhost:3000/api/cache', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', age: 30 })
});
const data1 = await response1.json();
console.log('First request:', data1.cached); // false

// Second request (same payload)
const response2 = await fetch('http://localhost:3000/api/cache', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', age: 30 })
});
const data2 = await response2.json();
console.log('Second request:', data2.cached); // true
```

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check your connection string in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use

Change the PORT in `.env` file:
```env
PORT=3001
```

### Module Not Found Errors

Run `npm install` again to ensure all dependencies are installed.


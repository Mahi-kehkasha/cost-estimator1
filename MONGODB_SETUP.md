# MongoDB Setup Guide - BuilderBro Cost Estimator

This guide will help you connect your backend to MongoDB.

## 📋 Prerequisites

- Node.js installed (v14 or higher)
- MongoDB installed locally OR MongoDB Atlas account

---

## 🗄️ Option 1: Local MongoDB Setup

### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB from [mongodb.com/download](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a Windows service

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
```

### Step 2: Start MongoDB

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or if installed manually
mongod --dbpath "C:\data\db"
```

**macOS/Linux:**
```bash
# Start MongoDB service
brew services start mongodb-community
# OR
sudo systemctl start mongod
```

### Step 3: Verify MongoDB is Running

```bash
# Check MongoDB status
mongosh
# OR
mongo
```

If you see the MongoDB shell, you're good to go!

### Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/cache-api
PORT=3000
NODE_ENV=development
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

---

## ☁️ Option 2: MongoDB Atlas (Cloud) Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free tier M0 is sufficient)

### Step 2: Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Create a username and password (save these!)
3. Set user privileges to **Read and write to any database**

### Step 3: Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. For development, click **Allow Access from Anywhere** (0.0.0.0/0)
3. For production, add your server's IP address

### Step 4: Get Connection String

1. Go to **Clusters** → Click **Connect**
2. Choose **Connect your application**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/cache-api?retryWrites=true&w=majority
   ```

### Step 5: Update Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cache-api?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**⚠️ Important**: Replace `username` and `password` with your actual database user credentials!

---

## 🚀 Testing the Connection

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start the Backend Server

```bash
npm run server
```

### Expected Output:

```
✅ MongoDB Connected: localhost (or your Atlas cluster)
📊 Database: cache-api
Server is running on port 3000
Health check: http://localhost:3000/health
API endpoint: http://localhost:3000/api/cache
```

### Step 3: Test the Connection

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test cache API
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

---

## 🔧 Troubleshooting

### Error: "MongoDB connection error"

**Possible Causes:**
1. MongoDB is not running
   - **Solution**: Start MongoDB service
   - Windows: `net start MongoDB`
   - macOS/Linux: `brew services start mongodb-community`

2. Wrong connection string
   - **Solution**: Check your `.env` file
   - Verify MONGODB_URI is correct
   - For Atlas, ensure username/password are correct

3. Firewall blocking connection
   - **Solution**: Check firewall settings
   - For Atlas, ensure your IP is whitelisted

4. Port 27017 is in use
   - **Solution**: Change MongoDB port or stop conflicting service

### Error: "Authentication failed"

**For MongoDB Atlas:**
- Verify username and password in connection string
- Check database user has proper permissions
- Ensure IP address is whitelisted

**For Local MongoDB:**
- If authentication is enabled, ensure credentials are correct
- For development, you can disable authentication

### Error: "Connection timeout"

**For MongoDB Atlas:**
- Check network access settings
- Verify IP whitelist includes your IP
- Check if cluster is paused (free tier)

**For Local MongoDB:**
- Ensure MongoDB service is running
- Check if port 27017 is accessible
- Verify firewall settings

---

## 📁 Database Structure

Once connected, MongoDB will create a database called `cache-api` with a collection called `cacheentries`.

### CacheEntry Schema:
```javascript
{
  key: Object,           // The input JSON payload
  keyHash: String,      // SHA-256 hash of the key
  value: Object,        // The cached response
  createdAt: Date,      // Creation timestamp
  updatedAt: Date,       // Last update timestamp
  accessCount: Number,  // Number of times accessed
  lastAccessedAt: Date  // Last access timestamp
}
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Use `.env.example` as template

2. **Use strong passwords**
   - For MongoDB Atlas users
   - At least 12 characters, mixed case, numbers, symbols

3. **Restrict IP access**
   - In production, only allow your server's IP
   - Don't use 0.0.0.0/0 in production

4. **Use environment-specific configs**
   - Development: local MongoDB
   - Production: MongoDB Atlas with restricted access

5. **Enable MongoDB authentication**
   - Even for local development
   - Use strong credentials

---

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/cache-api` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `VITE_OPENAI_API_KEY` | OpenAI API key for frontend | `sk-...` |

---

## ✅ Verification Checklist

- [ ] MongoDB is installed and running
- [ ] `.env` file created with correct `MONGODB_URI`
- [ ] Backend server starts without errors
- [ ] Health endpoint returns `{"status": "ok"}`
- [ ] Cache API accepts POST requests
- [ ] Data is being stored in MongoDB

---

## 🆘 Need Help?

1. Check MongoDB logs:
   - Windows: Check Event Viewer
   - macOS/Linux: `tail -f /usr/local/var/log/mongodb/mongo.log`

2. Test MongoDB connection directly:
   ```bash
   mongosh "mongodb://localhost:27017/cache-api"
   ```

3. Check server logs for detailed error messages

4. Verify environment variables are loaded:
   ```javascript
   console.log(process.env.MONGODB_URI);
   ```

---

**Last Updated**: 2024  
**Project**: BuilderBro Cost Estimator


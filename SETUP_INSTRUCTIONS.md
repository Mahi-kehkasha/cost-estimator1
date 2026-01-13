# Setup Instructions - BuilderBro Cost Estimator

## 🎯 Quick Setup Checklist

Follow these steps to get your project running with all APIs connected:

### ✅ Step 1: Install Dependencies
```bash
npm install
```

### ✅ Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/cache-api

# For MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cache-api?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development

# OpenAI API Key (Required for cost estimation)
# Get your API key from: https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**⚠️ Important**: 
- Replace `your_openai_api_key_here` with your actual OpenAI API key
- For MongoDB Atlas, replace `username` and `password` with your credentials

### ✅ Step 3: Setup MongoDB

**Option A: Local MongoDB**
1. Install MongoDB on your machine
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. Verify it's running: `mongosh` or `mongo`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user (Database Access)
4. Whitelist your IP (Network Access)
5. Copy connection string to `.env`

📖 **Detailed instructions**: See `MONGODB_SETUP.md`

### ✅ Step 4: Start Backend Server

```bash
npm run server
```

**Expected output:**
```
✅ MongoDB Connected: localhost (or your cluster)
📊 Database: cache-api
Server is running on port 3000
Health check: http://localhost:3000/health
API endpoint: http://localhost:3000/api/cache
```

### ✅ Step 5: Start Frontend (in a new terminal)

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### ✅ Step 6: Verify Everything Works

1. **Backend Health Check**:
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok","message":"API is running"}`

2. **Test Cache API**:
   ```bash
   curl -X POST http://localhost:3000/api/cache \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

3. **Frontend**: Open `http://localhost:5173` and test the cost estimation feature

---

## 📋 APIs Summary

### External APIs:
1. **OpenAI API** - For AI-powered cost estimation
   - Key: `VITE_OPENAI_API_KEY`
   - Status: ✅ Required

2. **Unsplash Images** - For project images
   - Key: ❌ Not required
   - Status: ✅ Optional

### Backend APIs:
- `GET /health` - Health check
- `POST /api/cache` - Cache management
- `GET /api/cache/stats` - Cache statistics
- `GET /api/cache/entries` - List cache entries
- `DELETE /api/cache/:id` - Delete entry
- `DELETE /api/cache` - Clear all cache

📖 **Full API documentation**: See `API_DOCUMENTATION.md`

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoDB connection error`

**Solutions**:
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   ```

2. Verify connection string in `.env`:
   - Local: `mongodb://localhost:27017/cache-api`
   - Atlas: Check username/password are correct

3. Test connection manually:
   ```bash
   mongosh "mongodb://localhost:27017/cache-api"
   ```

### OpenAI API Issues

**Error**: `OpenAI API key is missing`

**Solutions**:
1. Check `.env` file exists in project root
2. Verify `VITE_OPENAI_API_KEY` is set
3. Restart frontend server after adding key
4. Get API key from: https://platform.openai.com/api-keys

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:
1. Change PORT in `.env`:
   ```env
   PORT=3001
   ```
2. Or stop the process using port 3000

---

## 📚 Documentation Files

- **API_DOCUMENTATION.md** - Complete API reference
- **API_SUMMARY.md** - Quick API reference
- **MONGODB_SETUP.md** - Detailed MongoDB setup guide
- **SETUP_INSTRUCTIONS.md** - This file

---

## 🎉 You're All Set!

Once everything is running:
- ✅ Backend server on port 3000
- ✅ Frontend on port 5173
- ✅ MongoDB connected
- ✅ OpenAI API configured

You can now use the cost estimation feature!

---

**Need Help?**
- Check the troubleshooting section above
- Review detailed documentation files
- Check server logs for error messages


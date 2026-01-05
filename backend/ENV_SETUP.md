# Environment Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection String
# For local MongoDB: mongodb://localhost:27017/payload-cache
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/payload-cache
MONGODB_URI=mongodb://localhost:27017/payload-cache

# Server Port
PORT=3000
```

## MongoDB Setup Options

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/payload-cache`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Replace `<username>` and `<password>` with your credentials
5. Use connection string: `mongodb+srv://username:password@cluster.mongodb.net/payload-cache`


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PayloadCache } from './models/PayloadCache.js';
import { generateResponse } from './utils/responseGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env or root .env
dotenv.config({ path: join(__dirname, '.env') });
dotenv.config(); // Also try root .env as fallback

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/payload-cache';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// POST endpoint for caching payloads
app.post('/api/cache', async (req, res) => {
  try {
    const inputPayload = req.body;

    // Validate that request body is not empty
    if (!inputPayload || Object.keys(inputPayload).length === 0) {
      return res.status(400).json({ 
        error: 'Request body cannot be empty',
        message: 'Please provide a valid JSON payload'
      });
    }

    // Create a normalized key from the payload (sorted keys for consistency)
    const normalizedKey = JSON.stringify(inputPayload, Object.keys(inputPayload).sort());

    // Check if payload exists in database
    const existingCache = await PayloadCache.findOne({ 
      key: normalizedKey 
    });

    if (existingCache) {
      // Update lastAccessedAt
      existingCache.lastAccessedAt = new Date();
      await existingCache.save();
      
      // Return cached response
      console.log('📦 Returning cached response');
      return res.json({
        cached: true,
        response: existingCache.value,
        createdAt: existingCache.createdAt,
        lastAccessedAt: existingCache.lastAccessedAt
      });
    }

    // Generate new response
    console.log('🆕 Generating new response');
    const newResponse = generateResponse(inputPayload);

    // Store in database
    const newCache = new PayloadCache({
      key: normalizedKey,
      value: newResponse,
      createdAt: new Date(),
      lastAccessedAt: new Date()
    });

    await newCache.save();

    // Return new response
    res.json({
      cached: false,
      response: newResponse,
      createdAt: newCache.createdAt,
      lastAccessedAt: newCache.lastAccessedAt
    });

  } catch (error) {
    console.error('❌ Error processing request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET endpoint to retrieve all cached entries (optional, for debugging)
app.get('/api/cache', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const entries = await PayloadCache.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('key value createdAt lastAccessedAt');

    const total = await PayloadCache.countDocuments();

    res.json({
      total,
      limit,
      skip,
      entries: entries.map(entry => ({
        id: entry._id,
        key: JSON.parse(entry.key),
        value: entry.value,
        createdAt: entry.createdAt,
        lastAccessedAt: entry.lastAccessedAt
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching cache entries:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 API endpoint: http://localhost:${PORT}/api/cache`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});


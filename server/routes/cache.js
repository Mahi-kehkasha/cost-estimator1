import express from 'express';
import { CacheEntry } from '../models/CacheEntry.js';
import { normalizeAndHash } from '../services/jsonNormalizer.js';

const router = express.Router();

/**
 * POST /api/cache/saveChatGPTResponse
 * Saves ChatGPT response to MongoDB cache
 * Accepts: { key: string, value: string } where both are JSON strings
 */
router.post('/saveChatGPTResponse', async (req, res, next) => {
  try {
    const { key, value } = req.body;

    // Validate that key and value are provided
    if (!key || !value) {
      return res.status(400).json({
        error: 'key and value are required',
        message: 'Please provide both key and value in the request body'
      });
    }

    // Parse the key JSON string to get the actual input object
    let inputJson;
    try {
      inputJson = JSON.parse(key);
    } catch (parseError) {
      return res.status(400).json({
        error: 'Invalid key format',
        message: 'key must be a valid JSON string'
      });
    }

    // Parse the value JSON string to get the actual response object
    let outputJson;
    try {
      outputJson = JSON.parse(value);
    } catch (parseError) {
      return res.status(400).json({
        error: 'Invalid value format',
        message: 'value must be a valid JSON string'
      });
    }

    // Normalize and hash the input JSON for lookup
    const { normalized, hash } = normalizeAndHash(inputJson);
    const inputHash = hash;

    // Check if the exact payload exists in the database using hash
    const existingEntry = await CacheEntry.findOne({ inputHash });

    if (existingEntry) {
      // Increment access count and update last accessed time
      await existingEntry.incrementAccess();
      
      return res.json({
        cached: true,
        data: JSON.parse(existingEntry.outputJson),
        metadata: {
          createdAt: existingEntry.createdAt,
          lastAccessedAt: existingEntry.lastAccessedAt,
          accessCount: existingEntry.accessCount + 1,
        }
      });
    }

    // Store the new entry in MongoDB
    const newEntry = await CacheEntry.create({
      inputHash,
      inputJson: normalized, // Store normalized JSON as string
      outputJson: JSON.stringify(outputJson), // Store output as string
    });

    return res.status(201).json({
      cached: false,
      data: outputJson,
      metadata: {
        createdAt: newEntry.createdAt,
        accessCount: newEntry.accessCount,
      }
    });

  } catch (error) {
    console.error('Error in POST /api/cache/saveChatGPTResponse:', error);
    next(error);
  }
});

/**
 * GET /api/cache/stats
 * Get statistics about cached entries
 */
router.get('/stats', async (req, res, next) => {
  try {
    const totalEntries = await CacheEntry.countDocuments();
    const totalAccesses = await CacheEntry.aggregate([
      { $group: { _id: null, total: { $sum: '$accessCount' } } }
    ]);

    res.json({
      totalEntries,
      totalAccesses: totalAccesses[0]?.total || 0,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cache/entries
 * Get all cached entries (with pagination)
 */
router.get('/entries', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const entries = await CacheEntry.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('key value createdAt updatedAt accessCount lastAccessedAt');

    const total = await CacheEntry.countDocuments();

    res.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/cache/:id
 * Delete a specific cache entry by ID
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const entry = await CacheEntry.findByIdAndDelete(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Cache entry not found' });
    }

    res.json({ message: 'Cache entry deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/cache
 * Clear all cache entries
 */
router.delete('/', async (req, res, next) => {
  try {
    const result = await CacheEntry.deleteMany({});
    res.json({ 
      message: 'All cache entries cleared',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Helper function to generate a response from input payload
 * This is a generic response generator - customize as needed
 */
function generateResponse(inputPayload) {
  // Generate a generic response structure
  // You can customize this to generate different types of responses
  // based on the input payload structure
  
  const timestamp = new Date().toISOString();
  
  // Create a response that includes the input data plus additional fields
  const response = {
    success: true,
    timestamp,
    received: inputPayload,
    processed: true,
    // Add any additional fields you want in the response
    message: 'Response generated successfully',
  };

  // If the input has specific fields, you can customize the response
  if (inputPayload.type) {
    response.type = inputPayload.type;
  }

  if (inputPayload.action) {
    response.action = inputPayload.action;
    response.result = `Processed action: ${inputPayload.action}`;
  }

  return response;
}

export { router as cacheRouter };


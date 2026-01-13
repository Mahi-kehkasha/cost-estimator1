import express from 'express';
import { processWithCache } from '../services/cacheService.js';

const router = express.Router();

/**
 * POST /api/process
 * 
 * Main endpoint for processing input JSON with ChatGPT API caching.
 * 
 * Flow:
 * 1. Receive inputJson from frontend
 * 2. Normalize and hash inputJson
 * 3. Check MongoDB for existing record using hash
 * 4. If found: Return stored outputJson (no ChatGPT API call)
 * 5. If not found: Call ChatGPT API, save to MongoDB, return output
 * 
 * Request Body:
 * {
 *   "inputJson": { ... } // Any valid JSON object
 * }
 * 
 * Response (Cached):
 * {
 *   "cached": true,
 *   "outputJson": { ... },
 *   "metadata": {
 *     "createdAt": "2024-01-15T10:30:00.000Z",
 *     "lastAccessedAt": "2024-01-15T11:00:00.000Z",
 *     "accessCount": 5
 *   }
 * }
 * 
 * Response (New):
 * {
 *   "cached": false,
 *   "outputJson": { ... },
 *   "metadata": {
 *     "createdAt": "2024-01-15T10:30:00.000Z",
 *     "accessCount": 0
 *   }
 * }
 */
router.post('/', async (req, res, next) => {
  try {
    // Extract inputJson from request body
    const { inputJson } = req.body;

    // Validate that inputJson is provided
    if (!inputJson) {
      return res.status(400).json({
        error: 'inputJson is required',
        message: 'Please provide inputJson in the request body',
      });
    }

    // Validate that inputJson is an object
    if (typeof inputJson !== 'object' || inputJson === null || Array.isArray(inputJson)) {
      return res.status(400).json({
        error: 'inputJson must be a valid object',
        message: 'inputJson must be a non-null, non-array object',
      });
    }

    // Process with caching logic
    const result = await processWithCache(inputJson);

    // Return appropriate status code based on cache hit/miss
    const statusCode = result.cached ? 200 : 201;

    res.status(statusCode).json({
      cached: result.cached,
      outputJson: result.outputJson,
      metadata: result.metadata,
    });

  } catch (error) {
    console.error('Error in POST /api/process:', error);

    // Handle specific error types
    if (error.message.includes('OPENAI_API_KEY')) {
      return res.status(500).json({
        error: 'ChatGPT API configuration error',
        message: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in environment variables.',
      });
    }

    if (error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'ChatGPT API rate limit exceeded. Please try again later.',
      });
    }

    // Generic error handler
    next(error);
  }
});

export { router as processRouter };

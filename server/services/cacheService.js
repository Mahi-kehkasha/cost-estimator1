import { CacheEntry } from '../models/CacheEntry.js';
import { normalizeAndHash } from './jsonNormalizer.js';
import { callChatGPT } from './chatgptService.js';

/**
 * Cache Service
 * 
 * This service handles the caching logic for ChatGPT API responses.
 * It checks for existing cached responses and stores new ones.
 */

/**
 * Process input JSON with caching logic
 * 
 * Flow:
 * 1. Normalize and hash inputJson
 * 2. Check MongoDB for existing record using hash
 * 3. If found: Return stored outputJson (no ChatGPT API call)
 * 4. If not found: Call ChatGPT API, save to MongoDB, return output
 * 
 * @param {Object} inputJson - The input JSON from frontend
 * @returns {Promise<Object>} - Response object with outputJson and cache metadata
 */
export async function processWithCache(inputJson) {
  try {
    // Step 1: Normalize and hash the input JSON
    const { normalized, hash } = normalizeAndHash(inputJson);
    const inputHash = hash;

    // Step 2: Check MongoDB for existing record using hash
    const existingEntry = await CacheEntry.findOne({ inputHash });

    // Step 3: If record exists, return stored outputJson
    if (existingEntry) {
      // Update access statistics
      await existingEntry.incrementAccess();

      return {
        cached: true,
        outputJson: JSON.parse(existingEntry.outputJson),
        metadata: {
          createdAt: existingEntry.createdAt,
          lastAccessedAt: existingEntry.lastAccessedAt,
          accessCount: existingEntry.accessCount,
        },
      };
    }

    // Step 4: If record does NOT exist, call ChatGPT API
    const output = await callChatGPT(inputJson);

    // Step 5: Save input and output JSON as strings to MongoDB
    const newEntry = await CacheEntry.create({
      inputHash,
      inputJson: normalized, // Store normalized JSON as string
      outputJson: JSON.stringify(output), // Store output as string
    });

    return {
      cached: false,
      outputJson: output,
      metadata: {
        createdAt: newEntry.createdAt,
        accessCount: newEntry.accessCount,
      },
    };

  } catch (error) {
    console.error('Cache service error:', error);
    throw error;
  }
}

/**
 * Get cache statistics
 * @returns {Promise<Object>} - Cache statistics
 */
export async function getCacheStats() {
  try {
    const totalEntries = await CacheEntry.countDocuments();
    const totalAccesses = await CacheEntry.aggregate([
      { $group: { _id: null, total: { $sum: '$accessCount' } } }
    ]);

    return {
      totalEntries,
      totalAccesses: totalAccesses[0]?.total || 0,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    throw error;
  }
}

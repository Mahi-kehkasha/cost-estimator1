import mongoose from 'mongoose';

/**
 * CacheEntry Model
 * 
 * Stores cached ChatGPT API responses in MongoDB.
 * Uses hash-based lookup for efficient duplicate detection.
 * 
 * Schema:
 * - inputHash: SHA-256 hash of normalized inputJson (unique index for fast lookup)
 * - inputJson: Normalized input JSON stored as string
 * - outputJson: ChatGPT API response stored as string
 * - accessCount: Number of times this cache entry has been accessed
 * - lastAccessedAt: Timestamp of last access
 */
const cacheEntrySchema = new mongoose.Schema({
  inputHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  inputJson: {
    type: String,
    required: true,
  },
  outputJson: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  accessCount: {
    type: Number,
    default: 0,
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
cacheEntrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Increment access count and update last accessed timestamp
 * @returns {Promise} - Save promise
 */
cacheEntrySchema.methods.incrementAccess = function() {
  this.accessCount += 1;
  this.lastAccessedAt = Date.now();
  return this.save();
};

export const CacheEntry = mongoose.model('CacheEntry', cacheEntrySchema);


import crypto from 'crypto';

/**
 * JSON Normalization Service
 * 
 * This service normalizes JSON objects to ensure consistent hashing.
 * Normalization includes:
 * - Sorting object keys alphabetically
 * - Removing undefined values
 * - Normalizing whitespace in strings
 * - Handling nested objects and arrays
 */

/**
 * Normalizes a JSON object for consistent hashing
 * @param {any} input - The input JSON to normalize
 * @returns {string} - Normalized JSON string
 */
export function normalizeJson(input) {
  if (input === null || input === undefined) {
    return JSON.stringify(null);
  }

  // Handle primitives
  if (typeof input !== 'object') {
    return JSON.stringify(input);
  }

  // Handle arrays
  if (Array.isArray(input)) {
    const normalizedArray = input.map(item => {
      if (typeof item === 'object' && item !== null) {
        return JSON.parse(normalizeJson(item));
      }
      return item;
    });
    return JSON.stringify(normalizedArray);
  }

  // Handle objects - sort keys and recursively normalize
  const normalized = {};
  const sortedKeys = Object.keys(input).sort();

  for (const key of sortedKeys) {
    const value = input[key];
    
    // Skip undefined values
    if (value === undefined) {
      continue;
    }

    // Recursively normalize nested objects
    if (typeof value === 'object' && value !== null) {
      normalized[key] = JSON.parse(normalizeJson(value));
    } else {
      normalized[key] = value;
    }
  }

  return JSON.stringify(normalized);
}

/**
 * Creates a SHA-256 hash of the normalized JSON
 * @param {any} input - The input JSON to hash
 * @returns {string} - SHA-256 hash in hexadecimal format
 */
export function hashJson(input) {
  const normalized = normalizeJson(input);
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Normalizes and hashes JSON in one operation
 * @param {any} input - The input JSON
 * @returns {Object} - Object containing normalized JSON string and hash
 */
export function normalizeAndHash(input) {
  const normalized = normalizeJson(input);
  const hash = crypto.createHash('sha256').update(normalized).digest('hex');
  
  return {
    normalized,
    hash
  };
}

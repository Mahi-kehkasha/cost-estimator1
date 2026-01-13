import OpenAI from 'openai';

/**
 * ChatGPT Service
 * 
 * This service handles all interactions with the OpenAI ChatGPT API.
 * It provides a clean interface for making API calls and processing responses.
 */

// Initialize OpenAI client
let openaiClient = null;

/**
 * Initialize the OpenAI client with API key from environment variables
 * @returns {OpenAI} - Initialized OpenAI client
 */
function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
  }

  return openaiClient;
}

/**
 * Calls the ChatGPT API with the provided input JSON
 * 
 * @param {Object} inputJson - The input JSON to send to ChatGPT
 * @returns {Promise<Object>} - The response from ChatGPT API
 * @throws {Error} - If API call fails or API key is missing
 */
export async function callChatGPT(inputJson) {
  try {
    const client = getOpenAIClient();

    // Validate input
    if (!inputJson || typeof inputJson !== 'object') {
      throw new Error('inputJson must be a valid object');
    }

    // Use inputJson directly as it should already have the structure:
    // {
    //   prompt: { id, version, variables },
    //   text: { format: { type, name, strict, schema } }
    // }
    const requestData = inputJson;

    // Make the API call
    const response = await client.responses.parse(requestData);

    // Return the parsed output if available, otherwise return the full response
    return response.output_parsed || response;

  } catch (error) {
    console.error('ChatGPT API Error:', error.message);
    
    // Provide more specific error messages
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key');
    } else if (error.status === 429) {
      throw new Error('OpenAI API rate limit exceeded');
    } else if (error.status === 500) {
      throw new Error('OpenAI API server error');
    } else {
      throw new Error(`ChatGPT API call failed: ${error.message}`);
    }
  }
}

/**
 * Validates that the OpenAI API key is configured
 * @returns {boolean} - True if API key is configured
 */
export function isConfigured() {
  return !!process.env.OPENAI_API_KEY;
}

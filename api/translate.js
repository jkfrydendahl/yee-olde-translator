/**
 * Translation API Endpoint
 * POST /api/translate
 * 
 * Transforms modern text into pseudo-medieval English
 */

import { callOpenAI } from '../lib/openai.js';
import { buildTranslationPrompt, validateInput, TRANSLATION_STYLES } from '../lib/prompts.js';

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

/**
 * Check rate limit for an IP address
 * @param {string} ip - Client IP address
 * @returns {boolean} - true if allowed, false if rate limited
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  // Reset window if expired
  if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  // Check if within limit
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  // Increment count
  record.count++;
  return true;
}

/**
 * Get client IP from request
 * @param {object} req - Request object
 * @returns {string} - Client IP address
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
    || req.headers['x-real-ip'] 
    || req.socket?.remoteAddress 
    || 'unknown';
}

/**
 * Main handler for the translate endpoint
 */
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Prithee, thou must use POST to beseech the translator!'
    });
  }

  // Check rate limit
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Forsooth! Thou hast exhausted the translator with thy many requests. Pray wait a moment ere trying again.'
    });
  }

  try {
    const { text, style = 'medieval' } = req.body || {};

    // Validate input
    const validation = validateInput(text);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid input',
        message: validation.error
      });
    }

    // Validate style
    if (!TRANSLATION_STYLES[style]) {
      return res.status(400).json({
        error: 'Invalid style',
        message: `Unknown translation style. Available styles: ${Object.keys(TRANSLATION_STYLES).join(', ')}`,
        availableStyles: TRANSLATION_STYLES
      });
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return res.status(500).json({
        error: 'Configuration error',
        message: 'Alas! The magical scrolls of API configuration art missing. Alert the keeper of secrets!'
      });
    }

    // Build prompt and call OpenAI
    const prompt = buildTranslationPrompt(text.trim(), style);
    const translation = await callOpenAI(prompt);

    // Return successful response
    return res.status(200).json({
      success: true,
      original: text.trim(),
      translation,
      style: {
        id: style,
        ...TRANSLATION_STYLES[style]
      }
    });

  } catch (error) {
    console.error('Translation error:', error);

    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'The royal treasury of API tokens hath been depleted! Pray return another day.'
      });
    }

    if (error.code === 'invalid_api_key') {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'The magical key to the translation chamber is invalid. Summon the administrator!'
      });
    }

    // Generic error response
    return res.status(500).json({
      error: 'Translation failed',
      message: 'Zounds! A most grievous error hath occurred in the translation chamber. Pray try again anon.'
    });
  }
}

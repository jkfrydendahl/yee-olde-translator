/**
 * Translation API Endpoint
 * POST /api/translate
 * 
 * Transforms modern text into pseudo-medieval English
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Translation styles
const TRANSLATION_STYLES = {
  medieval: {
    name: 'Medieval',
    description: 'Generic pseudo-medieval English with thees and thous',
    emoji: '🏰'
  },
  shakespearean: {
    name: 'Shakespearean',
    description: 'Flowery Elizabethan prose worthy of the Bard himself',
    emoji: '🎭'
  },
  chaucerian: {
    name: 'Chaucerian',
    description: 'Middle English style with archaic spellings',
    emoji: '📜'
  },
  royal: {
    name: 'Royal Decree',
    description: 'Pompous proclamations fit for a monarch',
    emoji: '👑'
  },
  bardic: {
    name: 'Bardic',
    description: 'Dramatic storytelling voice of a traveling bard',
    emoji: '🎵'
  }
};

// Simple in-memory rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
    || req.headers['x-real-ip'] 
    || 'unknown';
}

function validateInput(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Text is required' };
  }

  const trimmed = text.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Text cannot be empty' };
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: 'Text must be under 5000 characters' };
  }

  const suspiciousPatterns = [
    /ignore (?:all )?(?:previous |above )?instructions/i,
    /disregard (?:all )?(?:previous |above )?instructions/i,
    /you are now/i,
    /new instructions:/i
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: 'Invalid input detected' };
    }
  }

  return { valid: true };
}

function buildTranslationPrompt(text, style = 'medieval') {
  const styleConfig = TRANSLATION_STYLES[style] || TRANSLATION_STYLES.medieval;
  const variationSeed = Math.floor(Math.random() * 9000) + 1000;

  const styleInstructions = {
    medieval: `
- Replace "you" with "thou/thee/ye" appropriately
- Use "art" instead of "are", "doth" instead of "does"
- Add "eth" or "est" endings to verbs (speaketh, runnest)
- Include interjections: Forsooth!, Hark!, Verily!, Prithee!, Marry!
- Replace common words: very → most, hello → well met, goodbye → fare thee well`,

    shakespearean: `
- Channel the dramatic flair of William Shakespeare
- Use elaborate metaphors and poetic comparisons
- Include rhetorical questions and dramatic asides
- Reference nature, celestial bodies, and classical mythology
- Employ iambic rhythms where possible
- Add "O!" exclamations and theatrical pauses`,

    chaucerian: `
- Use Middle English-style spellings (olde, faire, grete, swich)
- Include "ywis" (certainly), "anon" (soon), "eke" (also)
- Replace "gh" sounds creatively (night → nyght)
- Use "hath" and "doth" liberally
- Add pilgrim or traveler references when fitting`,

    royal: `
- Write as if issuing a royal proclamation
- Begin with "Hear ye, hear ye!" or "Be it known unto all"
- Use the royal "We" instead of "I"
- Include phrases like "by royal decree", "it is Our will"
- Add formal titles and honorifics
- End with "So it is written, so shall it be done"`,

    bardic: `
- Write as a dramatic storyteller or minstrel
- Begin with "Gather 'round, good folk!" or similar
- Use vivid, theatrical descriptions
- Include dramatic pauses indicated by "..."
- Reference epic tales and legendary heroes
- Add musical or rhythmic cadence to the prose`
  };

  return `You are Ye Olde Translator, a delightfully theatrical engine that transforms modern speech into dramatically overwrought pseudo-${styleConfig.name} English.

Your task: Transform the following modern text into ${styleConfig.description.toLowerCase()}. Be verbose, theatrical, and delightfully unnecessary. Every mundane statement should become an elaborate proclamation!

STYLE RULES (${styleConfig.name}):
${styleInstructions[style] || styleInstructions.medieval}

GENERAL RULES:
- Maintain the original meaning while maximizing theatrical effect
- Extend simple statements into elaborate proclamations
- Use archaic vocabulary and elaborate metaphors
- Be consistent with the chosen style throughout
- Do NOT include any explanations or notes - only output the translated text
- Variation seed: ${variationSeed} (use this to ensure unique phrasing)

MODERN TEXT TO TRANSLATE:
"${text}"

TRANSLATED TEXT:`;
}

function removeUnwantedEndings(text) {
  const unwantedPatterns = [
    /\n\n.*?[Ii]f you['d]* like.*/s,
    /\n\n.*?[Ww]ould you like.*/s,
    /\n\n.*?[Ll]et me know if.*/s,
    /\n\n.*?[Ff]eel free to.*/s,
    /\n\n.*?[Ii] can (?:add|provide|create|generate).*/s,
  ];

  let result = text;
  for (const pattern of unwantedPatterns) {
    result = result.replace(pattern, '');
  }

  return result.trim();
}

async function callOpenAI(prompt) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 1.0,
    max_tokens: 2000
  });

  let content = response.choices[0]?.message?.content?.trim() || '';
  content = removeUnwantedEndings(content);
  return content;
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Prithee, thou must use POST to beseech the translator!'
    });
  }

  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Forsooth! Thou hast exhausted the translator. Pray wait a moment.'
    });
  }

  try {
    const { text, style = 'medieval' } = req.body || {};

    const validation = validateInput(text);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid input',
        message: validation.error
      });
    }

    if (!TRANSLATION_STYLES[style]) {
      return res.status(400).json({
        error: 'Invalid style',
        message: `Unknown style. Available: ${Object.keys(TRANSLATION_STYLES).join(', ')}`,
        availableStyles: TRANSLATION_STYLES
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'Alas! The API key is not configured.'
      });
    }

    const prompt = buildTranslationPrompt(text.trim(), style);
    const translation = await callOpenAI(prompt);

    return res.status(200).json({
      success: true,
      original: text.trim(),
      translation,
      style: { id: style, ...TRANSLATION_STYLES[style] }
    });

  } catch (error) {
    console.error('Translation error:', error);

    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'The API quota hath been depleted!'
      });
    }

    return res.status(500).json({
      error: 'Translation failed',
      message: 'Zounds! An error occurred. Pray try again.'
    });
  }
}

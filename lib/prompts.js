/**
 * Translation Prompt Templates
 * Adapted from Storysmith's prompts pattern
 */

/**
 * Available translation styles
 */
export const TRANSLATION_STYLES = {
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

/**
 * Build the translation prompt based on style
 * @param {string} text - The modern text to translate
 * @param {string} style - The translation style to use
 * @returns {string} - The complete prompt
 */
export function buildTranslationPrompt(text, style = 'medieval') {
  const styleConfig = TRANSLATION_STYLES[style] || TRANSLATION_STYLES.medieval;
  
  // Generate a variation seed for more diverse outputs (from Storysmith pattern)
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
- Use the royal "We" instead of "I"
- Include phrases like "by royal decree", "it is Our will"
- Add formal titles and honorifics
- End with "So it is written, so shall it be done"`,

    bardic: `
- Write as a dramatic storyteller or minstrel
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

/**
 * Validate input text
 * @param {string} text - The text to validate
 * @returns {object} - { valid: boolean, error?: string }
 */
export function validateInput(text) {
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

  // Basic sanitization check for potential injection attempts
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

export default { buildTranslationPrompt, validateInput, TRANSLATION_STYLES };

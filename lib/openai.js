/**
 * OpenAI Client Module
 * Adapted from Storysmith's generators/openai.py pattern
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Remove unwanted follow-up offers from the model response
 * @param {string} text - The response text to clean
 * @returns {string} - Cleaned text
 */
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

/**
 * Remove echoed input from the response
 * GPT-5.2 sometimes echoes the original input at the end
 * @param {string} response - The model response
 * @param {string} originalInput - The original user input
 * @returns {string} - Cleaned response
 */
function removeEchoedInput(response, originalInput) {
  if (!originalInput || originalInput.length < 10) return response;
  
  // Normalize for comparison
  const normalizedInput = originalInput.toLowerCase().trim();
  const inputWords = normalizedInput.split(/\s+/);
  
  // Only check if input is substantial enough
  if (inputWords.length < 3) return response;
  
  // Check if the response ends with something very similar to the input
  const lines = response.split('\n');
  let lastNonEmptyIdx = lines.length - 1;
  while (lastNonEmptyIdx >= 0 && !lines[lastNonEmptyIdx].trim()) {
    lastNonEmptyIdx--;
  }
  
  if (lastNonEmptyIdx < 0) return response;
  
  // Check last 1-3 lines for similarity to input
  for (let checkLines = 1; checkLines <= Math.min(3, lastNonEmptyIdx + 1); checkLines++) {
    const endSection = lines.slice(lastNonEmptyIdx - checkLines + 1, lastNonEmptyIdx + 1).join(' ').toLowerCase().trim();
    
    // Calculate word overlap
    const endWords = endSection.split(/\s+/);
    const matchingWords = inputWords.filter(word => 
      word.length > 3 && endWords.some(endWord => endWord.includes(word) || word.includes(endWord))
    );
    
    // If more than 60% of significant input words appear in the ending, remove it
    const significantInputWords = inputWords.filter(w => w.length > 3);
    if (significantInputWords.length > 0 && matchingWords.length / significantInputWords.length > 0.6) {
      const cleaned = lines.slice(0, lastNonEmptyIdx - checkLines + 1).join('\n').trim();
      if (cleaned.length > 0) {
        return cleaned;
      }
    }
  }
  
  return response;
}

/**
 * Call OpenAI API with the given prompt
 * @param {string} prompt - The prompt to send to OpenAI
 * @param {object} options - Optional parameters
 * @returns {Promise<string>} - The generated response
 */
export async function callOpenAI(prompt, options = {}) {
  const {
    model = 'gpt-5.2',
    temperature = 1.0,
    maxTokens = 2000,
    originalInput = null
  } = options;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_completion_tokens: maxTokens
    });

    // Check if response was truncated
    const finishReason = response.choices[0]?.finish_reason;
    if (finishReason === 'length') {
      console.warn('Warning: Response was truncated due to token limit.');
    }

    let content = response.choices[0]?.message?.content?.trim() || '';

    if (!content) {
      console.warn('Warning: Empty response from API');
      return content;
    }

    // Clean up the response
    content = removeUnwantedEndings(content);
    
    // Remove any echoed input
    if (originalInput) {
      content = removeEchoedInput(content, originalInput);
    }

    return content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    throw error;
  }
}

export default { callOpenAI };

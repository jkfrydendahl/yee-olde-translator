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
 * Call OpenAI API with the given prompt
 * @param {string} prompt - The prompt to send to OpenAI
 * @param {object} options - Optional parameters
 * @returns {Promise<string>} - The generated response
 */
export async function callOpenAI(prompt, options = {}) {
  const {
    model = 'gpt-4-turbo',
    temperature = 1.0,
    maxTokens = 2000
  } = options;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens
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

    return content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    throw error;
  }
}

export default { callOpenAI };

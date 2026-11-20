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
 * Call OpenAI API with the given prompt
 * @param {string} prompt - The prompt to send to OpenAI
 * @param {object} options - Optional parameters
 * @returns {Promise<string>} - The generated response
 */
export async function callOpenAI(prompt, options = {}) {
  const {
    model = 'gpt-6.1-terra',
    reasoningEffort = 'low',
    maxTokens = 2000
  } = options;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      reasoning_effort: reasoningEffort,
      max_completion_tokens: maxTokens
    });

    // Check if response was truncated
    const finishReason = response.choices[0]?.finish_reason;
    if (finishReason === 'length') {
      const error = new Error('The translation ended before it was complete.');
      error.code = 'translation_truncated';
      throw error;
    }

    const content = response.choices[0]?.message?.content?.trim() || '';

    if (!content) {
      console.warn('Warning: Empty response from API');
      return content;
    }

    // Preserve complete prose verbatim: shared words and closing phrases are meaningful.
    return content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    throw error;
  }
}

export default { callOpenAI };


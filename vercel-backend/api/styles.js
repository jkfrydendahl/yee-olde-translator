/**
 * Styles API Endpoint
 * GET /api/styles
 * 
 * Returns available translation styles
 */

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed'
    });
  }

  return res.status(200).json({
    success: true,
    styles: TRANSLATION_STYLES
  });
}

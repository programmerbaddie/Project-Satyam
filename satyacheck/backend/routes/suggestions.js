const express = require('express');
const router = express.Router();

const SUGGESTION_PATTERNS = [
  { pattern: 'is it true that', templates: ['Is it true that {topic}?', 'Can you verify if {topic} is real?', 'Is the news about {topic} confirmed?'] },
  { pattern: 'fact check', templates: ['Fact check: {topic}', 'Verify this claim about {topic}', 'Check facts about {topic}'] },
  { pattern: 'whatsapp forward', templates: ['Is this WhatsApp forward real?', 'Can you verify this forwarded message?', 'Is this viral WhatsApp message true?'] },
  { pattern: 'viral', templates: ['Verify this viral news about {topic}', 'Is the viral claim about {topic} true?', 'Check viral post about {topic}'] },
  { pattern: 'politics', templates: ['Fact-check political claim about {topic}', 'Verify this politician\'s statement on {topic}', 'Is the political news about {topic} accurate?'] },
  { pattern: 'government', templates: ['Verify government announcement about {topic}', 'Is the official statement on {topic} real?', 'Check this scheme announcement about {topic}'] },
  { pattern: 'health', templates: ['Verify health claim about {topic}', 'Is this medical news about {topic} true?', 'Check health advisory about {topic}'] },
  { pattern: 'scam', templates: ['Is this {topic} a scam?', 'Verify if {topic} is fraudulent', 'Is the {topic} scheme legitimate?'] }
];

const AUTOCOMPLETE_SUGGESTIONS = [
  'Is it true that ',
  'Fact check: ',
  'Is this WhatsApp forward real? ',
  'Verify this news about ',
  'Check if this is fake: ',
  'Is this government scheme real? ',
  'Did this really happen? ',
  'Can you verify this claim? '
];

function matchPattern(query) {
  const q = query.toLowerCase();
  for (const item of SUGGESTION_PATTERNS) {
    if (q.includes(item.pattern)) {
      return item;
    }
  }
  return null;
}

function generateSuggestions(query) {
  const matched = matchPattern(query);
  if (matched) {
    return matched.templates.map(t => t.replace('{topic}', query.split(' ').slice(-3).join(' ')));
  }
  const base = AUTOCOMPLETE_SUGGESTIONS.filter(s => 
    s.toLowerCase().startsWith(q.slice(0, Math.min(q.length, 15)))
  );
  if (base.length > 0) return base.slice(0, 3);
  return [
    `Verify this news: ${query}`,
    `Is "${query}" true?`,
    `Fact check: ${query}`
  ];
}

router.get('/', (req, res) => {
  const { q = '' } = req.query;
  
  if (!q || q.length < 2) {
    return res.json({
      success: true,
      suggestions: AUTOCOMPLETE_SUGGESTIONS.slice(0, 5)
    });
  }

  const suggestions = generateSuggestions(q);
  res.json({
    success: true,
    suggestions: suggestions.slice(0, 5),
    query: q
  });
});

module.exports = router;
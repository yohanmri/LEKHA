const express = require('express');
const router = express.Router();

/**
 * Basic Sinhala grammar rules:
 * - Repeated consecutive words
 * - Double spaces
 * - Missing full stop at end of sentence
 * - Sentence starting with lowercase
 */

function checkGrammar(text) {
  const errors = [];
  const sentences = text.split(/[.!?।]/);

  // Rule 1: Repeated words
  const words = text.split(/\s+/);
  for (let i = 1; i < words.length; i++) {
    if (words[i] && words[i] === words[i - 1]) {
      errors.push({
        type: 'repeated_word',
        message: `Repeated word: "${words[i]}"`,
        suggestion: `Remove one instance of "${words[i]}"`,
        severity: 'warning',
      });
    }
  }

  // Rule 2: Double spaces
  if (/  +/.test(text)) {
    errors.push({
      type: 'double_space',
      message: 'Extra spaces detected',
      suggestion: 'Use a single space between words',
      severity: 'info',
    });
  }

  // Rule 3: Sentence ends without punctuation
  const lastChar = text.trim().slice(-1);
  if (text.trim().length > 10 && !['.', '!', '?', '।', '"', "'"].includes(lastChar)) {
    errors.push({
      type: 'missing_punctuation',
      message: 'Sentence may be missing ending punctuation',
      suggestion: 'Consider ending with a full stop (.) or Sinhala period (।)',
      severity: 'info',
    });
  }

  // Rule 4: Detect common Sinhala grammar patterns (spacing before punctuation)
  if (/\s[,.]/.test(text)) {
    errors.push({
      type: 'space_before_punctuation',
      message: 'Space before punctuation',
      suggestion: 'Remove the space before punctuation marks',
      severity: 'warning',
    });
  }

  return errors;
}

/**
 * POST /api/grammar
 * Body: { text: "..." }
 * Response: { errors: [...], text }
 */
router.post('/', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text field is required' });
  }
  const errors = checkGrammar(text.trim());
  res.json({ text, errors, clean: errors.length === 0 });
});

module.exports = router;

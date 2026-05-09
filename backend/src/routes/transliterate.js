const express = require('express');
const { transliterate } = require('../services/singlishEngine');
const router = express.Router();

/**
 * POST /api/transliterate
 * Body: { text: "mama" }
 * Response: { result: "මම", original: "mama" }
 */
router.post('/', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text field is required' });
  }
  try {
    const result = transliterate(text.trim());
    res.json({ result, original: text });
  } catch (err) {
    res.status(500).json({ error: 'Transliteration failed', detail: err.message });
  }
});

module.exports = router;

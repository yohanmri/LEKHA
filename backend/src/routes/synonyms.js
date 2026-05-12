const express = require('express');
const router = express.Router();

// Basic Sinhala synonyms dictionary (rule-based, no AI dependency)
const SYNONYMS_DB = {
  'ගෙදර': ['නිවස', 'ඇවිදිනවා', 'නේවාසිකය', 'හිමිකාරීත්වය'],
  'ලෝකය': ['භූමිය', 'විශ්වය', 'පෘථිවිය', 'ජනතාව'],
  'රැකියාව': ['කාර්යය', 'රැකියා', 'ශ්‍රමය', 'සේවය'],
  'ජලය': ['වතුර', 'දිය', 'නිල', 'සාගරය'],
  'සතුට': ['ප්‍රීතිය', 'ආශාව', 'සන්තෝසය', 'ඉල්ලීම'],
  'ශ්‍රේෂ්ඨ': ['විශිෂ්ට', 'ප්‍රශංසාව', 'ශ්‍රේෂ්ඨ', 'ඉහළ'],
  'ශ්‍රී': ['ශ්‍රේෂ්ඨ', 'ශ්‍රීය', 'ගෞරව', 'ශ්‍රීලා'],
  'ලෝකු': ['ශ්‍රේෂ්ඨ', 'විශාල', 'ශ්‍රේෂ්ඨ'],
  'work': ['කාර්ය', 'රැකියාව', 'ශ්‍රමය'],
  'home': ['ගෙදර', 'නිවස', 'ගෘහය'],
  'water': ['ජලය', 'දිය', 'වතුර'],
  'happy': ['සතුටු', 'ප්‍රීතිමත්', 'ප්‍රසන්න'],
  'great': ['ශ්‍රේෂ්ඨ', 'විශිෂ්ට', 'ඉහළ', 'හොඳ'],
};



/**
 * POST /api/synonyms
 * Body: { word: "ගෙදර" }
 * Response: { synonyms: ["නිවස", "ඇවිදිනවා", ...], word: "ගෙදර" }
 */
router.post('/', (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== 'string') {
    return res.status(400).json({ error: 'word field is required' });
  }
  const key = word.trim();
  const synonyms = SYNONYMS_DB[key] || [];
  res.json({ word: key, synonyms, found: synonyms.length > 0 });
});

module.exports = router;

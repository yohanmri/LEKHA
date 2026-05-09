// ─── Southern Sinhala Dialect Converter Engine ──────────────────────────────
// Shared module used by DialectPanel (selection convert) and PageEditor (inline ghost).

export const LOOKUP_DICT: Record<string, { dialect: string; alternatives: string[]; type: string }> = {
  "කෙටියෙන්": {"dialect": "ඩිංගිත්තක්", "alternatives": ["පොඩිත්තක්"], "type": "Adjective"},
  "ස්වල්පයක්": {"dialect": "ඩිංගිත්තක්", "alternatives": ["පොඩිත්තක්"], "type": "Adjective"},
  "කුඩා": {"dialect": "හීන්", "alternatives": ["හිච්චී"], "type": "Adjective"},
  "පොඩි": {"dialect": "හීන්", "alternatives": [], "type": "Adjective"},
  "පුංචි": {"dialect": "හීන්", "alternatives": [], "type": "Adjective"},
  "මද": {"dialect": "හිච්චි", "alternatives": [], "type": "Adjective"},
  "ටිකක්": {"dialect": "ඩිංගක්", "alternatives": [], "type": "Adjective"},
  "පුළුවන්": {"dialect": "ඇහැකි", "alternatives": [], "type": "Adverb"},
  "ගොඩක්": {"dialect": "ගොඩෑ", "alternatives": [], "type": "Adverb"},
  "ඔයා": {"dialect": "ඔයැයි", "alternatives": [], "type": "Pronoun"},
  "මම": {"dialect": "මං", "alternatives": [], "type": "Pronoun"},
  "අපි": {"dialect": "අපිලා", "alternatives": [], "type": "Pronoun"},
  "ඔහු": {"dialect": "එයැයි", "alternatives": [], "type": "Pronoun"},
  "ඇය": {"dialect": "එයැයි", "alternatives": [], "type": "Pronoun"},
  "එයා": {"dialect": "එයැයි", "alternatives": [], "type": "Pronoun"},
  "මෙයා": {"dialect": "මෙයැයි", "alternatives": [], "type": "Pronoun"},
  "අරයා": {"dialect": "අරයැයි", "alternatives": [], "type": "Pronoun"},
  "කොස්": {"dialect": "හෙරලි", "alternatives": [], "type": "Noun"},
  "ආච්චි": {"dialect": "ආත්තා", "alternatives": [], "type": "Noun"},
  "සීයා": {"dialect": "මුත්තා", "alternatives": [], "type": "Noun"},
  "කූඹියා": {"dialect": "හින්නා", "alternatives": [], "type": "Noun"},
  "එළවළු": {"dialect": "වෑංජන", "alternatives": [], "type": "Noun"},
  "සම්බෝලය": {"dialect": "සම්බලය", "alternatives": [], "type": "Noun"},
  "ගස්ලඹු": {"dialect": "පැපොල්", "alternatives": [], "type": "Noun"},
  "කොමඩු": {"dialect": "පත්තක්කා", "alternatives": [], "type": "Noun"},
  "වලිගය": {"dialect": "නෙට්ටිය", "alternatives": [], "type": "Noun"},
  "කඹය": {"dialect": "රෑණ", "alternatives": [], "type": "Noun"},
  "විවාහය": {"dialect": "හිරය", "alternatives": [], "type": "Noun"},
  "බිරිඳ": {"dialect": "මහගෙ", "alternatives": [], "type": "Noun"},
  "ආඩම්බරකම": {"dialect": "මහන්තත්තෙ", "alternatives": [], "type": "Noun"},
  "මොකක්": {"dialect": "මක්ක", "alternatives": [], "type": "Interrogative"},
  "නේද": {"dialect": "නො", "alternatives": [], "type": "Interrogative"},
  "ඇතිද": {"dialect": "ඇතෙයි", "alternatives": [], "type": "Interrogative"},
  "කොතනද": {"dialect": "කොයිබෙයි", "alternatives": [], "type": "Interrogative"},
  "මොනවද": {"dialect": "මක්කයි", "alternatives": ["මොනවයි"], "type": "Interrogative"},
  "රැස්වෙනවා": {"dialect": "ඇහිරෙනවා", "alternatives": [], "type": "Verb"},
  "කතා කරනවා": {"dialect": "දොඩනවා", "alternatives": [], "type": "Verb"},
  "උයනවා": {"dialect": "පිසිනවා", "alternatives": ["පිහනවා"], "type": "Verb"},
  "දැම්මා": {"dialect": "දෑවා", "alternatives": [], "type": "Verb"},
  "යනවා": {"dialect": "යනවැයි", "alternatives": [], "type": "Verb"},
  "එනවා": {"dialect": "එනවැයි", "alternatives": [], "type": "Verb"},
};

export const VERB_RULES: Record<string, string> = {
  "කරනවා": "කොරනවා",
  "කරනවාද": "කොරනවැයි",
  "කරනවාද?": "කොරනවැයි?",
  "යනවාද": "යනවැයි",
  "යනවාද?": "යනවැයි?",
  "ගේනවාද": "ගේනවැයි",
  "ගේනවාද?": "ගේනවැයි?",
  "බලනවාද": "බලනවැයි",
  "බලනවාද?": "බලනවැයි?",
  "කියනවාද": "කියනවැයි",
  "කියනවාද?": "කියනවැයි?",
  "දෙනවාද": "දෙනවැයි",
  "දෙනවාද?": "දෙනවැයි?",
  "එනවාද": "එනවැයි",
  "එනවාද?": "එනවැයි?",
  "වෙනවාද": "වෙනවැයි",
  "වෙනවාද?": "වෙනවැයි?",
  "ඉන්නවාද": "ඉන්නවැයි",
  "ඉන්නවාද?": "ඉන්නවැයි?",
  "කරන්න": "කොරන්ට",
  "යන්න": "යන්ට",
  "ගන්න": "ගන්ට",
  "දෙන්න": "දෙන්ට",
  "එන්න": "එන්ට",
  "බලන්න": "බලන්ට",
  "කියන්න": "කියන්ට",
  "වෙන්න": "වෙන්ට",
  "කනවාද?": "කනවැයි?",
  "කනවාද": "කනවැයි",
  "බොනවාද?": "බොනවැයි?",
  "බොනවාද": "බොනවැයි",
  "ගන්නවාද?": "ගන්නවැයි?",
  "ගන්නවාද": "ගන්නවැයි",
  "නිදනවාද?": "නිදනවැයි?",
  "නිදනවාද": "නිදනවැයි",
};

/** Convert a single word using the dictionary, verb rules, and patterns. */
export function convertWord(word: string): { converted: string; changed: boolean; type: string; alternatives: string[] } {
  const clean = word.replace(/[.,!?;:""'']/g, '');
  const punct = word.slice(clean.length);

  // 1. Direct dictionary match
  if (LOOKUP_DICT[clean]) {
    const info = LOOKUP_DICT[clean];
    return { converted: info.dialect + punct, changed: true, type: info.type, alternatives: info.alternatives };
  }

  // 2. Exact verb rule match
  if (VERB_RULES[clean]) {
    return { converted: VERB_RULES[clean] + punct, changed: true, type: 'Verb', alternatives: [] };
  }
  if (VERB_RULES[word]) {
    return { converted: VERB_RULES[word], changed: true, type: 'Verb', alternatives: [] };
  }

  // 3. Pattern-based conversion
  if (clean.endsWith('නවාද')) {
    return { converted: clean.slice(0, -4) + 'නවැයි' + punct, changed: true, type: 'Pattern', alternatives: [] };
  }
  if (clean.endsWith('නවා')) {
    return { converted: clean.slice(0, -3) + 'නවැයි' + punct, changed: true, type: 'Pattern', alternatives: [] };
  }
  if (clean.endsWith('න්න')) {
    return { converted: clean.slice(0, -3) + 'න්ට' + punct, changed: true, type: 'Pattern', alternatives: [] };
  }
  if (clean.includes('කරන')) {
    const c = word.replace('කරන', 'කොරන').replace('වාද', 'වැයි').replace('වා', 'වැයි');
    if (c !== word) return { converted: c, changed: true, type: 'Pattern', alternatives: [] };
  }

  // 4. Suffix-based (base word lookup)
  const suffixes = ['ට', 'ගේ', 'ලා', 'ත්', 'ද', 'නේ'];
  for (const suffix of suffixes) {
    if (clean.endsWith(suffix)) {
      const base = clean.slice(0, -suffix.length);
      if (LOOKUP_DICT[base]) {
        const info = LOOKUP_DICT[base];
        return {
          converted: info.dialect + suffix + punct,
          changed: true,
          type: 'Suffix',
          alternatives: info.alternatives.map(a => a + suffix),
        };
      }
    }
  }

  return { converted: word, changed: false, type: '', alternatives: [] };
}

export interface ConversionChange {
  original: string;
  converted: string;
  type: string;
  alternatives: string[];
}

/** Convert a full text block. Returns converted text and a log of changes. */
export function convertText(text: string): { output: string; changes: ConversionChange[] } {
  const changes: ConversionChange[] = [];
  const lines = text.split('\n');
  const outputLines = lines.map(line => {
    const words = line.split(' ');
    return words.map(word => {
      if (!word.trim()) return word;
      const result = convertWord(word);
      if (result.changed) {
        changes.push({ original: word, converted: result.converted, type: result.type, alternatives: result.alternatives });
      }
      return result.converted;
    }).join(' ');
  });
  return { output: outputLines.join('\n'), changes };
}

/** Suggest a dialect conversion for the current word being typed (for ghost text). */
export function suggestForCurrentWord(word: string): string | null {
  if (!word || word.length < 2) return null;
  const result = convertWord(word);
  if (result.changed && result.converted !== word) return result.converted;
  return null;
}

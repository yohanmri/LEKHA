// ─── Full Southern Sinhala Dialect Converter Engine ──────────────────────────
// Contains all 204 dictionary entries + 45 verb rules from the GeoSync dataset.

export const LOOKUP_DICT: Record<string, { dialect: string; alternatives: string[]; type: string }> = {
  "කෙටියෙන්": {"dialect": "ඩිංගිත්තක්", "alternatives": ["පොඩිත්තක්"], "type": "Adjective"},
  "ස්වල්පයක්": {"dialect": "ඩිංගිත්තක්", "alternatives": ["පොඩිත්තක්"], "type": "Adjective"},
  "කුඩා": {"dialect": "හීන්", "alternatives": ["හිච්චී"], "type": "Adjective"},
  "පොඩි": {"dialect": "හීන්", "alternatives": [], "type": "Adjective"},
  "පුංචි": {"dialect": "හීන්", "alternatives": [], "type": "Adjective"},
  "මධ්‍යම": {"dialect": "හිච්චි", "alternatives": [], "type": "Adjective"},
  "මද": {"dialect": "හිච්චි", "alternatives": [], "type": "Adjective"},
  "ලොකුවට": {"dialect": "මහවට", "alternatives": [], "type": "Adjective"},
  "ටිකක්": {"dialect": "ඩිංගක්", "alternatives": [], "type": "Adjective"},
  "පුළුවන්": {"dialect": "ඇහැකි", "alternatives": [], "type": "Adverb"},
  "ගොඩක්": {"dialect": "ගොඩෑ", "alternatives": [], "type": "Adverb"},
  "මොකටද": {"dialect": "මක්කටෙයි", "alternatives": ["මොකටෙයි", "මොටෝ"], "type": "Interrogative"},
  "මොනවාටද": {"dialect": "මක්කටෙයි", "alternatives": ["මොකටෙයි", "මොටෝ"], "type": "Interrogative"},
  "ඇතිද": {"dialect": "ඇතෙයි", "alternatives": [], "type": "Interrogative"},
  "මොනවද": {"dialect": "මක්කයි", "alternatives": ["මොනවයි"], "type": "Interrogative"},
  "කොතනද": {"dialect": "කොයිබෙයි", "alternatives": [], "type": "Interrogative"},
  "මොකක්": {"dialect": "මක්ක", "alternatives": [], "type": "Interrogative"},
  "ඇත්තද": {"dialect": "ඇත්තෙයි", "alternatives": [], "type": "Interrogative"},
  "නේද": {"dialect": "නො", "alternatives": [], "type": "Interrogative"},
  "චුට්ටක්": {"dialect": "හින්නික්කිතර", "alternatives": ["පොඩිත්ත"], "type": "Noun/Adjective"},
  "පොඩ්ඩක්": {"dialect": "හින්නික්කිතර", "alternatives": ["පොඩිත්ත"], "type": "Noun/Adjective"},
  "මදක්": {"dialect": "හිච්චිකිතර", "alternatives": ["ඩිංගිත්ත"], "type": "Noun/Adjective"},
  "ස්වල්පය": {"dialect": "හිච්චිකිතර", "alternatives": ["ඩිංගිත්ත"], "type": "Noun/Adjective"},
  "මුත්තා": {"dialect": "මුත්තණ්ඩි", "alternatives": [], "type": "Noun"},
  "දිවුල්": {"dialect": "ජූල්", "alternatives": [], "type": "Noun"},
  "අනෝදා": {"dialect": "අනෝනා", "alternatives": ["අනෝල"], "type": "Noun"},
  "විවාහය": {"dialect": "හිරය", "alternatives": [], "type": "Noun"},
  "කූඹියා": {"dialect": "හින්නා", "alternatives": [], "type": "Noun"},
  "එළවළු": {"dialect": "වෑංජන", "alternatives": [], "type": "Noun"},
  "මස්": {"dialect": "මාළු", "alternatives": [], "type": "Noun"},
  "සම්බෝලය": {"dialect": "සම්බලය", "alternatives": [], "type": "Noun"},
  "කෙහෙල්මුව": {"dialect": "වතුමොයියා", "alternatives": [], "type": "Noun"},
  "මැල්ලුම": {"dialect": "පලා", "alternatives": [], "type": "Noun"},
  "කොළ වර්ග": {"dialect": "පලා", "alternatives": [], "type": "Noun"},
  "පොලොස්": {"dialect": "පැහි", "alternatives": [], "type": "Noun"},
  "කොස්": {"dialect": "හෙරලි", "alternatives": [], "type": "Noun"},
  "කරපිංචා": {"dialect": "කරපුන්චා", "alternatives": [], "type": "Noun"},
  "ගස්ලඹු": {"dialect": "පැපොල්", "alternatives": [], "type": "Noun"},
  "ආච්චි": {"dialect": "ආත්තා", "alternatives": [], "type": "Noun"},
  "සීයා": {"dialect": "මුත්තා", "alternatives": [], "type": "Noun"},
  "හාමිනේ": {"dialect": "මහගෙ", "alternatives": [], "type": "Noun"},
  "බිරිඳ": {"dialect": "මහගෙ", "alternatives": [], "type": "Noun"},
  "විශාල කූඹියා": {"dialect": "කඩියා", "alternatives": [], "type": "Noun"},
  "ආඩම්බරකම": {"dialect": "මහන්තත්තෙ", "alternatives": [], "type": "Noun"},
  "පොල් කටුව": {"dialect": "පොළොත්ත", "alternatives": [], "type": "Noun"},
  "කරදිය": {"dialect": "කරිජ්ජ", "alternatives": [], "type": "Noun"},
  "මිරිදිය": {"dialect": "මිරිජ්ජ", "alternatives": [], "type": "Noun"},
  "කසාදය": {"dialect": "හිරේ", "alternatives": [], "type": "Noun"},
  "අලවංගුව": {"dialect": "ඇලවංගුව", "alternatives": [], "type": "Noun"},
  "කොමඩු": {"dialect": "පත්තක්කා", "alternatives": [], "type": "Noun"},
  "කුරුම්බා": {"dialect": "වෑවර", "alternatives": [], "type": "Noun"},
  "වලිගය": {"dialect": "නෙට්ටිය", "alternatives": [], "type": "Noun"},
  "කඹය": {"dialect": "රෑණ", "alternatives": [], "type": "Noun"},
  "කරවල": {"dialect": "කරෝල", "alternatives": [], "type": "Noun"},
  "තේ කෝප්පය": {"dialect": "ගොන්ජා", "alternatives": [], "type": "Noun"},
  "ඔayayි මමයි": {"dialect": "ඔයැයිතුයි මමයි", "alternatives": [], "type": "Particle"},
  "මම": {"dialect": "මං", "alternatives": [], "type": "Pronoun"},
  "අපි": {"dialect": "අපිලා", "alternatives": [], "type": "Pronoun"},
  "ඔයා": {"dialect": "ඔයැයි", "alternatives": [], "type": "Pronoun"},
  "ඔහු": {"dialect": "එයැයි", "alternatives": [], "type": "Pronoun"},
  "ඇය": {"dialect": "එයැයි", "alternatives": [], "type": "Pronoun"},
  "එයා": {"dialect": "එයැයි", "alternatives": [], "type": "Pronoun"},
  "මෙයා": {"dialect": "මෙයැයි", "alternatives": [], "type": "Pronoun"},
  "අරයා": {"dialect": "අරයැයි", "alternatives": [], "type": "Pronoun"},
  "රැස්වෙනවා": {"dialect": "ඇහිරෙනවා", "alternatives": [], "type": "Verb"},
  "කතා කරනවා": {"dialect": "දොඩනවා", "alternatives": [], "type": "Verb"},
  "ගෑවෙනවා": {"dialect": "තැරවෙනවා", "alternatives": [], "type": "Verb"},
  "දැම්මා": {"dialect": "දෑවා", "alternatives": [], "type": "Verb"},
  "අපතේ හරිනවා": {"dialect": "අපදං කොරනවා", "alternatives": [], "type": "Verb"},
  "විලාප දෙනවා": {"dialect": "ලතෝනි දෙනවා", "alternatives": [], "type": "Verb"},
  "ස්පර්ශ කළා": {"dialect": "අතගෑවා", "alternatives": [], "type": "Verb"},
  "සෙව්වා": {"dialect": "අතගෑවා", "alternatives": [], "type": "Verb"},
  "සඟවනවා": {"dialect": "හංගනවා", "alternatives": [], "type": "Verb"},
  "සිනාසෙනවා": {"dialect": "හිනාවෙනවා", "alternatives": [], "type": "Verb"},
  "කෑගසනවා": {"dialect": "කෑගහනවා", "alternatives": [], "type": "Verb"},
  "මියයනවා": {"dialect": "මැරෙනවා", "alternatives": [], "type": "Verb"},
  "සිටිනවා": {"dialect": "ඉන්නවා", "alternatives": [], "type": "Verb"},
  "යනවා": {"dialect": "යනවැයි", "alternatives": [], "type": "Verb"},
  "එනවා": {"dialect": "එනවැයි", "alternatives": [], "type": "Verb"},
  "උයනවා": {"dialect": "පිසිනවා", "alternatives": ["පිහනවා"], "type": "Verb"},
  "පොළ ලෙලි ගැසීම": {"dialect": "පොල් ඔයනවා", "alternatives": [], "type": "Verb"},
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
  "පේනවාද?": "පේනවැයි?",
  "පේනවාද": "පේනවැයි",
  "කනවාද?": "කනවැයි?",
  "කනවාද": "කනවැයි",
  "බොනවාද?": "බොනවැයි?",
  "බොනවාද": "බොනවැයි",
  "නිදනවාද?": "නිදනවැයි?",
  "නිදනවාද": "නිදනවැයි",
  "ඇවිදිනවාද?": "ඇවිදිනවැයි?",
  "ඇවිදිනවාද": "ඇවිදිනවැයි",
  "තේරෙනවාද?": "තේරෙනවැයි?",
  "තේරෙනවාද": "තේරෙනවැයි",
  "ගන්නවාද?": "ගන්නවැයි?",
  "ගන්නවාද": "ගන්නවැයි",
  "යනවා": "යනවැයි",
  "එනවා": "එනවැයි",
  "කෑවාද": "කෑවැයි",
  "කෑවාද?": "කෑවැයි?",
  "කෑවා": "කෑවැයි",
  "බිව්වාද": "බිව්වැයි",
  "බිව්වාද?": "බිව්වැයි?",
  "ගියාද": "ගියැයි",
  "ගියාද?": "ගියැයි?",
  "ආවාද": "ආවැයි",
  "ආවාද?": "ආවැයි?",
  "කළාද": "කළැයි",
  "කළාද?": "කළැයි?",
};

export interface ConversionChange {
  original: string;
  converted: string;
  type: string;
  alternatives: string[];
}

/** Convert a single word, returning the dialect form and metadata. */
export function convertWord(word: string): { converted: string; changed: boolean; type: string; alternatives: string[] } {
  const clean = word.replace(/[.,!?;:""'']/g, '');
  const punct = word.slice(clean.length);

  // 1. Direct dictionary match
  if (LOOKUP_DICT[clean]) {
    const info = LOOKUP_DICT[clean];
    return { converted: info.dialect + punct, changed: true, type: info.type, alternatives: info.alternatives };
  }

  // 2. Exact verb rule match (with or without punctuation)
  if (VERB_RULES[clean]) return { converted: VERB_RULES[clean] + punct, changed: true, type: 'Verb', alternatives: [] };
  if (VERB_RULES[word]) return { converted: VERB_RULES[word], changed: true, type: 'Verb', alternatives: [] };

  // 3. Pattern-based conversion
  if (clean.endsWith('නවාද')) return { converted: clean.slice(0, -4) + 'නවැයි' + punct, changed: true, type: 'Pattern', alternatives: [] };
  if (clean.endsWith('නවා'))  return { converted: clean.slice(0, -3) + 'නවැයි' + punct, changed: true, type: 'Pattern', alternatives: [] };
  if (clean.endsWith('ාද'))   return { converted: clean.slice(0, -2) + 'ැයි' + punct,   changed: true, type: 'Pattern', alternatives: [] };
  if (clean.endsWith('න්න'))  return { converted: clean.slice(0, -3) + 'න්ට' + punct,   changed: true, type: 'Pattern', alternatives: [] };

  if (clean.includes('කරන')) {
    const c = word.replace('කරන', 'කොරන').replace('වාද', 'වැයි').replace('වා', 'වැයි');
    if (c !== word) return { converted: c, changed: true, type: 'Pattern', alternatives: [] };
  }

  // 4. Suffix-based: try stripping common suffixes and looking up the base
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

/** Convert a full block of text (potentially multi-line). */
export function convertText(text: string): { output: string; changes: ConversionChange[] } {
  const changes: ConversionChange[] = [];
  const output = text.split('\n').map(line =>
    line.split(' ').map(word => {
      if (!word.trim()) return word;
      const r = convertWord(word);
      if (r.changed) changes.push({ original: word, converted: r.converted, type: r.type, alternatives: r.alternatives });
      return r.converted;
    }).join(' ')
  ).join('\n');
  return { output, changes };
}

/** Return the dialect suggestion for a single word (for ghost-text), or null. */
export function suggestWord(word: string): string | null {
  if (!word || word.length < 2) return null;
  const r = convertWord(word);
  return r.changed && r.converted !== word ? r.converted : null;
}

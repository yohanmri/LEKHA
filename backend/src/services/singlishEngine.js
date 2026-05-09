/**
 * Singlish → Sinhala transliteration engine
 * Based on Google IME / Helakuru-style phonetic mapping
 */

// Vowel modifiers (matra) — applied to preceding consonant
const VOWEL_MODIFIERS = {
  'aa': 'ා', 'a': '',
  'ii': 'ී', 'i': 'ි',
  'uu': 'ූ', 'u': 'ු',
  'ee': 'ේ', 'e': 'ෙ',
  'oo': 'ෝ', 'o': 'ො',
  'ae': 'ැ',
  'au': 'ෞ',
  'ai': 'ෛ',
};

// Independent vowels (word-start)
const INDEPENDENT_VOWELS = {
  'A': 'ආ', 'a': 'අ',
  'I': 'ඊ', 'i': 'ඉ',
  'U': 'ඌ', 'u': 'උ',
  'E': 'ඒ', 'e': 'එ',
  'O': 'ඕ', 'o': 'ඔ',
  'ae': 'ඇ',
};

// Consonants — longest match first
const CONSONANTS = [
  // Aspirated / special
  ['kh', 'ඛ'], ['gh', 'ඝ'], ['chh', 'ඡ'], ['jh', 'ඣ'],
  ['tth', 'ඨ'], ['ddh', 'ඪ'], ['nth', 'ඦ'], ['ndh', 'ඬ'],
  ['th', 'ත'], ['dh', 'ද'], ['ph', 'ඵ'], ['bh', 'භ'],
  ['sh', 'ශ'], ['Sh', 'ෂ'], ['gh', 'ඝ'],
  // Standard
  ['k', 'ක'], ['K', 'ඛ'],
  ['g', 'ග'], ['G', 'ඝ'],
  ['ch', 'ච'], ['c', 'ච'],
  ['j', 'ජ'], ['J', 'ඣ'],
  ['T', 'ට'], ['D', 'ඩ'],
  ['N', 'ණ'], ['n', 'න'],
  ['t', 'ත'], ['d', 'ද'],
  ['p', 'ප'], ['P', 'ඵ'],
  ['b', 'බ'], ['B', 'භ'],
  ['m', 'ම'],
  ['y', 'ය'],
  ['r', 'ර'],
  ['l', 'ල'], ['L', 'ළ'],
  ['v', 'ව'], ['w', 'ව'],
  ['s', 'ස'], ['S', 'ශ'],
  ['h', 'හ'],
  ['f', 'ෆ'],
  ['x', 'ක්ස'],
  ['q', 'ක'],
  ['z', 'ස'],
  // Nasal combinations
  ['ng', 'ං'],
  ['nk', 'ංක'],
];

/**
 * Transliterate a singlish string to sinhala unicode
 * @param {string} input
 * @returns {string}
 */
function transliterate(input) {
  let result = '';
  let i = 0;
  const len = input.length;

  while (i < len) {
    let matched = false;

    // Try to match a consonant
    for (const [key, sinhala] of CONSONANTS) {
      if (input.startsWith(key, i)) {
        // Found consonant — now look for a vowel modifier
        i += key.length;
        let vowelMatch = '';
        let vowelSinhala = '';

        // Try longest vowel match first
        const vowelKeys = Object.keys(VOWEL_MODIFIERS).sort((a, b) => b.length - a.length);
        for (const vk of vowelKeys) {
          if (input.startsWith(vk, i)) {
            vowelMatch = vk;
            vowelSinhala = VOWEL_MODIFIERS[vk] ?? '';
            break;
          }
        }

        if (vowelMatch) {
          // Consonant + vowel matra
          result += sinhala + vowelSinhala;
          i += vowelMatch.length;
        } else {
          // Consonant only — add hal kirima (virama) if not end
          result += sinhala + (i < len ? '්' : '');
        }

        matched = true;
        break;
      }
    }

    if (!matched) {
      // Check for independent vowel
      let vowelMatched = false;
      const iVowelKeys = Object.keys(INDEPENDENT_VOWELS).sort((a, b) => b.length - a.length);
      for (const vk of iVowelKeys) {
        if (input.startsWith(vk, i)) {
          result += INDEPENDENT_VOWELS[vk] ?? '';
          i += vk.length;
          vowelMatched = true;
          break;
        }
      }

      if (!vowelMatched) {
        // Pass through (numbers, spaces, punctuation)
        result += input[i];
        i++;
      }
    }
  }

  return result;
}

module.exports = { transliterate };

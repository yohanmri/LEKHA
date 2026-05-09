/**
 * Singlish → Sinhala transliteration engine (client-side)
 * Google IME / Helakuru-style phonetic mapping.
 * Runs 100% in the browser — no network calls needed.
 */

const VOWEL_MODIFIERS: Record<string, string> = {
  'aa': 'ා', 'a': '',
  'aea': 'ෑ', 'ae': 'ැ',
  'ii': 'ී', 'i': 'ි',
  'uu': 'ූ', 'u': 'ු',
  'ee': 'ේ', 'e': 'ෙ',
  'oo': 'ෝ', 'o': 'ො',
  'au': 'ෞ',
  'ai': 'ෛ',
};

const INDEPENDENT_VOWELS: Record<string, string> = {
  'aa': 'ආ', 'a': 'අ',
  'aea': 'ඈ', 'ae': 'ඇ',
  'ii': 'ඊ', 'i': 'ඉ',
  'uu': 'ඌ', 'u': 'උ',
  'ee': 'ඒ', 'e': 'එ',
  'oo': 'ඕ', 'o': 'ඔ',
};

// Consonants - Longest match first to handle combinations like 'nd', 'th', etc.
const CONSONANTS: [string, string][] = [
  // Nasalized / Sanyaka
  ['nnd', 'ඬ'], ['nndh', 'ඳ'], ['nng', 'ඟ'], ['nmb', 'ඹ'],
  ['ndh', 'ඳ'], ['nd', 'ඳ'], ['ng', 'ඟ'], ['nj', 'ඦ'],
  ['nk', 'ංක'], ['nv', 'ංව'],

  // Aspirated
  ['kh', 'ඛ'], ['gh', 'ඝ'], ['chh', 'ඡ'], ['jh', 'ඣ'],
  ['tth', 'ඨ'], ['ddh', 'ඪ'], ['th', 'ත'], ['dh', 'ද'],
  ['ph', 'ඵ'], ['bh', 'භ'], ['sh', 'ශ'], ['Sh', 'ෂ'],

  // Standard
  ['k', 'ක'], ['g', 'ග'], ['ch', 'ච'], ['c', 'ච'], ['j', 'ජ'],
  ['T', 'ට'], ['D', 'ඩ'], ['N', 'ණ'],
  ['t', 'ට'], ['d', 'ද'], ['n', 'න'], // Singlish style: t for ට
  ['th', 'ත'], ['dh', 'ද'], // th for ත
  ['p', 'ප'], ['b', 'බ'], ['m', 'ම'],
  ['y', 'ය'], ['r', 'ර'], ['l', 'ල'], ['v', 'ව'], ['w', 'ව'],
  ['s', 'ස'], ['h', 'හ'], ['f', 'ෆ'],
  ['L', 'ළ'], ['K', 'ඛ'], ['G', 'ඝ'], ['J', 'ඣ'],
  ['P', 'ඵ'], ['B', 'භ'], ['S', 'ශ'],
  ['z', 'ස'], ['x', 'ක්ස'],
];

const VOWEL_KEYS = Object.keys(VOWEL_MODIFIERS).sort((a, b) => b.length - a.length);
const IVOWEL_KEYS = Object.keys(INDEPENDENT_VOWELS).sort((a, b) => b.length - a.length);

export function transliterate(input: string): string {
  let result = '';
  let i = 0;
  const len = input.length;

  while (i < len) {
    let matchedConsonant = false;

    // 1. Try to match a consonant
    for (const [key, sinhala] of CONSONANTS) {
      if (input.startsWith(key, i)) {
        i += key.length;
        matchedConsonant = true;

        // 2. Now immediately look for a vowel modifier
        let matchedVowel = false;
        for (const vk of VOWEL_KEYS) {
          if (input.startsWith(vk, i)) {
            const modifier = VOWEL_MODIFIERS[vk];
            result += sinhala + modifier;
            i += vk.length;
            matchedVowel = true;
            break;
          }
        }

        // 3. If NO vowel followed the consonant, add Hal Kirima
        if (!matchedVowel) {
          result += sinhala + '්';
        }

        break;
      }
    }

    if (!matchedConsonant) {
      // 4. Try independent vowel
      let ivMatched = false;
      for (const vk of IVOWEL_KEYS) {
        if (input.startsWith(vk, i)) {
          result += INDEPENDENT_VOWELS[vk] ?? '';
          i += vk.length;
          ivMatched = true;
          break;
        }
      }

      if (!ivMatched) {
        // 5. Pass through (numbers, spaces, etc.)
        result += input[i];
        i++;
      }
    }
  }

  return result;
}

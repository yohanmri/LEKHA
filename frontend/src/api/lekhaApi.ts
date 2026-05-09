import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

export const lekhaApi = {
  /** Check backend health */
  health: () => api.get('/health'),

  /** Transliterate Singlish → Sinhala */
  transliterate: (text: string) =>
    api.post<{ result: string; original: string }>('/transliterate', { text }),

  /** Get synonyms for a Sinhala word */
  synonyms: (word: string) =>
    api.post<{ word: string; synonyms: string[]; found: boolean }>('/synonyms', { word }),

  /** Check grammar of a text */
  grammar: (text: string) =>
    api.post<{
      text: string;
      errors: { type: string; message: string; suggestion: string; severity: string }[];
      clean: boolean;
    }>('/grammar', { text }),

  /** Export document */
  export: (html: string, format: 'txt' | 'html', title?: string) =>
    api.post('/export', { html, format, title }, { responseType: 'blob' }),
};

export default lekhaApi;

import { create } from 'zustand';

interface AppState {
  // Tab / panel state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidePanel: 'synonyms' | 'grammar' | 'dialect' | null;
  setSidePanel: (panel: 'synonyms' | 'grammar' | 'dialect' | null) => void;

  // UI toggles
  isKeyboardOpen: boolean;
  toggleKeyboard: () => void;
  isLeftPanelCollapsed: boolean;
  toggleLeftPanel: () => void;

  // Document meta
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  saveStatus: 'saved' | 'unsaved' | 'saving';
  setSaveStatus: (status: 'saved' | 'unsaved' | 'saving') => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;

  // Font / language settings (shared between ribbon and editor)
  fontLang: 'sinhala' | 'latin';
  setFontLang: (lang: 'sinhala' | 'latin') => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'HOME',
  setActiveTab: (tab) => set({ activeTab: tab.toUpperCase() }),

  sidePanel: null,
  setSidePanel: (panel) => set({ sidePanel: panel }),

  isKeyboardOpen: false,
  toggleKeyboard: () => set((state) => ({ isKeyboardOpen: !state.isKeyboardOpen })),

  isLeftPanelCollapsed: false,
  toggleLeftPanel: () => set((state) => ({ isLeftPanelCollapsed: !state.isLeftPanelCollapsed })),

  documentTitle: 'ලේඛා ලියවිල්ල',
  setDocumentTitle: (title) => set({ documentTitle: title }),

  saveStatus: 'saved',
  setSaveStatus: (status) => set({ saveStatus: status }),

  zoomLevel: 100,
  setZoomLevel: (level) => set({ zoomLevel: level }),

  // Font defaults
  fontLang: 'sinhala',
  setFontLang: (lang) => set({
    fontLang: lang,
    fontFamily: lang === 'sinhala' ? 'Noto Sans Sinhala' : 'Inter',
  }),
  fontFamily: 'Noto Sans Sinhala',
  setFontFamily: (family) => set({ fontFamily: family }),
  fontSize: '12',
  setFontSize: (size) => set({ fontSize: size }),
}));

import { create } from 'zustand';

export type PageSizeName = 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal';
export type OrientationType = 'portrait' | 'landscape';
export type MarginPreset = 'normal' | 'narrow' | 'wide' | 'moderate';

export interface PageSize { name: PageSizeName; widthPx: number; heightPx: number; }

// Page sizes at 96 DPI (1cm = 37.8px)
export const PAGE_SIZES: Record<PageSizeName, PageSize> = {
  A4:     { name: 'A4',     widthPx: 794,  heightPx: 1123 },
  A3:     { name: 'A3',     widthPx: 1123, heightPx: 1587 },
  A5:     { name: 'A5',     widthPx: 559,  heightPx: 794  },
  Letter: { name: 'Letter', widthPx: 816,  heightPx: 1056 },
  Legal:  { name: 'Legal',  widthPx: 816,  heightPx: 1344 },
};

// Margin presets in px (at 96 DPI; 1cm≈38px)
export const MARGIN_PRESETS: Record<MarginPreset, { top: number; right: number; bottom: number; left: number; label: string }> = {
  normal:   { top: 96, right: 96, bottom: 96, left: 96,   label: 'Normal (2.54 cm)' },
  moderate: { top: 76, right: 57, bottom: 76, left: 57,   label: 'Moderate (2 cm / 1.5 cm)' },
  narrow:   { top: 48, right: 48, bottom: 48, left: 48,   label: 'Narrow (1.27 cm)' },
  wide:     { top: 96, right: 192, bottom: 96, left: 192, label: 'Wide (2.54 / 5.08 cm)' },
};

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

  // Page layout
  pageSize: PageSize;
  setPageSize: (name: PageSizeName) => void;
  orientation: OrientationType;
  setOrientation: (o: OrientationType) => void;
  marginPreset: MarginPreset;
  setMarginPreset: (p: MarginPreset) => void;

  // Font / language settings (shared between ribbon and editor)
  fontLang: 'sinhala' | 'latin';
  setFontLang: (lang: 'sinhala' | 'latin') => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;

  // Templates modal
  isTemplatesOpen: boolean;
  setTemplatesOpen: (open: boolean) => void;
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

  // Page layout defaults
  pageSize: PAGE_SIZES.A4,
  setPageSize: (name) => set({ pageSize: PAGE_SIZES[name] }),
  orientation: 'portrait',
  setOrientation: (o) => set({ orientation: o }),
  marginPreset: 'normal',
  setMarginPreset: (p) => set({ marginPreset: p }),

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

  isTemplatesOpen: false,
  setTemplatesOpen: (open) => set({ isTemplatesOpen: open }),
}));

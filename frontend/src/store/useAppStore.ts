import { create } from 'zustand';

export type PageSizeName = 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal' | 'Custom';
export type OrientationType = 'portrait' | 'landscape';
export type MarginPreset = 'normal' | 'narrow' | 'wide' | 'moderate';

export interface PageData {
  id: string;
  content: string;
  title: string;
}

export interface Reference {
  id: string;
  text: string;
}

export interface HeaderFooterFormat {
  text: string;
  fontFamily: string;
  fontSize: string;
  color: string;
  align: 'left' | 'center' | 'right';
  bold: boolean;
  italic: boolean;
}

export type PageNumberStyle = 'arabic' | 'roman' | 'alpha';
export interface PageNumberRule {
  id: string;
  startPage: number;
  endPage?: number;
  style: PageNumberStyle;
  startAt: number;
}

export interface PageNumberConfig {
  show: boolean;
  verticalPosition: 'top' | 'bottom';
  horizontalAlign: 'left' | 'center' | 'right';
  color: string;
  fontFamily: string;
  fontSize: string;
  bold: boolean;
  italic: boolean;
  rules: PageNumberRule[];
}

export type TocTemplate = 'classic' | 'numbered' | 'modern' | 'minimal';

export interface TocLevelStyle {
  fontFamily: string;
  fontSize: string;
  bold: boolean;
  color: string;
}

export interface TocConfig {
  template: TocTemplate;
  titleText: string;
  titleFontSize: string;
  showPageNumbers: boolean;
  levels: {
    h1: TocLevelStyle;
    h2: TocLevelStyle;
    h3: TocLevelStyle;
    h4: TocLevelStyle;
  };
}

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
  // Canva-style Pages
  pages: PageData[];
  setPages: (pages: PageData[]) => void;
  addPage: (index?: number) => void;
  deletePage: (id: string) => void;
  duplicatePage: (id: string) => void;
  movePage: (id: string, direction: 'up' | 'down') => void;
  updatePageTitle: (id: string, title: string) => void;
  updatePageContent: (id: string, content: string) => void;

  // Active Editor Tracking
  activeEditorId: string | null;
  setActiveEditorId: (id: string | null) => void;

  // Global Header/Footer & Numbering
  headerFormat: HeaderFooterFormat;
  setHeaderFormat: (format: Partial<HeaderFooterFormat>) => void;
  footerFormat: HeaderFooterFormat;
  setFooterFormat: (format: Partial<HeaderFooterFormat>) => void;
  
  pageNumberConfig: PageNumberConfig;
  setPageNumberConfig: (config: Partial<PageNumberConfig>) => void;

  // TOC
  tocConfig: TocConfig;
  setTocConfig: (config: Partial<TocConfig>) => void;

  // References
  references: Reference[];
  addReference: (text: string) => void;
  deleteReference: (id: string) => void;

  // Tab / panel state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidePanel: 'synonyms' | 'grammar' | 'dialect' | 'references' | 'toc' | null;
  setSidePanel: (panel: 'synonyms' | 'grammar' | 'dialect' | 'references' | 'toc' | null) => void;

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

  // Page Custom Size
  isCustomPageSize: boolean;
  setCustomPageSize: (widthPx: number, heightPx: number) => void;

  // Page Design
  pageBackgroundColor: string;
  setPageBackgroundColor: (color: string) => void;
  pageBorderStyle: string;
  setPageBorderStyle: (style: string) => void;
  pageBorderColor: string;
  setPageBorderColor: (color: string) => void;
  pageBorderWidth: string;
  setPageBorderWidth: (width: string) => void;

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
  pages: [
    { id: 'page-1', content: '<p>ලේඛා වෙත සාදරයෙන් පිළිගනිමු!</p>', title: '' }
  ],
  setPages: (pages) => set({ pages }),
  addPage: (index) => set((state) => {
    const newPage = { id: `page-${Date.now()}`, content: '<p></p>', title: '' };
    if (index !== undefined) {
      const newPages = [...state.pages];
      newPages.splice(index + 1, 0, newPage);
      return { pages: newPages };
    }
    return { pages: [...state.pages, newPage] };
  }),
  deletePage: (id) => set((state) => ({
    pages: state.pages.length > 1 ? state.pages.filter(p => p.id !== id) : state.pages
  })),
  duplicatePage: (id) => set((state) => {
    const index = state.pages.findIndex(p => p.id === id);
    if (index === -1) return state;
    const p = state.pages[index];
    const newPage = { id: `page-${Date.now()}`, content: p.content, title: p.title };
    const newPages = [...state.pages];
    newPages.splice(index + 1, 0, newPage);
    return { pages: newPages };
  }),
  movePage: (id, direction) => set((state) => {
    const index = state.pages.findIndex(p => p.id === id);
    if (index === -1) return state;
    if (direction === 'up' && index === 0) return state;
    if (direction === 'down' && index === state.pages.length - 1) return state;
    const newPages = [...state.pages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newPages[index], newPages[targetIndex]] = [newPages[targetIndex], newPages[index]];
    return { pages: newPages };
  }),
  updatePageTitle: (id, title) => set((state) => ({
    pages: state.pages.map(p => p.id === id ? { ...p, title } : p)
  })),
  updatePageContent: (id, content) => set((state) => ({
    pages: state.pages.map(p => p.id === id ? { ...p, content } : p)
  })),

  activeEditorId: null,
  setActiveEditorId: (id) => set({ activeEditorId: id }),

  headerFormat: { text: '', fontFamily: 'FMAbhaya', fontSize: '10', color: '#000000', align: 'center', bold: false, italic: false },
  setHeaderFormat: (format) => set((state) => ({ headerFormat: { ...state.headerFormat, ...format } })),
  footerFormat: { text: '', fontFamily: 'FMAbhaya', fontSize: '10', color: '#000000', align: 'left', bold: false, italic: false },
  setFooterFormat: (format) => set((state) => ({ footerFormat: { ...state.footerFormat, ...format } })),
  
  pageNumberConfig: { 
    show: true, 
    verticalPosition: 'bottom', 
    horizontalAlign: 'right', 
    color: '#000000', 
    fontFamily: 'Inter',
    fontSize: '10',
    bold: false,
    italic: false,
    rules: [
      { id: 'rule-1', startPage: 1, style: 'arabic', startAt: 1 }
    ] 
  },
  setPageNumberConfig: (config) => set((state) => ({ pageNumberConfig: { ...state.pageNumberConfig, ...config } })),

  tocConfig: {
    template: 'numbered',
    titleText: 'Table of Contents',
    titleFontSize: '18',
    showPageNumbers: true,
    levels: {
      h1: { fontFamily: 'Inter', fontSize: '14', bold: true, color: '#111111' },
      h2: { fontFamily: 'Inter', fontSize: '12', bold: false, color: '#333333' },
      h3: { fontFamily: 'Inter', fontSize: '12', bold: false, color: '#555555' },
      h4: { fontFamily: 'Inter', fontSize: '11', bold: false, color: '#777777' },
    },
  },
  setTocConfig: (config) => set((state) => ({ tocConfig: { ...state.tocConfig, ...config } })),

  references: [],
  addReference: (text) => set((state) => ({ 
    references: [...state.references, { id: `ref-${Date.now()}`, text }] 
  })),
  deleteReference: (id) => set((state) => ({ 
    references: state.references.filter(r => r.id !== id) 
  })),

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
  setPageSize: (name) => set({ pageSize: name === 'Custom' ? { name: 'Custom', widthPx: 794, heightPx: 1123 } : PAGE_SIZES[name], isCustomPageSize: name === 'Custom' }),
  orientation: 'portrait',
  setOrientation: (o) => set({ orientation: o }),
  marginPreset: 'normal',
  setMarginPreset: (p) => set({ marginPreset: p }),

  isCustomPageSize: false,
  setCustomPageSize: (widthPx, heightPx) => set({ pageSize: { name: 'Custom', widthPx, heightPx }, isCustomPageSize: true }),

  pageBackgroundColor: '#FFFFFF',
  setPageBackgroundColor: (color) => set({ pageBackgroundColor: color }),
  pageBorderStyle: 'none',
  setPageBorderStyle: (style) => set({ pageBorderStyle: style }),
  pageBorderColor: '#000000',
  setPageBorderColor: (color) => set({ pageBorderColor: color }),
  pageBorderWidth: '1px',
  setPageBorderWidth: (width) => set({ pageBorderWidth: width }),

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

import React, { useState } from 'react';
import {
  List, Image, Table2, BookOpen, ChevronDown,
  PlusCircle, RefreshCw, Trash2, FileText, Settings2,
} from 'lucide-react';
import { RibbonGroup, useDropdown } from '../RibbonComponents';
import { useAppStore } from '../../../store/useAppStore';
import type { TocTemplate, TocConfig } from '../../../store/useAppStore';
import { useTableOfContents } from '../../../hooks/useTableOfContents';
import { AVAILABLE_FONTS } from './LayoutTab';

// ─── TOC Template Previews ─────────────────────────────────────────────────────

const TOC_TEMPLATES: { id: TocTemplate; label: string; preview: string[] }[] = [
  {
    id: 'numbered',
    label: '1.1 Numbered',
    preview: ['1  Chapter One ......... 1', '   1.1  Section ......... 2', '      1.1.1  Sub ......... 3'],
  },
  {
    id: 'classic',
    label: 'Classic',
    preview: ['Chapter One ......... 1', '   Section ......... 2', '      Subsection ......... 3'],
  },
  {
    id: 'modern',
    label: 'Modern',
    preview: ['• Chapter One', '  ◦ Section', '    ▪ Subsection'],
  },
  {
    id: 'minimal',
    label: 'Minimal',
    preview: ['Chapter One', 'Section', 'Subsection'],
  },
];

// ─── Helper: build TOC HTML from headings (exported for LeftPanel use) ────────

export interface RawHeading {
  level: number;
  text: string;
  pageIndex: number;
  id: string;
}

export function buildTocHtml(headings: RawHeading[], config: TocConfig): string {
  const counters = [0, 0, 0, 0, 0, 0];

  const lines = headings.map((h) => {
    const lvl = h.level - 1; // 0-indexed
    counters[lvl]++;
    for (let i = lvl + 1; i < 6; i++) counters[i] = 0;

    const { fontFamily, fontSize, bold, color } = config.levels[`h${h.level}` as 'h1' | 'h2' | 'h3' | 'h4'] ?? config.levels.h3;
    const indent = (h.level - 1) * 20;

    let prefix = '';
    if (config.template === 'numbered') {
      prefix = counters.slice(0, h.level).filter(Boolean).join('.') + '&nbsp;&nbsp;';
    } else if (config.template === 'modern') {
      prefix = ['•', '◦', '▪'][h.level - 1] + '&nbsp;';
    }

    const dots = config.template !== 'modern' && config.template !== 'minimal' && config.showPageNumbers
      ? `<span style="flex-grow:1; border-bottom:2px dotted #ccc; margin:0 8px; position:relative; top:-6px;"></span>`
      : `<span style="flex-grow:1;"></span>`;

    const pageSpan = config.showPageNumbers 
      ? `<span style="flex-shrink:0;">${h.pageIndex + 1}</span>` 
      : '';

    return `
      <div style="display:flex; align-items:baseline; margin-left:${indent}px; font-family:${fontFamily}; font-size:${fontSize}pt; font-weight:${bold ? 'bold' : 'normal'}; color:${color}; margin-bottom:6px;">
        <a href="#${h.id}" style="color:inherit; text-decoration:none; flex-shrink:0;">${prefix}${h.text}</a>
        ${dots}
        ${pageSpan}
      </div>`;
  });

  return `
    <div style="padding:40px 60px;font-family:Inter,sans-serif">
      <h1 style="font-size:${config.titleFontSize}pt;font-weight:bold;margin-bottom:24px;border-bottom:2px solid #C9973A;padding-bottom:8px">${config.titleText}</h1>
      ${lines.join('')}
    </div>
  `;
}

// ─── TOC Dropdown ─────────────────────────────────────────────────────────────

const TocBtn: React.FC = () => {
  const { setSidePanel, isLeftPanelCollapsed, toggleLeftPanel } = useAppStore();

  const handleContentsClick = () => {
    setSidePanel('toc');
    if (isLeftPanelCollapsed) toggleLeftPanel();
  };

  return (
    <div className="relative h-full flex items-center px-1">
      <button
        onClick={handleContentsClick}
        className="flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[60px] h-full gap-0 hover:bg-[#f3f2f1] text-[#323130]"
      >
        <List size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">Contents</span>
      </button>
    </div>
  );
};

// ─── List of Figures ─────────────────────────────────────────────────────────

const ListOfFiguresBtn: React.FC = () => {
  const { pages, setPages } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  const insertFiguresList = () => {
    const parser = new DOMParser();
    const figures: { caption: string; pageIndex: number }[] = [];

    pages.forEach((page, pageIndex) => {
      if (!page.content) return;
      const doc = parser.parseFromString(page.content, 'text/html');
      const imgs = doc.querySelectorAll('img');
      imgs.forEach((img, i) => {
        const alt = img.getAttribute('alt') || `Figure ${figures.length + 1}`;
        figures.push({ caption: alt, pageIndex });
      });
    });

    const rows = figures.length === 0
      ? '<p style="color:#aaa;font-style:italic">No figures found in document.</p>'
      : figures.map((f, i) => `
          <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dotted #ddd;font-family:Inter,sans-serif;font-size:11pt">
            <span>Figure ${i + 1} — ${f.caption}</span>
            <span>${f.pageIndex + 1}</span>
          </div>`).join('');

    const html = `<div style="padding:40px 60px">
      <h1 style="font-size:18pt;font-weight:bold;margin-bottom:20px;border-bottom:2px solid #C9973A;padding-bottom:8px;font-family:Inter,sans-serif">List of Figures</h1>
      ${rows}
    </div>`;

    const newPage = { id: `page-lof-${Date.now()}`, content: html, title: 'List of Figures' };
    setPages([...pages.filter(p => !p.id.startsWith('page-lof-')), newPage]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative h-full flex items-center px-1">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
      >
        <Image size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">Figures</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] p-3 flex flex-col gap-2" style={{ top: pos.top, left: pos.left, minWidth: 220 }}>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">List of Figures</span>
          <p className="text-[11px] text-gray-500">Scans all images in your document and creates a numbered list with page references.</p>
          <button onClick={insertFiguresList} className="flex items-center justify-center gap-2 bg-[#C9973A] hover:bg-[#B08432] text-white text-[11px] font-bold px-3 py-2 rounded-lg transition-colors">
            <PlusCircle size={13} /> Insert List of Figures
          </button>
        </div>
      )}
    </div>
  );
};

// ─── List of Tables ──────────────────────────────────────────────────────────

const ListOfTablesBtn: React.FC = () => {
  const { pages, setPages } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  const insertTablesList = () => {
    const parser = new DOMParser();
    const tables: { caption: string; pageIndex: number }[] = [];

    pages.forEach((page, pageIndex) => {
      if (!page.content) return;
      const doc = parser.parseFromString(page.content, 'text/html');
      const tbls = doc.querySelectorAll('table');
      tbls.forEach((tbl, i) => {
        const firstTh = tbl.querySelector('th');
        const caption = firstTh?.textContent?.trim() || `Table ${tables.length + 1}`;
        tables.push({ caption, pageIndex });
      });
    });

    const rows = tables.length === 0
      ? '<p style="color:#aaa;font-style:italic">No tables found in document.</p>'
      : tables.map((t, i) => `
          <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dotted #ddd;font-family:Inter,sans-serif;font-size:11pt">
            <span>Table ${i + 1} — ${t.caption}</span>
            <span>${t.pageIndex + 1}</span>
          </div>`).join('');

    const html = `<div style="padding:40px 60px">
      <h1 style="font-size:18pt;font-weight:bold;margin-bottom:20px;border-bottom:2px solid #C9973A;padding-bottom:8px;font-family:Inter,sans-serif">List of Tables</h1>
      ${rows}
    </div>`;

    const newPage = { id: `page-lot-${Date.now()}`, content: html, title: 'List of Tables' };
    setPages([...pages.filter(p => !p.id.startsWith('page-lot-')), newPage]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative h-full flex items-center px-1">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
      >
        <Table2 size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">Tables</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] p-3 flex flex-col gap-2" style={{ top: pos.top, left: pos.left, minWidth: 220 }}>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">List of Tables</span>
          <p className="text-[11px] text-gray-500">Scans all tables in your document and creates a numbered list with page references.</p>
          <button onClick={insertTablesList} className="flex items-center justify-center gap-2 bg-[#C9973A] hover:bg-[#B08432] text-white text-[11px] font-bold px-3 py-2 rounded-lg transition-colors">
            <PlusCircle size={13} /> Insert List of Tables
          </button>
        </div>
      )}
    </div>
  );
};

// ─── References ──────────────────────────────────────────────────────────────

const ReferencesBtn: React.FC = () => {
  const { references, pages, setPages } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();
  const [style, setStyle] = useState<'ieee' | 'apa' | 'mla'>('ieee');

  const insertReferencesPage = () => {
    const rows = references.length === 0
      ? '<p style="color:#aaa;font-style:italic">No references added yet. Use the References tab to add them.</p>'
      : references.map((r, i) => {
          const label = style === 'ieee' ? `[${i + 1}]` : style === 'apa' ? `(${i + 1})` : `${i + 1}.`;
          return `<div style="padding:4px 0;font-family:Inter,sans-serif;font-size:11pt;display:flex;gap:8px">
            <span style="min-width:28px;font-weight:bold;color:#C9973A">${label}</span>
            <span>${r.text}</span>
          </div>`;
        }).join('');

    const html = `<div style="padding:40px 60px">
      <h1 style="font-size:18pt;font-weight:bold;margin-bottom:20px;border-bottom:2px solid #C9973A;padding-bottom:8px;font-family:Inter,sans-serif">References</h1>
      ${rows}
    </div>`;

    const newPage = { id: `page-ref-${Date.now()}`, content: html, title: 'References' };
    setPages([...pages.filter(p => !p.id.startsWith('page-ref-')), newPage]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative h-full flex items-center px-1">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
      >
        <BookOpen size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">References</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] p-3 flex flex-col gap-2" style={{ top: pos.top, left: pos.left, minWidth: 240 }}>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">References / Bibliography</span>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-600 font-medium">Citation Style</label>
            <div className="flex gap-1">
              {(['ieee', 'apa', 'mla'] as const).map(s => (
                <button key={s} onClick={() => setStyle(s)}
                  className={`flex-1 py-1 rounded text-[11px] font-bold uppercase border transition-colors ${style === s ? 'bg-[#C9973A] text-white border-[#C9973A]' : 'bg-white border-gray-300 text-gray-600 hover:border-[#C9973A]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-400">{references.length} reference(s) from the References tab.</p>
          <button onClick={insertReferencesPage} className="flex items-center justify-center gap-2 bg-[#C9973A] hover:bg-[#B08432] text-white text-[11px] font-bold px-3 py-2 rounded-lg transition-colors">
            <PlusCircle size={13} /> Insert References Page
          </button>
        </div>
      )}
    </div>
  );
};

// ─── PagesTab ─────────────────────────────────────────────────────────────────

const PagesTab: React.FC = () => {
  return (
    <div className="flex h-full items-center">
      <RibbonGroup label="Table of Contents">
        <TocBtn />
      </RibbonGroup>

      <RibbonGroup label="List of Figures">
        <ListOfFiguresBtn />
      </RibbonGroup>

      <RibbonGroup label="List of Tables">
        <ListOfTablesBtn />
      </RibbonGroup>

      <RibbonGroup label="Bibliography">
        <ReferencesBtn />
      </RibbonGroup>
    </div>
  );
};

export default PagesTab;

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
  const { setSidePanel, isLeftPanelCollapsed, toggleLeftPanel } = useAppStore();

  const handleClick = () => {
    setSidePanel('figures');
    if (isLeftPanelCollapsed) toggleLeftPanel();
  };

  return (
    <div className="relative h-full flex items-center px-1">
      <button
        onClick={handleClick}
        className="flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 hover:bg-[#f3f2f1] text-[#323130]"
      >
        <Image size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">Figures</span>
      </button>
    </div>
  );
};

// ─── List of Tables ──────────────────────────────────────────────────────────

const ListOfTablesBtn: React.FC = () => {
  const { setSidePanel, isLeftPanelCollapsed, toggleLeftPanel } = useAppStore();

  const handleClick = () => {
    setSidePanel('tables');
    if (isLeftPanelCollapsed) toggleLeftPanel();
  };

  return (
    <div className="relative h-full flex items-center px-1">
      <button
        onClick={handleClick}
        className="flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 hover:bg-[#f3f2f1] text-[#323130]"
      >
        <Table2 size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">Tables</span>
      </button>
    </div>
  );
};

// ─── References ──────────────────────────────────────────────────────────────

const ReferencesBtn: React.FC = () => {
  const { setSidePanel, isLeftPanelCollapsed, toggleLeftPanel } = useAppStore();

  const handleClick = () => {
    setSidePanel('references');
    if (isLeftPanelCollapsed) toggleLeftPanel();
  };

  return (
    <div className="relative h-full flex items-center px-1">
      <button
        onClick={handleClick}
        className="flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 hover:bg-[#f3f2f1] text-[#323130]"
      >
        <BookOpen size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">References</span>
      </button>
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

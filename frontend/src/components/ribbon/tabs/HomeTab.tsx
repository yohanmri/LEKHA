import React, { useState } from 'react';
import {
  Clipboard, Copy, Scissors, Paintbrush,
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  Highlighter, Baseline, Eraser, CaseSensitive,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, IndentDecrease, IndentIncrease,
  SortAsc, Pilcrow, ChevronDown,
  Search, Replace, MousePointer2, Keyboard,
  LineChart, BetweenHorizonalEnd, BetweenVerticalEnd,
  Languages, Type
} from 'lucide-react';
import {
  RibbonGroup, LargeBtn, SmallBtn, SplitLargeBtn, DropBtn,
  RibbonDivider, useDropdown, COLORS, ColorRow
} from '../RibbonComponents';
import { useAppStore } from '../../../store/useAppStore';

const SINHALA_FONTS = ['Noto Sans Sinhala', 'Abhaya Libre', 'Yaldevi', 'Iskoola Pota', 'DL-KMNN'];
const LATIN_FONTS = ['Arial', 'Times New Roman', 'Calibri', 'Georgia', 'Verdana', 'Courier New', 'Helvetica'];
const SIZES = ['8','9','10','11','12','14','16','18','20','22','24','28','32','36','48','72'];

const ColorPickerBtn: React.FC<{ icon: React.ElementType; label: string; title: string }> = ({ icon: Icon, label, title }) => {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        title={title}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-0.5 rounded px-1 hover:bg-[#f3f2f1] h-6 text-[#323130] transition-colors"
      >
        <Icon size={14} strokeWidth={2} />
        <ChevronDown size={8} className="text-gray-400" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-xl z-[9999] p-1">
          <div className="text-[10px] text-gray-400 px-1 mb-1 font-medium">{title}</div>
          <ColorRow colors={COLORS} onPick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

const HomeTab: React.FC = () => {
  const { isKeyboardOpen, toggleKeyboard } = useAppStore();
  const [fontSize, setFontSize] = useState('11');
  const [fontFamily, setFontFamily] = useState('Noto Sans Sinhala');
  const [fontLang, setFontLang] = useState<'sinhala' | 'latin'>('sinhala');

  const currentFonts = fontLang === 'sinhala' ? SINHALA_FONTS : LATIN_FONTS;

  return (
    <div className="flex h-full items-center">

      {/* Clipboard */}
      <RibbonGroup label="Clipboard">
        <SplitLargeBtn
          icon={Clipboard}
          label="Paste"
          items={[
            { label: 'Paste (Ctrl+V)' },
            { label: 'Keep Source Formatting' },
            { label: 'Merge Formatting' },
            { label: 'Text Only' },
          ]}
        />
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={Scissors} label="Cut" title="Cut (Ctrl+X)" />
          <SmallBtn icon={Copy} label="Copy" title="Copy (Ctrl+C)" />
          <SmallBtn icon={Paintbrush} label="Painter" title="Format Painter" />
        </div>
      </RibbonGroup>

      {/* Font */}
      <RibbonGroup label="Font">
        <div className="flex flex-col gap-1 pr-1 border-r border-gray-100 mr-1 justify-center">
          <button 
            title="Sinhala Fonts"
            onClick={() => { setFontLang('sinhala'); setFontFamily(SINHALA_FONTS[0]); }}
            className={`flex items-center justify-center w-8 h-7 rounded transition-all text-[11px] font-bold ${fontLang === 'sinhala' ? 'bg-[#1A7A6E] text-white shadow-sm' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            සිං
          </button>
          <button 
            title="Latin/English Fonts"
            onClick={() => { setFontLang('latin'); setFontFamily(LATIN_FONTS[0]); }}
            className={`flex items-center justify-center w-8 h-7 rounded transition-all text-[11px] font-bold ${fontLang === 'latin' ? 'bg-[#C9973A] text-white shadow-sm' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            En
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-0.5">
            <select
              value={fontFamily}
              onChange={e => setFontFamily(e.target.value)}
              className="text-[11px] border border-transparent hover:border-gray-300 hover:bg-[#f3f2f1] rounded px-1.5 h-7 w-36 outline-none bg-white transition-colors font-medium text-[#323130]"
            >
              {currentFonts.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select
              value={fontSize}
              onChange={e => setFontSize(e.target.value)}
              className="text-[11px] border border-transparent hover:border-gray-300 hover:bg-[#f3f2f1] rounded px-1 h-7 w-11 outline-none bg-white transition-colors text-center text-[#323130]"
            >
              {SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
            <RibbonDivider />
            <SmallBtn icon={CaseSensitive} title="Grow Font" />
            <SmallBtn icon={CaseSensitive} title="Shrink Font" />
            <SmallBtn icon={Eraser} title="Clear Formatting" />
          </div>
          <div className="flex items-center gap-0">
            <SmallBtn icon={Bold} title="Bold" />
            <SmallBtn icon={Italic} title="Italic" />
            <SmallBtn icon={Underline} title="Underline" />
            <SmallBtn icon={Strikethrough} title="Strikethrough" />
            <SmallBtn icon={Subscript} title="Subscript" />
            <SmallBtn icon={Superscript} title="Superscript" />
            <RibbonDivider />
            <ColorPickerBtn icon={Highlighter} label="H" title="Highlight" />
            <ColorPickerBtn icon={Baseline} label="A" title="Font Color" />
          </div>
        </div>
      </RibbonGroup>

      {/* Paragraph */}
      <RibbonGroup label="Paragraph">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-0">
            <SmallBtn icon={List} title="Bullets" />
            <SmallBtn icon={ListOrdered} title="Numbering" />
            <SmallBtn icon={IndentDecrease} title="Decrease Indent" />
            <SmallBtn icon={IndentIncrease} title="Increase Indent" />
            <RibbonDivider />
            <SmallBtn icon={SortAsc} title="Sort" />
            <SmallBtn icon={Pilcrow} title="Show/Hide" />
          </div>
          <div className="flex items-center gap-0">
            <SmallBtn icon={AlignLeft} title="Align Left" />
            <SmallBtn icon={AlignCenter} title="Center" />
            <SmallBtn icon={AlignRight} title="Align Right" />
            <SmallBtn icon={AlignJustify} title="Justify" />
            <RibbonDivider />
            <SmallBtn icon={BetweenHorizonalEnd} title="Line Spacing" />
            <ColorPickerBtn icon={BetweenVerticalEnd} label="" title="Shading" />
          </div>
        </div>
      </RibbonGroup>

      {/* Styles */}
      <RibbonGroup label="Styles">
        <div className="flex items-center gap-1 overflow-hidden">
          {[
            { name: 'Normal', preview: 'AaBbCc', style: '' },
            { name: 'Heading 1', preview: 'AaBbCc', style: 'font-bold text-blue-700' },
            { name: 'Heading 2', preview: 'AaBbCc', style: 'font-bold text-blue-500' },
            { name: 'Title', preview: 'AaBbCc', style: 'font-bold' },
          ].map(s => (
            <div key={s.name} className="border border-gray-200 rounded p-1.5 h-16 w-20 flex flex-col justify-between hover:bg-[#f3f2f1] hover:border-gray-300 cursor-pointer transition-colors flex-shrink-0 bg-white">
              <span className={`text-[11px] ${s.style} leading-tight truncate`}>{s.preview}</span>
              <span className="text-[9px] text-gray-500 leading-none truncate font-medium">{s.name}</span>
            </div>
          ))}
          <button className="flex items-center justify-center hover:bg-[#f3f2f1] rounded h-16 w-6 text-gray-400 border-l border-gray-100 ml-1">
            <ChevronDown size={12} />
          </button>
        </div>
      </RibbonGroup>

      {/* Editing */}
      <RibbonGroup label="Editing">
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={Search} label="Find" />
          <SmallBtn icon={Replace} label="Replace" />
          <SmallBtn icon={MousePointer2} label="Select" />
        </div>
        <LargeBtn icon={Keyboard} label="Keyboard" onClick={toggleKeyboard} active={isKeyboardOpen} />
      </RibbonGroup>

    </div>
  );
};

export default HomeTab;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Clipboard, Copy, Scissors, Paintbrush,
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  Highlighter, Baseline, Eraser, CaseSensitive,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, IndentDecrease, IndentIncrease,
  SortAsc, Pilcrow, ChevronDown,
  Search, Replace, MousePointer2, Keyboard,
  BetweenHorizonalEnd, BetweenVerticalEnd,
} from 'lucide-react';
import {
  RibbonGroup, LargeBtn, SmallBtn, SplitLargeBtn,
  RibbonDivider, useDropdown, COLORS, ColorRow
} from '../RibbonComponents';
import { useAppStore } from '../../../store/useAppStore';
import { useEditorContext } from '../../../hooks/useEditorContext';

const SINHALA_FONTS = ['Noto Sans Sinhala', 'Noto Serif Sinhala', 'Abhaya Libre', 'Yaldevi', 'Gemunu Libre'];
const LATIN_FONTS = ['Inter', 'Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New', 'Helvetica'];
const SIZES = ['8','9','10','11','12','14','16','18','20','22','24','28','32','36','48','72'];

// ─── Color Picker Button with fixed-position dropdown ────────────────────────
const ColorPickerBtn: React.FC<{
  icon: React.ElementType;
  title: string;
  onPick?: (color: string) => void;
}> = ({ icon: Icon, title, onPick }) => {
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();
  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        title={title}
        onClick={() => open ? setOpen(false) : openDropdown()}
        className="flex items-center gap-0.5 rounded px-1.5 hover:bg-[#f3f2f1] h-[22px] text-[#323130] transition-colors"
      >
        <Icon size={14} strokeWidth={2} />
        <ChevronDown size={8} className="text-gray-400" />
      </button>
      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded shadow-xl z-[9999] p-1"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="text-[10px] text-gray-400 px-1 mb-1 font-medium">{title}</div>
          <ColorRow colors={COLORS} onPick={(c) => { onPick?.(c); setOpen(false); }} />
        </div>
      )}
    </div>
  );
};

// ─── HomeTab ─────────────────────────────────────────────────────────────────
const HomeTab: React.FC = () => {
  const { isKeyboardOpen, toggleKeyboard, fontLang, setFontLang, fontFamily, setFontFamily, fontSize, setFontSize } = useAppStore();
  const { getEditor } = useEditorContext();

  const currentFonts = fontLang === 'sinhala' ? SINHALA_FONTS : LATIN_FONTS;

  // Editor command shortcuts
  const cmd = useCallback(() => getEditor()?.chain().focus(), [getEditor]);

  const handleFontFamily = (f: string) => {
    setFontFamily(f);
    cmd()?.setFontFamily(f).run();
  };

  const handleFontSize = (s: string) => {
    setFontSize(s);
    // TipTap doesn't have a built-in setFontSize, we use TextStyle + CSS
    const editor = getEditor();
    if (editor) {
      editor.chain().focus().setMark('textStyle', { fontSize: `${s}pt` }).run();
    }
  };

  return (
    <div className="flex h-full items-center">

      {/* ── Clipboard ── */}
      <RibbonGroup label="Clipboard">
        <SplitLargeBtn
          icon={Clipboard}
          label="Paste"
          onMain={() => cmd()?.run()}
          items={[
            { label: 'Paste (Ctrl+V)' },
            { label: 'Keep Source Formatting' },
            { label: 'Merge Formatting' },
            { label: 'Text Only' },
          ]}
        />
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={Scissors} label="Cut" title="Cut (Ctrl+X)" onClick={() => document.execCommand('cut')} />
          <SmallBtn icon={Copy} label="Copy" title="Copy (Ctrl+C)" onClick={() => document.execCommand('copy')} />
          <SmallBtn icon={Paintbrush} label="Painter" title="Format Painter" />
        </div>
      </RibbonGroup>

      {/* ── Font ── */}
      <RibbonGroup label="Font">
        {/* Language toggle */}
        <div className="flex flex-col gap-1 pr-1.5 border-r border-gray-200 mr-1.5 justify-center">
          <button
            title="Switch to Sinhala fonts (Singlish input enabled)"
            onClick={() => { setFontLang('sinhala'); handleFontFamily(SINHALA_FONTS[0]!); }}
            className={`flex items-center justify-center w-9 h-7 rounded-md transition-all text-[12px] font-bold border
              ${fontLang === 'sinhala' ? 'bg-[#1A7A6E] text-white border-[#1A7A6E] shadow-sm' : 'hover:bg-gray-100 text-gray-500 border-gray-200'}`}
          >
            සිං
          </button>
          <button
            title="Switch to Latin/English fonts"
            onClick={() => { setFontLang('latin'); handleFontFamily(LATIN_FONTS[0]!); }}
            className={`flex items-center justify-center w-9 h-7 rounded-md transition-all text-[12px] font-bold border
              ${fontLang === 'latin' ? 'bg-[#C9973A] text-white border-[#C9973A] shadow-sm' : 'hover:bg-gray-100 text-gray-500 border-gray-200'}`}
          >
            En
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {/* Row 1: Font family + size + grow/shrink/clear */}
          <div className="flex items-center gap-1">
            <select
              value={fontFamily}
              onChange={e => handleFontFamily(e.target.value)}
              className="text-[11px] border border-gray-200 hover:border-gray-400 rounded px-1.5 h-7 w-36 outline-none bg-white transition-colors font-medium text-[#323130] cursor-pointer"
            >
              {currentFonts.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
            </select>
            <select
              value={fontSize}
              onChange={e => handleFontSize(e.target.value)}
              className="text-[11px] border border-gray-200 hover:border-gray-400 rounded px-1 h-7 w-12 outline-none bg-white transition-colors text-center text-[#323130] cursor-pointer"
            >
              {SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
            <RibbonDivider />
            <SmallBtn icon={CaseSensitive} title="Grow Font" onClick={() => { const s = parseInt(fontSize); handleFontSize(String(Math.min(s + 2, 72))); }} />
            <SmallBtn icon={Eraser} title="Clear Formatting" onClick={() => cmd()?.unsetAllMarks().run()} />
          </div>
          {/* Row 2: Bold/Italic/Underline/etc + colors */}
          <div className="flex items-center gap-0">
            <SmallBtn icon={Bold} title="Bold (Ctrl+B)" active={getEditor()?.isActive('bold')} onClick={() => cmd()?.toggleBold().run()} />
            <SmallBtn icon={Italic} title="Italic (Ctrl+I)" active={getEditor()?.isActive('italic')} onClick={() => cmd()?.toggleItalic().run()} />
            <SmallBtn icon={Underline} title="Underline (Ctrl+U)" active={getEditor()?.isActive('underline')} onClick={() => cmd()?.toggleUnderline().run()} />
            <SmallBtn icon={Strikethrough} title="Strikethrough" active={getEditor()?.isActive('strike')} onClick={() => cmd()?.toggleStrike().run()} />
            <SmallBtn icon={Subscript} title="Subscript" active={getEditor()?.isActive('subscript')} onClick={() => cmd()?.toggleSubscript().run()} />
            <SmallBtn icon={Superscript} title="Superscript" active={getEditor()?.isActive('superscript')} onClick={() => cmd()?.toggleSuperscript().run()} />
            <RibbonDivider />
            <ColorPickerBtn icon={Highlighter} title="Highlight Color" onPick={(c) => cmd()?.setHighlight({ color: c }).run()} />
            <ColorPickerBtn icon={Baseline} title="Font Color" onPick={(c) => cmd()?.setColor(c).run()} />
          </div>
        </div>
      </RibbonGroup>

      {/* ── Paragraph ── */}
      <RibbonGroup label="Paragraph">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-0">
            <SmallBtn icon={List} title="Bullets" active={getEditor()?.isActive('bulletList')} onClick={() => cmd()?.toggleBulletList().run()} />
            <SmallBtn icon={ListOrdered} title="Numbering" active={getEditor()?.isActive('orderedList')} onClick={() => cmd()?.toggleOrderedList().run()} />
            <SmallBtn icon={IndentDecrease} title="Decrease Indent" onClick={() => cmd()?.liftListItem('listItem').run()} />
            <SmallBtn icon={IndentIncrease} title="Increase Indent" onClick={() => cmd()?.sinkListItem('listItem').run()} />
            <RibbonDivider />
            <SmallBtn icon={Pilcrow} title="Show/Hide marks" />
          </div>
          <div className="flex items-center gap-0">
            <SmallBtn icon={AlignLeft} title="Align Left" active={getEditor()?.isActive({ textAlign: 'left' })} onClick={() => cmd()?.setTextAlign('left').run()} />
            <SmallBtn icon={AlignCenter} title="Center" active={getEditor()?.isActive({ textAlign: 'center' })} onClick={() => cmd()?.setTextAlign('center').run()} />
            <SmallBtn icon={AlignRight} title="Align Right" active={getEditor()?.isActive({ textAlign: 'right' })} onClick={() => cmd()?.setTextAlign('right').run()} />
            <SmallBtn icon={AlignJustify} title="Justify" active={getEditor()?.isActive({ textAlign: 'justify' })} onClick={() => cmd()?.setTextAlign('justify').run()} />
            <RibbonDivider />
            <SmallBtn icon={BetweenHorizonalEnd} title="Line Spacing" />
            <ColorPickerBtn icon={BetweenVerticalEnd} title="Shading" onPick={(c) => cmd()?.setHighlight({ color: c }).run()} />
          </div>
        </div>
      </RibbonGroup>

      {/* ── Styles ── */}
      <RibbonGroup label="Styles">
        <div className="flex items-center gap-1">
          {[
            { name: 'Normal', label: 'AaBb', action: () => cmd()?.setParagraph().run(), style: 'text-[#323130]' },
            { name: 'Heading 1', label: 'AaBb', action: () => cmd()?.toggleHeading({ level: 1 }).run(), style: 'font-bold text-blue-700 text-[13px]' },
            { name: 'Heading 2', label: 'AaBb', action: () => cmd()?.toggleHeading({ level: 2 }).run(), style: 'font-semibold text-blue-500' },
            { name: 'Title', label: 'AaBb', action: () => cmd()?.toggleHeading({ level: 1 }).run(), style: 'font-bold text-[14px]' },
          ].map(s => (
            <div
              key={s.name}
              onClick={s.action}
              className="border border-gray-200 rounded p-1.5 h-16 w-[72px] flex flex-col justify-between hover:bg-[#f3f2f1] hover:border-[#C9973A] cursor-pointer transition-all flex-shrink-0 bg-white"
            >
              <span className={`text-[11px] ${s.style} leading-tight`}>{s.label}</span>
              <span className="text-[9px] text-gray-500 leading-none font-medium truncate">{s.name}</span>
            </div>
          ))}
          <button className="flex items-center justify-center hover:bg-[#f3f2f1] rounded h-16 w-5 text-gray-400 border-l border-gray-100 ml-0.5">
            <ChevronDown size={12} />
          </button>
        </div>
      </RibbonGroup>

      {/* ── Editing ── */}
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

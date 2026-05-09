import React from 'react';
import {
  Palette, Square, PaintBucket, Brush,
  Minus, GripHorizontal, ChevronDown, CheckCircle2
} from 'lucide-react';
import { RibbonGroup, DropBtn, useDropdown, COLORS, ColorRow, LargeBtn } from '../RibbonComponents';
import { useAppStore } from '../../../store/useAppStore';

// ─── Page Color Picker ────────────────────────────────────────────────────────
const PageColorBtn: React.FC = () => {
  const { pageBackgroundColor, setPageBackgroundColor } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div ref={ref} className="relative flex-shrink-0 h-full">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
        title="Page Color"
      >
        <PaintBucket size={20} strokeWidth={1.5} style={{ color: pageBackgroundColor !== '#FFFFFF' ? pageBackgroundColor : '#323130' }} />
        <span className="text-[10px] mt-0.5 font-medium">Page Color</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded shadow-xl z-[9999] p-2"
          style={{ top: pos.top, left: pos.left, minWidth: 150 }}
        >
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Background Color</div>
          <ColorRow colors={COLORS} onPick={(c) => { setPageBackgroundColor(c); setOpen(false); }} />
          <div className="border-t border-gray-100 mt-2 pt-1" />
          <button 
            onClick={() => { setPageBackgroundColor('#FFFFFF'); setOpen(false); }}
            className="w-full text-left text-[11px] px-1.5 py-1.5 hover:bg-[#f3f2f1] rounded text-[#323130]"
          >
            No Color (White)
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Page Border Controls ──────────────────────────────────────────────────────
const BorderStyleBtn: React.FC = () => {
  const { pageBorderStyle, setPageBorderStyle } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  const STYLES = [
    { value: 'none', label: 'None', icon: <Square size={14} className="text-gray-300" /> },
    { value: 'solid', label: 'Solid', icon: <Square size={14} /> },
    { value: 'dashed', label: 'Dashed', icon: <Square size={14} strokeDasharray="3 3" /> },
    { value: 'dotted', label: 'Dotted', icon: <Square size={14} strokeDasharray="1 3" /> },
    { value: 'double', label: 'Double', icon: <Square size={14} strokeWidth={3} /> },
  ];

  return (
    <div ref={ref} className="relative flex-shrink-0 h-full">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
        title="Page Borders"
      >
        <Square size={20} strokeWidth={1.5} className={pageBorderStyle === 'none' ? 'text-gray-400' : 'text-[#323130]'} />
        <span className="text-[10px] mt-0.5 font-medium">Borders</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded shadow-xl z-[9999] py-1"
          style={{ top: pos.top, left: pos.left, minWidth: 160 }}
        >
          <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Border Style
          </div>
          {STYLES.map(s => (
            <button
              key={s.value}
              onClick={() => { setPageBorderStyle(s.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#f3f2f1] transition-colors
                ${pageBorderStyle === s.value ? 'bg-amber-50 text-amber-700' : 'text-[#323130]'}`}
            >
              <div className="flex items-center gap-2">
                {s.icon}
                <span className="text-[12px]">{s.label}</span>
              </div>
              {pageBorderStyle === s.value && <CheckCircle2 size={12} className="text-amber-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const BorderColorBtn: React.FC = () => {
  const { pageBorderColor, setPageBorderColor, pageBorderStyle } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  const disabled = pageBorderStyle === 'none';

  return (
    <div ref={ref} className="relative flex-shrink-0 h-full">
      <button
        onClick={() => { if(!disabled) open ? setOpen(false) : openDropdown() }}
        disabled={disabled}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 
          ${disabled ? 'opacity-50 cursor-not-allowed' : (open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]')} text-[#323130]`}
        title="Border Color"
      >
        <Palette size={20} strokeWidth={1.5} style={{ color: pageBorderColor }} />
        <span className="text-[10px] mt-0.5 font-medium">Color</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded shadow-xl z-[9999] p-2"
          style={{ top: pos.top, left: pos.left, minWidth: 150 }}
        >
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Border Color</div>
          <ColorRow colors={COLORS} onPick={(c) => { setPageBorderColor(c); setOpen(false); }} />
        </div>
      )}
    </div>
  );
};

const BorderWidthBtn: React.FC = () => {
  const { pageBorderWidth, setPageBorderWidth, pageBorderStyle } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  const disabled = pageBorderStyle === 'none';
  const WIDTHS = ['1px', '2px', '4px', '8px'];

  return (
    <div ref={ref} className="relative flex-shrink-0 h-full">
      <button
        onClick={() => { if(!disabled) open ? setOpen(false) : openDropdown() }}
        disabled={disabled}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 
          ${disabled ? 'opacity-50 cursor-not-allowed' : (open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]')} text-[#323130]`}
        title="Border Width"
      >
        <Minus size={20} strokeWidth={parseInt(pageBorderWidth) || 1.5} />
        <span className="text-[10px] mt-0.5 font-medium">{pageBorderWidth}</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded shadow-xl z-[9999] py-1"
          style={{ top: pos.top, left: pos.left, minWidth: 100 }}
        >
          <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Width
          </div>
          {WIDTHS.map(w => (
            <button
              key={w}
              onClick={() => { setPageBorderWidth(w); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#f3f2f1] transition-colors text-[12px]
                ${pageBorderWidth === w ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-[#323130]'}`}
            >
              {w}
              {pageBorderWidth === w && <CheckCircle2 size={12} className="text-amber-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── DesignTab ─────────────────────────────────────────────────────────────────
const DesignTab: React.FC = () => {
  return (
    <div className="flex h-full items-center">
      <RibbonGroup label="Page Background">
        <PageColorBtn />
      </RibbonGroup>

      <RibbonGroup label="Page Borders">
        <BorderStyleBtn />
        <BorderWidthBtn />
        <BorderColorBtn />
      </RibbonGroup>

      <RibbonGroup label="Themes">
        <LargeBtn icon={Brush} label="Themes" />
      </RibbonGroup>
    </div>
  );
};

export default DesignTab;

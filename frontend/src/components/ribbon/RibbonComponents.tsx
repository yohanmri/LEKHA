import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

// ─── Shared Ribbon Primitives ──────────────────────────────────────────────────

export const RibbonGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col h-[92px] border-r border-gray-200 px-2 py-1 flex-shrink-0 bg-white">
    <div className="flex-1 flex items-center justify-center gap-1.5 flex-nowrap min-h-0">
      {children}
    </div>
    <div className="text-[10px] text-gray-500 text-center mt-auto mb-1 select-none pointer-events-none tracking-tight">
      {label}
    </div>
  </div>
);

// Large vertical button (icon + label, full height)
export const LargeBtn: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  active?: boolean;
  color?: string;
  hasArrow?: boolean;
}> = ({ icon: Icon, label, onClick, active, color, hasArrow }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center rounded px-2 py-1 transition-colors min-w-[52px] h-full gap-0.5
      ${active ? 'bg-[#edebe9] text-[#2b2b2b] shadow-inner' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
  >
    <Icon size={22} strokeWidth={1.5} style={color ? { color } : {}} />
    <span className="text-[11px] whitespace-nowrap text-center leading-tight">{label}</span>
    {hasArrow && <ChevronDown size={8} className="text-gray-400 mt-0.5" />}
  </button>
);

// Small horizontal button
export const SmallBtn: React.FC<{
  icon: React.ElementType;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  title?: string;
}> = ({ icon: Icon, label, onClick, active, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`flex items-center gap-1.5 rounded px-2 py-0.5 transition-colors h-[22px] flex-shrink-0
      ${active ? 'bg-[#edebe9] text-[#2b2b2b]' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
  >
    <Icon size={14} strokeWidth={2} />
    {label && <span className="text-[11px] font-normal">{label}</span>}
  </button>
);

// Sinhala-accent large button
export const SinhalaBtn: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  active?: boolean;
}> = ({ icon: Icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center rounded px-2 py-1 transition-colors min-w-[56px] h-full gap-0.5
      ${active ? 'bg-green-50 text-[#1A7A6E] shadow-sm' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
  >
    <Icon size={22} strokeWidth={1.5} className={active ? 'text-[#1A7A6E]' : ''} />
    <span className="text-[11px] whitespace-nowrap text-center leading-tight">{label}</span>
  </button>
);

// ─── Dropdown hook using fixed positioning ────────────────────────────────────

export function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const openDropdown = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return { open, setOpen, openDropdown, ref, pos };
}

// ─── Split-button with fixed dropdown ────────────────────────────────────────

export const SplitLargeBtn: React.FC<{
  icon: React.ElementType;
  label: string;
  items: { label: string; sub?: string; divider?: boolean }[];
  onMain?: () => void;
  color?: string;
}> = ({ icon: Icon, label, items, onMain, color }) => {
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div ref={ref} className="relative flex h-full flex-shrink-0">
      <button
        onClick={onMain}
        className="flex flex-col items-center justify-center rounded-l px-2 py-1 transition-colors min-w-[44px] h-full gap-0.5 hover:bg-[#f3f2f1] text-[#323130]"
      >
        <Icon size={22} strokeWidth={1.5} style={color ? { color } : {}} />
        <span className="text-[11px] whitespace-nowrap text-center leading-tight">{label}</span>
      </button>
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className="flex items-center justify-center px-1 hover:bg-[#edebe9] rounded-r text-gray-400 transition-colors h-full border-l border-gray-100"
      >
        <ChevronDown size={8} />
      </button>
      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded shadow-xl z-[9999] min-w-[160px] py-1"
          style={{ top: pos.top, left: pos.left }}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="border-t border-gray-100 my-1" />
            ) : (
              <button
                key={i}
                onClick={() => setOpen(false)}
                className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#f3f2f1] flex flex-col transition-colors"
              >
                <span className="text-[#323130]">{item.label}</span>
                {item.sub && <span className="text-[10px] text-gray-400">{item.sub}</span>}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

// ─── Small dropdown button (fixed position) ───────────────────────────────────

export const DropBtn: React.FC<{
  label: string;
  items: { label: string; divider?: boolean }[];
  className?: string;
}> = ({ label, items, className = '' }) => {
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div ref={ref} className={`relative flex-shrink-0 ${className}`}>
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className="flex items-center gap-1 border border-transparent hover:border-gray-300 hover:bg-[#f3f2f1] rounded px-1.5 h-6 text-[10.5px] transition-colors text-[#323130]"
      >
        <span className="truncate max-w-[100px]">{label}</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>
      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded shadow-xl z-[9999] min-w-[140px] py-1"
          style={{ top: pos.top, left: pos.left }}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="border-t border-gray-100 my-1" />
            ) : (
              <button
                key={i}
                onClick={() => setOpen(false)}
                className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#f3f2f1] text-[#323130] transition-colors"
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

// ─── Divider ─────────────────────────────────────────────────────────────────

export const RibbonDivider = () => <div className="w-px h-10 bg-gray-200 mx-1.5 self-center flex-shrink-0" />;

// ─── Color swatch row ─────────────────────────────────────────────────────────

export const ColorRow: React.FC<{ colors: string[]; onPick?: (c: string) => void }> = ({ colors, onPick }) => (
  <div className="flex gap-0.5 p-1 flex-wrap max-w-[112px]">
    {colors.map((c) => (
      <button
        key={c}
        onClick={() => onPick?.(c)}
        className="w-4 h-4 rounded-sm border border-gray-300 hover:scale-110 transition-transform"
        style={{ backgroundColor: c }}
        title={c}
      />
    ))}
  </div>
);

export const COLORS = [
  '#000000','#434343','#666666','#999999','#b7b7b7','#cccccc','#d9d9d9','#ffffff',
  '#ff0000','#ff9900','#ffff00','#00ff00','#00ffff','#4a86e8','#0000ff','#9900ff',
  '#ff00ff','#e06666','#f6b26b','#ffd966','#93c47d','#76a5af','#6fa8dc','#8e7cc3',
];

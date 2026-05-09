import React, { useRef, useState } from 'react';
import {
  FileText, FileX, Scissors,
  Table, Image,
  Square, Shapes, Star,
  Link, Bookmark, Navigation,
  PanelTop, PanelBottom, Hash,
  TextCursorInput, FileSignature, Type,
  Sigma, AtSign, ChevronDown, Monitor, FolderOpen, Globe2,
} from 'lucide-react';
import {
  RibbonGroup, LargeBtn, SmallBtn, SplitLargeBtn, useDropdown, RibbonDivider,
} from '../RibbonComponents';
import { useEditorContext } from '../../../hooks/useEditorContext';

// ─── Table Picker ─────────────────────────────────────────────────────────────

const TablePicker: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [hover, setHover] = useState<[number, number]>([0, 0]);
  const ROWS = 8, COLS = 10;
  const { editorRef } = useEditorContext();

  const insertTable = (rows: number, cols: number) => {
    editorRef.current?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    onClose();
  };

  return (
    <div className="p-2 w-[220px]">
      <div className="text-[10px] text-gray-500 mb-1.5 font-medium px-0.5">
        {hover[0] > 0 ? `${hover[1]} × ${hover[0]} Table` : 'Insert Table'}
      </div>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {Array.from({ length: ROWS * COLS }).map((_, idx) => {
          const row = Math.floor(idx / COLS) + 1;
          const col = (idx % COLS) + 1;
          const isActive = row <= hover[0] && col <= hover[1];
          return (
            <div
              key={idx}
              className={`w-4 h-4 border rounded-sm cursor-pointer transition-colors ${
                isActive ? 'bg-[#C9973A] border-[#C9973A]' : 'border-gray-200 hover:border-gray-400'
              }`}
              onMouseEnter={() => setHover([row, col])}
              onClick={() => insertTable(hover[0], hover[1])}
            />
          );
        })}
      </div>
      <div className="border-t border-gray-100 mt-2 pt-1 space-y-0">
        <button className="w-full text-left text-[11px] px-1.5 py-1 hover:bg-[#f3f2f1] rounded text-[#323130]">Insert Table...</button>
        <button className="w-full text-left text-[11px] px-1.5 py-1 hover:bg-[#f3f2f1] rounded text-[#323130]">Draw Table</button>
      </div>
    </div>
  );
};

// ─── Table Button (fixed-position dropdown) ───────────────────────────────────

const TableDropBtn: React.FC = () => {
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div ref={ref} className="relative h-full flex-shrink-0">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-1.5 py-0.5 transition-colors min-w-[40px] h-full gap-0
          ${open ? 'bg-[#edebe9] text-[#2b2b2b]' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
      >
        <Table size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5">Table</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>
      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded shadow-xl z-[9999]"
          style={{ top: pos.top, left: pos.left }}
        >
          <TablePicker onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

// ─── Shapes Button ─────────────────────────────────────────────────────────────

const ShapesDropBtn: React.FC = () => {
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();
  const shapes = ['□', '◯', '△', '⬡', '→', '☆', '◇', '⬟'];

  return (
    <div ref={ref} className="relative h-full flex-shrink-0">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-1.5 py-0.5 transition-colors min-w-[40px] h-full gap-0
          ${open ? 'bg-[#edebe9] text-[#2b2b2b]' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
      >
        <Shapes size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5">Shapes</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>
      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded shadow-xl z-[9999] p-1.5 w-40"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="text-[9px] text-gray-400 mb-1 px-0.5 uppercase font-bold">Recently Used</div>
          <div className="flex gap-1 flex-wrap">
            {shapes.map((s, i) => (
              <button key={i} onClick={() => setOpen(false)} className="w-7 h-7 text-lg hover:bg-[#f3f2f1] rounded flex items-center justify-center">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Picture button (Device + Online) ─────────────────────────────────────────

const PictureBtn: React.FC = () => {
  const { editorRef } = useEditorContext();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (src && editorRef.current) {
        editorRef.current.chain().focus().setImage({ src }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) insertImageFromFile(file);
    // reset so same file can be picked again
    e.target.value = '';
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative h-full flex-shrink-0">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Split button — main part inserts from device directly */}
      <div className="flex h-full">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-l px-2 py-0.5 transition-colors min-w-[44px] h-full gap-0 hover:bg-[#f3f2f1] text-[#323130]"
          title="Insert Picture from Device"
        >
          <Image size={20} strokeWidth={1.5} />
          <span className="text-[10px] mt-0.5">Picture</span>
        </button>
        <button
          onClick={() => open ? setOpen(false) : openDropdown()}
          className="flex items-center justify-center px-1 hover:bg-[#edebe9] rounded-r text-gray-400 transition-colors h-full border-l border-gray-100"
          title="Picture options"
        >
          <ChevronDown size={8} />
        </button>
      </div>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] py-1 overflow-hidden"
          style={{ top: pos.top, left: pos.left, minWidth: 200 }}
        >
          <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Insert Picture
          </div>
          <button
            onClick={() => { fileInputRef.current?.click(); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#f3f2f1] text-[#323130] transition-colors"
          >
            <FolderOpen size={15} className="text-amber-600" />
            <div>
              <div className="text-[12px] font-medium">From Device</div>
              <div className="text-[10px] text-gray-400">Browse your computer</div>
            </div>
          </button>
          <button
            onClick={() => {
              const url = prompt('Enter image URL:');
              if (url && editorRef.current) {
                editorRef.current.chain().focus().setImage({ src: url }).run();
              }
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#f3f2f1] text-[#323130] transition-colors"
          >
            <Globe2 size={15} className="text-blue-500" />
            <div>
              <div className="text-[12px] font-medium">From URL</div>
              <div className="text-[10px] text-gray-400">Paste an image link</div>
            </div>
          </button>
          <button
            onClick={() => {
              // Paste from clipboard
              navigator.clipboard.read().then(items => {
                for (const item of items) {
                  const imageType = item.types.find(t => t.startsWith('image/'));
                  if (imageType) {
                    item.getType(imageType).then(blob => {
                      const file = new File([blob], 'pasted.png', { type: imageType });
                      insertImageFromFile(file);
                    });
                  }
                }
              }).catch(() => alert('No image found in clipboard.'));
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#f3f2f1] text-[#323130] transition-colors"
          >
            <Monitor size={15} className="text-teal-600" />
            <div>
              <div className="text-[12px] font-medium">From Clipboard</div>
              <div className="text-[10px] text-gray-400">Paste copied image</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

// ─── InsertTab ────────────────────────────────────────────────────────────────

const InsertTab: React.FC = () => {
  return (
    <div className="flex h-full items-center">

      <RibbonGroup label="Pages">
        <LargeBtn icon={FileText} label="Cover" />
        <LargeBtn icon={FileX} label="Blank" />
        <LargeBtn icon={Scissors} label="Break" />
      </RibbonGroup>

      <RibbonGroup label="Tables">
        <TableDropBtn />
      </RibbonGroup>

      <RibbonGroup label="Illustrations">
        <PictureBtn />
        <ShapesDropBtn />
      </RibbonGroup>

      <RibbonGroup label="Links">
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={Link} label="Link" />
          <SmallBtn icon={Bookmark} label="Bookmark" />
          <SmallBtn icon={Navigation} label="Cross-ref" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Header & Footer">
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={PanelTop} label="Header" />
          <SmallBtn icon={PanelBottom} label="Footer" />
          <SmallBtn icon={Hash} label="Page #" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Text">
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={TextCursorInput} label="Text Box" />
          <SmallBtn icon={Type} label="WordArt" />
          <SmallBtn icon={FileSignature} label="Signature" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Symbols">
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={Sigma} label="Equation" />
          <SmallBtn icon={AtSign} label="Symbol" />
        </div>
      </RibbonGroup>

    </div>
  );
};

export default InsertTab;

import React, { useState } from 'react';
import {
  FileText, FileX, Scissors,
  Table, Grid2x2, Grid3x3,
  Image, ImagePlus, Monitor, Globe2,
  Square, Shapes, Star, Triangle,
  Link, Bookmark, Navigation,
  PanelTop, PanelBottom, Hash,
  TextCursorInput, FileSignature, CalendarDays, Type,
  Sigma, AtSign, ChevronDown
} from 'lucide-react';
import { RibbonGroup, LargeBtn, SmallBtn, SplitLargeBtn, DropBtn, useDropdown, RibbonDivider } from '../RibbonComponents';

const TablePicker: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [hover, setHover] = useState<[number, number]>([0, 0]);
  const ROWS = 8, COLS = 10;

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
              className={`w-4.5 h-4.5 border rounded-sm cursor-pointer transition-colors ${
                isActive ? 'bg-[#C9973A] border-[#C9973A]' : 'border-gray-200 hover:border-gray-400'
              }`}
              onMouseEnter={() => setHover([row, col])}
              onClick={onClose}
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

const TableDropBtn: React.FC = () => {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative h-full flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className={`flex flex-col items-center justify-center rounded px-1.5 py-0.5 transition-colors min-w-[40px] h-full gap-0
          ${open ? 'bg-[#edebe9] text-[#2b2b2b]' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
      >
        <Table size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5">Table</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-0.5 bg-white border border-gray-200 rounded shadow-xl z-[9999]">
          <TablePicker onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

const ShapesDropBtn: React.FC = () => {
  const { open, setOpen, ref } = useDropdown();
  const shapes = ['□', '◯', '△', '⬡', '→', '☆', '□', '◯'];

  return (
    <div ref={ref} className="relative h-full flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className={`flex flex-col items-center justify-center rounded px-1.5 py-0.5 transition-colors min-w-[40px] h-full gap-0
          ${open ? 'bg-[#edebe9] text-[#2b2b2b]' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
      >
        <Shapes size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5">Shapes</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-0.5 bg-white border border-gray-200 rounded shadow-xl z-[9999] p-1.5 w-40">
          <div className="text-[9px] text-gray-400 mb-1 px-0.5 uppercase font-bold">Recently Used</div>
          <div className="flex gap-1 flex-wrap">
            {shapes.map((s, i) => (
              <button key={i} onClick={() => setOpen(false)} className="w-7 h-7 text-lg hover:bg-[#f3f2f1] rounded flex items-center justify-center">{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
        <SplitLargeBtn icon={Image} label="Picture" items={[{ label: 'Device' }, { label: 'Online' }]} />
        <ShapesDropBtn />
        <LargeBtn icon={Monitor} label="Screen" />
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

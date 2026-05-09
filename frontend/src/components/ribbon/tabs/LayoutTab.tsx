import React, { useRef } from 'react';
import {
  FileText, RotateCw, AlignLeft, AlignCenter,
  ZoomIn, ZoomOut, Minus, Plus, ChevronDown,
  Maximize2, PanelTop, PanelBottom, Hash
} from 'lucide-react';
import { RibbonGroup, useDropdown, SmallBtn } from '../RibbonComponents';
import { useAppStore, PAGE_SIZES, MARGIN_PRESETS } from '../../../store/useAppStore';
import type { PageSizeName, MarginPreset } from '../../../store/useAppStore';

// ─── Page Size Dropdown ───────────────────────────────────────────────────────

const PAGE_SIZE_ICONS: Record<string, string> = {
  A4: '📄', A3: '🗒️', A5: '📋', Letter: '📃', Legal: '📜',
};

const PageSizeBtn: React.FC = () => {
  const { pageSize, setPageSize, isCustomPageSize, setCustomPageSize } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div ref={ref} className="relative flex-shrink-0 h-full">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[48px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
        title="Page Size"
      >
        <FileText size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">{pageSize.name}</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] py-1 overflow-hidden"
          style={{ top: pos.top, left: pos.left, minWidth: 220 }}
        >
          <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Page Size
          </div>
          {(Object.keys(PAGE_SIZES) as PageSizeName[]).map(name => {
            const ps = PAGE_SIZES[name];
            const isActive = pageSize.name === name;
            const wCm = (ps.widthPx / 37.8).toFixed(1);
            const hCm = (ps.heightPx / 37.8).toFixed(1);
            return (
              <button
                key={name}
                onClick={() => { setPageSize(name); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${isActive ? 'bg-amber-50 text-amber-700' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
              >
                <span className="text-lg">{PAGE_SIZE_ICONS[name]}</span>
                <div>
                  <div className="text-[12px] font-semibold">{name}</div>
                  <div className="text-[10px] text-gray-400">{wCm} × {hCm} cm</div>
                </div>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-amber-500" />}
              </button>
            );
          })}
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={() => { setPageSize('Custom'); }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${pageSize.name === 'Custom' ? 'bg-amber-50 text-amber-700' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
          >
            <span className="text-lg">📏</span>
            <div>
              <div className="text-[12px] font-semibold">Custom Size</div>
              <div className="text-[10px] text-gray-400">Specify width & height</div>
            </div>
            {pageSize.name === 'Custom' && <div className="ml-auto w-2 h-2 rounded-full bg-amber-500" />}
          </button>
          {pageSize.name === 'Custom' && (
            <div className="px-3 py-2 bg-gray-50 flex items-center gap-2 border-t border-gray-100">
              <input 
                type="number" step="0.1"
                className="w-16 h-7 text-[11px] border border-gray-300 rounded px-1.5 outline-none focus:border-[#C9973A]" 
                placeholder="W (cm)" 
                defaultValue={(pageSize.widthPx / 37.8).toFixed(1)}
                onBlur={(e) => setCustomPageSize(parseFloat(e.target.value || '21') * 37.8, pageSize.heightPx)}
              />
              <span className="text-[10px] font-bold text-gray-400">×</span>
              <input 
                type="number" step="0.1"
                className="w-16 h-7 text-[11px] border border-gray-300 rounded px-1.5 outline-none focus:border-[#C9973A]" 
                placeholder="H (cm)"
                defaultValue={(pageSize.heightPx / 37.8).toFixed(1)}
                onBlur={(e) => setCustomPageSize(pageSize.widthPx, parseFloat(e.target.value || '29.7') * 37.8)}
              />
              <span className="text-[10px] text-gray-400 font-medium">cm</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Orientation Toggle ───────────────────────────────────────────────────────

const OrientationBtn: React.FC = () => {
  const { orientation, setOrientation } = useAppStore();

  return (
    <div className="flex flex-col gap-0.5 h-full justify-center">
      <button
        onClick={() => setOrientation('portrait')}
        className={`flex items-center gap-1.5 rounded px-2 py-0.5 transition-colors h-[22px] text-[11px] flex-shrink-0
          ${orientation === 'portrait' ? 'bg-amber-50 text-amber-700 font-semibold' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
        title="Portrait"
      >
        <div className={`w-3 h-4 border rounded-[1px] flex-shrink-0 ${orientation === 'portrait' ? 'border-amber-500 bg-amber-100' : 'border-gray-400'}`} />
        Portrait
      </button>
      <button
        onClick={() => setOrientation('landscape')}
        className={`flex items-center gap-1.5 rounded px-2 py-0.5 transition-colors h-[22px] text-[11px] flex-shrink-0
          ${orientation === 'landscape' ? 'bg-amber-50 text-amber-700 font-semibold' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
        title="Landscape"
      >
        <div className={`w-4 h-3 border rounded-[1px] flex-shrink-0 ${orientation === 'landscape' ? 'border-amber-500 bg-amber-100' : 'border-gray-400'}`} />
        Landscape
      </button>
    </div>
  );
};

// ─── Margins Dropdown ─────────────────────────────────────────────────────────

const MARGIN_VISUALS: Record<MarginPreset, { t: number; r: number; b: number; l: number }> = {
  normal:   { t: 6, r: 6, b: 6, l: 6 },
  moderate: { t: 4, r: 3, b: 4, l: 3 },
  narrow:   { t: 2, r: 2, b: 2, l: 2 },
  wide:     { t: 6, r: 12, b: 6, l: 12 },
};

const MarginsBtn: React.FC = () => {
  const { marginPreset, setMarginPreset } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div ref={ref} className="relative flex-shrink-0 h-full">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
        title="Margins"
      >
        {/* tiny page preview */}
        <div className="w-4 h-5 border border-gray-400 relative flex-shrink-0 bg-white">
          <div className="absolute inset-[2px] border border-dashed border-gray-300" />
        </div>
        <span className="text-[10px] mt-0.5 font-medium capitalize">{marginPreset}</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] py-1 overflow-hidden"
          style={{ top: pos.top, left: pos.left, minWidth: 240 }}
        >
          <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Margins
          </div>
          {(Object.keys(MARGIN_PRESETS) as MarginPreset[]).map(preset => {
            const info = MARGIN_PRESETS[preset];
            const vis = MARGIN_VISUALS[preset];
            const isActive = marginPreset === preset;
            return (
              <button
                key={preset}
                onClick={() => { setMarginPreset(preset); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${isActive ? 'bg-amber-50 text-amber-700' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
              >
                {/* Margin preview */}
                <div className="w-8 h-10 border border-gray-300 relative bg-white flex-shrink-0">
                  <div
                    className="absolute bg-gray-100"
                    style={{ top: vis.t, right: vis.r, bottom: vis.b, left: vis.l }}
                  />
                </div>
                <div>
                  <div className="text-[12px] font-semibold capitalize">{preset}</div>
                  <div className="text-[10px] text-gray-400 leading-tight">{info.label}</div>
                </div>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-amber-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Zoom Controls ─────────────────────────────────────────────────────────────

const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200];

const ZoomControls: React.FC = () => {
  const { zoomLevel, setZoomLevel } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div className="flex items-center h-full gap-0.5 px-1">
      <button
        onClick={() => setZoomLevel(Math.max(25, zoomLevel - 10))}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f3f2f1] text-[#323130] transition-colors"
        title="Zoom Out"
      >
        <Minus size={12} strokeWidth={2} />
      </button>

      {/* Zoom percentage click to pick preset */}
      <div ref={ref} className="relative">
        <button
          onClick={() => open ? setOpen(false) : openDropdown()}
          className={`h-6 px-1.5 rounded text-[11px] font-semibold transition-colors min-w-[44px] ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
          title="Zoom"
        >
          {zoomLevel}%
        </button>
        {open && (
          <div
            className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] py-1"
            style={{ top: pos.top, left: pos.left, minWidth: 110 }}
          >
            {ZOOM_PRESETS.map(p => (
              <button
                key={p}
                onClick={() => { setZoomLevel(p); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors ${zoomLevel === p ? 'bg-amber-50 text-amber-700 font-bold' : 'hover:bg-[#f3f2f1] text-[#323130]'}`}
              >
                {p}%
              </button>
            ))}
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={() => { setZoomLevel(100); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#f3f2f1] text-[#323130]"
            >
              Fit Page
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => setZoomLevel(Math.min(500, zoomLevel + 10))}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f3f2f1] text-[#323130] transition-colors"
        title="Zoom In"
      >
        <Plus size={12} strokeWidth={2} />
      </button>
    </div>
  );
};

// ─── Header & Footer Controls ───────────────────────────────────────────────────

const HeaderFooterControls: React.FC = () => {
  const { globalHeader, setGlobalHeader, globalFooter, setGlobalFooter, showPageNumbers, setShowPageNumbers } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div ref={ref} className="relative h-full flex items-center px-1">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
        title="Header & Footer Settings"
      >
        <PanelTop size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">Headers</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] p-3 flex flex-col gap-3"
          style={{ top: pos.top, left: pos.left, minWidth: 260 }}
        >
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Header & Footer Settings
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5"><PanelTop size={12}/> Header Text</label>
            <input 
              type="text" 
              value={globalHeader}
              onChange={(e) => setGlobalHeader(e.target.value)}
              placeholder="e.g., LEKHA DOCUMENT" 
              className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#C9973A] bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5"><PanelBottom size={12}/> Footer Text</label>
            <input 
              type="text" 
              value={globalFooter}
              onChange={(e) => setGlobalFooter(e.target.value)}
              placeholder="e.g., Confidential" 
              className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#C9973A] bg-gray-50 focus:bg-white"
            />
          </div>

          <label className="flex items-center gap-2 mt-1 cursor-pointer hover:bg-gray-50 p-1.5 rounded -mx-1.5">
            <input 
              type="checkbox" 
              checked={showPageNumbers}
              onChange={(e) => setShowPageNumbers(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#C9973A] cursor-pointer"
            />
            <span className="text-[12px] font-medium text-gray-700 flex items-center gap-1"><Hash size={12}/> Show Page Numbers</span>
          </label>
        </div>
      )}
    </div>
  );
};

// ─── Main LayoutTab ────────────────────────────────────────────────────────────

const LayoutTab: React.FC = () => {
  return (
    <div className="flex h-full items-center">

      <RibbonGroup label="Page Size">
        <PageSizeBtn />
      </RibbonGroup>

      <RibbonGroup label="Orientation">
        <OrientationBtn />
      </RibbonGroup>

      <RibbonGroup label="Margins">
        <MarginsBtn />
      </RibbonGroup>

      <RibbonGroup label="Header & Footer">
        <HeaderFooterControls />
      </RibbonGroup>

      <RibbonGroup label="Zoom">
        <ZoomControls />
      </RibbonGroup>

    </div>
  );
};

export default LayoutTab;

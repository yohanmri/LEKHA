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

const HeaderFooterSettings: React.FC<{
  title: string;
  icon: React.ReactNode;
  format: any;
  setFormat: (f: any) => void;
}> = ({ title, icon, format, setFormat }) => {
  return (
    <div className="flex flex-col gap-1.5 p-2 bg-gray-50 border border-gray-100 rounded">
      <label className="text-[11px] font-semibold text-[#1A7A6E] flex items-center gap-1.5 mb-1">{icon} {title}</label>
      <input 
        type="text" 
        value={format.text}
        onChange={(e) => setFormat({ text: e.target.value })}
        placeholder={`Add ${title.toLowerCase()} text...`} 
        className="w-full text-[12px] border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#C9973A] bg-white mb-1"
      />
      <div className="flex items-center gap-1 flex-wrap">
        {/* Font Family */}
        <select 
          value={format.fontFamily}
          onChange={e => setFormat({ fontFamily: e.target.value })}
          className="text-[11px] border border-gray-300 rounded px-1 py-0.5 outline-none bg-white cursor-pointer max-w-[100px] truncate"
        >
          <option value="Inter">Inter</option>
          <option value="Noto Sans Sinhala">Noto Sans Sinhala</option>
          <option value="FMAbhaya">FMAbhaya</option>
          <option value="FMMalithi">FMMalithi</option>
        </select>

        {/* Font Size */}
        <select 
          value={format.fontSize}
          onChange={e => setFormat({ fontSize: e.target.value })}
          className="text-[11px] border border-gray-300 rounded px-1 py-0.5 outline-none bg-white cursor-pointer"
        >
          {['8', '10', '12', '14', '16', '18', '24'].map(s => <option key={s} value={s}>{s}pt</option>)}
        </select>
        
        {/* Bold / Italic */}
        <button onClick={() => setFormat({ bold: !format.bold })} className={`p-1 rounded ${format.bold ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-200 text-gray-600'}`}><span className="font-bold text-[11px] w-3 h-3 flex items-center justify-center">B</span></button>
        <button onClick={() => setFormat({ italic: !format.italic })} className={`p-1 rounded ${format.italic ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-200 text-gray-600'}`}><span className="italic font-serif text-[11px] w-3 h-3 flex items-center justify-center">I</span></button>

        <div className="w-px h-3 bg-gray-300 mx-0.5"></div>

        {/* Alignment */}
        <button onClick={() => setFormat({ align: 'left' })} className={`p-1 rounded ${format.align === 'left' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-200 text-gray-600'}`}><AlignLeft size={12} /></button>
        <button onClick={() => setFormat({ align: 'center' })} className={`p-1 rounded ${format.align === 'center' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-200 text-gray-600'}`}><AlignCenter size={12} /></button>
        <button onClick={() => setFormat({ align: 'right' })} className={`p-1 rounded ${format.align === 'right' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-200 text-gray-600'}`}><AlignLeft size={12} style={{ transform: 'scaleX(-1)' }} /></button>

        <div className="w-px h-3 bg-gray-300 mx-0.5"></div>

        {/* Color */}
        <input 
          type="color" 
          value={format.color}
          onChange={e => setFormat({ color: e.target.value })}
          className="w-5 h-5 p-0 border-none rounded cursor-pointer"
        />
      </div>
      <button className="text-[10px] text-[#C9973A] hover:underline self-start mt-1 font-medium">
        Advanced Formatting Options...
      </button>
    </div>
  );
};

const HeaderSettingsBtn: React.FC = () => {
  const { headerFormat, setHeaderFormat } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div ref={ref} className="relative h-full flex items-center px-1">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
      >
        <PanelTop size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">Header</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] p-3 flex flex-col gap-3"
          style={{ top: pos.top, left: pos.left, minWidth: 260 }}
        >
          <HeaderFooterSettings title="Header Styling" icon={<PanelTop size={12}/>} format={headerFormat} setFormat={setHeaderFormat} />
        </div>
      )}
    </div>
  );
};

const FooterSettingsBtn: React.FC = () => {
  const { footerFormat, setFooterFormat } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div ref={ref} className="relative h-full flex items-center px-1">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
      >
        <PanelBottom size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">Footer</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] p-3 flex flex-col gap-3"
          style={{ top: pos.top, left: pos.left, minWidth: 260 }}
        >
          <HeaderFooterSettings title="Footer Styling" icon={<PanelBottom size={12}/>} format={footerFormat} setFormat={setFooterFormat} />
        </div>
      )}
    </div>
  );
};

const PageNumberBtn: React.FC = () => {
  const { pageNumberConfig, setPageNumberConfig } = useAppStore();
  const { open, setOpen, openDropdown, ref, pos } = useDropdown();

  return (
    <div ref={ref} className="relative h-full flex items-center px-1">
      <button
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={`flex flex-col items-center justify-center rounded px-2 py-0.5 transition-colors min-w-[56px] h-full gap-0 ${open ? 'bg-[#edebe9]' : 'hover:bg-[#f3f2f1]'} text-[#323130]`}
      >
        <Hash size={20} strokeWidth={1.5} />
        <span className="text-[10px] mt-0.5 font-medium">Page No</span>
        <ChevronDown size={8} className="text-gray-400" />
      </button>

      {open && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] p-3 flex flex-col gap-3"
          style={{ top: pos.top, left: pos.left, minWidth: 260 }}
        >
          <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Page Numbers
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={pageNumberConfig.show}
                onChange={e => setPageNumberConfig({ show: e.target.checked })}
                className="accent-[#C9973A]"
              />
              <span className="text-[11px] text-gray-600 font-medium">Show</span>
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1 text-[11px] text-gray-600 font-medium">
              Position
              <select 
                value={pageNumberConfig.position}
                onChange={e => setPageNumberConfig({ position: e.target.value as any })}
                className="border border-gray-300 rounded px-2 py-1 outline-none bg-white focus:border-[#C9973A]"
              >
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-[11px] text-gray-600 font-medium">
              Number Color
              <input 
                type="color" 
                value={pageNumberConfig.color}
                onChange={e => setPageNumberConfig({ color: e.target.value })}
                className="w-full h-6 p-0 border-none rounded cursor-pointer"
              />
            </label>

            <div className="border-t border-gray-100 pt-2 mt-1">
              <label className="flex flex-col gap-1 text-[11px] text-gray-600 font-medium">
                Use Roman Numerals Until Page:
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="0"
                    value={pageNumberConfig.romanUntilPage}
                    onChange={e => setPageNumberConfig({ romanUntilPage: parseInt(e.target.value) || 0 })}
                    className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#C9973A] w-16"
                  />
                  <span className="text-[10px] text-gray-400 font-normal italic">0 = Off</span>
                </div>
              </label>
              <p className="text-[9px] text-gray-400 mt-1 leading-tight">
                Pages up to this number will display as i, ii, iii. Subsequent pages will restart at 1, 2, 3.
              </p>
            </div>
            
            <button className="text-[10px] text-[#C9973A] hover:underline self-start mt-1 font-medium">
              Advanced Numbering Options...
            </button>
          </div>
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
        <HeaderSettingsBtn />
        <FooterSettingsBtn />
        <PageNumberBtn />
      </RibbonGroup>

      <RibbonGroup label="Zoom">
        <ZoomControls />
      </RibbonGroup>

    </div>
  );
};

export default LayoutTab;

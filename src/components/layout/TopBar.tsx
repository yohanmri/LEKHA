import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useDropdown } from '../ribbon/RibbonComponents';
import {
  Save, History, Share2, Download, ChevronDown, UserCircle,
  FileText, File, Code, Printer, FileType2
} from 'lucide-react';

const TopBar: React.FC = () => {
  const { documentTitle, setDocumentTitle, saveStatus } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(documentTitle);
  const exportDropdown = useDropdown();
  const shareDropdown = useDropdown();

  const handleBlur = () => {
    setIsEditing(false);
    setDocumentTitle(tempTitle);
  };

  const exportOptions = [
    { icon: FileType2, label: 'Export as PDF', sub: 'Best for sharing & printing', color: '#e53e3e' },
    { icon: File, label: 'Export as DOCX', sub: 'Microsoft Word format', color: '#2b6cb0' },
    { icon: FileText, label: 'Export as TXT', sub: 'Plain text, no formatting', color: '#718096' },
    { icon: Code, label: 'Export as HTML', sub: 'For web publishing', color: '#d97706' },
    { divider: true },
    { icon: Printer, label: 'Print', sub: 'Ctrl+P', color: '#2d3748' },
  ];

  return (
    <div className="h-10 bg-[#f3f2f1] border-b border-gray-200 flex items-center justify-between px-3 z-50 flex-shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className="text-[#C9973A] font-bold text-lg select-none">ලේඛා</div>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        {isEditing ? (
          <input
            className="bg-white border border-[#C9973A] outline-none text-[13px] font-medium px-2 py-0.5 rounded min-w-[200px]"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            autoFocus
          />
        ) : (
          <div
            className="text-[13px] font-medium cursor-pointer hover:bg-gray-200 px-2 py-0.5 rounded truncate max-w-[300px] text-gray-700 transition-colors"
            onClick={() => { setIsEditing(true); setTempTitle(documentTitle); }}
            title="Click to rename"
          >
            {documentTitle}
          </div>
        )}
      </div>

      {/* Center */}
      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-0.5">

        {/* Save button */}
        <button className="h-8 px-2 hover:bg-gray-200 rounded flex items-center gap-1.5 text-gray-600 transition-colors">
          <Save size={14} />
          <span className="text-[12px]">Save</span>
          <span className={`w-1.5 h-1.5 rounded-full ${
            saveStatus === 'saved' ? 'bg-green-500' :
            saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' :
            'bg-red-500'
          }`} />
        </button>

        {/* Version History */}
        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded text-gray-500 transition-colors" title="Version History">
          <History size={14} />
        </button>

        {/* Share dropdown */}
        <div ref={shareDropdown.ref} className="relative">
          <button
            onClick={() => shareDropdown.setOpen(!shareDropdown.open)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded text-gray-500 transition-colors"
            title="Share"
          >
            <Share2 size={14} />
          </button>
          {shareDropdown.open && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-[300] min-w-[180px] py-1">
              <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Share</div>
              {['Share with People...', 'Copy Link', 'Embed...'].map(item => (
                <button key={item} onClick={() => shareDropdown.setOpen(false)} className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-100 text-gray-700">
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        {/* Export dropdown */}
        <div ref={exportDropdown.ref} className="relative ml-1">
          <button
            onClick={() => exportDropdown.setOpen(!exportDropdown.open)}
            className="h-7 bg-[#C9973A] hover:bg-[#B08432] text-white px-3 rounded flex items-center gap-1.5 text-[12px] font-semibold transition-colors shadow-sm"
          >
            <Download size={14} />
            <span>Export</span>
            <ChevronDown size={12} className={`transition-transform ${exportDropdown.open ? 'rotate-180' : ''}`} />
          </button>

          {exportDropdown.open && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-xl z-[300] min-w-[220px] py-1 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Export Document</div>
              {exportOptions.map((opt, i) =>
                (opt as any).divider ? (
                  <div key={i} className="border-t border-gray-100 my-1" />
                ) : (
                  <button
                    key={i}
                    onClick={() => exportDropdown.setOpen(false)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3 group transition-colors"
                  >
                    {opt.icon && <opt.icon size={15} style={{ color: opt.color }} />}
                    <div>
                      <div className="text-[12px] font-medium text-gray-800">{opt.label}</div>
                      {opt.sub && <div className="text-[10px] text-gray-400 leading-tight">{opt.sub}</div>}
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* User avatar */}
        <button className="ml-1 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors" title="Account">
          <UserCircle size={22} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;

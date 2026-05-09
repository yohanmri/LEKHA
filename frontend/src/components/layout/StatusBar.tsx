import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  FileText, 
  Monitor, 
  BookOpen, 
  Maximize2,
  Minus,
  Plus
} from 'lucide-react';

const StatusBar: React.FC = () => {
  const { saveStatus, zoomLevel, setZoomLevel } = useAppStore();

  return (
    <div className="h-7 bg-[#0078D4] text-white flex items-center justify-between px-3 text-[11px] select-none z-50">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <span>Page 1 of 1</span>
        <span>0 words</span>
        <span>0 characters</span>
      </div>

      {/* Center */}
      <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 h-full transition-colors">
        <span className="font-medium">සිංහල</span>
        <span className="opacity-60">|</span>
        <span>EN English</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 h-full">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            saveStatus === 'saved' ? 'bg-green-400' : saveStatus === 'unsaved' ? 'bg-amber-400' : 'bg-blue-400 animate-pulse'
          }`} title={saveStatus === 'saved' ? 'All changes saved' : 'Unsaved changes'} />
          <span className="capitalize">{saveStatus}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="hover:bg-white/10 p-0.5 rounded"><BookOpen size={14} /></button>
          <button className="hover:bg-white/10 p-0.5 rounded"><Monitor size={14} /></button>
          <button className="hover:bg-white/10 p-0.5 rounded"><Maximize2 size={14} /></button>
        </div>

        <div className="flex items-center gap-2 border-l border-white/20 pl-4 h-full">
          <button 
            onClick={() => setZoomLevel(Math.max(10, zoomLevel - 10))}
            className="hover:bg-white/10 p-1"
          >
            <Minus size={12} />
          </button>
          <div className="w-24 bg-white/20 h-0.5 relative">
            <div 
              className="absolute h-2 w-2 bg-white rounded-full -top-[3px] -ml-1 cursor-pointer"
              style={{ left: `${(zoomLevel - 10) / 4.9}%` }}
            />
          </div>
          <button 
            onClick={() => setZoomLevel(Math.min(500, zoomLevel + 10))}
            className="hover:bg-white/10 p-1"
          >
            <Plus size={12} />
          </button>
          <span className="w-8 text-right">{zoomLevel}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;

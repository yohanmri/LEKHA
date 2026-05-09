import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  List, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight,
  Search
} from 'lucide-react';

const LeftPanel: React.FC = () => {
  const { isLeftPanelCollapsed, toggleLeftPanel } = useAppStore();

  return (
    <div className={`
      bg-[#F8F9FA] border-r border-gray-200 transition-all duration-300 flex flex-col relative z-20
      ${isLeftPanelCollapsed ? 'w-0 overflow-hidden' : 'w-[240px]'}
    `}>
      {!isLeftPanelCollapsed && (
        <>
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Navigator</span>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-gray-100 rounded text-[#C9973A]"><List size={14} /></button>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-400"><LayoutGrid size={14} /></button>
            </div>
          </div>
          
          <div className="p-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search headings..." 
                className="w-full text-[11px] bg-white border border-gray-200 rounded px-2 py-1 pl-7 outline-none focus:ring-1 focus:ring-[#C9973A]"
              />
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              <div className="text-[12px] font-medium text-gray-700 cursor-pointer py-1.5 px-3 hover:bg-gray-100 rounded truncate border-l-2 border-[#C9973A]">
                ප්‍රධාන මාතෘකාව
              </div>
              <div className="text-[12px] text-gray-600 cursor-pointer py-1 px-3 ml-4 hover:bg-gray-100 rounded truncate">
                අනු මාතෘකාව 1
              </div>
              <div className="text-[12px] text-gray-600 cursor-pointer py-1 px-3 ml-4 hover:bg-gray-100 rounded truncate">
                අනු මාතෘකාව 2
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Collapse Toggle */}
      <button 
        onClick={toggleLeftPanel}
        className="absolute -right-3 top-12 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:text-[#C9973A] transition-colors shadow-sm z-30"
      >
        {isLeftPanelCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
};

export default LeftPanel;

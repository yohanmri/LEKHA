import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTableOfContents, type TOCItem } from '../../hooks/useTableOfContents';
import { 
  List, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight,
  Search
} from 'lucide-react';
import { useEditorContext } from '../../hooks/useEditorContext';

const LeftPanel: React.FC = () => {
  const { isLeftPanelCollapsed, toggleLeftPanel } = useAppStore();
  const toc = useTableOfContents();
  const { editorsMap } = useEditorContext();

  const handleTOCClick = (item: TOCItem) => {
    // Scroll to the page
    const pageEl = document.getElementById(item.pageId);
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Focus the editor
    const editor = editorsMap.current[item.pageId];
    if (editor) {
      editor.commands.focus();
    }
  };

  return (
    <div className={`
      bg-[#F8F9FA] border-r border-gray-200 transition-all duration-300 flex flex-col relative z-20
      ${isLeftPanelCollapsed ? 'w-0 overflow-hidden' : 'w-[260px]'}
    `}>
      {!isLeftPanelCollapsed && (
        <>
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Navigator</span>
            <div className="flex gap-1">
              <button className="p-1 bg-amber-50 rounded text-amber-600"><List size={14} /></button>
            </div>
          </div>
          
          <div className="p-3 border-b border-gray-100 bg-white">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search headings..." 
                className="w-full text-[12px] bg-gray-50 border border-gray-200 rounded px-2 py-1.5 pl-8 outline-none focus:ring-1 focus:ring-[#C9973A] focus:bg-white transition-colors"
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {toc.length === 0 ? (
              <div className="text-[11px] text-gray-400 text-center mt-6 px-4">
                Add headings (H1, H2, H3) to your pages to see them here.
              </div>
            ) : (
              <div className="space-y-0.5">
                {toc.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleTOCClick(item)}
                    className={`
                      text-[12px] cursor-pointer py-1.5 px-3 hover:bg-gray-100 rounded truncate transition-colors
                      ${item.level === 1 ? 'font-semibold text-gray-800' : 'text-gray-600'}
                    `}
                    style={{ marginLeft: `${(item.level - 1) * 12}px` }}
                    title={item.text}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            )}
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

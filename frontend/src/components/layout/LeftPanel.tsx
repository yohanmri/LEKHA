import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTableOfContents } from '../../hooks/useTableOfContents';
import { List, ChevronLeft, ChevronRight, Search, FileText } from 'lucide-react';
import { useEditorContext } from '../../hooks/useEditorContext';

const LeftPanel: React.FC = () => {
  const { isLeftPanelCollapsed, toggleLeftPanel, pages } = useAppStore();
  const toc = useTableOfContents();
  const { editorsMap } = useEditorContext();
  const [search, setSearch] = useState('');

  const handleHeadingClick = (item: ReturnType<typeof useTableOfContents>[0]) => {
    const pageEl = document.getElementById(item.pageId);
    if (pageEl) pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const ed = editorsMap.current[item.pageId];
    if (ed) {
      ed.commands.focus();
      const idx = toc.filter(t => t.pageId === item.pageId).findIndex(t => t.id === item.id);
      const headings = ed.view.dom.querySelectorAll('h1,h2,h3,h4,h5,h6');
      headings[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getPrefix = (item: ReturnType<typeof useTableOfContents>[0]) => {
    const counters = [0, 0, 0];
    for (const t of toc) {
      const lvl = Math.min(t.level - 1, 2);
      counters[lvl]++;
      for (let i = lvl + 1; i < 3; i++) counters[i] = 0;
      if (t.id === item.id) break;
    }
    return counters.slice(0, Math.min(item.level, 3)).filter(Boolean).join('.');
  };

  const filteredToc = search ? toc.filter(t => t.text.toLowerCase().includes(search.toLowerCase())) : toc;
  const contentPages = pages.filter(p => !['page-toc-', 'page-lof-', 'page-lot-', 'page-ref-'].some(x => p.id.startsWith(x)));

  return (
    <div className={`
      bg-[#F8F9FA] border-r border-gray-200 transition-all duration-300 flex flex-col relative z-20
      ${isLeftPanelCollapsed ? 'w-0 overflow-hidden' : 'w-[260px]'}
    `}>
      {!isLeftPanelCollapsed && (
        <>
          <div className="px-3 py-2.5 border-b border-gray-200 flex items-center justify-between bg-white">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Navigator</span>
            <List size={14} className="text-gray-400" />
          </div>

          <div className="p-3 border-b border-gray-100 bg-white">
            <div className="relative">
              <input type="text" placeholder="Search headings..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-[12px] bg-gray-50 border border-gray-200 rounded px-2 py-1.5 pl-8 outline-none focus:ring-1 focus:ring-[#2B579A] focus:bg-white transition-colors" />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {filteredToc.length === 0 ? (
              <div className="text-[11px] text-gray-400 text-center mt-6 px-4 leading-relaxed">
                Add headings (H1, H2, H3) to your pages to see them here.
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredToc.map(item => (
                  <div key={item.id} onClick={() => handleHeadingClick(item)}
                    className="cursor-pointer py-1.5 px-2 hover:bg-blue-50 rounded transition-colors flex items-center gap-1.5"
                    style={{ marginLeft: `${(item.level - 1) * 14}px` }} title={item.text}>
                    <span className="text-[10px] text-[#2B579A] font-medium shrink-0 min-w-[20px]">
                      {getPrefix(item)}
                    </span>
                    <span className={`text-[12px] truncate leading-tight flex-1
                      ${item.level === 1 ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-3 py-2 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <FileText size={11} />
              <span>{contentPages.length} page(s)</span>
              <span className="mx-0.5">·</span>
              <span>{toc.length} heading(s)</span>
            </div>
          </div>
        </>
      )}

      <button onClick={toggleLeftPanel}
        className="absolute -right-3 top-12 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:text-[#2B579A] transition-colors shadow-sm z-30">
        {isLeftPanelCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
};

export default LeftPanel;

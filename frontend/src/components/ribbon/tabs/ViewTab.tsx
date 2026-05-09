import React, { useState } from 'react';
import {
  FileText, Globe2, BookOpen, Zap, Maximize,
  Grid2x2, PanelLeft, Search, ZoomIn, ZoomOut, Minimize2,
  Columns2, LayoutTemplate, SplitSquareHorizontal, MonitorPlay,
  Minus, Plus, RefreshCw
} from 'lucide-react';
import { RibbonGroup, LargeBtn, SmallBtn, SplitLargeBtn, DropBtn, RibbonDivider } from '../RibbonComponents';
import { useAppStore } from '../../../store/useAppStore';

const ViewTab: React.FC = () => {
  const { zoomLevel, setZoomLevel } = useAppStore();
  const [activeView, setActiveView] = useState('print');

  return (
    <div className="flex h-full items-center">

      <RibbonGroup label="Views">
        <LargeBtn icon={FileText} label="Print" active={activeView === 'print'} onClick={() => setActiveView('print')} />
        <LargeBtn icon={BookOpen} label="Read" active={activeView === 'read'} onClick={() => setActiveView('read')} />
        <LargeBtn icon={Globe2} label="Web" active={activeView === 'web'} onClick={() => setActiveView('web')} />
      </RibbonGroup>

      <RibbonGroup label="Show">
        <div className="flex flex-col gap-0.5 justify-center h-full px-1">
          {['Ruler', 'Gridlines', 'Nav Pane'].map(item => (
            <div key={item} className="flex items-center gap-1.5">
              <input type="checkbox" className="w-3 h-3 accent-[#C9973A]" />
              <label className="text-[10px] text-gray-600 cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </RibbonGroup>

      <RibbonGroup label="Zoom">
        <LargeBtn icon={Search} label="Zoom" />
        <LargeBtn icon={Minimize2} label="100%" onClick={() => setZoomLevel(100)} />
        <div className="flex flex-col h-full justify-center gap-0">
          <SmallBtn icon={Maximize} label="Page Width" />
          <SmallBtn icon={Columns2} label="Two Pages" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Window">
        <LargeBtn icon={Plus} label="New" />
        <LargeBtn icon={LayoutTemplate} label="Arrange" />
        <LargeBtn icon={SplitSquareHorizontal} label="Split" />
      </RibbonGroup>

      <RibbonGroup label="Macros">
        <LargeBtn icon={Zap} label="Macros" />
      </RibbonGroup>

    </div>
  );
};

export default ViewTab;

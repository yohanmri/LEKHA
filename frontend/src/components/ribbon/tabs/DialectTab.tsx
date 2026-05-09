import React from 'react';
import {
  RefreshCw, BookMarked,
  Languages, SlidersHorizontal, Sparkles
} from 'lucide-react';
import { RibbonGroup, SinhalaBtn, LargeBtn, SmallBtn } from '../RibbonComponents';
import { useAppStore } from '../../../store/useAppStore';

const DialectTab: React.FC = () => {
  const { sidePanel, setSidePanel, dialectAutoConvert, setDialectAutoConvert } = useAppStore();

  return (
    <div className="flex h-full items-center">
      <div className="flex flex-col justify-center px-2 h-full border-r border-gray-100">
        <div className="bg-[#f3f2f1] text-[#1A7A6E] px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100">DIALECT</div>
      </div>

      {/* Convert button → opens side panel for selection-based conversion */}
      <RibbonGroup label="Conversion">
        <SinhalaBtn
          icon={RefreshCw}
          label="Convert"
          onClick={() => setSidePanel(sidePanel === 'dialect' ? null : 'dialect')}
          active={sidePanel === 'dialect'}
        />
      </RibbonGroup>

      <RibbonGroup label="Tools">
        <div className="flex flex-col h-full justify-center gap-0">
          <SmallBtn icon={BookMarked} label="Dictionary" />
          <SmallBtn icon={Languages} label="Transliterate" />
        </div>
        <LargeBtn icon={SlidersHorizontal} label="Settings" />
      </RibbonGroup>

      {/* Auto Suggest → toggles inline ghost-text suggestions while typing */}
      <RibbonGroup label="AI Assistant">
        <LargeBtn
          icon={Sparkles}
          label="Auto Suggest"
          color={dialectAutoConvert ? '#7C3AED' : undefined}
          active={dialectAutoConvert}
          onClick={() => setDialectAutoConvert(!dialectAutoConvert)}
        />
      </RibbonGroup>
    </div>
  );
};

export default DialectTab;

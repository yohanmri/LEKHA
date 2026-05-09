import React from 'react';
import {
  Search, PanelRightOpen, RefreshCw, SlidersHorizontal,
  FileText, Languages, BookOpen, Lightbulb, Globe2
} from 'lucide-react';
import { RibbonGroup, SinhalaBtn, LargeBtn, DropBtn, SmallBtn } from '../RibbonComponents';
import { useAppStore } from '../../../store/useAppStore';

const SynonymsTab: React.FC = () => {
  const { sidePanel, setSidePanel } = useAppStore();

  return (
    <div className="flex h-full items-center">
      <div className="flex flex-col justify-center px-2 h-full border-r border-gray-100">
        <div className="bg-amber-50 text-[#C9973A] px-1.5 py-0.5 rounded text-[9px] font-bold">SINHALA AI</div>
      </div>

      <RibbonGroup label="Proofing">
        <SinhalaBtn
          icon={Search}
          label="Thesaurus"
          onClick={() => setSidePanel(sidePanel === 'synonyms' ? null : 'synonyms')}
          active={sidePanel === 'synonyms'}
        />
        <LargeBtn icon={RefreshCw} label="Rewrite" />
      </RibbonGroup>

      <RibbonGroup label="Vocabulary">
        <div className="flex flex-col gap-1 justify-center h-full px-1">
          <DropBtn label="All Word Forms" items={[]} />
          <DropBtn label="All Registers" items={[]} />
        </div>
        <div className="flex flex-col h-full justify-center gap-0">
          <SmallBtn icon={Lightbulb} label="Smart" />
          <SmallBtn icon={SlidersHorizontal} label="Options" />
        </div>
      </RibbonGroup>
    </div>
  );
};

export default SynonymsTab;

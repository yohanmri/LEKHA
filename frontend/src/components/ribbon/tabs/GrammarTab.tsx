import React from 'react';
import {
  SpellCheck, MessageSquare, ChevronLeft, ChevronRight,
  Settings, CheckCircle2, AlertCircle, RefreshCw, PanelRightOpen,
  Sparkles
} from 'lucide-react';
import { RibbonGroup, SinhalaBtn, LargeBtn, SmallBtn, DropBtn } from '../RibbonComponents';
import { useAppStore } from '../../../store/useAppStore';

const GrammarTab: React.FC = () => {
  const { sidePanel, setSidePanel } = useAppStore();

  return (
    <div className="flex h-full items-center">
      <div className="flex flex-col justify-center px-2 h-full border-r border-gray-100">
        <div className="bg-green-50 text-[#1A7A6E] px-1.5 py-0.5 rounded text-[9px] font-bold">INTELLIGENCE</div>
      </div>

      <RibbonGroup label="Proofing">
        <SinhalaBtn
          icon={SpellCheck}
          label="Check"
          onClick={() => setSidePanel(sidePanel === 'grammar' ? null : 'grammar')}
          active={sidePanel === 'grammar'}
        />
        <div className="flex flex-col h-full justify-center gap-0">
          <SmallBtn icon={ChevronLeft} label="Prev" />
          <SmallBtn icon={ChevronRight} label="Next" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Settings">
        <div className="flex flex-col gap-1 justify-center h-full px-1">
          <DropBtn label="Formal Style" items={[]} />
          <DropBtn label="High Sensitivity" items={[]} />
        </div>
        <LargeBtn icon={RefreshCw} label="Re-check" />
      </RibbonGroup>

      <RibbonGroup label="AI Assistant">
        <LargeBtn icon={Sparkles} label="Auto Corrector" color="#7C3AED" />
      </RibbonGroup>
    </div>
  );
};

export default GrammarTab;

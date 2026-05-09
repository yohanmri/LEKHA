import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import {
  List, PlusCircle,
  FileText, MessageSquarePlus,
  BookOpen, Quote,
  Image, Shield
} from 'lucide-react';
import { RibbonGroup, LargeBtn, SmallBtn, SplitLargeBtn, DropBtn } from '../RibbonComponents';

const ReferencesTab: React.FC = () => {
  const { setSidePanel, toggleLeftPanel } = useAppStore();

  return (
    <div className="flex h-full items-center">

      <RibbonGroup label="Table of Contents">
        <LargeBtn icon={List} label="TOC" onClick={() => toggleLeftPanel()} />
        <SmallBtn icon={PlusCircle} label="Add Text" />
      </RibbonGroup>

      <RibbonGroup label="Footnotes">
        <LargeBtn icon={FileText} label="Insert" />
        <div className="flex flex-col h-full justify-center gap-0">
          <SmallBtn icon={PlusCircle} label="Next" />
          <SmallBtn icon={MessageSquarePlus} label="Show" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Citations">
        <LargeBtn icon={Quote} label="Insert" onClick={() => setSidePanel('references')} />
        <div className="flex flex-col gap-1 justify-center h-full px-1">
          <DropBtn label="IEEE Style" items={[]} />
          <SmallBtn icon={BookOpen} label="Manage" onClick={() => setSidePanel('references')} />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Captions">
        <LargeBtn icon={Image} label="Insert" />
        <SmallBtn icon={List} label="Table" />
      </RibbonGroup>

      <RibbonGroup label="Index">
        <LargeBtn icon={BookOpen} label="Mark" />
        <SmallBtn icon={List} label="Insert" />
      </RibbonGroup>

    </div>
  );
};

export default ReferencesTab;

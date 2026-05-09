import React from 'react';
import {
  SpellCheck, Volume2, Hash,
  MessageSquare, ChevronLeft, ChevronRight, X, MessageSquarePlus, Eye,
  GitBranch, Check, SkipBack, SkipForward, CheckCheck,
  FileSearch, GitMerge, FileDiff,
  Lock, Shield
} from 'lucide-react';
import { RibbonGroup, LargeBtn, SmallBtn, SplitLargeBtn, DropBtn } from '../RibbonComponents';

const ReviewTab: React.FC = () => {
  return (
    <div className="flex h-full items-center">

      <RibbonGroup label="Proofing">
        <LargeBtn icon={SpellCheck} label="Check" />
        <LargeBtn icon={Volume2} label="Read" />
        <SmallBtn icon={Hash} label="Word Count" />
      </RibbonGroup>

      <RibbonGroup label="Language">
        <LargeBtn icon={FileSearch} label="Translate" />
        <LargeBtn icon={SpellCheck} label="Language" />
      </RibbonGroup>

      <RibbonGroup label="Comments">
        <LargeBtn icon={MessageSquarePlus} label="New" />
        <div className="flex flex-col h-full justify-center gap-0">
          <SmallBtn icon={ChevronLeft} label="Prev" />
          <SmallBtn icon={ChevronRight} label="Next" />
        </div>
        <LargeBtn icon={X} label="Delete" />
      </RibbonGroup>

      <RibbonGroup label="Tracking">
        <LargeBtn icon={GitBranch} label="Track" />
        <div className="flex flex-col gap-1 justify-center h-full px-1">
          <DropBtn label="All Markup" items={[]} />
          <SmallBtn icon={Eye} label="Show Markup" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Changes">
        <LargeBtn icon={CheckCheck} label="Accept" />
        <LargeBtn icon={X} label="Reject" />
        <div className="flex flex-col h-full justify-center gap-0">
          <SmallBtn icon={SkipBack} label="Prev" />
          <SmallBtn icon={SkipForward} label="Next" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Compare">
        <LargeBtn icon={FileDiff} label="Compare" />
      </RibbonGroup>

      <RibbonGroup label="Protect">
        <LargeBtn icon={Shield} label="Protect" />
      </RibbonGroup>

    </div>
  );
};

export default ReviewTab;

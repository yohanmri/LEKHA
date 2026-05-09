import React from 'react';
import {
  FileText, Columns2, Scissors,
  IndentDecrease, IndentIncrease,
  ArrowUp, ArrowDown,
  LayoutTemplate, Layers, Square, RotateCw, AlignCenter,
  Move, List
} from 'lucide-react';
import { RibbonGroup, LargeBtn, SmallBtn, DropBtn, RibbonDivider } from '../RibbonComponents';

const LayoutTab: React.FC = () => {
  return (
    <div className="flex h-full items-center">

      <RibbonGroup label="Page Setup">
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={FileText} label="Margins" />
          <SmallBtn icon={FileText} label="Orientation" />
          <SmallBtn icon={FileText} label="Size" />
        </div>
        <LargeBtn icon={Columns2} label="Columns" />
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={Scissors} label="Breaks" />
          <SmallBtn icon={List} label="Line #" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Paragraph">
        <div className="flex flex-col gap-1 justify-center h-full px-1">
          <div className="flex items-center gap-1">
            <span className="text-[9px] w-10 text-gray-400">Indent</span>
            <DropBtn label="0 cm" items={[]} className="w-16" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] w-10 text-gray-400">Spacing</span>
            <DropBtn label="8 pt" items={[]} className="w-16" />
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Arrange">
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={Square} label="Position" />
          <SmallBtn icon={Layers} label="Wrap Text" />
        </div>
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={ArrowUp} label="Bring Fwd" />
          <SmallBtn icon={ArrowDown} label="Send Bk" />
        </div>
        <div className="flex flex-col justify-center gap-0.5">
          <SmallBtn icon={RotateCw} label="Rotate" />
          <SmallBtn icon={AlignCenter} label="Align" />
        </div>
      </RibbonGroup>

    </div>
  );
};

export default LayoutTab;

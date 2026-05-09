import React from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface PageSeparatorProps {
  index: number;
}

const PageSeparator: React.FC<PageSeparatorProps> = ({ index }) => {
  const { addPage, zoomLevel } = useAppStore();

  return (
    <div className="w-full flex justify-center py-4 my-2 group">
      <button
        onClick={() => addPage(index)}
        className="flex items-center justify-center gap-2 w-full max-w-2xl h-10 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 bg-[#F3F2F1] hover:bg-gray-200 transition-colors shadow-sm"
      >
        <Plus size={16} strokeWidth={2.5} /> Add page
      </button>
    </div>
  );
};

export default PageSeparator;

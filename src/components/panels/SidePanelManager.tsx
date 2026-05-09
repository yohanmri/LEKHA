import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X } from 'lucide-react';

const PanelHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
    <h3 className="font-semibold text-sm text-[#1A7A6E]">{title}</h3>
    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500">
      <X size={16} />
    </button>
  </div>
);

const SidePanelManager: React.FC = () => {
  const { sidePanel, setSidePanel } = useAppStore();

  if (!sidePanel) return null;

  const renderContent = () => {
    switch (sidePanel) {
      case 'synonyms':
        return <div className="p-4 text-sm text-gray-500">Synonyms panel content...</div>;
      case 'grammar':
        return <div className="p-4 text-sm text-gray-500">Grammar panel content...</div>;
      case 'dialect':
        return <div className="p-4 text-sm text-gray-500">Dialect panel content...</div>;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (sidePanel) {
      case 'synonyms': return 'Synonyms';
      case 'grammar': return 'Grammar Checker';
      case 'dialect': return 'Dialect Converter';
      default: return '';
    }
  };

  return (
    <div className="w-[320px] bg-[#F8F9FA] border-l border-gray-200 flex flex-col z-30 shadow-2xl transition-all duration-300">
      <PanelHeader title={getTitle()} onClose={() => setSidePanel(null)} />
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SidePanelManager;

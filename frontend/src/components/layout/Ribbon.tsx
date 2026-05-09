import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import HomeTab from '../ribbon/tabs/HomeTab';
import InsertTab from '../ribbon/tabs/InsertTab';
import LayoutTab from '../ribbon/tabs/LayoutTab';
import ReferencesTab from '../ribbon/tabs/ReferencesTab';
import SynonymsTab from '../ribbon/tabs/SynonymsTab';
import GrammarTab from '../ribbon/tabs/GrammarTab';
import DialectTab from '../ribbon/tabs/DialectTab';
import ReviewTab from '../ribbon/tabs/ReviewTab';
import ViewTab from '../ribbon/tabs/ViewTab';

const Ribbon: React.FC = () => {
  const { activeTab, setActiveTab } = useAppStore();

  const tabs = [
    'Home', 'Insert', 'Layout', 'References',
    'Synonyms', 'Grammar', 'Dialect',
    'Review', 'View'
  ];

  const sinhalaTabs = ['Synonyms', 'Grammar', 'Dialect'];

  const renderTabContent = () => {
    switch (activeTab.toUpperCase()) {
      case 'HOME': return <HomeTab />;
      case 'INSERT': return <InsertTab />;
      case 'LAYOUT': return <LayoutTab />;
      case 'REFERENCES': return <ReferencesTab />;
      case 'SYNONYMS': return <SynonymsTab />;
      case 'GRAMMAR': return <GrammarTab />;
      case 'DIALECT': return <DialectTab />;
      case 'REVIEW': return <ReviewTab />;
      case 'VIEW': return <ViewTab />;
      default: return <div className="flex items-center text-gray-400 text-xs px-4 italic">Content coming soon...</div>;
    }
  };

  return (
    <div className="bg-white flex flex-col z-[100] border-b border-gray-200 shadow-sm flex-shrink-0 select-none">
      {/* Tab Bar */}
      <div className="flex px-2 border-b border-gray-100 bg-[#f3f2f1] h-[30px] items-center overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isSinhala = sinhalaTabs.includes(tab);
          const isActive = activeTab.toUpperCase() === tab.toUpperCase();

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toUpperCase())}
              className={`
                px-3 h-full text-[11.5px] font-medium transition-all relative flex items-center justify-center flex-shrink-0
                ${isActive ? 'bg-white text-gray-900 border-x border-t border-gray-200 rounded-t-sm -mb-px shadow-[0_-2px_4px_rgba(0,0,0,0.02)]' : 'text-gray-600 hover:bg-gray-200'}
              `}
            >
              <span className={isSinhala ? 'text-[#1A7A6E]' : ''}>{tab}</span>
              {isActive && (
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${isSinhala ? 'bg-[#1A7A6E]' : 'bg-[#C9973A]'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Ribbon Groups — clean, no overflow hack */}
      <div className="h-[92px] bg-white overflow-x-auto no-scrollbar">
        <div className="flex h-[92px] items-center w-max px-2">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Ribbon;

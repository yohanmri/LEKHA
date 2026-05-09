import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X } from 'lucide-react';

const VirtualKeyboard: React.FC = () => {
  const { toggleKeyboard } = useAppStore();

  const keys = [
    ['ක', 'කා', 'කි', 'කී', 'කු', 'කූ', 'කෙ', 'කේ', 'කො', 'කෝ'],
    ['ග', 'ගා', 'ගි', 'ගී', 'ගු', 'ගූ', 'ගෙ', 'ගේ', 'ගො', 'ගෝ'],
    ['ච', 'චා', 'චි', 'චී', 'චු', 'චූ', 'චෙ', 'චේ', 'චො', 'චෝ'],
    // ... more keys
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white border border-gray-300 shadow-2xl rounded-lg p-4 z-[100] w-[600px] animate-slide-up">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <span className="text-sm font-bold text-[#C9973A]">සිංහල අතථ්‍ය යතුරුපුවරුව</span>
        <button onClick={toggleKeyboard} className="p-1 hover:bg-gray-100 rounded text-gray-500">
          <X size={18} />
        </button>
      </div>
      
      <div className="grid gap-2">
        {keys.map((row, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {row.map((key) => (
              <button 
                key={key} 
                className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center text-lg hover:bg-gray-50 hover:border-[#C9973A] transition-colors"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] text-gray-400">
        <span>Press keys to insert into editor</span>
        <span>Standard Wijesekera Layout</span>
      </div>
    </div>
  );
};

export default VirtualKeyboard;

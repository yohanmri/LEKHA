import React from 'react';
import TopBar from './TopBar';
import Ribbon from './Ribbon';
import LeftPanel from './LeftPanel';
import EditorArea from './EditorArea';
import StatusBar from './StatusBar';
import VirtualKeyboard from './VirtualKeyboard';
import SidePanelManager from '../panels/SidePanelManager';
import { useAppStore } from '../../store/useAppStore';
import { EditorProvider } from '../../hooks/useEditorContext';

const AppShell: React.FC = () => {
  const { isKeyboardOpen } = useAppStore();

  return (
    <EditorProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#F3F2F1] text-[#323130] font-sans">
        <TopBar />
        <Ribbon />
        
        <div className="flex-1 flex overflow-hidden relative">
          <LeftPanel />
          <EditorArea />
          <SidePanelManager />
          
          {isKeyboardOpen && <VirtualKeyboard />}
        </div>

        <StatusBar />
      </div>
    </EditorProvider>
  );
};

export default AppShell;

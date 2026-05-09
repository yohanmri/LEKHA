import React from 'react';
import TopBar from './TopBar';
import Ribbon from './Ribbon';
import LeftPanel from './LeftPanel';
import EditorArea from './EditorArea';
import StatusBar from './StatusBar';
import VirtualKeyboard from './VirtualKeyboard';
import SidePanelManager from '../panels/SidePanelManager';
import TemplatesModal from '../modals/TemplatesModal';
import { useAppStore } from '../../store/useAppStore';
import { EditorProvider } from '../../hooks/useEditorContext';

const AppShell: React.FC = () => {
  const { isKeyboardOpen } = useAppStore();

  return (
    <EditorProvider>
      {/* Outermost: full screen, flex column, nothing scrolls at this level */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#F3F2F1', color: '#323130' }}>
        
        {/* STICKY HEADER ZONE — never moves */}
        <div style={{ flexShrink: 0, position: 'relative', zIndex: 200 }}>
          <TopBar />
          <Ribbon />
        </div>

        {/* BODY — scrollable area below the header */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          <LeftPanel />
          <EditorArea />
          <SidePanelManager />
          {isKeyboardOpen && <VirtualKeyboard />}
        </div>

        {/* STATUS BAR — always at bottom */}
        <div style={{ flexShrink: 0, zIndex: 200 }}>
          <StatusBar />
        </div>
      </div>

      <TemplatesModal />
    </EditorProvider>
  );
};

export default AppShell;

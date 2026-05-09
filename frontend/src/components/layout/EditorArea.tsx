import React, { useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import PageEditor from './PageEditor';
import PageSeparator from './PageSeparator';

const EditorArea: React.FC = () => {
  const { zoomLevel, pages, addPage } = useAppStore();

  // Scale wrapper
  const scale = zoomLevel / 100;

  return (
    <div
      className="flex-1 overflow-y-auto bg-[#EDEBE9] no-scrollbar"
      style={{ padding: '32px 32px' }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {pages.map((page, index) => (
          <React.Fragment key={page.id}>
            <PageEditor pageId={page.id} index={index} />
            {index === pages.length - 1 && <PageSeparator index={index} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EditorArea;

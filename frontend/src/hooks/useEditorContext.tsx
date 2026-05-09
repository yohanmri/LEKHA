import React, { createContext, useContext, useRef, type ReactNode } from 'react';
import type { Editor } from '@tiptap/react';

interface EditorContextValue {
  editorRef: React.MutableRefObject<Editor | null>;
  getEditor: () => Editor | null;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const editorRef = useRef<Editor | null>(null);

  const getEditor = () => editorRef.current;

  return (
    <EditorContext.Provider value={{ editorRef, getEditor }}>
      {children}
    </EditorContext.Provider>
  );
};

/** Hook to access the shared TipTap editor instance from any component */
export const useEditorContext = (): EditorContextValue => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditorContext must be used inside <EditorProvider>');
  return ctx;
};

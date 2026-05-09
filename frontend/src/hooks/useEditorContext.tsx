import React, { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import type { Editor } from '@tiptap/react';

interface EditorContextValue {
  editorRef: React.MutableRefObject<Editor | null>;
  getEditor: () => Editor | null;
  editorsMap: React.MutableRefObject<Record<string, Editor>>;
  registerEditor: (id: string, editor: Editor) => void;
  unregisterEditor: (id: string) => void;
  setActiveEditor: (id: string) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const editorRef = useRef<Editor | null>(null);
  const editorsMap = useRef<Record<string, Editor>>({});
  
  const registerEditor = (id: string, editor: Editor) => {
    editorsMap.current[id] = editor;
    if (!editorRef.current) {
      editorRef.current = editor; // Default to first registered
    }
  };

  const unregisterEditor = (id: string) => {
    const wasActive = editorRef.current === editorsMap.current[id];
    delete editorsMap.current[id];
    if (wasActive) {
      editorRef.current = Object.values(editorsMap.current)[0] || null;
    }
  };

  const setActiveEditor = (id: string) => {
    if (editorsMap.current[id]) {
      editorRef.current = editorsMap.current[id];
    }
  };

  const getEditor = () => editorRef.current;

  return (
    <EditorContext.Provider value={{ 
      editorRef, getEditor, editorsMap, registerEditor, unregisterEditor, setActiveEditor 
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = (): EditorContextValue => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditorContext must be used inside <EditorProvider>');
  return ctx;
};

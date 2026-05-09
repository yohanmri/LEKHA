import React, { useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CharacterCount } from '@tiptap/extension-character-count';
import { ChevronUp, ChevronDown, Copy, Trash2, PlusSquare } from 'lucide-react';
import { useAppStore, MARGIN_PRESETS } from '../../store/useAppStore';
import { useEditorContext } from '../../hooks/useEditorContext';
import { transliterate } from '../../services/singlishEngine';

interface PageEditorProps {
  pageId: string;
  index: number;
}

let singlishBuffer = '';

const PageEditor: React.FC<PageEditorProps> = ({ pageId, index }) => {
  const {
    pages, updatePageTitle, updatePageContent, deletePage, duplicatePage, movePage, addPage,
    fontLang, fontFamily, fontSize,
    pageSize, orientation, marginPreset,
    pageBackgroundColor, pageBorderStyle, pageBorderColor, pageBorderWidth,
    globalHeader, setGlobalHeader, globalFooter, setGlobalFooter, showPageNumbers
  } = useAppStore();
  
  const { registerEditor, unregisterEditor, setActiveEditor } = useEditorContext();
  const pageData = pages.find(p => p.id === pageId);
  const isSinhala = fontLang === 'sinhala';
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canvasW = orientation === 'landscape' ? pageSize.heightPx : pageSize.widthPx;
  const canvasH = orientation === 'landscape' ? pageSize.widthPx : pageSize.heightPx;
  const margins = MARGIN_PRESETS[marginPreset];

  const editor = useEditor({
    extensions: [
      StarterKit,
      FontFamily,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Subscript,
      Superscript,
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: 'මෙතැන ටයිප් කරන්න...' }),
      CharacterCount,
    ],
    content: pageData?.content || '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none text-[#323130] leading-[1.9] min-h-[100px]',
      },
    },
    onFocus: () => {
      setActiveEditor(pageId);
    },
    onUpdate: ({ editor }) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        updatePageContent(pageId, editor.getHTML());
      }, 500);
    },
  });

  useEffect(() => {
    if (editor) registerEditor(pageId, editor);
    return () => unregisterEditor(pageId);
  }, [editor, pageId, registerEditor, unregisterEditor]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    editor.chain().focus().setFontFamily(fontFamily).run();
  }, [editor, fontFamily]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!editor || editor.isDestroyed) return;
    const isMod = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;

    if (isMod && isShift && e.key === 'Enter') {
      e.preventDefault();
      addPage(index);
      return;
    }

    if (!isSinhala) return;
    if (isMod && !isShift) return;

    if (['Enter', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape'].includes(e.key)) {
      singlishBuffer = ''; 
      return;
    }
    if (e.key === 'Delete') {
      singlishBuffer = '';
      return;
    }
    if (e.key === 'Backspace') {
      if (singlishBuffer.length > 0) {
        e.preventDefault();
        const currentResult = transliterate(singlishBuffer);
        singlishBuffer = singlishBuffer.slice(0, -1);
        const newResult = transliterate(singlishBuffer);
        if (currentResult.length > 0) {
          editor.commands.deleteRange({ from: editor.state.selection.from - currentResult.length, to: editor.state.selection.from });
        }
        if (newResult.length > 0) editor.commands.insertContent(newResult);
      }
      return;
    }
    if (e.key.length !== 1) return;

    e.preventDefault();
    const flushChars = [' ', '.', ',', '!', '?', '(', ')', ':', ';', '"', "'", '[', ']', '{', '}'];
    if (flushChars.includes(e.key)) {
      editor.commands.insertContent(e.key);
      singlishBuffer = '';
    } else {
      const prevResult = transliterate(singlishBuffer);
      singlishBuffer += e.key;
      const newResult = transliterate(singlishBuffer);
      if (prevResult.length > 0) {
        editor.commands.deleteRange({ from: editor.state.selection.from - prevResult.length, to: editor.state.selection.from });
      }
      editor.commands.insertContent(newResult);
    }
  }, [isSinhala, editor, index, addPage]);

  if (!pageData) return null;

  return (
    <div id={pageId} className="flex flex-col items-center mb-4 w-full" onKeyDown={(e) => handleKeyDown(e.nativeEvent)}>
      
      {/* Canva-style Page Toolbar (Detached) */}
      <div className="flex items-center justify-between bg-[#F8F9FA] px-3 py-1.5 rounded-t shadow-sm mb-1" style={{ width: canvasW }}>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-gray-800">Page {index + 1}</span>
          {pageData.title && <span className="text-gray-400 text-xs">-</span>}
          <input 
            type="text" 
            value={pageData.title}
            onChange={(e) => updatePageTitle(pageId, e.target.value)}
            placeholder="Add page title"
            className="bg-transparent text-[13px] text-gray-500 font-medium border-none outline-none focus:text-gray-800 placeholder-gray-400 w-48"
          />
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <button onClick={() => movePage(pageId, 'up')} className="p-1 hover:bg-gray-200 rounded" title="Move up"><ChevronUp size={16} strokeWidth={2.5} /></button>
          <button onClick={() => movePage(pageId, 'down')} className="p-1 hover:bg-gray-200 rounded" title="Move down"><ChevronDown size={16} strokeWidth={2.5} /></button>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button onClick={() => duplicatePage(pageId)} className="p-1 hover:bg-gray-200 rounded" title="Duplicate"><Copy size={15} strokeWidth={2} /></button>
          <button onClick={() => deletePage(pageId)} className="p-1 hover:bg-gray-200 rounded" title="Delete"><Trash2 size={15} strokeWidth={2} /></button>
          <button onClick={() => addPage(index)} className="p-1 hover:bg-gray-200 rounded" title="Add page"><PlusSquare size={16} strokeWidth={2.5} /></button>
        </div>
      </div>

      {/* Page Canvas */}
      <div
        className="bg-white shadow-lg relative flex flex-col"
        onClick={() => editor?.commands.focus()}
        style={{
          width: canvasW,
          minHeight: canvasH,
          paddingTop: margins.top,
          paddingBottom: margins.bottom,
          paddingLeft: margins.left,
          paddingRight: margins.right,
          fontFamily: fontFamily,
          fontSize: `${fontSize}pt`,
          backgroundColor: pageBackgroundColor,
          borderStyle: pageBorderStyle,
          borderColor: pageBorderColor,
          borderWidth: pageBorderStyle !== 'none' ? pageBorderWidth : '0px',
        }}
      >
        {/* Header Display */}
        {globalHeader && (
          <div className="absolute left-0 right-0 top-0 px-12 pt-4 pointer-events-none">
            <div className="w-full text-center text-[10px] text-gray-400 font-sans uppercase tracking-widest border-b border-transparent">
              {globalHeader}
            </div>
          </div>
        )}

        {/* TipTap Editor */}
        <div className="flex-1 cursor-text">
          <EditorContent editor={editor} />
        </div>

        {/* Footer & Page Number Display */}
        <div className="absolute left-0 right-0 bottom-0 px-12 pb-4 flex justify-between items-end pointer-events-none">
          <div className="flex-1 text-left text-[10px] text-gray-400 font-sans border-t border-transparent">
            {globalFooter}
          </div>
          {showPageNumbers && (
            <div className="text-[10px] text-gray-500 font-sans ml-4">
              {index + 1}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageEditor;

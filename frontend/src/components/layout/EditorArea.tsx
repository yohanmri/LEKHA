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
import { useAppStore } from '../../store/useAppStore';
import { useEditorContext } from '../../hooks/useEditorContext';
import { transliterate } from '../../services/singlishEngine';
import { MARGIN_PRESETS } from '../../store/useAppStore';

// Singlish input buffer
let singlishBuffer = '';

const EditorArea: React.FC = () => {
  const {
    setSaveStatus, fontLang, fontFamily, fontSize, zoomLevel,
    pageSize, orientation, marginPreset,
  } = useAppStore();
  const { editorRef } = useEditorContext();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSinhala = fontLang === 'sinhala';

  // Compute actual canvas dimensions from page size + orientation
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
    content: '<p>ලේඛා වෙත සාදරයෙන් පිළිගනිමු!</p>',
    editorProps: {
      attributes: {
        class: 'focus:outline-none text-[#323130] leading-[1.9]',
      },
    },
    onUpdate: () => {
      setSaveStatus('unsaved');
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('saving');
        setTimeout(() => setSaveStatus('saved'), 800);
      }, 1500);
    },
  });

  // Store editor ref globally so ribbon can access it
  useEffect(() => {
    if (editor) editorRef.current = editor;
  }, [editor, editorRef]);

  // Apply font family whenever store changes
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    editor.chain().focus().setFontFamily(fontFamily).run();
  }, [editor, fontFamily]);

  // Singlish keydown handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!editor || editor.isDestroyed) return;
      
      const isMod = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;

      // ── Word Processor Shortcuts ──
      if (isMod && isShift && (e.key === '>' || e.key === '.')) {
        e.preventDefault();
        const currentSize = parseInt(fontSize);
        const newSize = String(Math.min(currentSize + 2, 72));
        useAppStore.getState().setFontSize(newSize);
        editor.chain().focus().setMark('textStyle', { fontSize: `${newSize}pt` }).run();
        return;
      }
      if (isMod && isShift && (e.key === '<' || e.key === ',')) {
        e.preventDefault();
        const currentSize = parseInt(fontSize);
        const newSize = String(Math.max(currentSize - 2, 8));
        useAppStore.getState().setFontSize(newSize);
        editor.chain().focus().setMark('textStyle', { fontSize: `${newSize}pt` }).run();
        return;
      }

      if (!isSinhala) return;
      
      // Basic navigation and control keys pass through
      if (isMod && !isShift) return;
      
      // On navigation or enter/tab, we commit the current buffer
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
            editor.commands.deleteRange({ 
              from: editor.state.selection.from - currentResult.length, 
              to: editor.state.selection.from 
            });
          }
          if (newResult.length > 0) {
            editor.commands.insertContent(newResult);
          }
          return;
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
          editor.commands.deleteRange({ 
            from: editor.state.selection.from - prevResult.length, 
            to: editor.state.selection.from 
          });
        }
        editor.commands.insertContent(newResult);
      }
    },
    [isSinhala, editor, fontSize]
  );

  // Attach / detach keydown listener
  useEffect(() => {
    const el = document.querySelector('.ProseMirror') as HTMLElement | null;
    if (!el) return;
    el.addEventListener('keydown', handleKeyDown as EventListener);
    return () => el.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [handleKeyDown, editor]);

  const scale = zoomLevel / 100;

  return (
    <div
      className="flex-1 overflow-y-auto bg-[#EDEBE9] no-scrollbar"
      style={{ padding: '32px 32px' }}
    >
      {/* Scale wrapper — shrinks/grows around the canvas */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          // compensate negative space when zoomed out
          marginBottom: scale < 1 ? `${-(canvasH * (1 - scale))}px` : `${32 * scale}px`,
          marginTop: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* The page canvas */}
        <div
          className="bg-white shadow-lg"
          style={{
            width: canvasW,
            minHeight: canvasH,
            paddingTop: margins.top,
            paddingBottom: margins.bottom,
            paddingLeft: margins.left,
            paddingRight: margins.right,
            fontFamily: fontFamily,
            fontSize: `${fontSize}pt`,
            boxSizing: 'border-box',
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default EditorArea;

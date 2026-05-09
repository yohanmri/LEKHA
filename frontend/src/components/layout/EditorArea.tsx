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

// Singlish input buffer
let singlishBuffer = '';

const EditorArea: React.FC = () => {
  const { setSaveStatus, fontLang, fontFamily, fontSize, zoomLevel } = useAppStore();
  const { editorRef } = useEditorContext();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSinhala = fontLang === 'sinhala';

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
      Image,
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
        class: 'focus:outline-none min-h-[1056px] text-[#323130] leading-[1.9]',
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
        setFontSize(newSize);
        editor.chain().focus().setMark('textStyle', { fontSize: `${newSize}pt` }).run();
        return;
      }
      if (isMod && isShift && (e.key === '<' || e.key === ',')) {
        e.preventDefault();
        const currentSize = parseInt(fontSize);
        const newSize = String(Math.max(currentSize - 2, 8));
        setFontSize(newSize);
        editor.chain().focus().setMark('textStyle', { fontSize: `${newSize}pt` }).run();
        return;
      }

      if (!isSinhala) return;
      
      // Basic navigation and control keys pass through
      if (isMod && !isShift) return; // Allow Mod+B, Mod+I, etc.
      
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
          
          // 1. How many characters does the CURRENT buffer represent in the editor?
          const currentResult = transliterate(singlishBuffer);
          
          // 2. Remove last char from singlish buffer
          singlishBuffer = singlishBuffer.slice(0, -1);
          
          // 3. How many characters does the NEW buffer represent?
          const newResult = transliterate(singlishBuffer);
          
          // 4. Delete the old result and insert the new one
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

      // We only intercept single printable characters
      if (e.key.length !== 1) return;

      e.preventDefault();
      
      const flushChars = [' ', '.', ',', '!', '?', '(', ')', ':', ';', '"', "'", '[', ']', '{', '}'];
      
      if (flushChars.includes(e.key)) {
        editor.commands.insertContent(e.key);
        singlishBuffer = '';
      } else {
        // Real-time update:
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
    [isSinhala, editor]
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
    <div className="flex-1 overflow-y-auto bg-[#EDEBE9] p-8 no-scrollbar scroll-smooth">
      <div
        className="mx-auto"
        style={{
          width: 816,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginBottom: scale < 1 ? `${-(816 * (1 - scale))}px` : 0,
        }}
      >
        <div
          className="bg-white shadow-lg mx-auto"
          style={{
            padding: '96px',
            fontFamily: fontFamily,
            fontSize: `${fontSize}pt`,
            minHeight: 1056,
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default EditorArea;

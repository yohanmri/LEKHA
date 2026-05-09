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
import lekhaApi from '../../api/lekhaApi';

// Singlish input buffer
let singlishBuffer = '';
let singlishTimer: ReturnType<typeof setTimeout> | null = null;

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
    async (e: KeyboardEvent) => {
      if (!isSinhala || !editor || editor.isDestroyed) return;
      // Only intercept printable chars (not Ctrl/Alt/Meta combos)
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1) return;

      e.preventDefault();
      singlishBuffer += e.key;

      // Clear any pending debounce
      if (singlishTimer) clearTimeout(singlishTimer);

      // Trigger on space/punctuation immediately
      const flushNow = [' ', '.', ',', '!', '?', '\n', '(', ')', ':', ';'].includes(e.key);

      const flush = async () => {
        const buf = singlishBuffer;
        singlishBuffer = '';
        singlishTimer = null;
        if (!buf) return;

        // Check if it's just a special char
        if (flushNow && buf.length === 1) {
          editor.commands.insertContent(buf);
          return;
        }

        try {
          const toTransliterate = flushNow ? buf.slice(0, -1) : buf;
          const suffix = flushNow ? buf.slice(-1) : '';

          if (toTransliterate) {
            const { data } = await lekhaApi.transliterate(toTransliterate);
            editor.commands.insertContent(data.result + suffix);
          } else if (suffix) {
            editor.commands.insertContent(suffix);
          }
        } catch {
          // Fallback: insert raw singlish text
          editor.commands.insertContent(buf);
        }
      };

      if (flushNow) {
        await flush();
      } else {
        singlishTimer = setTimeout(flush, 300);
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

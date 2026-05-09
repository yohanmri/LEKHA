import React from 'react';
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

const EditorArea: React.FC = () => {
  const { setSaveStatus } = useAppStore();
  const saveTimeoutRef = React.useRef<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      FontFamily,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Subscript,
      Superscript,
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: 'මෙතැන ටයිප් කරන්න...',
      }),
      CharacterCount,
    ],
    content: '<p>ලේඛා වෙත සාදරයෙන් පිළිගනිමු!</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[1056px] w-[816px] bg-white shadow-lg mx-auto p-[96px] text-[#323130] leading-[1.9] font-["Noto_Sans_Sinhala"]',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('unsaved');
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('saving');
        // Mock API call to represent backend saving
        setTimeout(() => {
          setSaveStatus('saved');
        }, 800);
      }, 1500);
    },
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#EDEBE9] p-8 no-scrollbar scroll-smooth">
      <div className="max-w-4xl mx-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default EditorArea;

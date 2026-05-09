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
import { Link } from '@tiptap/extension-link';
import { ChevronUp, ChevronDown, Copy, Trash2, PlusSquare } from 'lucide-react';
import { useAppStore, MARGIN_PRESETS } from '../../store/useAppStore';
import { useEditorContext } from '../../hooks/useEditorContext';
import { transliterate } from '../../services/singlishEngine';

interface PageEditorProps {
  pageId: string;
  index: number;
}

// NOTE: singlishBuffer is now a per-editor ref — see useRef below

const toRoman = (num: number): string => {
  if (num <= 0) return num.toString();
  const roman = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let str = '';
  for (let i of Object.keys(roman) as (keyof typeof roman)[]) {
    let q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return str.toLowerCase();
};

const toAlpha = (num: number): string => {
  if (num <= 0) return num.toString();
  let str = '';
  while (num > 0) {
    let mod = (num - 1) % 26;
    str = String.fromCharCode(97 + mod) + str;
    num = Math.floor((num - mod) / 26);
  }
  return str;
};

const PageEditor: React.FC<PageEditorProps> = ({ pageId, index }) => {
  const {
    pages, updatePageTitle, updatePageContent, deletePage, duplicatePage, movePage, addPage,
    fontLang, fontFamily, fontSize,
    pageSize, orientation, marginPreset,
    pageBackgroundColor, pageBorderStyle, pageBorderColor, pageBorderWidth,
    headerFormat, footerFormat, pageNumberConfig
  } = useAppStore();
  
  const { registerEditor, unregisterEditor, setActiveEditor, editorsMap } = useEditorContext();
  const pageData = pages.find(p => p.id === pageId);
  const isSinhala = fontLang === 'sinhala';
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const singlishBufferRef = useRef(''); // Per-instance buffer — fixes multi-page typing bug
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  const canvasW = orientation === 'landscape' ? pageSize.heightPx : pageSize.widthPx;
  const canvasH = orientation === 'landscape' ? pageSize.widthPx : pageSize.heightPx;
  const margins = MARGIN_PRESETS[marginPreset];
  const maxContentHeight = canvasH - margins.top - margins.bottom;

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
      Link.configure({ openOnClick: false, HTMLAttributes: { target: null } }),
    ],
    content: pageData?.content || '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none text-[#323130] leading-[1.9] min-h-[100px]',
      },
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement;
        const anchor = target.closest('a');
        if (anchor) {
          const href = anchor.getAttribute('href');
          if (href && href.startsWith('#page-')) {
            event.preventDefault();
            event.stopPropagation();
            
            const targetId = href.substring(1);
            const lastDash = targetId.lastIndexOf('-h');
            if (lastDash !== -1) {
              const targetPageId = targetId.substring(0, lastDash);
              const hIndex = parseInt(targetId.substring(lastDash + 2), 10);
              
              const pageEl = document.getElementById(targetPageId);
              if (pageEl) pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              
              const targetEditor = editorsMap.current[targetPageId];
              if (targetEditor) {
                targetEditor.commands.focus();
                const headings = targetEditor.view.dom.querySelectorAll('h1, h2, h3, h4, h5, h6');
                if (headings[hIndex]) {
                  headings[hIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }
            }
            return true;
          }
        }
        return false;
      }
    },
    onFocus: () => {
      setActiveEditor(pageId);
    },
    onUpdate: ({ editor }) => {
      // Overflow detection: compare the ProseMirror DOM scrollHeight vs available content area
      const dom = editor.view.dom;
      if (dom.scrollHeight > maxContentHeight) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }

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
    if (isMod && !isShift) {
      if (e.key === 'a') {
        // Let TipTap handle select all, but clear buffer
        singlishBufferRef.current = '';
      }
      return;
    }

    if (['Enter', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape'].includes(e.key)) {
      singlishBufferRef.current = ''; 
      return;
    }
    if (e.key === 'Delete') {
      singlishBufferRef.current = '';
      return;
    }
    if (e.key === 'Backspace') {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        singlishBufferRef.current = '';
        return;
      }
      if (singlishBufferRef.current.length > 0) {
        e.preventDefault();
        const currentResult = transliterate(singlishBufferRef.current);
        singlishBufferRef.current = singlishBufferRef.current.slice(0, -1);
        const newResult = transliterate(singlishBufferRef.current);
        if (currentResult.length > 0) {
          const deleteFrom = Math.max(0, editor.state.selection.from - currentResult.length);
          editor.commands.deleteRange({ from: deleteFrom, to: editor.state.selection.from });
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
      singlishBufferRef.current = '';
    } else {
      const prevResult = transliterate(singlishBufferRef.current);
      singlishBufferRef.current += e.key;
      const newResult = transliterate(singlishBufferRef.current);
      if (prevResult.length > 0) {
        editor.commands.deleteRange({ from: editor.state.selection.from - prevResult.length, to: editor.state.selection.from });
      }
      editor.commands.insertContent(newResult);
    }
  }, [isSinhala, editor, index, addPage]);

  const handleOverflow = useCallback(() => {
    if (!editor) return;
    addPage(index);
  }, [index, addPage, editor]);

  if (!pageData) return null;

  const getPageNumberDisplay = () => {
    if (!pageNumberConfig.show) return null;
    
    const absolutePage = index + 1;
    let rule = pageNumberConfig.rules?.find(r => 
      absolutePage >= r.startPage && (!r.endPage || absolutePage <= r.endPage)
    );

    // If there are rules defined but this page falls outside all of them, don't show a number.
    if (!rule && pageNumberConfig.rules?.length > 0) return null;

    let displayStr = absolutePage.toString();
    if (rule) {
      const logicalNumber = rule.startAt + (absolutePage - rule.startPage);
      if (rule.style === 'roman') displayStr = toRoman(logicalNumber);
      else if (rule.style === 'alpha') displayStr = toAlpha(logicalNumber);
      else displayStr = logicalNumber.toString();
    }

    let posClasses = "absolute ";
    if (pageNumberConfig.verticalPosition === 'top') posClasses += "top-4 ";
    else posClasses += "bottom-4 ";

    if (pageNumberConfig.horizontalAlign === 'left') posClasses += "left-12 text-left";
    else if (pageNumberConfig.horizontalAlign === 'right') posClasses += "right-12 text-right";
    else posClasses += "left-0 right-0 text-center";

    return (
      <div 
        className={`${posClasses} z-10 pointer-events-none`}
        style={{ 
          color: pageNumberConfig.color,
          fontFamily: pageNumberConfig.fontFamily,
          fontSize: `${pageNumberConfig.fontSize}pt`,
          fontWeight: pageNumberConfig.bold ? 'bold' : 'normal',
          fontStyle: pageNumberConfig.italic ? 'italic' : 'normal',
        }}
      >
        {displayStr}
      </div>
    );
  };

  return (
    <div id={pageId} className="flex flex-col items-center mb-4 w-full" onKeyDown={(e) => handleKeyDown(e.nativeEvent)}>
      
      {/* Canva-style Page Toolbar (Detached) */}
      <div className="flex items-center justify-between bg-[#F8F9FA] px-3 py-1.5 rounded-t shadow-sm mb-1" style={{ width: canvasW }}>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-gray-800">Page {index + 1}</span>
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

      <div
        className={`bg-white shadow-lg relative flex flex-col overflow-hidden transition-shadow duration-300 ${isOverflowing ? 'ring-2 ring-red-500 ring-offset-4 ring-offset-red-50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''}`}
        onClick={() => editor?.commands.focus()}
        style={{
          width: canvasW,
          height: canvasH,
          maxHeight: canvasH,
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
        {headerFormat.text && (
          <div className="absolute left-0 right-0 top-0 px-12 pt-4 pointer-events-none">
            <div 
              className="w-full border-b border-transparent"
              style={{
                fontFamily: headerFormat.fontFamily,
                fontSize: `${headerFormat.fontSize}pt`,
                color: headerFormat.color,
                textAlign: headerFormat.align,
                fontWeight: headerFormat.bold ? 'bold' : 'normal',
                fontStyle: headerFormat.italic ? 'italic' : 'normal',
              }}
            >
              {headerFormat.text}
            </div>
          </div>
        )}

        {/* TipTap Editor */}
        <div className="flex-1 cursor-text">
          <EditorContent editor={editor} />
        </div>

        {/* Footer Display */}
        {footerFormat.text && (
          <div className="absolute left-0 right-0 bottom-0 px-12 pb-4 flex justify-between items-end pointer-events-none">
            <div 
              className="flex-1 border-t border-transparent"
              style={{
                fontFamily: footerFormat.fontFamily,
                fontSize: `${footerFormat.fontSize}pt`,
                color: footerFormat.color,
                textAlign: footerFormat.align,
                fontWeight: footerFormat.bold ? 'bold' : 'normal',
                fontStyle: footerFormat.italic ? 'italic' : 'normal',
              }}
            >
              {footerFormat.text}
            </div>
          </div>
        )}

        {/* Page Number Overlay */}
        {getPageNumberDisplay()}

        {/* Smart Overflow Warning */}
        {isOverflowing && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-red-50 to-transparent flex items-center justify-center pointer-events-none z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleOverflow();
              }}
              className="pointer-events-auto flex items-center gap-2 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg hover:bg-red-700 transition-all transform hover:scale-105"
            >
              <PlusSquare size={14} /> Page Overflowing: Add New Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageEditor;

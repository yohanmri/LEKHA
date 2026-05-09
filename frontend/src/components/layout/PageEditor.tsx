import React, { useEffect, useCallback, useRef, useState } from 'react';
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
import { suggestWord } from '../../services/dialectConverter';

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

const EDITOR_EXTENSIONS = [
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
];

const PageEditor: React.FC<PageEditorProps> = ({ pageId, index }) => {
  const {
    pages, updatePageTitle, updatePageContent, deletePage, duplicatePage, movePage, addPage, setPages,
    fontLang, fontFamily, fontSize,
    pageSize, orientation, marginPreset,
    pageBackgroundColor, pageBorderStyle, pageBorderColor, pageBorderWidth,
    headerFormat, footerFormat, pageNumberConfig,
    dialectAutoConvert,
  } = useAppStore();

  const { registerEditor, unregisterEditor, setActiveEditor, editorsMap } = useEditorContext();
  const pageData = pages.find(p => p.id === pageId);
  const isSinhala = fontLang === 'sinhala';
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const singlishBufferRef = useRef(''); // Per-instance buffer — fixes multi-page typing bug
  const isFlowingRef = useRef(false); // Guard against recursive overflow triggers

  // ── Dialect ghost-text suggestion state ─────────────────────────────────
  const [dialectSuggestion, setDialectSuggestion] = useState<string | null>(null);
  const dialectCurrentWordRef = useRef(''); // The word at cursor when suggestion was made
  const dialectFromRef = useRef(0);         // Start pos of that word in the document
  // Use a ref so the onUpdate closure always reads the latest value without re-creating the editor
  const dialectAutoConvertRef = useRef(dialectAutoConvert);
  useEffect(() => { dialectAutoConvertRef.current = dialectAutoConvert; }, [dialectAutoConvert]);

  const canvasW = orientation === 'landscape' ? pageSize.heightPx : pageSize.widthPx;
  const canvasH = orientation === 'landscape' ? pageSize.widthPx : pageSize.heightPx;
  const margins = MARGIN_PRESETS[marginPreset];
  const maxContentHeight = canvasH - margins.top - margins.bottom;

  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
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
      // ─── Overflow Detection ─────────────────────────────────────────────────
      // Guard: prevent re-entrant calls when we are already moving content
      if (isFlowingRef.current) return;

      // The editor's ProseMirror root element gives us the actual rendered height
      // of all content, regardless of the parent page clip.
      const dom = editor.view.dom as HTMLElement;
      const contentHeight = dom.scrollHeight;

      if (contentHeight > maxContentHeight) {
        const lastNode = editor.state.doc.lastChild;
        if (!lastNode) return;

        // Get the HTML of the last block node from the live DOM for exact fidelity
        const lastDomEl = dom.lastElementChild;
        const nodeHtml = lastDomEl ? lastDomEl.outerHTML : '';
        if (!nodeHtml) return;

        const nodeSize = lastNode.nodeSize;
        const deleteFrom = editor.state.doc.content.size - nodeSize;
        const deleteTo = editor.state.doc.content.size;

        // Track whether the cursor was in the node being moved
        const sel = editor.state.selection;
        const isSelectionInMovedNode = sel.from >= deleteFrom;
        const offsetInNode = isSelectionInMovedNode ? sel.from - deleteFrom : 0;

        // Set guard BEFORE making any editor changes
        isFlowingRef.current = true;

        try {
          // Delete last block from this editor
          editor.commands.deleteRange({ from: deleteFrom, to: deleteTo });

          const nextPageIndex = index + 1;

          if (nextPageIndex < pages.length) {
            // ── Next page already exists: prepend the node ──────────────────
            const nextPageId = pages[nextPageIndex].id;
            const nextEditor = editorsMap.current[nextPageId];

            if (nextEditor && !nextEditor.isDestroyed) {
              // Insert at position 1 (start of document body in ProseMirror)
              nextEditor.commands.insertContentAt(1, nodeHtml);
              if (isSelectionInMovedNode) {
                setTimeout(() => {
                  if (!nextEditor.isDestroyed) {
                    nextEditor.commands.focus();
                    nextEditor.commands.setTextSelection(offsetInNode + 1);
                  }
                  isFlowingRef.current = false;
                }, 30);
                return;
              }
            } else {
              // Editor not mounted yet: update store content directly
              const existing = pages[nextPageIndex].content || '';
              updatePageContent(nextPageId, nodeHtml + existing);
            }
          } else {
            // ── No next page: create one ────────────────────────────────────
            const newId = `page-${Date.now()}`;
            const newPage = { id: newId, content: nodeHtml, title: '' };
            const newPages = [...pages];
            newPages.splice(index + 1, 0, newPage);
            setPages(newPages);

            if (isSelectionInMovedNode) {
              // Focus new page once it mounts and registers
              const focusInterval = setInterval(() => {
                const newEditor = editorsMap.current[newId];
                if (newEditor && !newEditor.isDestroyed) {
                  clearInterval(focusInterval);
                  newEditor.commands.focus();
                  newEditor.commands.setTextSelection(offsetInNode + 1);
                  isFlowingRef.current = false;
                }
              }, 20);
              // Safety: clear after 1s regardless
              setTimeout(() => {
                clearInterval(focusInterval);
                isFlowingRef.current = false;
              }, 1000);
              return;
            }
          }
        } finally {
          // Only release guard here if we didn't return early above
          isFlowingRef.current = false;
        }
      }

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        updatePageContent(pageId, editor.getHTML());
      }, 500);

      // ── Dialect auto-suggest ghost text ─────────────────────────────────
      if (dialectAutoConvertRef.current) {
        const { from } = editor.state.selection;
        const textBefore = editor.state.doc.textBetween(
          Math.max(0, from - 80), from, '\n'
        );
        const wordMatch = textBefore.match(/\S+$/);
        const currentWord = wordMatch ? wordMatch[0] : '';

        if (currentWord.length >= 2) {
          const suggestion = suggestWord(currentWord);
          if (suggestion) {
            dialectCurrentWordRef.current = currentWord;
            dialectFromRef.current = from - currentWord.length;
            setDialectSuggestion(suggestion);
          } else {
            setDialectSuggestion(null);
          }
        } else {
          setDialectSuggestion(null);
        }
      } else {
        setDialectSuggestion(null);
      }

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

    // ── Tab: accept dialect suggestion (fires before Singlish block) ───────────
    if (e.key === 'Tab' && dialectSuggestion) {
      e.preventDefault();
      const wordLen = dialectCurrentWordRef.current.length;
      const from = dialectFromRef.current;
      const to = from + wordLen;
      editor.chain().focus()
        .deleteRange({ from, to })
        .insertContentAt(from, dialectSuggestion + ' ')
        .run();
      setDialectSuggestion(null);
      singlishBufferRef.current = '';
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
        className="bg-white shadow-lg relative flex flex-col overflow-hidden transition-shadow duration-300"
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

        {/* TipTap Editor + Dialect Ghost Text */}
        <div className="flex-1 cursor-text relative">
          <EditorContent editor={editor} />
          {/* Ghost text suggestion overlay — appears inline after cursor word */}
          {dialectSuggestion && (
            <div
              className="pointer-events-none absolute inset-0 flex items-start"
              style={{ paddingTop: 0 }}
            >
              {/* We use a transparent sibling trick: render a hidden mirror of the
                  existing text, then append the ghost span. For simplicity we show
                  a floating pill near the bottom of the editor as a suggestion hint. */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '0px',
                  right: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '2px 4px',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    fontFamily,
                    fontSize: `${fontSize}pt`,
                    color: 'rgba(124,58,237,0.55)',
                    background: 'rgba(237,233,254,0.75)',
                    border: '1px solid rgba(124,58,237,0.25)',
                    borderRadius: '4px',
                    padding: '1px 6px',
                    letterSpacing: '0.01em',
                    userSelect: 'none',
                    backdropFilter: 'blur(4px)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {dialectSuggestion}
                  <span style={{ fontSize: '9px', marginLeft: '6px', opacity: 0.7, color: '#7C3AED' }}>Tab</span>
                </span>
              </div>
            </div>
          )}
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
      </div>
    </div>
  );
};

export default PageEditor;

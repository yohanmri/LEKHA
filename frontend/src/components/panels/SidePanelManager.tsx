import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Search, Loader2, AlertCircle, CheckCircle2, Info, BookOpen, Quote, Trash2, RefreshCw } from 'lucide-react';
import lekhaApi from '../../api/lekhaApi';
import { useEditorContext } from '../../hooks/useEditorContext';
import { useTableOfContents } from '../../hooks/useTableOfContents';
import { buildTocHtml } from '../ribbon/tabs/PagesTab';

const PanelHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
    <h3 className="font-semibold text-sm text-[#1A7A6E]">{title}</h3>
    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors">
      <X size={14} />
    </button>
  </div>
);

// ─── Synonyms Panel ───────────────────────────────────────────────────────────
const SynonymsPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { getEditor } = useEditorContext();

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await lekhaApi.synonyms(query.trim());
      setSynonyms(data.synonyms);
    } catch {
      setSynonyms([]);
    } finally {
      setLoading(false);
    }
  };

  const insertWord = (word: string) => {
    const editor = getEditor();
    if (editor) editor.chain().focus().insertContent(word + ' ').run();
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-[11px] text-gray-500">Enter a Sinhala or English word to find synonyms.</p>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="e.g. ගෙදර"
          className="flex-1 text-sm border border-gray-200 rounded px-3 py-1.5 outline-none focus:border-[#1A7A6E] transition-colors bg-white"
        />
        <button
          onClick={search}
          className="bg-[#1A7A6E] hover:bg-[#155f55] text-white rounded px-3 py-1.5 transition-colors"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
        </button>
      </div>

      {searched && !loading && (
        synonyms.length > 0 ? (
          <div>
            <p className="text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wider">Synonyms</p>
            <div className="flex flex-wrap gap-1.5">
              {synonyms.map(s => (
                <button
                  key={s}
                  onClick={() => insertWord(s)}
                  className="px-2.5 py-1 bg-[#f0faf8] text-[#1A7A6E] text-[12px] rounded border border-[#1A7A6E]/20 hover:bg-[#1A7A6E] hover:text-white transition-colors font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Click a word to insert it into your document.</p>
          </div>
        ) : (
          <p className="text-[12px] text-gray-400 italic">No synonyms found for "{query}".</p>
        )
      )}
    </div>
  );
};

// ─── Grammar Panel ────────────────────────────────────────────────────────────
const GrammarPanel: React.FC = () => {
  const { getEditor } = useEditorContext();
  const [errors, setErrors] = useState<{ type: string; message: string; suggestion: string; severity: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const checkGrammar = async () => {
    const editor = getEditor();
    if (!editor) return;
    const text = editor.getText();
    if (!text.trim()) return;
    setLoading(true);
    setChecked(true);
    try {
      const { data } = await lekhaApi.grammar(text);
      setErrors(data.errors);
    } catch {
      setErrors([]);
    } finally {
      setLoading(false);
    }
  };

  const severityIcon = (s: string) => {
    if (s === 'warning') return <AlertCircle size={13} className="text-amber-500 flex-shrink-0" />;
    return <Info size={13} className="text-blue-400 flex-shrink-0" />;
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-[11px] text-gray-500">Check the active document for grammar and style issues.</p>
      <button
        onClick={checkGrammar}
        className="flex items-center justify-center gap-2 bg-[#1A7A6E] hover:bg-[#155f55] text-white rounded px-4 py-2 text-[12px] font-medium transition-colors w-full"
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
        {loading ? 'Checking...' : 'Check Grammar'}
      </button>

      {checked && !loading && (
        errors.length === 0 ? (
          <div className="flex items-center gap-2 text-[#1A7A6E] bg-[#f0faf8] rounded p-3 text-[12px]">
            <CheckCircle2 size={14} />
            No grammar issues found!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{errors.length} Issue{errors.length !== 1 ? 's' : ''} Found</p>
            {errors.map((e, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded p-2.5 shadow-sm">
                <div className="flex items-start gap-1.5">
                  {severityIcon(e.severity)}
                  <div>
                    <p className="text-[12px] text-gray-800 font-medium">{e.message}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">💡 {e.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

// ─── Dialect Panel ────────────────────────────────────────────────────────────
const DialectPanel: React.FC = () => (
  <div className="p-4">
    <p className="text-[11px] text-gray-500 mb-3">Convert text between Sinhala dialects (formal / colloquial).</p>
    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-[11px] text-amber-700">
      Dialect conversion will be available in a future update.
    </div>
  </div>
);

// ─── Styles & Contents Panel (Right Side) ──────────────────────────────────
const StylesPanel: React.FC = () => {
  const { tocConfig, setTocConfig, pages, setPages } = useAppStore();
  const { getEditor, editorsMap } = useEditorContext();
  const toc = useTableOfContents();
  const [activeStyle, setActiveStyle] = useState('Normal');
  const [editingLevel, setEditingLevel] = useState<'h1'|'h2'|'h3'|'h4'|null>(null);

  const hasTocPage = pages.some(p => p.id.startsWith('page-toc-'));

  const TOC_TEMPLATES = [
    { id: 'numbered' as const, label: '1.1 Numbered' },
    { id: 'classic'  as const, label: 'Classic' },
    { id: 'modern'   as const, label: 'Modern' },
    { id: 'minimal'  as const, label: 'Minimal' },
  ];

  // Track cursor style
  useEffect(() => {
    const interval = setInterval(() => {
      const editor = getEditor();
      if (!editor || editor.isDestroyed) return;
      if (editor.isActive('heading', { level: 1 })) setActiveStyle('Heading 1');
      else if (editor.isActive('heading', { level: 2 })) setActiveStyle('Heading 2');
      else if (editor.isActive('heading', { level: 3 })) setActiveStyle('Heading 3');
      else if (editor.isActive('heading', { level: 4 })) setActiveStyle('Heading 4');
      else setActiveStyle('Normal');
    }, 300);
    return () => clearInterval(interval);
  }, [getEditor]);

  const applyHeading = (lvl: 'h1'|'h2'|'h3'|'h4') => {
    const editor = getEditor();
    if (!editor) return;
    const level = parseInt(lvl.replace('h', '')) as 1|2|3|4;
    editor.chain().focus().setHeading({ level }).run();
  };

  const handleInsert = () => {
    const headings = toc.map(h => ({ level: h.level, text: h.text, pageIndex: h.pageIndex, id: h.id }));
    const tocHtml = buildTocHtml(headings, tocConfig);
    
    const tocPage = pages.find(p => p.id.startsWith('page-toc-'));
    if (tocPage) {
      setPages(pages.map(p => p.id === tocPage.id ? { ...p, content: tocHtml } : p));
      
      const tocEditor = editorsMap.current[tocPage.id];
      if (tocEditor) {
        tocEditor.commands.setContent(tocHtml);
      }
    } else {
      setPages([{ id: `page-toc-${Date.now()}`, content: tocHtml, title: 'Table of Contents' }, ...pages]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-gray-800">
      <div className="flex-1 overflow-y-auto pb-4">
        
        {/* Template & Title Settings */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">TOC Template</p>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {TOC_TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setTocConfig({ template: t.id })}
                className={`py-1.5 px-2 rounded text-[11px] border-2 transition-all font-medium text-left
                  ${tocConfig.template === t.id ? 'border-[#2B579A] bg-blue-50 text-[#2B579A]' : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5 items-end">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Title Text</label>
                <input
                  value={tocConfig.titleText}
                  onChange={e => setTocConfig({ titleText: e.target.value })}
                  className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#2B579A]"
                />
              </div>
              <select
                value={tocConfig.titleFontSize}
                onChange={e => setTocConfig({ titleFontSize: e.target.value })}
                className="text-[12px] border border-gray-300 rounded px-1 py-1.5 outline-none bg-white w-[60px]"
              >
                {['14','16','18','20','24'].map(s => <option key={s} value={s}>{s}pt</option>)}
              </select>
            </div>
            
            <label className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer mt-1">
              <input type="checkbox" checked={tocConfig.showPageNumbers} onChange={e => setTocConfig({ showPageNumbers: e.target.checked })} className="accent-[#2B579A] w-3.5 h-3.5" />
              Show page numbers
            </label>
          </div>
        </div>

        {/* Styles List */}
        <div className="p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Apply & Edit Styles</p>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {(['h1', 'h2', 'h3', 'h4'] as const).map((lvl, i) => {
              const label = `Heading ${lvl.replace('h', '')}`;
              const isEditing = editingLevel === lvl;
              const isActive = activeStyle === label;
              const style = tocConfig.levels[lvl];

              return (
                <div key={lvl} className={i !== 0 ? 'border-t border-gray-100' : ''}>
                  <div className={`flex items-center justify-between transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <button 
                      onClick={() => applyHeading(lvl)} 
                      className={`flex-1 text-left px-3 py-2 text-[12px] ${isActive ? 'text-[#2B579A] font-bold' : 'text-gray-700 font-medium'}`}
                    >
                      {label}
                    </button>
                    <button 
                      onClick={() => setEditingLevel(isEditing ? null : lvl)}
                      className="p-2 text-gray-400 hover:text-[#2B579A] transition-colors"
                      title={`Edit ${label} TOC Style`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                  </div>

                  {isEditing && (
                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">TOC Appearance</label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <select
                          value={style.fontFamily}
                          onChange={e => setTocConfig({ levels: { ...tocConfig.levels, [lvl]: { ...style, fontFamily: e.target.value } } })}
                          className="text-[11px] border border-gray-300 rounded px-1.5 py-1 outline-none bg-white max-w-[100px] truncate"
                        >
                          {['Inter', 'Arial', 'Times New Roman', 'Georgia', 'Verdana'].map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <select
                          value={style.fontSize}
                          onChange={e => setTocConfig({ levels: { ...tocConfig.levels, [lvl]: { ...style, fontSize: e.target.value } } })}
                          className="text-[11px] border border-gray-300 rounded px-1.5 py-1 outline-none bg-white w-[50px]"
                        >
                          {['9','10','11','12','13','14','16'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button
                          onClick={() => setTocConfig({ levels: { ...tocConfig.levels, [lvl]: { ...style, bold: !style.bold } } })}
                          className={`px-2 py-1 rounded border text-[11px] font-bold transition-colors ${style.bold ? 'bg-[#2B579A] text-white border-[#2B579A]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                        >
                          B
                        </button>
                        <input
                          type="color"
                          value={style.color}
                          onChange={e => setTocConfig({ levels: { ...tocConfig.levels, [lvl]: { ...style, color: e.target.value } } })}
                          className="w-6 h-6 p-0 border-none rounded cursor-pointer shrink-0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advanced + Insert */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <button onClick={handleInsert} disabled={toc.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-[#2B579A] hover:bg-[#1A365D] disabled:opacity-40 text-white text-[11px] font-bold px-3 py-2.5 rounded shadow-sm transition-colors">
          <RefreshCw size={12} />
          {hasTocPage ? 'Update Contents Page' : 'Insert Contents Page'}
        </button>
      </div>
    </div>
  );
};

// ─── References Panel ──────────────────────────────────────────────────────────
const ReferencesPanel: React.FC = () => {
  const { references, addReference, deleteReference } = useAppStore();
  const { getEditor } = useEditorContext();
  const [newRef, setNewRef] = useState('');

  const handleAdd = () => {
    if (!newRef.trim()) return;
    addReference(newRef.trim());
    setNewRef('');
  };

  const insertCitation = (index: number) => {
    const editor = getEditor();
    if (editor) {
      editor.chain().focus().insertContent(`[${index + 1}]`).run();
    }
  };

  const generateBibliography = () => {
    const editor = getEditor();
    if (!editor || references.length === 0) return;
    
    let html = '<h3>References</h3><ol>';
    references.forEach(ref => {
      html += `<li>${ref.text}</li>`;
    });
    html += '</ol><p></p>';
    
    editor.chain().focus().insertContent(html).run();
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div>
        <p className="text-[11px] text-gray-500 mb-2">Add a new reference (IEEE format recommended):</p>
        <textarea
          value={newRef}
          onChange={e => setNewRef(e.target.value)}
          placeholder="e.g. J. K. Author, Title of chapter, in Title of Book..."
          className="w-full text-[12px] border border-gray-200 rounded p-2 outline-none focus:border-[#C9973A] transition-colors bg-white min-h-[60px] resize-none"
        />
        <button
          onClick={handleAdd}
          className="mt-2 flex items-center justify-center gap-1.5 bg-[#C9973A] hover:bg-amber-600 text-white rounded px-3 py-1.5 text-[11px] font-medium transition-colors w-full"
        >
          <BookOpen size={13} /> Add Reference
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {references.length === 0 ? (
          <p className="text-[11px] text-gray-400 text-center italic mt-4">No references added yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reference List</span>
              <button 
                onClick={generateBibliography}
                className="text-[10px] text-[#C9973A] hover:underline font-semibold"
              >
                Insert Bibliography
              </button>
            </div>
            {references.map((ref, index) => (
              <div key={ref.id} className="bg-white border border-gray-100 rounded p-2.5 shadow-sm group">
                <div className="flex gap-2">
                  <span className="text-[11px] font-bold text-gray-500">[{index + 1}]</span>
                  <p className="text-[11px] text-gray-700 flex-1">{ref.text}</p>
                </div>
                <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => insertCitation(index)}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[#1A7A6E] hover:bg-[#f0faf8] rounded transition-colors"
                  >
                    <Quote size={10} /> Insert Citation
                  </button>
                  <button 
                    onClick={() => deleteReference(ref.id)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Manager ─────────────────────────────────────────────────────────────────
const SidePanelManager: React.FC = () => {
  const { sidePanel, setSidePanel } = useAppStore();
  if (!sidePanel) return null;

  const titles: Record<string, string> = {
    synonyms: 'Synonyms',
    grammar: 'Grammar Checker',
    dialect: 'Dialect Converter',
    references: 'Manage References',
    toc: 'Styles',
  };

  return (
    <div className={`bg-[#F8F9FA] border-l border-gray-200 flex flex-col z-30 flex-shrink-0 ${sidePanel === 'toc' ? 'w-[280px]' : 'w-[300px]'}`}>
      <PanelHeader title={titles[sidePanel] ?? ''} onClose={() => setSidePanel(null)} />
      <div className="flex-1 overflow-y-auto flex flex-col">
        {sidePanel === 'synonyms'   && <SynonymsPanel />}
        {sidePanel === 'grammar'    && <GrammarPanel />}
        {sidePanel === 'dialect'    && <DialectPanel />}
        {sidePanel === 'references' && <ReferencesPanel />}
        {sidePanel === 'toc'        && <StylesPanel />}
      </div>
    </div>
  );
};

export default SidePanelManager;

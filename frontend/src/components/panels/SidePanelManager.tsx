import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Search, Loader2, AlertCircle, CheckCircle2, Info, BookOpen, Quote, Trash2, RefreshCw, PlusSquare } from 'lucide-react';
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
const DIALECT_LOOKUP: Record<string, { dialect: string; alternatives: string[]; type: string }> = {
  "෎යා": {"dialect": "෎යැයි", "alternatives": [], "type": "Pronoun"},
  "මම": {"dialect": "මං", "alternatives": [], "type": "Pronoun"},
  "අපි": {"dialect": "අපිලා", "alternatives": [], "type": "Pronoun"},
  "ෞහු": {"dialect": "එයැයි", "alternatives": [], "type": "Pronoun"},
  "ඇය": {"dialect": "එයැයි", "alternatives": [], "type": "Pronoun"},
  "එයා": {"dialect": "එයැයි", "alternatives": [], "type": "Pronoun"},
  "මේයා": {"dialect": "මේයැයි", "alternatives": [], "type": "Pronoun"},
  "කුඩා": {"dialect": "හීන්", "alternatives": ["හිච්චී"], "type": "Adjective"},
  "පැඩි": {"dialect": "හීන්", "alternatives": [], "type": "Adjective"},
  "පුංචි": {"dialect": "හීන්", "alternatives": [], "type": "Adjective"},
  "ගොඩක්": {"dialect": "ගොඩෑ", "alternatives": [], "type": "Adverb"},
  "ටිකක්": {"dialect": "ඩිංගක්", "alternatives": [], "type": "Adjective"},
  "කොස්": {"dialect": "හේරලි", "alternatives": [], "type": "Noun"},
  "ආච්චි": {"dialect": "ආත්තා", "alternatives": [], "type": "Noun"},
  "සීයා": {"dialect": "මුත්තා", "alternatives": [], "type": "Noun"},
  "යනවා": {"dialect": "යනවැයි", "alternatives": [], "type": "Verb"},
  "එනවා": {"dialect": "එනවැයි", "alternatives": [], "type": "Verb"},
  "මොනවද": {"dialect": "මක්කයි", "alternatives": [], "type": "Interrogative"},
  "නේද": {"dialect": "නො", "alternatives": [], "type": "Interrogative"},
};
const DIALECT_VERBS: Record<string, string> = {
  "කරනවා": "කොරනවා", "කරනවාද": "කොරනවැයි", "කරනවාද?": "කොරනවැයි?",
  "යනවාද": "යනවැයි", "යනවාද?": "යනවැයි?", "කරන්න": "කොරන්ට",
  "යන්න": "යන්ට", "ගන්න": "ගන්ට", "දේන්න": "දේන්ට",
  "කනවාද?": "කනවැයි?", "කනවාද": "කනවැයි",
};

function dialectConvertWord(word: string) {
  const clean = word.replace(/[.,!?;:""'']/g, '');
  const punct = word.slice(clean.length);
  if (DIALECT_LOOKUP[clean]) {
    const info = DIALECT_LOOKUP[clean];
    return { converted: info.dialect + punct, changed: true, type: info.type };
  }
  if (DIALECT_VERBS[clean]) return { converted: DIALECT_VERBS[clean] + punct, changed: true, type: 'Verb' };
  if (DIALECT_VERBS[word]) return { converted: DIALECT_VERBS[word], changed: true, type: 'Verb' };
  if (clean.endsWith('නවාද')) return { converted: clean.slice(0, -4) + 'නවැයි' + punct, changed: true, type: 'Pattern' };
  if (clean.endsWith('නවා')) return { converted: clean.slice(0, -3) + 'නවැයි' + punct, changed: true, type: 'Pattern' };
  if (clean.endsWith('න්න')) return { converted: clean.slice(0, -3) + 'න්ට' + punct, changed: true, type: 'Pattern' };
  if (clean.includes('කරන')) {
    const c = word.replace('කරන', 'කොරන').replace('වාද', 'වැයි').replace('වා', 'වැයි');
    if (c !== word) return { converted: c, changed: true, type: 'Pattern' };
  }
  return { converted: word, changed: false, type: '' };
}

export function dialectConvertText(text: string) {
  const changes: { original: string; converted: string; type: string }[] = [];
  const output = text.split('\n').map(line =>
    line.split(' ').map(word => {
      if (!word.trim()) return word;
      const r = dialectConvertWord(word);
      if (r.changed) changes.push({ original: word, converted: r.converted, type: r.type });
      return r.converted;
    }).join(' ')
  ).join('\n');
  return { output, changes };
}

const DialectPanel: React.FC = () => {
  const { dialectAutoConvert, setDialectAutoConvert } = useAppStore();
  const { getEditor } = useEditorContext();
  const [result, setResult] = useState<{ original: string; converted: string; changes: {original:string;converted:string;type:string}[] } | null>(null);
  const [selRange, setSelRange] = useState<{from:number;to:number} | null>(null);

  const handleConvert = () => {
    const editor = getEditor();
    if (!editor) return;
    const { from, to, empty } = editor.state.selection;
    if (empty) { alert('Please select some text in the editor first.'); return; }
    const text = editor.state.doc.textBetween(from, to, '\n');
    const { output, changes } = dialectConvertText(text);
    setResult({ original: text, converted: output, changes });
    setSelRange({ from, to });
  };

  const handleReplace = () => {
    const editor = getEditor();
    if (!editor || !result || !selRange) return;
    editor.chain().focus().setTextSelection(selRange).deleteSelection().insertContent(result.converted).run();
    setResult(null);
    setSelRange(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-gray-800">
      <div className="flex-1 overflow-y-auto pb-4">

        {/* Auto-suggest Status */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">AI Auto-Suggest</p>
          <div className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${dialectAutoConvert ? 'border-[#7C3AED] bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex-1 mr-3">
              <p className={`text-[12px] font-bold ${dialectAutoConvert ? 'text-[#7C3AED]' : 'text-gray-500'}`}>
                {dialectAutoConvert ? '✨ Auto-Suggest ENABLED' : 'Auto-Suggest DISABLED'}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                {dialectAutoConvert ? 'Type a word — see a ghost suggestion. Press Tab to accept.' : 'Click the toggle or use Dialect → AI Assistant → Auto Suggest.'}
              </p>
            </div>
            <button
              onClick={() => setDialectAutoConvert(!dialectAutoConvert)}
              className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${dialectAutoConvert ? 'bg-[#7C3AED]' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${dialectAutoConvert ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Selection Converter */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Selection Converter</p>
          <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">Select text in the editor, then click below to convert it to Southern Sinhala dialect.</p>
          <button
            onClick={handleConvert}
            className="w-full flex items-center justify-center gap-2 bg-[#1A7A6E] hover:bg-[#155f56] text-white text-[11px] font-bold px-3 py-2.5 rounded shadow-sm transition-colors"
          >
            <RefreshCw size={13} /> Convert Selected Text
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="p-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Conversion Result</p>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-2">
              <div className="px-3 py-1 bg-red-50 border-b border-gray-100">
                <p className="text-[9px] font-bold text-red-400 uppercase">Original</p>
              </div>
              <p className="px-3 py-2 text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed">{result.original}</p>
            </div>

            <div className="bg-white border-2 border-[#1A7A6E] rounded-lg overflow-hidden mb-3">
              <div className="px-3 py-1 bg-green-50 border-b border-green-100">
                <p className="text-[9px] font-bold text-[#1A7A6E] uppercase">Southern Sinhala</p>
              </div>
              <p className="px-3 py-2 text-[12px] text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">{result.converted}</p>
            </div>

            {result.changes.length > 0 ? (
              <div className="flex flex-col gap-1 mb-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{result.changes.length} word{result.changes.length > 1 ? 's' : ''} converted</p>
                {result.changes.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] bg-white border border-gray-100 rounded px-2 py-1.5">
                    <span className="text-red-400 line-through">{c.original}</span>
                    <span className="text-gray-400 text-[10px]">→</span>
                    <span className="text-green-600 font-semibold">{c.converted}</span>
                    <span className="ml-auto text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{c.type}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-amber-600 text-center italic py-2 bg-amber-50 rounded mb-3">No dialect conversions found for this selection.</p>
            )}

            <button
              onClick={handleReplace}
              disabled={result.changes.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-[#C9973A] hover:bg-[#B08432] disabled:opacity-40 text-white text-[11px] font-bold px-3 py-2.5 rounded shadow-sm transition-colors"
            >
              Replace in Document
            </button>
            <button onClick={() => { setResult(null); setSelRange(null); }}
              className="w-full mt-1.5 text-[10px] text-gray-400 hover:text-gray-600 py-1 transition-colors">
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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

// ─── Figures Panel ────────────────────────────────────────────────────────────
const FiguresPanel: React.FC = () => {
  const { figuresConfig, setFiguresConfig, pages, setPages } = useAppStore();
  const { editorsMap } = useEditorContext();
  const [isEditingStyle, setIsEditingStyle] = useState(false);

  const hasLofPage = pages.some(p => p.id.startsWith('page-lof-'));

  const TEMPLATES = [
    { id: 'numbered' as const, label: 'Figure 1 Numbered' },
    { id: 'classic'  as const, label: 'Classic' },
    { id: 'modern'   as const, label: 'Modern' },
    { id: 'minimal'  as const, label: 'Minimal' },
  ];

  const handleUpdate = () => {
    const parser = new DOMParser();
    const figures: { caption: string; pageIndex: number; id: string }[] = [];

    pages.forEach((page, pageIndex) => {
      if (!page.content || page.id.startsWith('page-lof-') || page.id.startsWith('page-lot-') || page.id.startsWith('page-toc-') || page.id.startsWith('page-ref-')) return;
      const doc = parser.parseFromString(page.content, 'text/html');
      const imgs = doc.querySelectorAll('img');
      imgs.forEach((img) => {
        const alt = img.getAttribute('alt') || `Figure ${figures.length + 1}`;
        figures.push({ caption: alt, pageIndex, id: page.id });
      });
    });

    const { template, titleText, titleFontSize, showPageNumbers, style } = figuresConfig;
    const lines = figures.map((f, i) => {
      const prefix = template === 'numbered' ? `Figure ${i + 1} — ` : '';
      const dots = template === 'numbered' || template === 'classic' 
        ? `<span style="flex-grow:1; border-bottom:1px dotted ${style.color}; margin: 0 8px; position:relative; top:-4px;"></span>`
        : `<span style="flex-grow:1; margin: 0 8px;"></span>`;
      const pageSpan = showPageNumbers ? `<span>${f.pageIndex + 1}</span>` : '';
      
      return `
        <div style="display:flex; align-items:baseline; font-family:${style.fontFamily}; font-size:${style.fontSize}pt; font-weight:${style.bold ? 'bold' : 'normal'}; color:${style.color}; margin-bottom:8px;">
          <a href="#${f.id}" style="color:inherit; text-decoration:none; flex-shrink:0;">${prefix}${f.caption}</a>
          ${dots}
          ${pageSpan}
        </div>`;
    });

    const html = `
      <div style="padding:40px 60px;font-family:Inter,sans-serif">
        <h1 style="font-size:${titleFontSize}pt;font-weight:bold;margin-bottom:24px;border-bottom:2px solid #C9973A;padding-bottom:8px">${titleText}</h1>
        ${lines.length ? lines.join('') : '<p style="color:#aaa;font-style:italic">No figures found in document.</p>'}
      </div>
    `;

    const lofPage = pages.find(p => p.id.startsWith('page-lof-'));
    if (lofPage) {
      setPages(pages.map(p => p.id === lofPage.id ? { ...p, content: html } : p));
      const editor = editorsMap.current[lofPage.id];
      if (editor) editor.commands.setContent(html);
    } else {
      setPages([{ id: `page-lof-${Date.now()}`, content: html, title: titleText }, ...pages]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-gray-800">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="p-3 border-b border-gray-200 bg-white">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Template</p>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setFiguresConfig({ template: t.id })}
                className={`py-1.5 px-2 rounded text-[11px] border-2 transition-all font-medium text-left
                  ${figuresConfig.template === t.id ? 'border-[#C9973A] bg-amber-50 text-[#C9973A]' : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5 items-end">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Title</label>
                <input value={figuresConfig.titleText} onChange={e => setFiguresConfig({ titleText: e.target.value })}
                  className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#C9973A]" />
              </div>
              <select value={figuresConfig.titleFontSize} onChange={e => setFiguresConfig({ titleFontSize: e.target.value })}
                className="text-[12px] border border-gray-300 rounded px-1 py-1.5 outline-none bg-white w-[60px]">
                {['14','16','18','20','24'].map(s => <option key={s} value={s}>{s}pt</option>)}
              </select>
            </div>
            <label className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer mt-1">
              <input type="checkbox" checked={figuresConfig.showPageNumbers} onChange={e => setFiguresConfig({ showPageNumbers: e.target.checked })} className="accent-[#C9973A] w-3.5 h-3.5" />
              Show page numbers
            </label>
          </div>
        </div>

        <div className="p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">List Item Style</p>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className={`flex items-center justify-between transition-colors ${isEditingStyle ? 'bg-amber-50' : 'hover:bg-gray-50'}`}>
              <div className="px-3 py-2 text-[12px] text-gray-700 font-medium">Standard Figure Item</div>
              <button onClick={() => setIsEditingStyle(!isEditingStyle)} className="p-2 text-gray-400 hover:text-[#C9973A] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
            </div>
            {isEditingStyle && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <select value={figuresConfig.style.fontFamily} onChange={e => setFiguresConfig({ style: { ...figuresConfig.style, fontFamily: e.target.value } })}
                    className="text-[11px] border border-gray-300 rounded px-1.5 py-1 bg-white max-w-[100px] truncate">
                    {['Inter', 'Arial', 'Times New Roman', 'Georgia', 'Verdana'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select value={figuresConfig.style.fontSize} onChange={e => setFiguresConfig({ style: { ...figuresConfig.style, fontSize: e.target.value } })}
                    className="text-[11px] border border-gray-300 rounded px-1.5 py-1 bg-white w-[50px]">
                    {['9','10','11','12','13','14'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setFiguresConfig({ style: { ...figuresConfig.style, bold: !figuresConfig.style.bold } })}
                    className={`px-2 py-1 rounded border text-[11px] font-bold ${figuresConfig.style.bold ? 'bg-[#C9973A] text-white border-[#C9973A]' : 'bg-white text-gray-600 border-gray-300'}`}>B</button>
                  <input type="color" value={figuresConfig.style.color} onChange={e => setFiguresConfig({ style: { ...figuresConfig.style, color: e.target.value } })}
                    className="w-6 h-6 p-0 border-none rounded cursor-pointer" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 border-t border-gray-200 bg-white">
        <button onClick={handleUpdate}
          className="w-full flex items-center justify-center gap-2 bg-[#C9973A] hover:bg-[#B08432] text-white text-[11px] font-bold px-3 py-2.5 rounded shadow-sm transition-colors">
          <RefreshCw size={12} />
          {hasLofPage ? 'Update List of Figures' : 'Insert List of Figures'}
        </button>
      </div>
    </div>
  );
};

// ─── Tables Panel ─────────────────────────────────────────────────────────────
const TablesPanel: React.FC = () => {
  const { tablesConfig, setTablesConfig, pages, setPages } = useAppStore();
  const { editorsMap } = useEditorContext();
  const [isEditingStyle, setIsEditingStyle] = useState(false);

  const hasLotPage = pages.some(p => p.id.startsWith('page-lot-'));

  const handleUpdate = () => {
    const parser = new DOMParser();
    const tables: { caption: string; pageIndex: number; id: string }[] = [];

    pages.forEach((page, pageIndex) => {
      if (!page.content || page.id.startsWith('page-lof-') || page.id.startsWith('page-lot-') || page.id.startsWith('page-toc-') || page.id.startsWith('page-ref-')) return;
      const doc = parser.parseFromString(page.content, 'text/html');
      const tbls = doc.querySelectorAll('table');
      tbls.forEach((tbl) => {
        const firstTh = tbl.querySelector('th');
        const caption = firstTh?.textContent?.trim() || `Table ${tables.length + 1}`;
        tables.push({ caption, pageIndex, id: page.id });
      });
    });

    const { template, titleText, titleFontSize, showPageNumbers, style } = tablesConfig;
    const lines = tables.map((t, i) => {
      const prefix = template === 'numbered' ? `Table ${i + 1} — ` : '';
      const dots = template === 'numbered' || template === 'classic' 
        ? `<span style="flex-grow:1; border-bottom:1px dotted ${style.color}; margin: 0 8px; position:relative; top:-4px;"></span>`
        : `<span style="flex-grow:1; margin: 0 8px;"></span>`;
      const pageSpan = showPageNumbers ? `<span>${t.pageIndex + 1}</span>` : '';
      
      return `
        <div style="display:flex; align-items:baseline; font-family:${style.fontFamily}; font-size:${style.fontSize}pt; font-weight:${style.bold ? 'bold' : 'normal'}; color:${style.color}; margin-bottom:8px;">
          <a href="#${t.id}" style="color:inherit; text-decoration:none; flex-shrink:0;">${prefix}${t.caption}</a>
          ${dots}
          ${pageSpan}
        </div>`;
    });

    const html = `
      <div style="padding:40px 60px;font-family:Inter,sans-serif">
        <h1 style="font-size:${titleFontSize}pt;font-weight:bold;margin-bottom:24px;border-bottom:2px solid #C9973A;padding-bottom:8px">${titleText}</h1>
        ${lines.length ? lines.join('') : '<p style="color:#aaa;font-style:italic">No tables found in document.</p>'}
      </div>
    `;

    const lotPage = pages.find(p => p.id.startsWith('page-lot-'));
    if (lotPage) {
      setPages(pages.map(p => p.id === lotPage.id ? { ...p, content: html } : p));
      const editor = editorsMap.current[lotPage.id];
      if (editor) editor.commands.setContent(html);
    } else {
      setPages([{ id: `page-lot-${Date.now()}`, content: html, title: titleText }, ...pages]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-gray-800">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="p-3 border-b border-gray-200 bg-white">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Template</p>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {[
              { id: 'numbered' as const, label: 'Table 1 Numbered' },
              { id: 'classic'  as const, label: 'Classic' },
              { id: 'modern'   as const, label: 'Modern' },
              { id: 'minimal'  as const, label: 'Minimal' },
            ].map(t => (
              <button key={t.id} onClick={() => setTablesConfig({ template: t.id })}
                className={`py-1.5 px-2 rounded text-[11px] border-2 transition-all font-medium text-left
                  ${tablesConfig.template === t.id ? 'border-[#C9973A] bg-amber-50 text-[#C9973A]' : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5 items-end">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Title</label>
                <input value={tablesConfig.titleText} onChange={e => setTablesConfig({ titleText: e.target.value })}
                  className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#C9973A]" />
              </div>
              <select value={tablesConfig.titleFontSize} onChange={e => setTablesConfig({ titleFontSize: e.target.value })}
                className="text-[12px] border border-gray-300 rounded px-1 py-1.5 outline-none bg-white w-[60px]">
                {['14','16','18','20','24'].map(s => <option key={s} value={s}>{s}pt</option>)}
              </select>
            </div>
            <label className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer mt-1">
              <input type="checkbox" checked={tablesConfig.showPageNumbers} onChange={e => setTablesConfig({ showPageNumbers: e.target.checked })} className="accent-[#C9973A] w-3.5 h-3.5" />
              Show page numbers
            </label>
          </div>
        </div>

        <div className="p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">List Item Style</p>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className={`flex items-center justify-between transition-colors ${isEditingStyle ? 'bg-amber-50' : 'hover:bg-gray-50'}`}>
              <div className="px-3 py-2 text-[12px] text-gray-700 font-medium">Standard Table Item</div>
              <button onClick={() => setIsEditingStyle(!isEditingStyle)} className="p-2 text-gray-400 hover:text-[#C9973A] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
            </div>
            {isEditingStyle && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <select value={tablesConfig.style.fontFamily} onChange={e => setTablesConfig({ style: { ...tablesConfig.style, fontFamily: e.target.value } })}
                    className="text-[11px] border border-gray-300 rounded px-1.5 py-1 bg-white max-w-[100px] truncate">
                    {['Inter', 'Arial', 'Times New Roman', 'Georgia', 'Verdana'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select value={tablesConfig.style.fontSize} onChange={e => setTablesConfig({ style: { ...tablesConfig.style, fontSize: e.target.value } })}
                    className="text-[11px] border border-gray-300 rounded px-1.5 py-1 bg-white w-[50px]">
                    {['9','10','11','12','13','14'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setTablesConfig({ style: { ...tablesConfig.style, bold: !tablesConfig.style.bold } })}
                    className={`px-2 py-1 rounded border text-[11px] font-bold ${tablesConfig.style.bold ? 'bg-[#C9973A] text-white border-[#C9973A]' : 'bg-white text-gray-600 border-gray-300'}`}>B</button>
                  <input type="color" value={tablesConfig.style.color} onChange={e => setTablesConfig({ style: { ...tablesConfig.style, color: e.target.value } })}
                    className="w-6 h-6 p-0 border-none rounded cursor-pointer" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 border-t border-gray-200 bg-white">
        <button onClick={handleUpdate}
          className="w-full flex items-center justify-center gap-2 bg-[#C9973A] hover:bg-[#B08432] text-white text-[11px] font-bold px-3 py-2.5 rounded shadow-sm transition-colors">
          <RefreshCw size={12} />
          {hasLotPage ? 'Update List of Tables' : 'Insert List of Tables'}
        </button>
      </div>
    </div>
  );
};

const ReferencesPanel: React.FC = () => {
  const { references, addReference, deleteReference, referencesConfig, setReferencesConfig, pages, setPages } = useAppStore();
  const { getEditor, editorsMap } = useEditorContext();
  const [newRef, setNewRef] = useState('');
  const [isEditingStyle, setIsEditingStyle] = useState(false);

  const hasRefPage = pages.some(p => p.id.startsWith('page-ref-'));

  const handleAdd = () => {
    if (!newRef.trim()) return;
    addReference(newRef.trim());
    setNewRef('');
  };

  const insertCitation = (idx: number) => {
    const editor = getEditor();
    if (!editor) return;
    const label = referencesConfig.template === 'ieee' ? `[${idx + 1}]` : referencesConfig.template === 'apa' ? `(${idx + 1})` : `${idx + 1}.`;
    editor.chain().focus().insertContent(label).run();
  };

  const handleUpdate = () => {
    const { template, titleText, titleFontSize, style } = referencesConfig;
    const rows = references.map((r, i) => {
      const label = template === 'ieee' ? `[${i + 1}]` : template === 'apa' ? `(${i + 1})` : `${i + 1}.`;
      return `<div style="padding:4px 0; font-family:${style.fontFamily}; font-size:${style.fontSize}pt; font-weight:${style.bold ? 'bold' : 'normal'}; color:${style.color}; display:flex; gap:8px">
        <span style="min-width:32px; font-weight:bold; color:#C9973A">${label}</span>
        <span style="flex:1">${r.text}</span>
      </div>`;
    }).join('');

    const html = `<div style="padding:40px 60px; font-family:Inter,sans-serif">
      <h1 style="font-size:${titleFontSize}pt; font-weight:bold; margin-bottom:24px; border-bottom:2px solid #C9973A; padding-bottom:8px">${titleText}</h1>
      ${rows || '<p style="color:#aaa;font-style:italic">No references added yet.</p>'}
    </div>`;

    const refPage = pages.find(p => p.id.startsWith('page-ref-'));
    if (refPage) {
      setPages(pages.map(p => p.id === refPage.id ? { ...p, content: html } : p));
      const editor = editorsMap.current[refPage.id];
      if (editor) editor.commands.setContent(html);
    } else {
      setPages([{ id: `page-ref-${Date.now()}`, content: html, title: titleText }, ...pages]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-gray-800">
      <div className="flex-1 overflow-y-auto pb-4">
        
        <div className="p-3 border-b border-gray-200 bg-white">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Bibliography Style</p>
          <div className="grid grid-cols-3 gap-1 mb-4">
            {(['ieee', 'apa', 'mla'] as const).map(s => (
              <button key={s} onClick={() => setReferencesConfig({ template: s })}
                className={`py-1.5 rounded text-[11px] border transition-all font-bold uppercase
                  ${referencesConfig.template === s ? 'bg-[#C9973A] text-white border-[#C9973A]' : 'bg-white border-gray-300 text-gray-600'}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5 items-end">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Title</label>
                <input value={referencesConfig.titleText} onChange={e => setReferencesConfig({ titleText: e.target.value })}
                  className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#C9973A]" />
              </div>
              <select value={referencesConfig.titleFontSize} onChange={e => setReferencesConfig({ titleFontSize: e.target.value })}
                className="text-[12px] border border-gray-300 rounded px-1 py-1.5 outline-none bg-white w-[60px]">
                {['14','16','18','20','24'].map(s => <option key={s} value={s}>{s}pt</option>)}
              </select>
            </div>
            
            <button onClick={() => setIsEditingStyle(!isEditingStyle)} className="flex items-center gap-1.5 text-[10px] text-[#C9973A] font-semibold hover:underline mt-1">
              {isEditingStyle ? 'Close Style Settings' : 'Edit Bibliography Item Style'}
            </button>

            {isEditingStyle && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded mt-1 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <select value={referencesConfig.style.fontFamily} onChange={e => setReferencesConfig({ style: { ...referencesConfig.style, fontFamily: e.target.value } })}
                    className="text-[11px] border border-gray-300 rounded px-1.5 py-1 bg-white max-w-[100px] truncate">
                    {['Inter', 'Arial', 'Times New Roman', 'Georgia', 'Verdana'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select value={referencesConfig.style.fontSize} onChange={e => setReferencesConfig({ style: { ...referencesConfig.style, fontSize: e.target.value } })}
                    className="text-[11px] border border-gray-300 rounded px-1.5 py-1 bg-white w-[50px]">
                    {['9','10','11','12','13','14'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setReferencesConfig({ style: { ...referencesConfig.style, bold: !referencesConfig.style.bold } })}
                    className={`px-2 py-1 rounded border text-[11px] font-bold ${referencesConfig.style.bold ? 'bg-[#C9973A] text-white border-[#C9973A]' : 'bg-white text-gray-600 border-gray-300'}`}>B</button>
                  <input type="color" value={referencesConfig.style.color} onChange={e => setReferencesConfig({ style: { ...referencesConfig.style, color: e.target.value } })}
                    className="w-6 h-6 p-0 border-none rounded cursor-pointer" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 border-b border-gray-200 bg-white">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Add New Source</p>
          <div className="flex flex-col gap-2">
            <textarea
              placeholder="Enter reference text (e.g. Smith, J. (2021). The Book.)"
              value={newRef}
              onChange={e => setNewRef(e.target.value)}
              className="w-full h-20 text-[11px] border border-gray-300 rounded p-2 outline-none focus:border-[#C9973A] resize-none"
            />
            <button onClick={handleAdd} className="bg-[#C9973A] hover:bg-[#B08432] text-white text-[11px] font-bold py-2 rounded transition-colors flex items-center justify-center gap-2">
              <PlusSquare size={13} /> Add Source
            </button>
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Source Library ({references.length})</p>
          </div>
          <div className="flex flex-col gap-2">
            {references.map((ref, index) => (
              <div key={ref.id} className="bg-white border border-gray-100 rounded p-2.5 shadow-sm group">
                <div className="flex gap-2">
                  <span className="text-[11px] font-bold text-gray-500">[{index + 1}]</span>
                  <p className="text-[11px] text-gray-700 flex-1 leading-relaxed">{ref.text}</p>
                </div>
                <div className="flex justify-end gap-1 mt-2 border-t border-gray-50 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => insertCitation(index)} className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-[#C9973A] hover:bg-amber-50 rounded transition-colors">
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
      </div>
      </div>

      <div className="p-3 border-t border-gray-200 bg-white">
        <button onClick={handleUpdate} disabled={references.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-[#C9973A] hover:bg-[#B08432] disabled:opacity-40 text-white text-[11px] font-bold px-3 py-2.5 rounded shadow-sm transition-colors">
          <RefreshCw size={12} />
          {hasRefPage ? 'Update Bibliography Page' : 'Insert Bibliography Page'}
        </button>
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
    references: 'Bibliography & Citations',
    toc: 'Table of Contents Style',
    figures: 'List of Figures Style',
    tables: 'List of Tables Style',
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
        {sidePanel === 'figures'    && <FiguresPanel />}
        {sidePanel === 'tables'     && <TablesPanel />}
      </div>
    </div>
  );
};

export default SidePanelManager;

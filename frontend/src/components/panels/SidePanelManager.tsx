import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Search, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import lekhaApi from '../../api/lekhaApi';
import { useEditorContext } from '../../hooks/useEditorContext';

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

// ─── Manager ─────────────────────────────────────────────────────────────────
const SidePanelManager: React.FC = () => {
  const { sidePanel, setSidePanel } = useAppStore();
  if (!sidePanel) return null;

  const titles: Record<string, string> = {
    synonyms: 'Synonyms',
    grammar: 'Grammar Checker',
    dialect: 'Dialect Converter',
  };

  return (
    <div className="w-[300px] bg-[#F8F9FA] border-l border-gray-200 flex flex-col z-30 flex-shrink-0">
      <PanelHeader title={titles[sidePanel] ?? ''} onClose={() => setSidePanel(null)} />
      <div className="flex-1 overflow-y-auto">
        {sidePanel === 'synonyms' && <SynonymsPanel />}
        {sidePanel === 'grammar' && <GrammarPanel />}
        {sidePanel === 'dialect' && <DialectPanel />}
      </div>
    </div>
  );
};

export default SidePanelManager;

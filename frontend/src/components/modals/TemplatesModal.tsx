import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useEditorContext } from '../../hooks/useEditorContext';
import { X, FileText } from 'lucide-react';

// ─── Template Definitions ─────────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  nameSi: string;
  description: string;
  emoji: string;
  accentColor: string;
  html: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    nameSi: 'හිස් ලේඛනය',
    description: 'Start with an empty document',
    emoji: '📄',
    accentColor: '#6B7280',
    html: '<p></p>',
  },
  {
    id: 'letter',
    name: 'Formal Letter',
    nameSi: 'ලිපිය',
    description: 'Official Sinhala letter format',
    emoji: '✉️',
    accentColor: '#1A7A6E',
    html: `
<p style="text-align:right">දිනය: ................................</p>
<p><br></p>
<p><strong>ගරු,</strong></p>
<p>...................................................................</p>
<p>...................................................................</p>
<p><br></p>
<p><strong>මාතෘකාව: ...................................................................</strong></p>
<p><br></p>
<p>ඉහත සඳහන් මාතෘකාව සම්බන්ධයෙන් ඔබගේ අවධානය යොමු කිරීමට කැමැත්තෙමි.</p>
<p><br></p>
<p>...................................................................</p>
<p>...................................................................</p>
<p>...................................................................</p>
<p><br></p>
<p>ඔබගේ විශ්වාසවන්ත,</p>
<p><br></p>
<p>...................................................................</p>
<p><strong>නම: ................................</strong></p>
<p><strong>තනතුර: ................................</strong></p>
<p><strong>දිනය: ................................</strong></p>
    `.trim(),
  },
  {
    id: 'report',
    name: 'Official Report',
    nameSi: 'වාර්තාව',
    description: 'Structured report with sections',
    emoji: '📊',
    accentColor: '#2563EB',
    html: `
<h1 style="text-align:center">වාර්තා මාතෘකාව</h1>
<p style="text-align:center"><strong>සකස් කළේ: ................................</strong></p>
<p style="text-align:center"><strong>දිනය: ................................</strong></p>
<p><br></p>
<h2>1. හැඳින්වීම</h2>
<p>...</p>
<p><br></p>
<h2>2. ක්‍රමවේදය</h2>
<p>...</p>
<p><br></p>
<h2>3. සොයා ගැනීම් හා විශ්ලේෂණය</h2>
<p>...</p>
<p><br></p>
<h2>4. නිගමන</h2>
<p>...</p>
<p><br></p>
<h2>5. නිර්දේශ</h2>
<p>...</p>
<p><br></p>
<p><strong>යොමු ලේඛන</strong></p>
<p>...</p>
    `.trim(),
  },
  {
    id: 'cv',
    name: 'Curriculum Vitae',
    nameSi: 'ජීව දත්ත',
    description: 'Personal profile and CV',
    emoji: '👤',
    accentColor: '#7C3AED',
    html: `
<h1 style="text-align:center">ජීව දත්ත</h1>
<p style="text-align:center">................................ | ................................ | ................................</p>
<p><br></p>
<h2>පෞද්ගලික තොරතුරු</h2>
<p><strong>නම:</strong> ................................</p>
<p><strong>ලිපිනය:</strong> ................................</p>
<p><strong>දුරකථනය:</strong> ................................</p>
<p><strong>විද්‍යුත් තැපෑල:</strong> ................................</p>
<p><br></p>
<h2>අධ්‍යාපනික සුදුසුකම්</h2>
<p>...</p>
<p><br></p>
<h2>වෘත්තීය අත්දැකීම්</h2>
<p>...</p>
<p><br></p>
<h2>කුසලතා</h2>
<p>...</p>
<p><br></p>
<h2>යොමු කරන්නන්</h2>
<p>ඉල්ලීම් මත ලබා ගත හැක.</p>
    `.trim(),
  },
  {
    id: 'notice',
    name: 'Official Notice',
    nameSi: 'නිවේදනය',
    description: 'Formal announcement format',
    emoji: '📢',
    accentColor: '#DC2626',
    html: `
<p style="text-align:center"><strong>ශ්‍රී ලංකා ................................</strong></p>
<p style="text-align:center"><strong>................................ දෙපාර්තමේන්තුව</strong></p>
<p><br></p>
<h1 style="text-align:center">නිවේදනය</h1>
<p><br></p>
<p>අංකය: ................................&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;දිනය: ................................</p>
<p><br></p>
<p><strong>................................ සියලු දෙනා වෙත,</strong></p>
<p><br></p>
<p>...</p>
<p>...</p>
<p>...</p>
<p><br></p>
<p style="text-align:right">................................</p>
<p style="text-align:right"><strong>................................</strong></p>
<p style="text-align:right">................................</p>
    `.trim(),
  },
];

// ─── TemplatesModal ────────────────────────────────────────────────────────────

const TemplatesModal: React.FC = () => {
  const { isTemplatesOpen, setTemplatesOpen } = useAppStore();
  const { editorRef } = useEditorContext();

  if (!isTemplatesOpen) return null;

  const applyTemplate = (html: string) => {
    const editor = editorRef.current;
    if (editor) {
      editor.commands.setContent(html, true);
      editor.commands.focus('start');
    }
    setTemplatesOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setTemplatesOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 10000,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          width: 'min(720px, 92vw)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px 16px',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
              ලේඛන සැකිලි
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              Document Templates — Select a template to start writing
            </div>
          </div>
          <button
            onClick={() => setTemplatesOpen(false)}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: 'transparent', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#6B7280',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Templates Grid */}
        <div style={{
          overflowY: 'auto', padding: '20px 24px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}>
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => applyTemplate(t.html)}
              style={{
                background: '#FAFAFA',
                border: '1.5px solid #E5E7EB',
                borderRadius: 10,
                padding: '16px 16px 14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = t.accentColor;
                e.currentTarget.style.background = '#FFF';
                e.currentTarget.style.boxShadow = `0 4px 16px ${t.accentColor}22`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.background = '#FAFAFA';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Mini page preview */}
              <div style={{
                width: '100%', aspectRatio: '3/4',
                background: '#fff',
                border: `1.5px solid ${t.accentColor}44`,
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{t.emoji}</span>
                {/* Decorative lines */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '8px 8px 8px',
                  display: 'flex', flexDirection: 'column', gap: 3,
                }}>
                  {[80, 65, 72, 55].map((w, i) => (
                    <div key={i} style={{
                      height: 2.5, borderRadius: 2,
                      background: `${t.accentColor}33`,
                      width: `${w}%`,
                    }} />
                  ))}
                </div>
              </div>

              {/* Labels */}
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: '#111827',
                  lineHeight: 1.3,
                }}>
                  {t.nameSi}
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                  {t.name}
                </div>
              </div>

              {/* Tag */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: `${t.accentColor}15`,
                color: t.accentColor,
                borderRadius: 4, padding: '2px 8px',
                fontSize: 10, fontWeight: 600,
              }}>
                <FileText size={10} />
                {t.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default TemplatesModal;

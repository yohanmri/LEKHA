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
<p style="text-align:right; color: #666666;">දිනය: 202_ / __ / __</p>
<p><br></p>
<p><strong>ගරු අධ්‍යක්ෂතුමා,</strong></p>
<p>ශ්‍රී ලංකා ජාතික ආයතනය,</p>
<p>කොළඹ 07.</p>
<p><br></p>
<p><strong>මාතෘකාව: <u>වැදගත් ව්‍යාපෘති යෝජනාව සම්බන්ධවයි</u></strong></p>
<p><br></p>
<p>ඉහත සඳහන් මාතෘකාව සම්බන්ධයෙන් ඔබගේ කාරුණික අවධානය යොමු කිරීමට කැමැත්තෙමි. මෙම ව්‍යාපෘතිය මගින් අපේක්ෂිත අරමුණු සාක්ෂාත් කර ගැනීම සඳහා අදාළ කටයුතු කඩිනමින් සිදු කිරීමට අවශ්‍ය පියවර ගන්නා මෙන් කාරුණිකව ඉල්ලා සිටිමි.</p>
<p><br></p>
<p>මේ පිළිබඳව වැඩිදුර තොරතුරු අවශ්‍ය වුවහොත් කරුණාකර මා අමතන්න. ඔබගේ සහයෝගය අගය කරමි.</p>
<p><br></p>
<p>මෙයට විශ්වාසී,</p>
<p><br></p>
<p>.......................................</p>
<p><strong>ඒ. බී. සී. පෙරේරා</strong></p>
<p>ප්‍රධාන කළමනාකරු</p>
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
<h1 style="text-align:center; color: #1E3A8A;">මාසික ප්‍රගති වාර්තාව</h1>
<p style="text-align:center; color: #6B7280;">සකස් කළේ: ව්‍යාපෘති කළමනාකරණ අංශය</p>
<p style="text-align:center; color: #6B7280;">දිනය: 202X මාර්තු 31</p>
<p><br></p>
<h2 style="color: #2563EB;">1. හැඳින්වීම</h2>
<p>මෙම වාර්තාව මගින් පසුගිය මාසය තුළ අප ආයතනය විසින් සිදු කරන ලද ප්‍රධාන ව්‍යාපෘතිවල ප්‍රගතිය සහ ඉදිරි සැලසුම් පිළිබඳව සවිස්තරාත්මකව සාකච්ඡා කෙරේ.</p>
<p><br></p>
<h2 style="color: #2563EB;">2. ප්‍රධාන ජයග්‍රහණ</h2>
<ul>
  <li>පළමු අදියරේ කටයුතු 100% ක් සම්පූර්ණ කිරීම.</li>
  <li>නව සේවාලාභීන් 50 දෙනෙකු බඳවා ගැනීම.</li>
  <li>මෙහෙයුම් පිරිවැය 15% කින් අවම කිරීම.</li>
</ul>
<p><br></p>
<h2 style="color: #2563EB;">3. ඉදිරි සැලසුම්</h2>
<p>මීළඟ කාර්තුව තුළදී නව තාක්ෂණික මෙවලම් හඳුන්වා දීමටත්, සේවක පුහුණු වැඩසටහන් පුළුල් කිරීමටත් සැලසුම් කර ඇත.</p>
<p><br></p>
<h2 style="color: #2563EB;">4. නිගමනය</h2>
<p>සමස්තයක් වශයෙන් පසුගිය මාසයේ කාර්යසාධනය ඉතා ඉහළ මට්ටමක පවතින අතර, ඉදිරි ඉලක්ක සපුරා ගැනීම සඳහා සියලු අංශවල සහයෝගය අපේක්ෂා කෙරේ.</p>
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
<h1 style="text-align:center; color: #4C1D95;">සමන් කුමාර සිල්වා</h1>
<p style="text-align:center; color: #6B7280;">මෘදුකාංග ඉංජිනේරු | samank@email.com | 077-1234567 | කොළඹ</p>
<p><br></p>
<h2 style="color: #7C3AED;">පෞද්ගලික පැතිකඩ</h2>
<p>වසර 5ක පළපුරුද්දක් සහිත, නවෝත්පාදන තාක්ෂණයන් කෙරෙහි දැඩි උනන්දුවක් දක්වන මෘදුකාංග ඉංජිනේරුවරයෙකි. කණ්ඩායම් හැඟීමෙන් යුතුව වැඩ කිරීමට සහ අභියෝගාත්මක ගැටළු සඳහා විසඳුම් සෙවීමට විශේෂ දක්ෂතාවයක් ඇත.</p>
<p><br></p>
<h2 style="color: #7C3AED;">අධ්‍යාපනික සුදුසුකම්</h2>
<ul>
  <li><strong>පරිගණක විද්‍යාව පිළිබඳවේදී උපාධිය (ගෞරව)</strong> - කොළඹ විශ්වවිද්‍යාලය (2015-2019)</li>
  <li><strong>අ.පො.ස (උසස් පෙළ)</strong> - ගණිත අංශයෙන් A සාමාර්ථ 3ක් සහිතව සමත් (2014)</li>
</ul>
<p><br></p>
<h2 style="color: #7C3AED;">වෘත්තීය අත්දැකීම්</h2>
<p><strong>ජ්‍යෙෂ්ඨ මෘදුකාංග ඉංජිනේරු</strong> - ABC තාක්ෂණික සමාගම (2020 සිට මේ දක්වා)</p>
<ul>
  <li>ප්‍රධාන වෙබ් යෙදුම් සංවර්ධනය සහ නඩත්තුව.</li>
  <li>නවක ඉංජිනේරුවන් පුහුණු කිරීම සහ කණ්ඩායම් මෙහෙයවීම.</li>
</ul>
<p><br></p>
<h2 style="color: #7C3AED;">කුසලතා</h2>
<p>JavaScript, React, Node.js, Python, SQL, Git, Agile කණ්ඩායම් කළමනාකරණය.</p>
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
<p style="text-align:center; font-size: 18px; color: #991B1B;"><strong>ශ්‍රී ලංකා රජයේ නිල නිවේදනයයි</strong></p>
<p style="text-align:center; font-size: 14px; color: #DC2626;"><strong>මහජන සෞඛ්‍ය දෙපාර්තමේන්තුව</strong></p>
<p><br></p>
<h1 style="text-align:center;">අතිවිශේෂ නිවේදනය</h1>
<p><br></p>
<p><strong>අංකය:</strong> 202X/04/12/PHD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>දිනය:</strong> 202X අප්‍රේල් 12</p>
<p><br></p>
<p><strong>සියලුම දිස්ත්‍රික් වෛද්‍ය නිලධාරීන් සහ මහජනතාව වෙත,</strong></p>
<p><br></p>
<p>පවතින සෞඛ්‍ය තත්ත්වය සැලකිල්ලට ගනිමින්, ඉදිරි සති දෙක තුළ විශේෂ සෞඛ්‍යාරක්ෂිත මාර්ගෝපදේශ මාලාවක් ක්‍රියාත්මක කිරීමට තීරණය කර ඇත. කරුණාකර පහත සඳහන් උපදෙස් දැඩිව අනුගමනය කරන්න:</p>
<ol>
  <li>පොදු ස්ථානවලදී සෑම විටම මුහුණු ආවරණ පැළඳීම අනිවාර්ය වේ.</li>
  <li>සමාජ දුරස්ථභාවය පවත්වා ගැනීම සහ සෙනඟ ගැවසෙන ස්ථාන මඟ හැරීම.</li>
  <li>රෝග ලක්ෂණ ඇත්නම් වහාම ළඟම ඇති රෝහලට වාර්තා කිරීම.</li>
</ol>
<p><br></p>
<p>මහජන සෞඛ්‍යය ආරක්ෂා කර ගැනීම සඳහා ඔබ සැමගේ සහයෝගය අපේක්ෂා කරමු.</p>
<p><br></p>
<p style="text-align:right">අත්සන් කළේ,</p>
<p style="text-align:right"><strong>අධ්‍යක්ෂ ජනරාල්</strong></p>
<p style="text-align:right">මහජන සෞඛ්‍ය දෙපාර්තමේන්තුව</p>
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

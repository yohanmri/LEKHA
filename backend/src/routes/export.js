const express = require('express');
const router = express.Router();
const { htmlToText } = require('html-to-text');
const puppeteer = require('puppeteer');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
} = require('docx');

/**
 * POST /api/export
 * Body: { html: "...", format: "txt" | "html" | "pdf" | "docx", title: "..." }
 */
router.post('/', async (req, res) => {
  const { html, format = 'txt', title = 'LEKHA Document' } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'html field is required' });
  }

  // ── TXT ────────────────────────────────────────────────────────────────────
  if (format === 'txt') {
    const text = htmlToText(html, { wordwrap: 80 });
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${title}.txt"`);
    return res.send(text);
  }

  // ── HTML ───────────────────────────────────────────────────────────────────
  if (format === 'html') {
    const fullHtml = `<!DOCTYPE html>
<html lang="si">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700&family=Abhaya+Libre&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans Sinhala', sans-serif; max-width: 816px; margin: 96px auto; line-height: 1.9; color: #323130; }
  </style>
</head>
<body>${html}</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${title}.html"`);
    return res.send(fullHtml);
  }

  // ── PDF ────────────────────────────────────────────────────────────────────
  if (format === 'pdf') {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      const pageHtml = `<!DOCTYPE html>
<html lang="si">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700&family=Abhaya+Libre:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Noto Sans Sinhala', sans-serif;
      font-size: 12pt;
      line-height: 1.9;
      color: #323130;
      padding: 2.54cm;
    }
    h1 { font-size: 20pt; margin: 1em 0 0.5em; }
    h2 { font-size: 16pt; margin: 1em 0 0.4em; }
    h3 { font-size: 13pt; margin: 0.8em 0 0.3em; }
    p  { margin-bottom: 0.6em; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    td, th { border: 1px solid #ccc; padding: 6px 10px; }
    th { background: #f3f2f1; font-weight: 700; }
    img { max-width: 100%; }
    ul, ol { padding-left: 1.5em; margin: 0.5em 0; }
    .lekha-page { page-break-after: always; padding-bottom: 2em; }
    .lekha-page:last-child { page-break-after: avoid; }
  </style>
</head>
<body>${html}</body>
</html>`;

      // Wait for Sinhala fonts to load
      await page.setContent(pageHtml, { waitUntil: 'networkidle2' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '2.54cm', right: '2.54cm', bottom: '2.54cm', left: '2.54cm' },
      });

      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
      return res.send(Buffer.from(pdf));
    } catch (err) {
      console.error('[Export PDF]', err);
      return res.status(500).json({ error: 'PDF generation failed: ' + err.message });
    }
  }

  // ── DOCX ───────────────────────────────────────────────────────────────────
  if (format === 'docx') {
    try {
      // Convert HTML to plain text paragraphs for a basic DOCX
      // For a richer conversion we use html-to-text and split into paragraphs
      const plainText = htmlToText(html, { wordwrap: false });
      const lines = plainText.split('\n');

      const paragraphs = lines.map((line) => {
        // Detect headings by ALL-CAPS heuristic from html-to-text
        const trimmed = line.trim();
        if (!trimmed) return new Paragraph({ text: '' });

        return new Paragraph({
          children: [
            new TextRun({
              text: trimmed,
              font: 'Noto Sans Sinhala',
              size: 24, // 12pt in half-points
            }),
          ],
          spacing: { after: 120 },
        });
      });

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch = 1440 twips
            },
          },
          children: paragraphs,
        }],
      });

      const buffer = await Packer.toBuffer(doc);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${title}.docx"`);
      return res.send(buffer);
    } catch (err) {
      console.error('[Export DOCX]', err);
      return res.status(500).json({ error: 'DOCX generation failed: ' + err.message });
    }
  }

  res.status(400).json({ error: `Unsupported format: ${format}. Use 'txt', 'html', 'pdf', or 'docx'.` });
});

module.exports = router;

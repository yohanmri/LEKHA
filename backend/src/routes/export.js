const express = require('express');
const router = express.Router();
const { htmlToText } = require('html-to-text');

/**
 * POST /api/export
 * Body: { html: "...", format: "txt" | "html" }
 * Currently supports txt and raw html.
 * PDF/DOCX can be added later with puppeteer/docx packages.
 */
router.post('/', (req, res) => {
  const { html, format = 'txt', title = 'LEKHA Document' } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'html field is required' });
  }

  if (format === 'txt') {
    const text = htmlToText(html, { wordwrap: 80 });
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${title}.txt"`);
    return res.send(text);
  }

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

  res.status(400).json({ error: `Unsupported format: ${format}. Use 'txt' or 'html'.` });
});

module.exports = router;

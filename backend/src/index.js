const express = require('express');
const cors = require('cors');
require('dotenv').config();

const transliterateRouter = require('./routes/transliterate');
const synonymsRouter = require('./routes/synonyms');
const grammarRouter = require('./routes/grammar');
const exportRouter = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '5mb' }));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'LEKHA Backend' }));

// Routes
app.use('/api/transliterate', transliterateRouter);
app.use('/api/synonyms', synonymsRouter);
app.use('/api/grammar', grammarRouter);
app.use('/api/export', exportRouter);

app.listen(PORT, () => {
  console.log(`\n🟢 LEKHA Backend running → http://localhost:${PORT}\n`);
});

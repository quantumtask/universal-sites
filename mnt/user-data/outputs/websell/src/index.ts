import express from 'express';
import path from 'path';
import { CALLERS } from './db.js';
import dealsRouter from './routes/deals.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API
app.use('/api/deals', dealsRouter);

// Expose caller list for frontend
app.get('/api/callers', (_req, res) => {
  res.json(CALLERS);
});

// SPA fallback — serve index.html for all non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`WebSell running → http://localhost:${PORT}`);
});

export default app;

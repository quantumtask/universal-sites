import express from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const app  = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const ROOT = process.cwd();
const DATA = path.join(ROOT, 'client-data');

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(ROOT, 'admin')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(ROOT, 'admin', 'index.html'));
});
// Serve generated site assets so uploaded images preview correctly in the admin
app.use('/site-assets', express.static(path.join(ROOT, 'generated-sites')));

/* ── List all client sites ──────────────────────────────── */
app.get('/api/sites', (_req, res) => {
  const files = fs.readdirSync(DATA)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => f.replace('.json', ''))
    .sort();
  res.json(files);
});

/* ── Load a site ────────────────────────────────────────── */
app.get('/api/sites/:id', (req, res) => {
  const file = path.join(DATA, `${req.params.id}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
  res.json(JSON.parse(fs.readFileSync(file, 'utf8')));
});

/* ── Save a site ────────────────────────────────────────── */
app.put('/api/sites/:id', (req, res) => {
  const file = path.join(DATA, `${req.params.id}.json`);
  fs.writeFileSync(file, JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
});

/* ── Create new site from template ─────────────────────── */
app.post('/api/sites', (req, res) => {
  const { id } = req.body as { id: string };
  if (!id || !/^[a-z0-9-]+$/.test(id))
    return res.status(400).json({ error: 'Use lowercase letters, numbers and hyphens only' });
  const dest = path.join(DATA, `${id}.json`);
  if (fs.existsSync(dest))
    return res.status(409).json({ error: 'A site with that ID already exists' });
  const tmpl = JSON.parse(fs.readFileSync(path.join(DATA, '_new-site-template.json'), 'utf8'));
  tmpl.id = id;
  fs.writeFileSync(dest, JSON.stringify(tmpl, null, 2));
  res.json({ ok: true, id });
});

/* ── Delete a site ──────────────────────────────────────── */
app.delete('/api/sites/:id', (req, res) => {
  const file = path.join(DATA, `${req.params.id}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ ok: true });
});

/* ── Upload an image ────────────────────────────────────── */
app.post('/api/upload/:id', (req, res) => {
  const { filename, data } = req.body as { filename: string; data: string };
  if (!filename || !data) return res.status(400).json({ error: 'Missing data' });
  const safe = filename.replace(/[^a-z0-9._-]/gi, '-').toLowerCase().slice(0, 120);
  const dir  = path.join(ROOT, 'generated-sites', req.params.id, 'assets');
  fs.mkdirSync(dir, { recursive: true });
  const b64  = data.replace(/^data:[^;]+;base64,/, '');
  fs.writeFileSync(path.join(dir, safe), Buffer.from(b64, 'base64'));
  res.json({ url: `assets/${safe}`, preview: `/site-assets/${req.params.id}/assets/${safe}` });
});

/* ── Generate a site ────────────────────────────────────── */
app.post('/api/generate/:id', (req, res) => {
  try {
    execSync(`npm run generate -- ${req.params.id}`, { cwd: ROOT, timeout: 30000 });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: String(e.stderr || e.message) });
  }
});

/* ── Download a generated site as HTML file ─────────────── */
app.get('/api/download/:id', (req, res) => {
  const file = path.join(ROOT, 'generated-sites', req.params.id, 'index.html');
  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: 'Site not generated yet — click Generate Site first.' });
  }
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.id}.html"`);
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(file);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n  ┌────────────────────────────────────┐');
  console.log(`  │  Site Editor  →  http://localhost:${PORT}  │`);
  console.log('  │  Press Ctrl+C to stop              │');
  console.log('  └────────────────────────────────────┘\n');
  try { execSync(`start http://localhost:${PORT}`, { stdio: 'ignore' }); } catch {}
});

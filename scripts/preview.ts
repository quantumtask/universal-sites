/**
 * preview.ts
 * Serves a generated site in the browser instantly.
 *
 * Usage:
 *   npm run preview <client-id>         — open a specific site
 *   npm run preview                     — show a list of available sites
 *
 * Example:
 *   npm run preview plumbify-london
 */

import path from 'path';
import http from 'http';
import { promises as fs } from 'fs';
import { execSync } from 'child_process';

const ROOT        = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'generated-sites');
const PORT        = 4321;

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
};

async function listSites(): Promise<string[]> {
  try {
    const entries = await fs.readdir(OUTPUT_PATH, { withFileTypes: true });
    const sites: string[] = [];
    for (const e of entries) {
      if (e.isDirectory()) {
        const index = path.join(OUTPUT_PATH, e.name, 'index.html');
        try { await fs.access(index); sites.push(e.name); } catch { /* skip */ }
      }
    }
    return sites;
  } catch {
    return [];
  }
}

function openBrowser(url: string) {
  const platform = process.platform;
  try {
    if (platform === 'win32')  execSync(`start "" "${url}"`, { stdio: 'ignore' });
    else if (platform === 'darwin') execSync(`open "${url}"`, { stdio: 'ignore' });
    else execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
  } catch { /* best-effort */ }
}

function serveDirectory(siteId: string) {
  const siteRoot = path.join(OUTPUT_PATH, siteId);

  const server = http.createServer(async (req, res) => {
    const reqPath = (req.url ?? '/').split('?')[0];
    const filePath = path.join(siteRoot, reqPath === '/' ? 'index.html' : reqPath);

    // Prevent directory traversal
    if (!filePath.startsWith(siteRoot)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }

    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        const index = path.join(filePath, 'index.html');
        const content = await fs.readFile(index);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
        return;
      }
      const ext  = path.extname(filePath).toLowerCase();
      const mime = MIME[ext] ?? 'application/octet-stream';
      const content = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': mime });
      res.end(content);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 – File not found');
    }
  });

  server.listen(PORT, '127.0.0.1', () => {
    const url = `http://localhost:${PORT}`;
    console.log(`\n  Preview server running`);
    console.log(`  Site     : ${siteId}`);
    console.log(`  URL      : ${url}`);
    console.log(`\n  Opening browser…`);
    console.log(`  Press Ctrl+C to stop\n`);
    openBrowser(url);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n  Port ${PORT} is already in use. Try stopping the other server first.`);
    } else {
      console.error('\n  Server error:', err.message);
    }
    process.exit(1);
  });
}

async function main() {
  const clientId = process.argv[2];

  if (!clientId) {
    const sites = await listSites();
    if (sites.length === 0) {
      console.log('\nNo generated sites found. Run: npm run generate');
      process.exit(0);
    }
    console.log('\nAvailable sites (run: npm run preview <id>):\n');
    sites.forEach((s) => console.log(`  npm run preview ${s}`));
    console.log('');
    process.exit(0);
  }

  const siteDir = path.join(OUTPUT_PATH, clientId);
  const indexFile = path.join(siteDir, 'index.html');

  try {
    await fs.access(indexFile);
  } catch {
    console.error(`\nSite not found: ${clientId}`);
    console.error(`Run "npm run generate ${clientId}" first to generate it.\n`);
    process.exit(1);
  }

  serveDirectory(clientId);
}

main();

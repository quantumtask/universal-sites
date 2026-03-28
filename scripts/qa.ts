import path from 'path';
import fs from 'fs';
import { promises as fsp } from 'fs';
import { listClientConfigs, loadClientConfig } from '../src/data/client-data';
import { validateClientConfig } from '../src/engine/validate';

const ROOT = path.resolve(__dirname, '..');
const GENERATED_PATH = path.join(ROOT, 'generated-sites');

function checkThemeColor(value: string | undefined, name: string, errors: string[]) {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    errors.push(`Missing theme color '${name}'`);
    return;
  }
  if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim())) {
    errors.push(`Theme color '${name}' has invalid hex value: ${value}`);
  }
}

function checkLinks(html: string, siteDir: string, errors: string[]) {
  const hrefRegex = /href="([^"]+)"/g;
  const idSet = new Set<string>();

  for (const idMatch of html.matchAll(/id="([^"]+)"/g)) {
    idSet.add(idMatch[1]);
  }

  for (const match of html.matchAll(hrefRegex)) {
    const href = match[1].trim();
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }

    if (href.startsWith('#')) {
      const target = href.slice(1);
      if (target && !idSet.has(target)) {
        errors.push(`Broken anchor link in generated site: ${href}`);
      }
      continue;
    }

    if (href.startsWith('javascript:')) {
      continue;
    }

    const targetPath = path.join(siteDir, href.replace(/^\//, ''));
    if (!targetPath.startsWith(siteDir)) {
      continue;
    }

    if (!fs.existsSync(targetPath)) {
      errors.push(`Missing linked asset/file: ${href}`);
    }
  }
}

function checkMinimalHtml(html: string, errors: string[]) {
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push('Missing <title> element');
  if (!/<meta\s+name="description"\s+content="[^"]+"\s*\/>/.test(html)) errors.push('Missing meta description element');
  if (!/<h1[^>]*>[^<]+<\/h1>/.test(html)) errors.push('Missing H1 heading');
  if (!/<h2[^>]*>[^<]+<\/h2>/.test(html)) errors.push('Missing H2 headings');
  if (html.includes('{{') || html.includes('}}')) errors.push('Found untranslated template tokens ({{...}})');
}

async function checkClientConfigs() {
  const clients = await listClientConfigs();
  const errors: string[] = [];

  for (const entry of clients) {
    const config = await loadClientConfig(entry);
    const fileName = path.basename(entry);

    const validateErrors = validateClientConfig(config);
    if (validateErrors.length > 0) {
      errors.push(`${fileName}: validation errors: ${validateErrors.join('; ')}`);
    }

    checkThemeColor(config.theme_colors?.primary, 'primary', errors);
    checkThemeColor(config.theme_colors?.secondary, 'secondary', errors);
    checkThemeColor(config.theme_colors?.accent, 'accent', errors);

    const logoCandidate = path.join(path.dirname(entry), config.logo_path || '');
    if (config.logo_path && !fs.existsSync(logoCandidate)) {
      console.warn(`${fileName}: logo asset missing at path ${config.logo_path} (optional but recommended)`);
    }
  }

  return errors;
}

async function checkGeneratedOutput() {
  const errors: string[] = [];
  const siteDirs = await fsp.readdir(GENERATED_PATH, { withFileTypes: true });

  for (const dirent of siteDirs) {
    if (!dirent.isDirectory()) continue;

    const siteDir = path.join(GENERATED_PATH, dirent.name);
    const indexFile = path.join(siteDir, 'index.html');

    if (!fs.existsSync(indexFile)) {
      errors.push(`${dirent.name}: missing index.html`);
      continue;
    }

    const html = await fsp.readFile(indexFile, 'utf-8');

    checkMinimalHtml(html, errors);
    checkLinks(html, siteDir, errors);

    const requiredSections = ['services', 'about', 'reviews', 'faq', 'lead', 'contact'];
    requiredSections.forEach((sectionId) => {
      if (!html.includes(`id="${sectionId}"`)) {
        errors.push(`${dirent.name}: missing required section id=${sectionId}`);
      }
    });
  }

  return errors;
}

async function main() {
  console.log('Running local QA checks for generated sites...');
  const configErrors = await checkClientConfigs();
  const outputErrors = await checkGeneratedOutput();

  const errors = [...configErrors, ...outputErrors];

  if (errors.length === 0) {
    console.log('OK: All QC checks passed. Site is safe to ship.');
    process.exit(0);
  }

  console.error('QC failed with the following issues:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

main().catch((err) => {
  console.error('Fatal QC script error:', err);
  process.exit(2);
});

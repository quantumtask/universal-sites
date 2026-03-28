import path from 'path';
import { promises as fs } from 'fs';
import { ClientSiteConfig } from '../types';
import { renderTemplate } from './template';
import { listClientConfigs, loadClientConfig } from '../data/client-data';
import { validateClientConfig } from './validate';

const ROOT = path.resolve(__dirname, '..', '..');
const STYLES_PATH = path.join(ROOT, 'shared', 'styles', 'tokens.css');
const OUTPUT_PATH = path.join(ROOT, 'generated-sites');

export type TemplateName = 'master' | 'tailwind';

function getTemplatePath(templateName: TemplateName): string {
  return path.join(ROOT, 'templates', templateName, 'index.html');
}

export async function generateSite(config: ClientSiteConfig, templateName: TemplateName = 'tailwind'): Promise<string> {
  const errors = validateClientConfig(config);
  if (errors.length > 0) {
    throw new Error(`Validation failed for ${config.id}: ${errors.join('; ')}`);
  }

  const templatePath = getTemplatePath(templateName);

  // Tailwind template is self-contained — no external styles needed
  const isTailwind = templateName === 'tailwind';
  const [template, styles] = await Promise.all([
    fs.readFile(templatePath, 'utf-8'),
    isTailwind ? Promise.resolve('') : fs.readFile(STYLES_PATH, 'utf-8'),
  ]);

  const html = renderTemplate(template, config, styles);
  const outDir = path.join(OUTPUT_PATH, config.id);
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, 'index.html');
  await fs.writeFile(outFile, html, 'utf-8');

  return outFile;
}

export async function generateAllSites(selectedId?: string, templateName: TemplateName = 'tailwind'): Promise<string[]> {
  const clients = await listClientConfigs();
  const generated: string[] = [];
  const failed: string[] = [];

  for (const configFile of clients) {
    if (selectedId && !configFile.startsWith(selectedId)) continue;

    const config = await loadClientConfig(configFile);
    if (!config.id) {
      failed.push(`${configFile}: missing id`);
      continue;
    }

    try {
      const output = await generateSite(config, templateName);
      generated.push(output);
    } catch (error) {
      failed.push(`${configFile}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failed.length > 0) {
    const message = `Some sites failed to generate:\n${failed.join('\n')}`;
    throw new Error(message);
  }

  if (generated.length === 0) {
    throw new Error('No sites generated. Please check client-data content or selectedId.');
  }

  return generated;
}

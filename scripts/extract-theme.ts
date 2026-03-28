/**
 * extract-theme.ts
 * Reads a logo.svg, extracts the dominant hex colors, and writes theme_colors
 * into the matching client JSON file.
 *
 * Usage:
 *   npm run extract-theme <client-id>
 *
 * Example:
 *   npm run extract-theme plumbify-london
 *
 * How it works:
 *   1. Reads generated-sites/<id>/assets/logo.svg
 *   2. Finds all hex colors (#RRGGBB or #RGB) used in fill/stroke attributes
 *   3. Clusters them into primary, secondary, and accent by perceived brightness
 *   4. Writes the result back into client-data/<id>.json as theme_colors
 */

import path from 'path';
import { promises as fs } from 'fs';

const ROOT = path.resolve(__dirname, '..');

function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const len = h.length === 3 ? 1 : 2;
  const r = parseInt(h.slice(0, len).padEnd(2, h[0]), 16) / 255;
  const g = parseInt(h.slice(len, len * 2).padEnd(2, h[len]), 16) / 255;
  const b = parseInt(h.slice(len * 2, len * 3).padEnd(2, h[len * 2]), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0, sat = 0;
  const lig = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = lig > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: hue = ((b - r) / d + 2) / 6; break;
      case b: hue = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(hue * 360), Math.round(sat * 100), Math.round(lig * 100)];
}

function expandHex(hex: string): string {
  if (hex.length === 4) {
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex;
}

function lightness(hex: string): number {
  return hexToHsl(hex)[2];
}

function saturation(hex: string): number {
  return hexToHsl(hex)[1];
}

function extractColorsFromSvg(svg: string): string[] {
  const pattern = /#[0-9a-fA-F]{3,6}/g;
  const found = [...new Set([...svg.matchAll(pattern)].map((m) => expandHex(m[0].toLowerCase())))];
  // Filter out near-black, near-white, and very low-saturation colors for cleaner palettes
  return found.filter((c) => {
    const l = lightness(c);
    const s = saturation(c);
    return l > 5 && l < 96 && s > 8;
  });
}

function pickTheme(colors: string[]): {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  surface: string;
} {
  if (colors.length === 0) {
    return { primary: '#1a3a5c', secondary: '#2563eb', accent: '#f59e0b', background: '#f8fafc', text: '#0f172a', surface: '#ffffff' };
  }

  // Sort by lightness ascending (darkest first)
  const sorted = [...colors].sort((a, b) => lightness(a) - lightness(b));

  // Primary = darkest saturated color
  const primary = sorted[0];

  // Secondary = next darkest or mid-range
  const secondary = sorted.length > 1 ? sorted[Math.floor(sorted.length * 0.3)] : sorted[0];

  // Accent = the most saturated color that differs from primary
  const accents = [...colors].sort((a, b) => saturation(b) - saturation(a));
  const accent = accents.find((c) => c !== primary) ?? accents[0];

  // Background = very light tint derived from primary hue
  const [ph] = hexToHsl(primary);
  const bgR = Math.min(255, 242 + Math.round(ph / 360 * 8));
  const bgG = Math.min(255, 247 + Math.round(ph / 360 * 6));
  const bgB = Math.min(255, 252 + Math.round(ph / 360 * 4));
  const background = `#${bgR.toString(16).padStart(2, '0')}${bgG.toString(16).padStart(2, '0')}${bgB.toString(16).padStart(2, '0')}`;

  return {
    primary,
    secondary,
    accent,
    background,
    text:    '#0d1b2a',
    surface: '#ffffff',
  };
}

async function main() {
  const clientId = process.argv[2];
  if (!clientId) {
    console.error('Usage: npm run extract-theme <client-id>');
    console.error('Example: npm run extract-theme plumbify-london');
    process.exit(1);
  }

  const svgPath  = path.join(ROOT, 'generated-sites', clientId, 'assets', 'logo.svg');
  const jsonPath = path.join(ROOT, 'client-data', `${clientId}.json`);

  let svgContent: string;
  try {
    svgContent = await fs.readFile(svgPath, 'utf-8');
  } catch {
    console.error(`Error: logo not found at ${svgPath}`);
    process.exit(1);
  }

  let config: Record<string, unknown>;
  try {
    config = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
  } catch {
    console.error(`Error: client config not found at ${jsonPath}`);
    process.exit(1);
  }

  const colors  = extractColorsFromSvg(svgContent);
  const theme   = pickTheme(colors);

  console.log(`\nColors found in logo: ${colors.join(', ')}`);
  console.log('\nGenerated theme:');
  console.log(JSON.stringify(theme, null, 2));

  config.theme_colors = theme;

  await fs.writeFile(jsonPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`\n✓ Written to ${jsonPath}`);
  console.log('Run: npm run generate ' + clientId);
}

main();

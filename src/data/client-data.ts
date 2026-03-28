import { promises as fs } from 'fs';
import path from 'path';
import { ClientSiteConfig } from '../types';

const DATA_DIRECTORY = path.resolve(__dirname, '..', '..', 'client-data');

export async function listClientConfigs(): Promise<string[]> {
  const entries = await fs.readdir(DATA_DIRECTORY);
  return entries.filter((it) => it.toLowerCase().endsWith('.json')); 
}

export async function loadClientConfig(name: string): Promise<ClientSiteConfig> {
  const data = await fs.readFile(path.join(DATA_DIRECTORY, name), 'utf-8');
  return JSON.parse(data) as ClientSiteConfig;
}

import path from 'path';
import { execSync } from 'child_process';

const workspaceRoot = path.resolve(__dirname, '..');
const generatorFile = path.join(workspaceRoot, 'src', 'generator.ts');

const args = process.argv.slice(2);
const runCmd = `ts-node ${JSON.stringify(generatorFile)} ${args.map(a => JSON.stringify(a)).join(' ')}`;

try {
  execSync(runCmd, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}

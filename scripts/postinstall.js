import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const baseVoltaPath = resolve(join(__dirname, '..', 'node_modules', 'base-volta-off-of-nwjs', 'index.js'));

if (existsSync(baseVoltaPath)) {
  execSync('node ' + baseVoltaPath);
}

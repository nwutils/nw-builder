import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const baseVoltaPath = resolve(join(__dirname, '..', 'node_modules', 'base-volta-off-of-nwjs', 'index.js'));

/**
 * When developing locally, we want to make sure the Node.js version
 * documented in the `volta` object in the `package.json` matches
 * whatever version of NW.js is installed, for manual testing purposes.
 * However, for those installing this library as a devDependency, they
 * will not have `base-volta-off-of-nwjs` installed, and nor should
 * they. So we skip this check for them.
 */
if (existsSync(baseVoltaPath)) {
  execSync('node ' + baseVoltaPath);
}

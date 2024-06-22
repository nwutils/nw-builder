import child_process from 'node:child_process';
import fs from 'node:fs';
import path  from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const baseVoltaPath = path.resolve(path.join(__dirname, '..', 'node_modules', 'base-volta-off-of-nwjs', 'index.js'));

/* Execute the script in development mode only since it is used during testing */
if (fs.existsSync(baseVoltaPath)) {
  child_process.execSync('node ' + baseVoltaPath);
}

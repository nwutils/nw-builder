import nwbuild from '../../src/index.js';

await nwbuild({
  mode: 'build',
  flavor: 'sdk',
  platform: 'win',
  srcDir: './tests/fixtures/app',
  cacheDir: './node_modules/nw',
  outDir: './tests/fixtures/out',
  glob: false,
  app: {
    name: 'Demo',
    /* Relative to where the manifest will be located */
    icon: './icon.ico',
  }
});

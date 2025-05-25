import nwbuild from '../../src/index.js';

await nwbuild({
  mode: 'package',
  flavor: 'sdk',
  platform: 'linux',
  srcDir: './tests/fixtures/app',
  cacheDir: './node_modules/nw',
  outDir: './tests/fixtures/out/linux',
  glob: false,
  appimage: true,
  logLevel: 'debug',
  app: {
    name: 'nw',
    genericName: 'nw',
    noDisplay: false,
    comment: 'Tooltip information',
    categories: ['Utility'],
    /* File path of icon from where it is copied. */
    icon: '/usr/bin/demo/package.nw/icon',
  }
});

console.log('\nExecute `npm run demo:exe:linux` to run the application.');

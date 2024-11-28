import nwbuild from '../../src/index.js';

await nwbuild({
  mode: 'build',
  version: '0.14.7',
  flavor: 'sdk',
  platform: 'linux',
  srcDir: './tests/fixtures/app',
  cacheDir: './node_modules/nw',
  outDir: './tests/fixtures/out/linux',
  glob: false,
  logLevel: 'debug',
  app: {
    name: 'Demo',
    genericName: 'Demo',
    noDisplay: false,
    comment: 'Tooltip information',
    /* File path of icon from where it is copied. */
    icon: './tests/fixtures/app/icon.png',
    hidden: false,
    // TODO: test in different Linux desktop environments
    // onlyShowIn: [],
    // notShowIn: [],
    dBusActivatable: true,
    // TODO: test in Linux environment
    // tryExec: '/path/to/exe?'
    exec: './tests/fixtures/out/linux/Demo',
  }
});

console.log('\nExecute `npm run demo:exe:linux` to run the application.');

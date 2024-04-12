const NwBuilder = require('nw-builder');

const nw = new NwBuilder({
  version: '0.86.0',
  files: './fixtures/demo/**',
});

nw.build();

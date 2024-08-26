#!/usr/bin/env node

import { program } from 'commander';

import nwbuild from './index.js';

program
  .option('--mode', 'get, run or build mode')
  .option('--version', 'NW.js version')
  .option('--flavor', 'NW.js build flavor')
  .option('--platform', 'NW.js supported platform')
  .option('--arch', 'NW.js supported architecture')
  .option('--downloadUrl', 'NW.js download server')
  .option('--manifestUrl', 'NW.js version info')
  .option('--cacheDir', 'Cache NW.js binaries')
  .option('--outDir', 'NW.js build artifacts')
  .option('--app', 'Platform specific app metadata. Refer to docs for more info')
  .option('--cache', 'Flag to enable/disable caching')
  .option('--ffmpeg', 'Flag to enable/disable downloading community ffmpeg')
  .option('--glob', 'Flag to enable/disable globbing')
  .option('--logLevel', 'Specify log level')
  .option('--zip', 'Flag to enable/disable compression')
  .option('--managedManifest', 'Managed manifest mode')
  .option('--nodeAddon', 'Download NW.js Node headers')

program.parse();

nwbuild({
  ...program.opts(),
  srcDir: program.args.join(' '),
  cli: true,
});

#!/usr/bin/env node

import { program } from 'commander';

import nwbuild from './index.js';

program
  .argument('<string>', 'File path(s) to project')
  .option('--mode <string>', 'get, run or build mode')
  .option('--version <string>', 'NW.js version')
  .option('--flavor <string>', 'NW.js build flavor')
  .option('--platform <string>', 'NW.js supported platform')
  .option('--arch <string>', 'NW.js supported architecture')
  .option('--downloadUrl <string>', 'NW.js download server')
  .option('--manifestUrl <string>', 'NW.js version info')
  .option('--cacheDir <string>', 'Cache NW.js binaries')
  .option('--outDir <string>', 'NW.js build artifacts')
  .option('--app <string>', 'Platform specific app metadata. Refer to docs for more info')
  .option('--cache <boolean>', 'Flag to enable/disable caching')
  .option('--ffmpeg <boolean>', 'Flag to enable/disable downloading community ffmpeg')
  .option('--glob <boolean>', 'Flag to enable/disable globbing')
  .option('--logLevel <string>', 'Specify log level')
  .option('--zip <string>', 'Flag to enable/disable compression')
  .option('--managedManifest <string>', 'Managed manifest mode')
  .option('--nodeAddon <boolean>', 'Download NW.js Node headers');

program.parse();

nwbuild({
  ...program.opts(),
  srcDir: program.args.join(' '),
  cli: true,
});

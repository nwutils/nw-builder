#!/usr/bin/env node

import process from 'node:process';
import { program } from 'commander';

import nwbuild from './index.js';
import util from './util.js';

program
  .argument('<string>', 'File path(s) to project')
  .option('--mode <string>', 'get, run or build mode', 'build')
  .option('--version <string>', 'NW.js version', 'latest')
  .option('--flavor <string>', 'NW.js build flavor', 'normal')
  .option('--platform <string>', 'NW.js supported platform', util.PLATFORM_KV[process.platform])
  .option('--arch <string>', 'NW.js supported architecture', util.ARCH_KV[process.arch])
  .option('--downloadUrl <string>', 'NW.js download server', 'https://dl.nwjs.io')
  .option('--manifestUrl <string>', 'NW.js versions info', 'https://nwjs.io/versions.json')
  .option('--cacheDir <string>', 'Cache NW.js binaries', './cache')
  .option('--outDir <string>', 'NW.js build artifacts', './out')
  .option('--app <object>', 'Platform specific app metadata. Refer to docs for more info', {})
  .option('--cache <boolean>', 'Enable/disable caching', true)
  .option('--ffmpeg <boolean>', 'Enable/disable community ffmpeg', false)
  .option('--glob <boolean>', 'Enable/disable globbing', true)
  .option('--logLevel <string>', 'Specify log level', 'info')
  .option('--shaSum <boolean>', 'Enable/disable shasum', true)
  .option('--zip <string>', 'Enable/disable compression', false)
  .option('--managedManifest <string>', 'Managed manifest mode', false)
  .option('--nodeAddon <boolean>', 'Download NW.js Node headers', false)
  .allowUnknownOption(true)
  .allowExcessArguments(true);

// Handle unknown --app.* arguments
const unknownArgs = program.parse(process.argv).args;
const appConfig = {};
for (const arg of unknownArgs) {
  const match = arg.match(/^--app\.([^.=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    appConfig[key] = value;
  }
}

// Compose final options object
const opts = {
  ...program.opts(),
  app: appConfig,
  srcDir: program.args.find((arg) => !arg.startsWith('--app')),
  cli: true,
};

nwbuild(opts);

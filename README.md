# nw-builder

[![npm](https://img.shields.io/npm/v/nw-builder.svg?style=flat)](https://www.npmjs.com/package/nw-builder)
[![Join the chat at https://gitter.im/nwjs/nw-builder](https://badges.gitter.im/nwjs/nw-builder.svg)](https://gitter.im/nwjs/nw-builder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Build [NW.js](https://github.com/nwjs/nw.js) applications for Mac, Windows and Linux.

## Installation

Install via `npm` or your package manager of choice:

```javascript
npm install nw-builder
```

## Usage

At a glance module usage:

```javascript
import { nwbuild } from "nw-builder";

nwbuild({
  srcDir: "./nwapp", // directory to store nw app files
  version: "0.69.1", // latest or stable or 0.x.y
  flavour: "sdk", //sdk (dev) or normal (prod)
  platform: "linux", //linux, osx, win
  arch: "x64", //ia32 or x64
  outDir: "./build",
  // flags with their default values
  cacheDir: "./cache", //directory to store nw binaries and shared libraries
  downloadUrl: "https://dl.nwjs.io",
  manifestUrl: "https://nwjs.io/versions",
  run: false, //run app to quickly demo it
  noCache: false, //delete and redownload nw version
  zip: false, // optionally zip files
});
```

At a glance CLI usage:

```shell
nwbuild ./nwapp --version=0.70.1 --flavour=sdk --platform=linux --arch=x64 --outDir=./build
```

## Contributing

1. Pick and install a Node version manager
   - Linux/OSX - [nvm](https://github.com/nvm-sh/nvm)
   - Win 7+/Linux/OSX - [volta](https://volta.sh)
1. Use your version manager to install Node 14.19 or above
1. Run `npm install`
1. `npm run demo` to test your changes at first glance
1. `npm t` to run unit tests
1. Don't forget to run `npm run format && npm run lint` before commiting your changes
1. Whenever possible, open an issue before submitting a pull request
1. Ensure there are tests that cover your changes

## License

[MIT](https://github.com/nwutils/nw-builder/blob/master/.github/LICENSE)

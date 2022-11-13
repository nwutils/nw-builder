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

```javascript

import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./nwapp",
  cacheDir: "./cache",
  version: "0.69.1",
  flavour: "sdk",
  platform: "linux",
  arch: "x64",
  outDir: "./build",
  // flags with their default values
  // these are implicitely defined unless
  // you want to change some behaviour
  downloadUrl: "https://dl.nwjs.io",
  manifestUrl: "https://nwjs.io/versions",
  run: false,
  noCache: false,
  zip: false
});

```

## Team

This project was created by [Steffen Müller](https://github.com/steffenmllr) and has been maintained by [Gabe Paez](https://github.com/gabepaez), [Andy Trevorah](https://github.com/trevorah), [Adam Lynch](https://github.com/adam-lynch) and [Rémy Boulanouar](https://github.com/DblK) in the past. This project is currently maintained by [Ayushman Chhabra](https://github.com/ayushmxn).

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

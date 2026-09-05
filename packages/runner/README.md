# @nwutils/runner

[![npm](https://img.shields.io/npm/v/@nwutils/runner/latest)](https://www.npmjs.com/package/@nwutils/runner/v/latest)

Run NW.js on Linux, MacOS and Windows hosts.

## Getting Started

1. Install [Volta](https://volta.sh)
1. `npm i` to install third party dependencies

## Usage

```js
import run from "@nwutils/runner";

const nwProcess = await run({
  version: "latest",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  srcDir: "./src",
  cacheDir: "./cache",
  argv: [],
});

nwProcess.kill();
```

## API Reference

Options

| Name     | Type                         | Description                                  |
| -------- | ---------------------------- | -------------------------------------------- |
| version  | `string`                     | Runtime version                              |
| flavor   | `"normal" \| "sdk"`          | Runtime flavor                               |
| platform | `"linux" \| "osx" \| "win"`  | Host platform                                |
| arch     | `"ia32" \| "x64" \| "arm64"` | Host architecture                            |
| cacheDir | `string`                     | Directory to cache NW binaries               |
| argv     | `string[]`                   | List of CLI arguments to be passed to NW.js. |

## Contributing

### External contributor

- Use Node.js standard libraries whenever possible.
- Prefer to use syncronous APIs over modern APIs which have been introduced in later versions.

### Maintainer

- npm trusted publishing is used for releases
- a package is released when a maintainer creates a release note for a specific version

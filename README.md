# @nwutils/doctor

[![npm](https://img.shields.io/npm/v/@nwutils/doctor/latest)](https://www.npmjs.com/package/@nwutils/doctor/v/latest)

Detect and configure Linux, MacOS and Windows platforms for NW.js development.

## Getting Started

1. `npm i` to install third party dependencies

## Usage

Calling the API

```js
import doctor from "@nwutils/doctor";

await doctor({
  version: "latest",
  manifestUrl: "https://nwjs.io/versions.json",
  cacheDir: "cache",
  srcDir: "./path/to/app",
});
```

The shell output

```shell
[ INFO ] The required Node.js version is: 26.1.0
[ WARN ] Your current Node.js version is: 24.18.0. Native addons may not build properly.
[ INFO ] Install the required Node.js version via a Node verssion manager (e.g., nvm, n, volta) or download it from https://nodejs.org/en/download/releases/.
[ INFO ] The latest npm version is: 12.0.2
[ WARN ] The current npm version is: 11.16.0
```

## API Reference

Options

| Name        | Type                                                                                                                            | Description                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| version     | `string \| "latest" \| "stable"`                                                                                                |
| manifestUrl | `"https://nwjs.io/versions.json" \| "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json"` | Versions manifest                                                                 |
| srcDir      | `string`                                                                                                                        | Directory containing the application's `package.json` (used to read `devEngines`) |
| cacheDir    | `string`                                                                                                                        | Directory to cache NW binaries                                                    |

## Contributing

### External contributor

- Use Node.js standard libraries whenever possible.
- Prefer to use syncronous APIs over modern APIs which have been introduced in later versions.

### Maintainer

- npm trusted publishing is used for releases
- a package is released when a maintainer creates a release note for a specific version

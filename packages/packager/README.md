# @nwutils/packager

[![npm](https://img.shields.io/npm/v/@nwutils/packager/latest)](https://www.npmjs.com/package/@nwutils/packager/v/latest)

Package NW.js applications for Linux, MacOS and Windows.

Currently supported: packaging a Linux application as an [AppImage](https://appimage.org/).

## Getting Started

1. `npm i` to install third party dependencies

## Usage

This composes with `@nwutils/builder`: run it against the `outDir` (and `app.name`)
that `@nwutils/builder` produced for `platform: "linux"`.

```js
import build from "@nwutils/builder";
import { appImage } from "@nwutils/packager";

await build({
  version: "0.115.0",
  platform: "linux",
  arch: "x64",
  srcDir: "./src",
  cacheDir: "./cache",
  outDir: "./out",
  app: {
    name: "Demo",
    icon: "icon.png",
    categories: "Utility;",
  },
});

const appImagePath = await appImage({
  appDir: "./out",
  appName: "Demo",
  cacheDir: "./cache",
  outDir: "./dist",
});

console.log(`AppImage written to ${appImagePath}`);
```

The first time it runs for a given architecture, `appImage()` downloads
[`appimagetool`](https://github.com/AppImage/appimagetool) into `cacheDir` and
reuses it on subsequent calls. `appimagetool` is a native Linux binary, so
`appImage()` only runs on a Linux host, targeting the host's own architecture
by default.

`appimagetool` is invoked with `APPIMAGE_EXTRACT_AND_RUN=1`, so a FUSE mount is
never required - useful in containers, CI runners and other sandboxes where
FUSE is typically unavailable.

## API Reference

### `appImage(options)`

Options

| Name            | Type                         | Description                                                                                                              |
| --------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| appDir          | `string`                     | Path to a built NW.js Linux application, ie. the `outDir` produced by `@nwutils/builder` for `platform: "linux"`         |
| appName         | `string`                     | Name of the application. Must match the `app.name` value used to build `appDir`                                          |
| icon            | `string`                     | Path to a `.png` or `.svg` icon. Defaults to the `Icon` value read from `<appDir>/<appName>.desktop`                     |
| arch            | `"ia32" \| "x64" \| "arm64"` | Target architecture. Defaults to the host architecture                                                                   |
| outDir          | `string`                     | Directory the resulting `.AppImage` file is written to. Defaults to the parent directory of `appDir`                     |
| cacheDir        | `string`                     | Directory used to cache the downloaded `appimagetool` binary. Defaults to `"./cache"`                                    |
| cache           | `boolean`                    | If true, reuse a cached `appimagetool` binary. Otherwise redownload it. Defaults to `true`                               |
| appImageToolUrl | `string`                     | Base URL `appimagetool-<arch>.AppImage` is downloaded from. Defaults to the `AppImage/appimagetool` "continuous" release |

Resolves with the path to the resulting `.AppImage` file.

The application's desktop entry file (`<appDir>/<appName>.desktop`, as written
by `@nwutils/builder`) is copied into the AppImage with its `Exec` and `Icon`
keys rewritten to match the AppImage's own layout, and a `Categories` key
added (defaulting to `Utility;`) if one isn't already present, since
`appimagetool` refuses to build an AppImage without one.

## Contributing

### External contributor

- Use Node.js standard libraries whenever possible.
- Prefer to use syncronous APIs over modern APIs which have been introduced in later versions.

### Maintainer

- npm trusted publishing is used for releases
- a package is released when a maintainer creates a release note for a specific version

# @nwutils/packager

[![npm](https://img.shields.io/npm/v/@nwutils/packager/latest)](https://www.npmjs.com/package/@nwutils/packager/v/latest)

Package NW.js applications for Linux, MacOS and Windows.

Supported output formats, selected via `format`:

| Format     | Platform | Status      |
| ---------- | -------- | ----------- |
| `AppImage` | Linux    | Implemented |
| `deb`      | Linux    | Planned     |
| `rpm`      | Linux    | Planned     |
| `MSIX`     | Windows  | Planned     |
| `NSIS`     | Windows  | Planned     |

## Getting Started

1. `npm i` to install third party dependencies

## Usage

This composes with `@nwutils/builder`: run it against the `outDir` (and `app.name`)
that `@nwutils/builder` produced.

```js
import build from "@nwutils/builder";
import { packageApp } from "@nwutils/packager";

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

const appImagePath = await packageApp({
  format: "AppImage",
  appDir: "./out",
  appName: "Demo",
  cacheDir: "./cache",
  outDir: "./dist",
});

console.log(`AppImage written to ${appImagePath}`);
```

`packageApp({ format, ...options })` dispatches to the packager for `format` -
`options` is whatever that packager expects (see `appImage(options)` below).
Passing a `format` that isn't `"AppImage"` yet throws a clear "not implemented
yet" error rather than doing nothing. `appImage` is also exported directly, if
you'd rather skip the dispatch and know you only ever target AppImage.

The first time it runs for a given architecture, `appImage()` downloads
[`appimagetool`](https://github.com/AppImage/appimagetool) into `cacheDir` and
reuses it on subsequent calls. `appimagetool` is a native Linux binary, so
`appImage()` only runs on a Linux host, targeting the host's own architecture
by default.

`appimagetool` is invoked with `APPIMAGE_EXTRACT_AND_RUN=1`, so a FUSE mount is
never required - useful in containers, CI runners and other sandboxes where
FUSE is typically unavailable.

## API Reference

### `packageApp({ format, ...options })`

| Name   | Type                                               | Description                                                                  |
| ------ | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| format | `"AppImage" \| "deb" \| "rpm" \| "MSIX" \| "NSIS"` | Which packager to run. Only `"AppImage"` is implemented today.               |
| ...    | -                                                  | The remaining options are passed through to the packager for `format` as-is. |

Resolves with the path to the resulting packaged artifact.

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

# @nwutils/packager

[![npm](https://img.shields.io/npm/v/@nwutils/packager/latest)](https://www.npmjs.com/package/@nwutils/packager/v/latest)

Package NW.js applications for Linux, MacOS and Windows.

Supported output formats, selected via `format`:

| Format     | Platform | Status      |
| ---------- | -------- | ----------- |
| `AppImage` | Linux    | Implemented |
| `deb`      | Linux    | Planned     |
| `rpm`      | Linux    | Planned     |
| `msix`     | Windows  | Planned     |
| `nsis`     | Windows  | Planned     |
| `dmg`      | MacOS    | Planned     |

## Getting Started

1. `npm i` to install third party dependencies

## Usage

Build the application.

```js
import build from "@nwutils/builder";
import packager from "@nwutils/packager";

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
```

### AppImage

```js
const appImagePath = await packager({
  format: "AppImage",
  appDir: "./out",
  appName: "Demo",
  cacheDir: "./cache",
  outDir: "./dist",
  sign: true,
  signKey: "ABCDEF1234567890",
});

console.log(`AppImage written to ${appImagePath}`);
```

Signing needs `gpg` installed on the host and the secret key imported into its
keyring. If the key is protected by a passphrase, set it in the
`APPIMAGETOOL_SIGN_PASSPHRASE` environment variable

## API Reference

### `packager({ format, ...options })`

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
| sign            | `boolean`                    | If true, embed a GPG signature in the AppImage. Defaults to `false`                                                      |
| signKey         | `string`                     | ID of the GPG key to sign with. Defaults to `gpg`'s default secret key. Requires `sign: true`                            |

Resolves with the path to the resulting `.AppImage` file.

## Contributing

### External contributor

- Use Node.js standard libraries whenever possible.
- Prefer to use syncronous APIs over modern APIs which have been introduced in later versions.

### Maintainer

- npm trusted publishing is used for releases
- a package is released when a maintainer creates a release note for a specific version

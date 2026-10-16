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
| `nsis`     | Windows  | Implemented |
| `dmg`      | MacOS    | Implemented |

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

### Self updating AppImages

Set `publish` to where releases are uploaded, and `version` to the app's
version.

- an `app-update.yml` describing `publish` is embedded next to the NW.js
  executable inside the AppImage, so the running app knows where to look
- a `latest-linux.yml` update info file (`latest-linux-<arch>.yml` for
  architectures other than `x64`) with the version, file name, size and SHA-512
  of the AppImage is written next to it in `outDir`

Upload both the AppImage and the update info file to every release.
[`@nwutils/updater`](https://www.npmjs.com/package/@nwutils/updater) reads them
at runtime to check for, download and install updates.

```js
await packager({
  format: "AppImage",
  appDir: "./out",
  appName: "Demo",
  outDir: "./dist",
  version: "1.2.0",
  publish: { provider: "github", owner: "nwutils", repo: "demo" },
  // Optional: also support zsync based updaters, see below.
  updateInformation: true,
});
// ./dist/Demo-x86_64.AppImage
// ./dist/latest-linux.yml
// ./dist/Demo-x86_64.AppImage.zsync (only with updateInformation)
```

| `publish.provider` | Other keys      | The latest release is looked up at                               |
| ------------------ | --------------- | ---------------------------------------------------------------- |
| `"github"`         | `owner`, `repo` | The latest (non draft, non prerelease) GitHub release's assets   |
| `"generic"`        | `url`           | `<url>/latest-linux.yml`, with the AppImage served from `<url>/` |

`updateInformation` additionally embeds AppImage update information, for zsync
based updaters such as AppImageUpdate, `appimageupdatetool` and AppImage
managers. `true` derives it from `publish`
(`gh-releases-zsync|<owner>|<repo>|latest|<AppImage>.zsync` or
`zsync|<url>/<AppImage>.zsync`); a string is embedded as-is. It needs
`zsyncmake` (usually packaged as `zsync`) installed on the host, and the
`.zsync` file must be uploaded alongside the AppImage.

### NSIS installer

Build the application with `platform: "win"` first, then:

```js
const installerPath = await packager({
  format: "nsis",
  appDir: "./out",
  appName: "Demo",
  version: "1.2.0",
  outDir: "./dist",
  icon: "./icon.ico",
  publisher: "ACME",
  license: "./LICENSE.txt",
});
// ./dist/Demo-x64-Setup.exe
```

The installer walks the user through a wizard and installs for the current
user only, into `%LOCALAPPDATA%\Programs\<appName>`, so it never asks for
administrator rights. It adds Start Menu and desktop shortcuts, and registers
an uninstaller in Windows' installed apps list. The uninstaller removes exactly
the files that were installed. Installing a new version first uninstalls the
previous one, matched by `appId`, and stops if that fails. If the application
is running, the installer and uninstaller ask the user to close it first;
in silent mode (`/S`) they exit with an error instead.

The installer refuses to run on Windows machines that can't run `arch`: x64
builds need x64 Windows, or ARM64 Windows 11, which emulates x64.

Run the installer with `/S` to install silently, and `/D=<dir>` (last, unquoted)
to choose the install directory.

It needs the NSIS compiler, `makensis`, installed on the host. It runs on
Linux (`apt install nsis`) and MacOS (`brew install makensis`) too, so a Windows
installer can be built from any platform. On Windows, `choco install nsis`.

### Self updating NSIS installs

Set `publish`, the same way as for [AppImages](#self-updating-appimages):

- an `app-update.yml` describing `publish` is installed next to
  `<appName>.exe`, and removed by the uninstaller
- a `latest.yml` update info file (`latest-<arch>.yml` for architectures other
  than `x64`) with the version, file name, size and SHA-512 of the installer is
  written next to it in `outDir`

```js
await packager({
  format: "nsis",
  appDir: "./out",
  appName: "Demo",
  version: "1.2.0",
  outDir: "./dist",
  publish: { provider: "github", owner: "nwutils", repo: "demo" },
});
// ./dist/Demo-x64-Setup.exe
// ./dist/latest.yml
```

Upload both the installer and `latest.yml` to every release.
[`@nwutils/updater`](https://www.npmjs.com/package/@nwutils/updater)'s
`NsisUpdater` downloads the new installer, checks it, and runs it with
`/S /UPDATE`. With `/UPDATE`, the installer waits up to 60 seconds for the
running application to exit instead of asking the user to close it, updates it
silently, and starts the new version. Because it installs for the current user,
updating never asks for administrator rights.

### DMG

Build the application with `platform: "osx"` first, then, on a MacOS host:

```js
const dmgPath = await packager({
  format: "dmg",
  appDir: "./out",
  appName: "Demo",
  arch: "arm64",
  outDir: "./dist",
  signIdentity: "Developer ID Application: ACME (TEAMID)",
});
// ./dist/Demo-arm64.dmg
```

The DMG holds the app next to a link to `/Applications`, so users install it by
dragging the app onto the link. It is made with `hdiutil`, and the app is signed
with `codesign` when `signIdentity` is set (`"-"` signs ad-hoc). Both are part
of MacOS, so DMGs are built on a MacOS host. Notarize the DMG afterwards, eg.
with `xcrun notarytool submit --wait` and `xcrun stapler staple`, so Gatekeeper
lets users open it.

### Self updating DMGs

Set `publish` and `version`. Updates don't use the DMG:

- an `app-update.yml` describing `publish` is added to the app's
  `Contents/Resources`
- a `<appName>-<arch>-mac.zip` of the app, made with `ditto` so permissions,
  symbolic links and the signature survive, is written next to the DMG
- a `latest-mac.yml` update info file (`latest-mac-<arch>.yml` for
  architectures other than `x64`) describing the zip is written next to it

```js
await packager({
  format: "dmg",
  appDir: "./out",
  appName: "Demo",
  arch: "arm64",
  outDir: "./dist",
  version: "1.2.0",
  signIdentity: "Developer ID Application: ACME (TEAMID)",
  publish: { provider: "github", owner: "nwutils", repo: "demo" },
});
// ./dist/Demo-arm64.dmg
// ./dist/Demo-arm64-mac.zip
// ./dist/latest-mac-arm64.yml
```

Upload all three to every release.
[`@nwutils/updater`](https://www.npmjs.com/package/@nwutils/updater)'s
`MacUpdater` downloads the zip, checks it, swaps it in for the running app and
restarts it. Adding `app-update.yml` changes the app, so sign it here with
`signIdentity` rather than before packaging. A signed app only accepts updates
signed by the same team.

## API Reference

### `packager({ format, ...options })`

| Name   | Type                                                        | Description                                                                      |
| ------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------- |
| format | `"AppImage" \| "deb" \| "rpm" \| "msix" \| "nsis" \| "dmg"` | Which packager to run. `"AppImage"`, `"nsis"` and `"dmg"` are implemented today. |
| ...    | -                                                           | The remaining options are passed through to the packager for `format` as-is.     |

Resolves with the path to the resulting packaged artifact.

### `appImage(options)`

Options

| Name              | Type                         | Description                                                                                                                                                   |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| appDir            | `string`                     | Path to a built NW.js Linux application, ie. the `outDir` produced by `@nwutils/builder` for `platform: "linux"`                                              |
| appName           | `string`                     | Name of the application. Must match the `app.name` value used to build `appDir`. Must not contain `/` or control characters                                   |
| icon              | `string`                     | Path to a `.png` or `.svg` icon. Defaults to the `Icon` value read from `<appDir>/<appName>.desktop`                                                          |
| arch              | `"ia32" \| "x64" \| "arm64"` | Target architecture. Defaults to the host architecture                                                                                                        |
| outDir            | `string`                     | Directory the resulting `.AppImage` file is written to. Defaults to the parent directory of `appDir`                                                          |
| cacheDir          | `string`                     | Directory used to cache the downloaded `appimagetool` binary. Defaults to `"./cache"`                                                                         |
| cache             | `boolean`                    | If true, reuse a cached `appimagetool` binary. Otherwise redownload it. Defaults to `true`                                                                    |
| appImageToolUrl   | `string`                     | Base URL `appimagetool-<arch>.AppImage` is downloaded from. Defaults to the `AppImage/appimagetool` "continuous" release. Must be https, except for localhost |
| sign              | `boolean`                    | If true, embed a GPG signature in the AppImage. Defaults to `false`                                                                                           |
| signKey           | `string`                     | ID of the GPG key to sign with. Defaults to `gpg`'s default secret key. Requires `sign: true`                                                                 |
| version           | `string`                     | Version of the application. Required with `publish`                                                                                                           |
| publish           | `PublishOptions`             | Where releases are published. Embeds `app-update.yml` and writes `latest-linux[-<arch>].yml` to `outDir`                                                      |
| updateInformation | `boolean \| string`          | AppImage zsync update information. `true` derives it from `publish`. Requires `zsyncmake` on the host                                                         |

Resolves with the path to the resulting `.AppImage` file.

### `nsis(options)`

Options

| Name              | Type                         | Description                                                                                                           |
| ----------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| appDir            | `string`                     | Path to a built NW.js Windows application, ie. the `outDir` produced by `@nwutils/builder` for `platform: "win"`      |
| appName           | `string`                     | Name of the application. Must match the `app.name` value used to build `appDir`. Must be a valid Windows file name    |
| version           | `string`                     | Version of the application, eg. `"1.2.0"`. Required                                                                   |
| arch              | `"ia32" \| "x64" \| "arm64"` | Architecture `appDir` was built for. Defaults to the host architecture                                                |
| outDir            | `string`                     | Directory the resulting `<appName>-<arch>-Setup.exe` file is written to. Defaults to the parent directory of `appDir` |
| icon              | `string`                     | Path to a `.ico` icon for the installer and uninstaller. Defaults to NSIS' own icon                                   |
| appId             | `string`                     | Name of the registry key the installation is recorded under. Defaults to `appName`. Keep it the same across releases  |
| publisher         | `string`                     | Publisher shown in Windows' installed apps list                                                                       |
| copyright         | `string`                     | Copyright notice written into the installer's version information                                                     |
| license           | `string`                     | Path to a `.txt` or `.rtf` license file the user has to accept                                                        |
| desktopShortcut   | `boolean`                    | If true, create a desktop shortcut. Defaults to `true`                                                                |
| startMenuShortcut | `boolean`                    | If true, create a Start Menu shortcut. Defaults to `true`                                                             |
| makensisPath      | `string`                     | Path to the NSIS compiler. Defaults to `makensis` on the `PATH`                                                       |
| publish           | `PublishOptions`             | Where releases are published. Installs `app-update.yml` and writes `latest[-<arch>].yml` to `outDir`                  |

Resolves with the path to the resulting installer `.exe` file.

### `dmg(options)`

Options

| Name         | Type               | Description                                                                                                                         |
| ------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| appDir       | `string`           | Path to a built NW.js MacOS application, ie. the `outDir` produced by `@nwutils/builder` for `platform: "osx"`                      |
| appName      | `string`           | Name of the application. Must match the `app.name` value used to build `appDir`: the bundle is expected at `<appDir>/<appName>.app` |
| arch         | `"x64" \| "arm64"` | Architecture `appDir` was built for. Defaults to the host architecture                                                              |
| outDir       | `string`           | Directory the resulting `<appName>-<arch>.dmg` file is written to. Defaults to the parent directory of `appDir`                     |
| volumeName   | `string`           | Name of the volume the DMG mounts as. Defaults to `appName`                                                                         |
| signIdentity | `string`           | Code signing identity to sign the app with, or `"-"` to sign ad-hoc. Not signed by default                                          |
| version      | `string`           | Version of the application. Required with `publish`                                                                                 |
| publish      | `PublishOptions`   | Where releases are published. Adds `app-update.yml` and writes `<appName>-<arch>-mac.zip` and `latest-mac[-<arch>].yml` to `outDir` |
| hdiutilPath  | `string`           | Path to `hdiutil`. Defaults to `hdiutil` on the `PATH`                                                                              |
| dittoPath    | `string`           | Path to `ditto`. Defaults to `ditto` on the `PATH`                                                                                  |
| codesignPath | `string`           | Path to `codesign`. Defaults to `codesign` on the `PATH`                                                                            |

Resolves with the path to the resulting `.dmg` file.

## Contributing

### External contributor

- Use Node.js standard libraries whenever possible.
- Prefer to use syncronous APIs over modern APIs which have been introduced in later versions.

### Maintainer

- npm trusted publishing is used for releases
- a package is released when a maintainer creates a release note for a specific version

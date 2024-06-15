# nw-builder

[![npm](https://img.shields.io/npm/v/nw-builder/latest)](https://www.npmjs.com/package/nw-builder/v/latest)
[![Join the chat at https://gitter.im/nwjs/nw-builder](https://badges.gitter.im/repo.svg)](https://app.gitter.im/#/room/#nwjs_nw-builder:gitter.im)

Build [NW.js](https://github.com/nwjs/nw.js) applications for Mac, Windows and Linux.

For version 3, please go to the [corresponding branch](https://github.com/nwutils/nw-builder/tree/v3).

## Major Features

- Get, run or build applications.
- Integrate [FFmpeg community builds](https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt)
- Configure executable fields and icons
- Downloading from mirrors
- Node Native Addon support

## Table of Contents

- [Installation](https://github.com/nwutils/nw-builder#install)
- [Usage](https://github.com/nwutils/nw-builder#usage)
- [Concepts](https://github.com/nwutils/nw-builder#concepts)
- [API Reference](https://github.com/nwutils/nw-builder#api-reference)
- [Guides](https://github.com/nwutils/nw-builder#guides)
- [Contributing](https://github.com/nwutils/nw-builder#contributing)
- [Roadmap](https://github.com/nwutils/nw-builder#roadmap)
- [FAQ](https://github.com/nwutils/nw-builder#faq)
- [License](https://github.com/nwutils/nw-builder#license)

## Install

Every NW.js release includes a modified Node.js binary at a specific version. It is recommended to [install](https://nodejs.org/en/download/package-manager) exactly that version on the host system. Not doing so may download ABI incompatible Node modules. Consult the NW.js [versions manifest](https://nwjs.io/versions) for what Node.js version to install. It is recommended to use a Node version manager (such as [volta](https://volta.sh), n, nvm, or nvm-windows) to be able to easily install and switch between Node versions.

For example, NW.js v0.83.0 comes with Node.js v21.1.0.

```shell
$: node --version
v21.1.0
```

## Usage

This package can be used via a command line interface, be imported as a JavaScript module, or configured via the Node manifest as a JSON object.

ESM import:

```javascript
import nwbuild from "nw-builder";
```

CJS import:

```javascript
let nwbuild;
import("nwbuild")
  .then((object) => {
    nwbuild = obj;
  })
  .catch((error) => {
    console.error(error);
  });
```

Node manifest usage:

```json
{
    "nwbuild": {
        // user specified options
    }
}
```

> From here on we will show `nw-builder` functionality by using the JavaScript module. Please note that the same method applies when using a command line or Node manifest.

## Concepts

`nw-builder` can get, run and build NW.js applications. We refer to them as get, run and build modes.

### Get Mode

> Deprecation warning: From v4.6.4 onward, run mode is deprecated. This logic will be ported over to nwjs/npm-installer repo and removed in the next major release.

By default you get the normal build of the latest NW.js release for your specific platform and arch. For more information, please refer to the API reference.

```javascript
nwbuild({
  mode: "get"
});
```

Get the community built FFmeg which contains proprietary codecs. This options is disabled by default. Please read the [license's constraints](https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#get-ffmpeg-binaries-from-the-community) before enabling this option.

```javascript
nwbuild({
  mode: "get",
  ffmpeg: true
});
```

Get Node headers if you have to rebuild Node addons.

```javascript
nwbuild({
  mode: "get",
  nativeAddon: "gyp"
});
```

### Run Mode

> Deprecation warning: From v4.6.0 onward, run mode is deprecated. This logic will be ported over to `nwjs/npm-installer` repo and removed in the next major release.

```javascript
nwbuild({
  mode: "run",
  srcDir: "./app",
  glob: false,
});
```

### Build Mode

Build with defaults:

```javascript
nwbuild({
  mode: "build",
});
```

Managed Manifest

You can let `nw-builder` manage your node modules. The `managedManifest` options accepts a `boolean`, `string` or `object` type. It will then remove `devDependencies`, autodetect and download `dependencies` via the relevant `packageManager`. If none is specified, it uses `npm` as default.

Setting it to `true` will parse the first Node manifest it encounters as the NW manifest.

```javascript
nwbuild({
  mode: "build",
  managedManifest: true,
});
```

Setting it to a `string` implies that you are passing the file path to the NW manifest.

```javascript
nwbuild({
  mode: "build",
  managedManifest: "./nw.js",
});
```

Setting it to a `object` implies you are directly passing the NW manifest as a JavaScript object.

```javascript
nwbuild({
  mode: "build",
  managedManifest: {
    name: "nwdemo",
    main: "index.html"
  },
});
```

Rebuild Node addons

Currently this feature is quite limited. It only builds node addons which have a `binding.gyp` file in the `srcDir`. There are plans to support nan, cmake, ffi and gn and auto rebuild native addons which are installed as node modules.

```javascript
nwbuild({
  mode: "build",
  nodeAddon: "gyp",
});
```

We recommend rebuilding Node addons for NW.js via `node-gyp` if you are using NW.js v0.83.0 or above.

```shell
node-gyp rebuild --target=21.1.0 --nodedir=/path/to/nw/node/headers
```

NW.js's Node version should match the Node version on the host machine due to [ABI differences in V8](https://github.com/nwjs/nw.js/issues/5025).

## API Reference

Options

| Name | Type    | Default   | Description |
| ---- | ------- | --------- | ----------- |
| app | `LinuxRc \| WinRc \| OsxRc` | Additional options for each platform. (See below.)
| mode | `"get" \| "run" \| "build"` | `"build"` | Choose between get, run or build mode |
| version | `string \| "latest" \| "stable"` | `"latest"` | Runtime version |
| flavor | `"normal" \| "sdk"` | `"normal"` | Runtime flavor |
| platform | `"linux" \| "osx" \| "win"` | | Host platform |
| arch | `"ia32" \| "x64" \| "arm64"` | | Host architecture |
| downloadUrl | `"https://dl.nwjs.io" \| "https://npm.taobao.org/mirrors/nwjs" \| https://npmmirror.com/mirrors/nwjs \| "https://github.com/corwin-of-amber/nw.js/releases/"` | `"https://dl.nwjs.io"` | Download server. Supports file systems too (for example `file:///home/localghost/nwjs_mirror`) |
| manifestUrl | `"https://nwjs.io/versions" \| "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json"` | `"https://nwjs.io/versions"` | Versions manifest |
| cacheDir | `string` | `"./cache"` | Directory to cache NW binaries |
| srcDir | `string` | `"./"` | File paths to application code |
| outDir | `string` | `"./out"` | Directory to store build artifacts |
| managedManifest | `boolean \| string \| object` | `false` | Managed manifest |
| nodeAddon | `false \| "gyp"` | `false` | Rebuild Node native addons |
| cache | `boolean` | `true`| If true the existing cache is used. Otherwise it removes and redownloads it. |
| ffmpeg | `boolean` | `false`| If true the chromium ffmpeg is replaced by community version with proprietary codecs. |
| glob | `boolean` | `true`| If true file globbing is enabled when parsing `srcDir`. |
| logLevel | `"error" \| "warn" \| "info" \| "debug"` | `"info"`| Specify level of logging. |
| zip | `boolean \| "zip" \| "tar" \| "tgz"` | `false`| If true, "zip", "tar" or "tgz" the `outDir` directory is compressed. |

### `app` configuration object

This object defines additional properties used for building for a specific platform. For each platform, pass an object with appropriate values:

#### Windows-specific options (`WinRc`)

| Name | Type    | Default   | Description |
| ---- | ------- | --------- | ----------- |
| `icon` | `string` | `undefined` | The path to the icon file. It should be a .ico file. |
| `name` | `string` | Value of `name` in app's `package.json` | The name of the application |
| `version` | `string` | Value of `version` in app's `package.json` | The version of the application |
| `comments` | `string` | `undefined` | Additional information that should be displayed for diagnostic purposes. |
| `company` | `string` | `undefined` | Company that produced the file—for example, Microsoft Corporation or Standard Microsystems Corporation, Inc. This string is required. |
| `fileDescription` | `string` | Value of `description` in app's `package.json` | File description to be presented to users. This string may be displayed in a list box when the user is choosing files to install. For example, Keyboard Driver for AT-Style Keyboards. This string is required. |
| `fileVersion` | `string` | Value of `version` in app's `package.json` | Version number of the file. For example, 3.10 or 5.00.RC2. This string is required. |
| `internalName` | `string` | `undefined` |Internal name of the file, if one exists—for example, a module name if the file is a dynamic-link library. If the file has no internal name, this string should be the original filename, without extension. This string is required. |
| `legalCopyright` | `string` | NW.js' copyright info | Copyright notices that apply to the file. This should include the full text of all notices, legal symbols, copyright dates, and so on. This string is optional. |
| `legalTrademark` | `string` | `undefined` | Trademarks and registered trademarks that apply to the file. This should include the full text of all notices, legal symbols, trademark numbers, and so on. This string is optional. |
| `originalFilename` | `string` | Value of `name` option | Original name of the file, not including a path. This information enables an application to determine whether a file has been renamed by a user. The format of the name depends on the file system for which the file was created. This string is required. |
| `privateBuild` | `string` | `undefined` | Information about a private version of the file—for example, Built by TESTER1 on \\TESTBED. |
| `productName` | `string` | Matches the package name defined in app's `package.json` | Name of the product with which the file is distributed. This string is required. |
| `productVersion` | `string` | Value of `version` in app's `package.json` | Version of the product with which the file is distributed—for example, 3.10 or 5.00.RC2. |
| `specialBuild` | `string` | `undefined` | Text that specifies how this version of the file differs from the standard version—for example, Private build for TESTER1 solving mouse problems on M250 and M250E computers. |

#### Linux-specific options (`LinuxRc`)

| Name | Type    | Description |
| ---- | ------- | ----------- |
| name | `string` | Name of the application |
| genericName | `string` | Generic name of the application |
| noDisplay | `boolean` | If true the application is not displayed |
| comment | `string` | Tooltip for the entry, for example "View sites on the Internet". |
| icon | `string` | Icon to display in file manager, menus, etc. |
| hidden | `boolean` | TBD |
| onlyShowIn | `string[]` | A list of strings identifying the desktop environments that should display a given desktop entry |
| notShowIn | `string[]` | A list of strings identifying the desktop environments that should not display a given desktop entry |
| dBusActivatable | `boolean` | A boolean value specifying if D-Bus activation is supported for this application |
| tryExec | `string` | Path to an executable file on disk used to determine if the program is actually installed |
| exec | `string` | Program to execute, possibly with arguments. |
| path | `string` | If entry is of type Application, the working directory to run the program in. |
| terminal | `boolean` | Whether the program runs in a terminal window. |
| actions | `string[]` | Identifiers for application actions. |
| mimeType | `string[]` | The MIME type(s) supported by this application. |
| categories | `string[]` | Categories in which the entry should be shown in a menu |
| implements | `string[]` | A list of interfaces that this application implements. |
| keywords | `string[]` | A list of strings which may be used in addition to other metadata to describe this entry. |
| startupNotify | `boolean` | If true, it is KNOWN that the application will send a "remove" message when started with the DESKTOP_STARTUP_ID environment variable set. If false, it is KNOWN that the application does not work with startup notification at all. |
| startupWMClass | `string` | If specified, it is known that the application will map at least one window with the given string as its WM class or WM name hin |
| prefersNonDefaultGPU | `boolean` | If true, the application prefers to be run on a more powerful discrete GPU if available. |
| singleMainWindow | `string` | If true, the application has a single main window, and does not support having an additional one opened. |

#### MacOS-specific options (`OsxRc`)

| Name | Type    | Description |
| ---- | ------- | ----------- |
| name | `string` | The name of the application |
| icon | `string` | The path to the icon file. It should be a .icns file. |
| LSApplicationCategoryType | `string` | The category that best describes your app for the App Store. |
| CFBundleIdentifier | `string` | A unique identifier for a bundle usually in reverse DNS format. |
| CFBundleName | `string` | A user-visible short name for the bundle. |
| CFBundleDisplayName | `string` | The user-visible name for the bundle. |
| CFBundleSpokenName | `string` | A replacement for the app name in text-to-speech operations. |
| CFBundleVersion | `string` | The version of the build that identifies an iteration of the bundle. |
| CFBundleShortVersionString | `string` | The release or version number of the bundle. |
| NSHumanReadableCopyright | `string` | A human-readable copyright notice for the bundle. |


## Guides

### Get unofficial MacOS builds

If you're running older Apple machines, you can download the unofficial builds.

> Note: You will have to manually remove quarantine flag.

```shell
sudo xattr -r -d com.apple.quarantine /path/to/nwjs.app
```

```javascript
nwbuild({
  mode: "get",
  platform: "osx",
  arch: "arm64",
  downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
  manifestUrl: "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json",
});
```

> Note: Community FFmpeg binaries may not be available for unofficial builds. You will have to rebuild them yourself.

### Get binaries via mirrors

China mirror:

```javascript
nwbuild({
  mode: "get",
  downloadUrl: "https://npm.taobao.org/mirrors/nwjs",
});
```

Singapore mirror:

```javascript
nwbuild({
  mode: "get",
  downloadUrl: "https://cnpmjs.org/mirrors/nwjs/",
});
```

### Let `nw-builder` manage your native addons

> Note: this behaviour is buggy and quite limited. This guide is to show what will be possible in the coming minor releases.

```javascript
nwbuild({
  mode: "build",
  managedManifest: true,
  nativeAddon: "gyp",
});
```

## Contributing

### External contributor

- We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) style of commit messages.
- On opening a new PR, the comments will guide you on how to construct the new PR.
- Pull requests are squashed and merged onto the `main` branch.
- PR title is used as commit's first line, PR description is used as commit body.
- Only commit messages starting with `fix`, `feat` and `chore` are recognised by the Release Please bot.
- Lint your code before commiting your change.
- Add tests whenever possible.

### Maintainer guidelines

- Approve pull requests before merging.
- Enforce conventional commits before merging pull requests.
- A commit's first line should be formatted as `<type>[optional scope]: <description>`.
- A commit's body should have a description of changes in bullet points followed by any links it references or issues it fixes or closes.
- Google's Release Please Action is used to update the changelog, bump the package version and generate GitHub releases.
- NPM Publish Action publishes to `npm` if there is a version bump.

## Roadmap

### Bugs

- Managed Manifest is broken. If glob is disabled and srcDir has no package.json, build fails.
- Add back error, info, warn and debug logs

### Features

- feat(get): support canary releases
- feat(bld): rename MacOS Helper apps
- feat(pkg): add `AppImage` installer
- feat(pkg): add `NSIS` installer
- feat(pkg): add `DMG` installer
- feat(get): add Linux ARM unofficial support
- feat(bld): add source code protection
- feat(pkg): add code signing

### Chores

- chore(docs): don't store JSDoc definitions in `typedef`s - get's hard to understand during development.
- chore(get): verify sha checksum for downloads
- chore: annotate file paths as `fs.PathLike` instead of `string`.
- chore(bld): factor out core build step
- chore(bld): factor out linux config
- chore(bld): factor out macos config
- chore(bld): factor out windows config
- chore(bld): factor out native addon
- chore(bld): factor out compressing
- chore(bld): factor out managed manifest
- chore(bld): move `.desktop` entry file logic to `create-desktop-shortcuts` package

## FAQ

## License

MIT License.

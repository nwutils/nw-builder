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
| mode | `"get" \| "run" \| "build"` | `"build"` | Choose between get, run or build mode |
| version | `string \| "latest" \| "stable"` | `"latest"` | Runtime version |
| flavor | `"normal" \| "sdk"` | `"normal"` | Runtime flavor |
| platform | `"linux" \| "osx" \| "win"` | | Host platform |
| arch | `"ia32" \| "x64" \| "arm64"` | | Host architecture |
| downloadUrl | `"https://dl.nwjs.io" \| "https://npm.taobao.org/mirrors/nwjs" \| https://npmmirror.com/mirrors/nwjs \| "https://github.com/corwin-of-amber/nw.js/releases/"` | `"https://dl.nwjs.io"` | Download server |
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
- When making changes, try to follow [SOLID](https://en.wikipedia.org/wiki/SOLID) and [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principles.
- Pull requests are squashed and merged onto the `main` branch.
- Lint your code before commiting your change.
- Add tests whenever possible.

### Maintainer guidelines

## Roadmap

### Bugs

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

- chore(cicd): use `google-github-actions/release-please-action` to automate publishing to npm, updating changelog and creating releases
- chore(cli): migrate from `yargs` to `commander`
- chore(get): verify sha checksum for downloads
- chore(util): factor out nw file paths finder
- chore(get): factor out https downloader
- chore(get): factor out nwjs downloader
- chore(get): factor out ffmpeg downloader
- chore(get): factor out node headers downloader
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

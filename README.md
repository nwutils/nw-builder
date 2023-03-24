# nw-builder

[![npm](https://img.shields.io/npm/v/nw-builder.svg?style=flat)](https://www.npmjs.com/package/nw-builder)
[![Join the chat at https://gitter.im/nwjs/nw-builder](https://badges.gitter.im/nwjs/nw-builder.svg)](https://gitter.im/nwjs/nw-builder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Build [NW.js](https://github.com/nwjs/nw.js) applications for Mac, Windows and Linux.

## Major Features

- Build for Linux, MacOS, and Windows
- Support downloading [from](https://npm.taobao.org/mirrors/nwjs) [mirrors](https://npmmirror.com/mirrors/nwjs)
- Integrate [`nwjs-ffmpeg-prebuilt`](https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt)
- Configure executable fields and icons

## Installation

Install `nw-builder` via `npm` or your preferred Node package manager of choice.

```shell
npm i -D nw-builder
```

## Usage

### Run your first application

Module usage

```javascript
import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./nwapp/*",
  mode: "run",
  version: "latest",
  flavor: "sdk",
});
```

CLI usage

```shell
nwbuild ./nwapp/* --mode=run --version=latest --flavor=sdk
```

package.json usage

`./nwapp/package.json`

```json
{
  "name": "nwdemo",
  "main": "./index.html",
  "nwbuild": {
    "srcDir": "./nwapp/*",
    "mode": "run",
    "version": "latest",
    "flavor": "sdk"
  }
}
```

### Build your first application

Module usage

```javascript
import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./nwapp/*",
  mode: "build",
  version: "latest",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  outDir: "./out",
});
```

CLI usage

```shell
nwbuild ./nwapp/* --mode=build --version=latest --flavor=normal --platform=linux --arch=x64 --outDir=./out
```

package.json usage

`./nwapp/package.json`

```json
{
  "name": "nwdemo",
  "main": "./index.html",
  "nwbuild": {
    "srcDir": "./nwapp/*",
    "mode": "build",
    "version": "latest",
    "flavor": "normal",
    "platform": "linux",
    "arch": "x64",
    "outDir": "./out"
  }
}
```

## Limitations

- #716 File permissions are incorrectly set for Linux or MacOS apps built on Windows platform.

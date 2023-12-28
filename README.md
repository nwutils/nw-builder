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

## Installation

With npm:

```shell
npm i -D nw-builder
```

With yarn:

```shell
yarn add -D nw-builder
```

With pnpm:

```shell
pnpm add -D nw-builder
```

## Usage

You can use this package via CLI or JavaScript module. To customise your configuration options, please consult the [documentation](https://nwutils.io/nw-builder/).

### CLI

Download NW.js binary

```shell
nwbuild --mode=get
```

Run NW.js application

```shell
nwbuild --mode=run
```

Build NW.js application

```shell
nwbuild --mode=get
```

### Module

ESM import

```javascript
import nwbuild from "nw-builder";
```

CJS import

```javascript
import nwbuild from "nw-builder";

let nwbuild = undefined;

nwbuild = await import("nw-builder").default;
```

Download NW.js binary

```javascript
nwbuild({
  mode: "get",
});
```

Run NW.js application

```javascript
nwbuild({
  mode: "run",
});
```

Build NW.js application

```javascript
nwbuild({
  mode: "build",
});
```

## Alternatives

- [nw-builder-platforms](https://github.com/naviapps/nw-builder-platforms) - Fork of this repo with platform specific build options
- [nwjs-builder-phoenix](https://github.com/evshiron/nwjs-builder-phoenix) - Previously the most used build tool, however it is no longer maintained

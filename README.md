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

Check out the [documentation](https://nwutils.io/nw-builder/) if you wish to give `nw-builder` a try.

> Please note that the documentation assumes you know [how to write NW.js applications](https://nwjs.readthedocs.io/en/latest/For%20Users/Getting%20Started/).

## Installation

With npm:

```shell
npm install nw-builder -D
```

With yarn:

```shell
yarn add nw-builder -D
```

With pnpm:

```shell
pnpm add nw-builder -D
```

## Usage

Here is two way to use nw-build to build your nwjs applications

### CLI

1. To get nwjs cache
    ```bash
    nwbuild --mode=get
    ```
2. To run nwjs application
    ```bash
    nwbuild --mode=run
    ```
3. To build nwjs application
    ```bash
    nwbuild --mode=build
    ```

### JavaScript API
1. Define an npm script
    ```json
    {
      "scripts": {
        "build": "node scripts/build.js"
      }
    }
    ```
2. Create a build script
    ```javascript
    // scripts/build.js
    const { nwbuild } = require("nw-builder");
    await nwbuild({
      srcDir: "./nwapp/**/* ./other/**/*.js",
      mode: "build",
      version: "latest",
      flavor: "normal",
      platform: "linux",
      arch: "x64",
      outDir: "./build",
      cache: false,
      app: { ... },
    });
    ```
3. Run the script
    ```bash
    npm run build
    ```

## Alternatives

- [nw-builder-platforms](https://github.com/naviapps/nw-builder-platforms) - Fork of this repo with platform specific build options
- [nwjs-builder-phoenix](https://github.com/evshiron/nwjs-builder-phoenix) - Previously the most used build tool, however it is no longer maintained

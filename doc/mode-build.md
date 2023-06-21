# Build NW.js applications

Module usage:

```javascript
nwbuild({
  mode: "build",
});
```

This is equivalent to:

```javascript
nwbuild({
  mode: "get",
  version: "latest",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  downloadUrl: "https://dl.nwjs.io",
  manifestUrl: "https://nwjs.io/versions",
  cacheDir: "./cache",
  outDir: "./out"
  srcDir: ".",
  cache: true,
  ffmpeg: false
});
```

CLI usage:

```shell
nwbuild --mode=build --glob=false
```

This is equivalent to:

```shell
nwbuild --mode=build --version=latest --flavor=normal --platform=linux --arch=x64 --downloadUrl=https://dl.nwjs.io --manifestUrl=https://nwjs.io/versions --cacheDir=./cache --outDir=./out --cache=true --ffmpeg=false --glob=false .
```

Note: File permissions are incorrectly set for Linux or MacOS apps built on Windows platform.

> [The Windows platform only supports the changing of the write permission. It also does not support the distinction between the permissions of user, group, or others.](https://www.geeksforgeeks.org/node-js-fs-chmod-method/)

When the `platform` and `arch` are not specified, they default to the host platform and arch. For this guide, we are assumed to be using Linux x64.

Note: To edit Windows executable resources, we use [`rcedit`](https://github.com/electron/node-rcedit). To use rcedit on non-Windows platforms, you will have to install [Wine](https://www.winehq.org/).

Note: We recursively glob the file patterns given by the user. The first `package.json` parsed is taken to be the NW.js manifest file. If you have multiple manifest files, the first glob pattern should be the path to the NW.js manifest.

For example, if we have a project with file structure as below:

`/project`:

```shell
/web/index.js
/web/package.json # Node manifest
/nw/package.json # NW.js manifest
/package.json # Monorepo Node manifest
```

We can specify `nw/package.json` as the first glob pattern so that all [NW.js manifest properties](https://nwjs.readthedocs.io/en/latest/References/Manifest%20Format/) are taken from this file and applied to the application.

Module usage:

```javascript
nwbuild({
  srcDir: "nw/package.json web/**/*",
});
```

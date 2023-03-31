# Build NW.js applications

> Currently file globbing is broken and it is recommended to disable it.

Module usage:

```javascript
nwbuild({
  mode: "build",
  glob: false,
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
  ffmpeg: false,
  glob: false,
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

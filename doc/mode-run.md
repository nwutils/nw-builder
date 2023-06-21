# Run NW.js applications

Module usage:

```javascript
nwbuild({
  mode: "run",
});
```

This is equivalent to:

```javascript
nwbuild({
  mode: "run",
  version: "latest",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  downloadUrl: "https://dl.nwjs.io",
  manifestUrl: "https://nwjs.io/versions",
  cacheDir: "./cache",
  srcDir: ".",
  cache: true,
  ffmpeg: false,
});
```

CLI usage:

```shell
nwbuild --mode=run --glob=false
```

This is equivalent to:

```shell
nwbuild --mode=run --version=latest --flavor=normal --platform=linux --arch=x64 --downloadUrl=https://dl.nwjs.io --manifestUrl=https://nwjs.io/versions --cacheDir=./cache --cache=true --ffmpeg=false --glob=false .
```

> When the `platform` and `arch` are not specified, they default to the host platform and arch. For this guide, we are assumed to be using Linux x64.

This is useful if you want to run your application without building it.

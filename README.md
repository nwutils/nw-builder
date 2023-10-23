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

## Alternatives

- [nw-builder-platforms](https://github.com/naviapps/nw-builder-platforms) - Fork of this repo with platform specific build options
- [nwjs-builder-phoenix](https://github.com/evshiron/nwjs-builder-phoenix) - Previously the most used build tool, however it is no longer maintained

## Migration Guide (v3 -> v4)

> We are working on making the migration process smoother. If you encounter any issues with the current guide, please open an issue or start a discussion.

### Update `nw-builder`

With npm:

```shell
npm update nw-builder@latest
```

With yarn:

```shell
yarn upgrade nw-builder@latest
```

With pnpm:

```shell
pnpm update nw-builder@latest
```

### Update options

Let's take an example of v3 code and migrate it to v4.

```javascript
const NwBuilder = require("nw-builder");

const nw = new NwBuilder({
  files: ["./nwapp/**/*", "./other/**/*.js"],
  version: "latest",
  flavor: "normal",
  platforms: ["win32", "win64", "osx32", "osx64", "linux32", "linux64"],
  cacheDir: "./cache",
  buildDir: "./build",
  buildType: "versioned",
  forceDownload: true,
  appName: "nwdemo",
  appVersion: "0.1.0",
  argv: "--nw-stderr-logging",
  macCredits: "./nwapp/credits.html",
  macIcns: "./nwapp/mac.icns",
  macPlist: { ... },
  winVersionString: { ... },
  winIco: "./nwapp/win.ico",
  zip: true,
  macZip: false,
  mergeZip: false,
});

nw.build();
```

Update the import path

```diff
-const NwBuilder = require("nw-builder");
+const nwbuild = require("nw-builder");
```

Replace the `NwBuilder` initialization with a function

```diff
-const nw = new NwBuilder({
+await nwbuild({
```

The `files` property has been renamed to `srcDir`.

```diff
-  files: ["./nwapp/**/*", "./other/**/*.js"],
+  srcDir: "./nwapp/**/* ./other/**/*.js",
```

Add the `mode` option and remove the now redundant `nw.build` function call. The `build` call is made by `nwbuild` internally.

```diff
+  mode: "build",

-nw.build();
```

The `platforms` option has been removed and replaced with `platform` and `arch`. Notice that one `nwbuild` function call now creates one build for one platform and one arch only.

```diff
-  platforms: ["win32", "win64", "osx32", "osx64", "linux32", "linux64"],
+  platform: "linux", // "osx" for MacOS "win",  for Windows
+  arch: "x64", // "ia32" for 32 bit or "arm64" for arm based 65 bit architectures
```

The `buildDir` option has been rename to `outDir`.

```diff
-  buildDir: "./build",
+  outDir: "./build",
```

The `buildType` option has been removed.

```diff
-  buildType: "versioned",
```

The `forceDownload` option has been changed to `cache`.

```diff
-  forceDownload: true,
+  cache: false,
```

The `appName` option has been changed to `app.name`.

```diff
-  appName: "nwdemo",
+  app: { name: "nwdemo" },
```

The `appVersion` option has been changed to `app.version`.

```diff
-  appVersion: "0.1.0",
+  app: { version: "0.1.0" },
```

The `macCredit` option has been removed.

```diff
-  macCredits: "./nwapp/credits.html",
```

The `macIcns` option has been replaced with `icon`.

```diff
-  macIcns: "./nwapp/mac.icns",
+  icon: "./nwapp/mac.icns",
```

The `macPlist` option has been replaced by `app.*` options. Consult the [documentation](https://nwutils.io/nw-builder/mode-build.html#osxrc-object) for valid properties.

```diff
-  macPlist: { ... },
+  app: { ... },
```

The `winVersionString` option has been replaced with `app`. Consult the [documentation](https://nwutils.io/nw-builder/mode-build.html#winrc-object) for valid properties.

```diff
-  winVersionString: {
-    'CompanyName': 'Some Company',
-    'FileDescription': 'Process Name',
-    'ProductName': 'Some Product',
-    'LegalCopyright': 'Copyright 2017',
-  }
+  app: {
+    company: "Some Company",
+    fileDescription: "Process Name",
+    productName: "Some Product",
+    legalCopyright: "Copyright (c) 2023",
+  }
```

The `winIco` option has been replaced by `app.icon`.

```diff
-  winIco: "./nwapp/win.ico",
+  app: { icon: "./nwapp/win.ico" },
```

The `macZip` option has been removed.

```diff
-  macZip: false,
```

The `mergeZip` option has been removed.

```diff
-  mergeZip: false,
```

The final code should look like this.

```javascript
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

# Migration to v4

## Why you should migrate

- Generate Desktop Entry file for Linux builds
- Edit executable for Windows builds
- Improve compression of build artifacts
- ES Modules support

### Update `nw-builder`

With npm:

```shell
npm update @nw-builder@^4.0.0
```

With parn:

```shell
yarn upgrade @nw-builder@^4.0.0
```

With npm:

```shell
pnpm update @nw-builder@^4.0.0
```

> Note: `nw-builder` has been tested on Node 16 and 18 only.

### Module usage

Let's take an example of v3 code and migrate it to v4.

```javascript
const NwBuilder = require("nw-builder");

const nw = new NwBuilder({
  files: ["./nwapp", "./other/**/*.js"],
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

```patch
-const NwBuilder = require("nw-builder");
+const { nwbuild } = require("nw-builder");
```

Replace the `NwBuilder` initialization with a function

```patch
-const nw = new NwBuilder({
+nwbuild({
```

The `files` property has been renamed to `srcDir`. As the name suggests, it does not taken in any globbing patterns. The processing of how users want to structure their NW app directory is left up to the user.

```patch
-  files: ["./nwapp", "./other/**/*.js"],
+  srcDir: "./nwapp"
```

Add the `mode` option.

```patch
+  mode: "build",
```

The `platforms` option has been removed and replaced with `platform` and `arch`. Notice that one `nwbuild` function call now creates one build only. Refer to the docs for valid `platform` and `arch` values.

```patch
-  platforms: ["win32", "win64", "osx32", "osx64", "linux32", "linux64"],
+  platform: "linux",
+  arch: "x64",
```

The `buildDir` has been rename to `outDir`

```patch
-  buildDir: "./build",
+  outDir: "./build",
```

The `buildType` option has been removed.

```patch
-  buildType: "versioned",
```

The `forceDownload` option has been changed to `cache`.

```patch
-  forceDownload: true,
+  cache: false,
```

The `appName` option has been changed to `app.name`.

```patch
-  appName: "nwdemo",
+  app: { name: "nwdemo" },
```

The `appVersion` option has been removed. The version is automatically taken from `srcDir/package.json`.

```patch
-  appVersion: "0.1.0",
```

The `macCredit` option has been removed.

```patch
-  macCredits: "./nwapp/credits.html",
```

The `macIcns` option has been replaced with `icon`.

```patch
-  macIcns: "./nwapp/mac.icns",
+  icon: "./nwapp/mac.icns",
```

The `macPlist` option has been removed.

```patch
-  macPlist: { ... },
```

The `winVersionString` option has been replaced with `app.*`.

```patch
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
+    legalCopyright: "Copyright 2017",
+  }
```

The `winIco` option has been replaced by `icon`.

```patch
-  winIco: "./nwapp/win.ico",
+  icon: "./nwapp/win.ico",
```

The `macZip` option has been removed.

```patch
-  macZip: false,
```

The `mergeZip` option has been removed.

```patch
-  mergeZip: false,
```

The final code should look like this.

```javascript
const { nwbuild } = require("nw-builder");

nwbuild({
  srcDir: "./nwapp",
  mode: "build",
  version: "latest",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  outDir: "./build",
  cache: false,
  app: {
    name: "Some Product",
    icon: "./nwapp/icon.png",
    company: "Some Company",
    fileDescription: "Process Name",
    productName: "Some Product",
    legalCopyright: "Copyright 2017",
  },
});
```

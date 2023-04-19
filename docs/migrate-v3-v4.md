# Migrate from v3 to v4

## Update `nw-builder`

With npm:

```shell
npm update nw-builder@^4.2.3
```

With yarn:

```shell
yarn upgrade nw-builder@^4.2.3
```

With pnpm:

```shell
pnpm update nw-builder@^4.2.3
```

## Update options

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

```patch
-const NwBuilder = require("nw-builder");
+const nwbuild = require("nw-builder");
```

Replace the `NwBuilder` initialization with a function

```patch
-const nw = new NwBuilder({
+await nwbuild({
```

The `files` property has been renamed to `srcDir`.S

```patch
-  files: ["./nwapp/**/*", "./other/**/*.js"],
+  srcDir: "./nwapp/**/* ./other/**/*.js",
```

Add the `mode` option and remove the now redundant `nw.build` function call.

```patch
+  mode: "build",

-nw.build();
```

The `platforms` option has been removed and replaced with `platform` and `arch`. Notice that one `nwbuild` function call now creates one build only. Refer to the [documentation](./index.md) for valid `platform` and `arch` values.

```patch
-  platforms: ["win32", "win64", "osx32", "osx64", "linux32", "linux64"],
+  platform: "linux",
+  arch: "x64",
```

> If platform is Linux then even if Windows or MacOS specific `app.*` properties are defined, only the Linux `app.*` properties will be parsed. Multiple platform `app.*` properties have been shown in this guide to cater to all platforms.

The `buildDir` option has been rename to `outDir`.

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

The `appVersion` option has been removed. The `version` is automatically taken from `srcDir/package.json`.

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

The `winVersionString` option has been replaced with `app`.

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

The `winIco` option has been replaced by `app.icon`.

```patch
-  winIco: "./nwapp/win.ico",
+  app: { icon: "./nwapp/win.ico" },
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

await nwbuild({
  srcDir: "./nwapp/**/*",
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

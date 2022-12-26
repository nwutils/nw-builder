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
  files: "./nwapp",
  version: "latest",
  flavor: "normal",
  platforms: ["win32", "win64", "osx32", "osx64", "linux32", "linux64"],
  appName: "nwdemo",
  appVersion: "0.1.0",
  cacheDir: "./cache",
  buildDir: "./build",
  buildType: "versioned",
  forceDownload: true,
  argv: "--nw-stderr-logging",
  macCredits: "./nwapp/credits.html",
  macIcns: "./nwapp/mac.icns",
  zip: true,
  macPlist: { ... },
  winVersionString: { ... },
  winIco: "./nwapp/win.ico",
  macZip: false,
  mergeZip: false,
});

nw.build();
```

Update the import path

```patch
- const NwBuilder = require("nw-builder");
+ const { nwbuild } = require("nw-builder");
```

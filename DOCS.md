# Documentation

## Install

Every NW.js release includes a modified Node.js binary at a specific version. It is recommended to [install](https://nodejs.org/en/download/package-manager) exactly that version on the host system. Not doing so may download ABI incompatible Node modules. Consult the NW.js [versions manifest](https://nwjs.io/versions) for what Node.js version to install. It is recommended to use a Node version manager (such as [volta](https://volta.sh), n, nvm, or nvm-windows) to be able to easily install and switch between Node versions.

For example, NW.js v0.83.0 comes with Node.js v21.1.0.

```shell
$: node --version
v21.1.0
```

## Usage

This package can be used via a command line interface, be imported as a JavaScript module, or configured via the Node manifest as a JSON object.

ESM import:

```javascript
import nwbuild from "nw-builder";
```

CJS import:

```javascript
let nwbuild;
import("nwbuild")
  .then((object) => {
    nwbuild = obj;
  })
  .catch((error) => {
    console.error(error);
  });
```

Node manifest usage:

```json
{
    "nwbuild": {
        // user specified options
    }
}
```

> From here on we will show `nw-builder` functionality by using the JavaScript module. Please note that the same method applies when using a command line or Node manifest.

## Concepts

`nw-builder` can get, run and build NW.js applications. We refer to them as get, run and build modes.

### Get Mode

By default you get the normal build of the latest NW.js release for your specific platform and arch. For more information, please refer to the API reference.

```javascript
nwbuild({
  mode: "get"
});
```

Get the community built FFmeg which contains proprietary codecs. This options is disabled by default. Please read the [license's constraints](https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#get-ffmpeg-binaries-from-the-community) before enabling this option.

```javascript
nwbuild({
  mode: "get",
  ffmpeg: true
});
```

Get Node headers if you have to rebuild Node addons.

```javascript
nwbuild({
  mode: "get",
  nativeAddon: "gyp"
});
```

## API Reference

Options

| Name | Type    | Default   | Description |
| ---- | ------- | --------- | ----------- |
| mode | `"get" \| "run" \| "build"` | `"build"` | Choose between get, run or build mode |
| version | `string \| "latest" \| "stable"` | `"latest"` | Runtime version |
| flavor | `"normal" \| "sdk"` | `"normal"` | Runtime flavor |
| platform | `"linux" \| "osx" \| "win"` | | Host platform |
| arch | `""ia32" \| "x64" \| "arm64"` | | Host architecture |
| downloadUrl | `"https://dl.nwjs.io" \| "https://npm.taobao.org/mirrors/nwjs" \| https://npmmirror.com/mirrors/nwjs \| "https://github.com/corwin-of-amber/nw.js/releases/"` | `"https://dl.nwjs.io"` | Download server |
| manifestUrl | `"https://nwjs.io/versions" \| "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json"` | `"https://nwjs.io/versions"` | Versions manifest |
| cacheDir | `string` | `"./cache"` | Directory to cache NW binaries |
| srcDir | `string` | `"./"` | File paths to application code |
| outDir | `string` | `"./out"` | Directory to store build artifacts |

## Guides

### Get unofficial MacOS builds

If you're running older Apple machines, you can download the unofficial builds.

```javascript
nwbuild({
  mode: "get",
  platform: "osx",
  arch: "arm64",
  downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
  manifestUrl: "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json",
});
```

Please note community FFmpeg binaries may not be available for unofficial builds. You will have to rebuild them yourself.

### Get binaries via mirrors

China mirror:

```javascript
nwbuild({
  mode: "get",
  downloadUrl: "https://npm.taobao.org/mirrors/nwjs",
});
```

Singapore mirror:

```javascript
nwbuild({
  mode: "get",
  downloadUrl: "https://cnpmjs.org/mirrors/nwjs/",
});
```

## Contributing

### Maintainer guidelines

### External contributor

## FAQ

## License

MIT License.

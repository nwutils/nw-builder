# Documentation

> This assumes you know how to [write an NW.js application](https://nwjs.readthedocs.io/en/latest/For%20Users/Getting%20Started/).

## Install

Install `nw-builder` via `npm` or your preferred Node package manager of choice.

```shell
npm i -D nw-builder
```

## Usage

### Run your first application

Module usage

```javascript
import { nwbuild } from "nw-builder";

nwbuild({
  srcDir: "./nwapp",
  mode: "run",
  version: "0.70.1",
  flavour: "sdk",
});
```

CLI usage

```shell
nwbuild ./nwapp --mode=run --version=0.70.1 --flavour=sdk
```

package.json usage

`./nwapp/package.json`

```json
{
  "name": "nwdemo",
  "main": "./index.html",
  "nwbuild": {
    "srcDir": "./nwapp",
    "mode": "run",
    "version": "0.70.1",
    "flavour": "sdk"
  }
}
```

### Build your first application

Module usage

```javascript
import { nwbuild } from "nw-builder";

nwbuild({
  srcDir: "./nwapp",
  mode: "build",
  version: "0.70.1",
  flavour: "normal",
  platform: "linux",
  arch: "x64",
  outDir: "./out",
});
```

CLI usage

```shell
nwbuild ./nwapp --mode=build --version=0.70.1 --flavour=normal --platform=linux --arch=x64 --outDir=./out
```

package.json usage

`./nwapp/package.json`

```json
{
  "name": "nwdemo",
  "main": "./index.html",
  "nwbuild": {
    "srcDir": "./nwapp",
    "mode": "build",
    "version": "0.70.1",
    "flavour": "normal",
    "platform": "linux",
    "arch": "x64",
    "outDir": "./out"
  }
}
```

## API Reference

### Methods

`nwbuild(options) :Promise<undefined>`

| Name        | Type                                | Default                    | Description                                                                    |
| ----------- | ----------------------------------- | -------------------------- | ------------------------------------------------------------------------------ |
| srcDir      | `string`                            | `./`                       | Directory to hold NW app files                                                 |
| mode        | `run \| build`                      | `build`                    | Run or build application                                                       |
| version     | `latest \| stable \| string \| lts` | `latest`                   | NW runtime version                                                             |
| flavor      | `sdk \| normal`                     | `normal`                   | NW runtime build flavour.                                                      |
| platform    | `linux \| osx \| win`               | `<current platform>`       | NW supported platforms                                                         |
| arch        | `ia32 \| x64`                       | `<current architecture>`   | NW supported architectures                                                     |
| outDir      | `string`                            | `./out`                    | Directory to store build artifacts                                             |
| cacheDir    | `string`                            | `./cacheDir`               | Directory to store NW binaries                                                 |
| downloadUrl | `string`                            | `https://dl.nwjs.io`       | URI to download NW binaries from                                               |
| manifestUrl | `string`                            | `https://nwjs.io/versions` | URI to download manifest from                                                  |
| cache       | `boolean`                           | `true`                     | If `true` the existing cache is used. Otherwise it removes and redownloads it. |
| zip         | `boolean`                           | `false`                    | If `true` the `outDir` directory is zipped                                     |

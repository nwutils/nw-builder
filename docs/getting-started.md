# Getting Started

## Installation

Download and install `nw-builder` using your preferred node package manager:

Via `npm`

```shell
npm install nw-builder
```

Via `yarn`

```shell
yarn add nw-builder
```

Via `pnpm`

```shell
pnpm add nw-builder
```

Run the executable to check if it's working correctly:

```shell
./node_modules/bin/nwbuild.cjs
```

This should give an error:

```shell
[ ERROR ] package.json not found
```

## Write your first application:

To learn how to write your NW.js application, follow the steps given [here](https://ayushmxn.github.io/nw-repro/getting-started#write-your-first-nwjs-application).

## Run your first application

CLI usage:

```shell
./node_modules/bin/nwbuild.cjs ./path/to/nw/app
```

Module usage:

```javascript
const { nwbuild } = require("nw-builder");

nwbuild({
    files: "./path/to/nw/app"
})
    .then(() => { ... })
    .catch(() => { ... })
    .finally(() => { ... })
```

This is the minimum arguments required to run a NW.js application. It detects your current platform, downloads the required NW binary and runs it.

## Build your first application

CLI usage:

```shell
./node_modules/bin/nwbuild.cjs ./path/to/nw/app --mode=build
```

Module usage:

```javascript
const { nwbuild } = require("nw-builder");

nwbuild({
    files: "./path/to/nw/app/dir/**/*.*"
    mode: "build"
})
    .then(() => { ... })
    .catch(() => { ... })
    .finally(() => { ... })
```

This is the minimum arguments required to build a NW.js application. It detects your current platform, downloads the required NW binary and builds for the current platform.

You can learn more about the configuration options in the [API reference](./api).

## Tips

You may run or build your app repeatedly and will probably want to automate it. You can add a script in your `package.json`:

```json
{
  "scripts": {
    "run": "nwbuild ./src/**/*",
    "build": "nwbuild ./src/**/* --mode=build"
  }
}
```

However this may not make sense if you have multiple scripts with multiple options potentially leading to a lot of errors and debugging. You can write your run/build script in a module:

```json
{
  "scripts": {
    "run": "node run.js",
    "build": "node build.js"
  }
}
```

You can even define your options in your project's `package.json` under the `nwbuild` property. This is ideal if you only have one NW.js run or build process. Note that the `package.json` options override the CLI and module.

`run.js`

```javascript
nwbuild({
  files: "./",
});
```

`package.json`

```json
{
  "scripts": {
    "override:cli": "nwbuild ./",
    "override:module": "node run.js"
  },
  "nwbuild": {
    "files": "./dist/**/*,
  }
}
```

Since `files` is a required argument, you'll have to define it in the CLI or module even if you plan to override it.

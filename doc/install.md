# Installation Guide

Every NW.js release includes a modified Node.js at a specific version. It is recommended to [install](https://nodejs.org/en/download/package-manager) a version greater than or equal to NW.js's Node version. Consult the [version manifest](https://nwjs.io/versions) on the version to install.

With the environment set up, install `nw-builder` using npm:

Using npm:

```shell
npm i -D nw-builder
```

> Note: We install as a development dependency to prevent it from being packaged with your application code.

You may use alternate package managers. The recommended metohd is via [corepack](https://nodejs.org/api/corepack.html).

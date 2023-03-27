# Installation Guide

Every NW.js release includes a modified Node.js at a specific version. By installing a version greater/equal to NW.js's Node version, you get to use the latest features. In that case tt is recommended to use a [Node Version Manager](https://nodejs.org/en/download/package-manager) to manage multiple Node installations. Consult the [manifest](https://nwjs.io/versions) for what Node version to install.

With the environment setup, install `nw-builder` using npm:

Using npm:

```shell
npm i -D nw-builder
```

> Note: We install as a dev dependency to prevent it from being packaged with your application code.

You may use alternate package managers:

Enable `corepack` if your Node version is above `v14.19.0` or `v16.9.0`:

```shell
corepack enable
```

You may install it via npm if your version does not match:

```shell
npm i -g corepack
```

Prepare yarn:

```
corepack prepare yarn@x.y.z --activate
```

Using yarn:

```shell
yarn add -D nw-builder
```

Prepare yarn:

```
corepack prepare pnpm@x.y.z --activate
```

Using pnpm:

```shell
pnpm add -D nw-builder
```

For more information, refer to the official [corepack documentation](https://nodejs.org/api/corepack.html).

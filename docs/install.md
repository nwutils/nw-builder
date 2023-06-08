# Installation Guide

Every NW.js release includes a modified Node.js at a specific version. It is recommended to [install](https://nodejs.org/en/download/package-manager) a version greater than or equal to NW.js's Node version. Consult the [version manifest](https://nwjs.io/versions) on the version to install.

With the environment set up, install `nw-builder` using npm:

Using npm:

```shell
npm i -D nw-builder
```

> Note: We install as a dev dependency to prevent it from being packaged with your application code.

You may use alternate package managers:

Enable `corepack`:

```shell
corepack enable
```

Or install it if your version does not include it:

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

# Documentation

## Install

Every NW.js release includes a modified Node.js binary at a specific version. It is recommended to [install](https://nodejs.org/en/download/package-manager) exactly that version on the host system. Not doing so may download ABI incompatible Node modules. Consult the NW.js [versions manifest](https://nwjs.io/versions) for what Node.js version to install. It is recommended to use a Node version manager (such as [volta](https://volta.sh), n, nvm, or nvm-windows) to be able to easily install and switch between Node versions.

For example, NW.js v0.83.0 comes with Node.js v21.1.0.

```shell
$: node --version
v21.1.0
```

## Usage

This package can be used via a command line interface, be imported as a JavaScript module, or used via the Node manifest as a JSON object.

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

## API Reference

## Guides

## Contributing

### Maintainer guidelines

### External contributor

## FAQ

## License

MIT License.

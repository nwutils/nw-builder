# Basic Usage

Depending on your use case, `nw-builder` can be used via a JavaScript module, command line interface or `package.json`. Please note that if `package.json` is used, it will override the module or CLI configuration.

## Import package

ESM usage:

```javascript
import nwbuild from "nw-builder";
```

CJS usage:

```javascript
let nwbuild = undefined;

(() => {
    try {
        nwbuild = await import("nw-builder");
    } catch(error) {
        console.error(error);
    }
})();
```

## Execute function

Module usage:

```javascript
nwbuild();
```

CLI usage:

```shell
npx nwbuild
```

`package.json` usage:

```json
{
  "nwbuild": {}
}
```

By default, it performs a build using the latest version for the host platform and architecture. The next few guides will show you how to customize this behaviour.

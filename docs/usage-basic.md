# Basic Usage

Depending on your needs, `nw-builder` can be used via a JavaScript module, via command line interface or via `package.json`. Please note that if `package.json` is used, it will override the module or CLI configuration. A single function is exported which performs a single build using a specific [build flavor](https://nwjs.readthedocs.io/en/latest/For%20Users/Advanced/Build%20Flavors/) for a specific platform and architecture.

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
nwbuild({ ...options });
```

CLI usage:

```shell
npx nwbuild
```

`package.json` usage:

```json
{
    "nwbuild": {
        ...
    }
}
```

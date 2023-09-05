<a name="get_nwjs"></a>

## get_nwjs(options) ⇒ <code>Promise.&lt;void&gt;</code>

_Note: This an internal function which is not called directly. Please see example usage below._

Get NW.js binaries.

**Kind**: global function

| Param               | Type                                                                                            | Description                                                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options             | <code>object</code>                                                                             | Get mode options                                                                                                                                                                       |
| options.version     | <code>string</code>                                                                             | NW.js runtime version. Defaults to "latest".                                                                                                                                           |
| options.flavor      | <code>&quot;normal&quot;</code> \| <code>&quot;sdk&quot;</code>                                 | NW.js build flavor. Defaults to "normal".                                                                                                                                              |
| options.platform    | <code>&quot;linux&quot;</code> \| <code>&quot;osx&quot;</code> \| <code>&quot;win&quot;</code>  | Target platform. Defaults to host platform.                                                                                                                                            |
| options.arch        | <code>&quot;ia32&quot;</code> \| <code>&quot;x64&quot;</code> \| <code>&quot;arm64&quot;</code> | Target architecture. Defaults to host architecture.                                                                                                                                    |
| options.downloadUrl | <code>string</code>                                                                             | File server to download from. Defaults to "https://dl.nwjs.io". Set "https://npm.taobao.org/mirrors/nwjs" for China mirror or "https://cnpmjs.org/mirrors/nwjs/" for Singapore mirror. |
| options.cacheDir    | <code>string</code>                                                                             | Cache directory path. Defaults to "./cache"                                                                                                                                            |
| options.cache       | <code>boolean</code>                                                                            | If false, remove cache before download. Defaults to true.                                                                                                                              |

**Example**

```js
// Minimal Usage (uses default values)
nwbuild({
  mode: "get",
});
```

**Example**

```js
// Unofficial macOS builds (upto v0.75.0)
nwbuild({
  mode: "get",
  platform: "osx",
  arch: "arm64",
  downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
  manifestUrl:
    "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json",
});
```

**Example**

```js
// China mirror
nwbuild({
  mode: "get",
  downloadUrl: "https://npm.taobao.org/mirrors/nwjs",
});
```

**Example**

```js
// Singapore mirror
nwbuild({
  mode: "get",
  downloadUrl: "https://cnpmjs.org/mirrors/nwjs/",
});
```

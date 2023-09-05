<a name="get_ffmpeg"></a>

## get_ffmpeg(options) ⇒ <code>Promise.&lt;void&gt;</code>

_Note: This an internal function which is not called directly. Please see example usage below._

Get FFMPEG binaries.

**Kind**: global function

| Param            | Type                                                                                            | Description                                               |
| ---------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| options          | <code>object</code>                                                                             | Get mode options                                          |
| options.version  | <code>string</code>                                                                             | NW.js runtime version. Defaults to "latest".              |
| options.flavor   | <code>&quot;normal&quot;</code> \| <code>&quot;sdk&quot;</code>                                 | NW.js build flavor. Defaults to "normal".                 |
| options.platform | <code>&quot;linux&quot;</code> \| <code>&quot;osx&quot;</code> \| <code>&quot;win&quot;</code>  | Target platform. Defaults to host platform.               |
| options.arch     | <code>&quot;ia32&quot;</code> \| <code>&quot;x64&quot;</code> \| <code>&quot;arm64&quot;</code> | Target architecture. Defaults to host architecture.       |
| options.cacheDir | <code>string</code>                                                                             | Cache directory path. Defaults to "./cache"               |
| options.cache    | <code>boolean</code>                                                                            | If false, remove cache before download. Defaults to true. |

**Example**

```js
// FFMPEG (proprietary codecs)
// Please read the license's constraints: https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#get-ffmpeg-binaries-from-the-community
nwbuild({
  mode: "get",
  ffmpeg: true,
});
```

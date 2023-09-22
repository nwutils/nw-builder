<a name="run"></a>

## run(options) ⇒ <code>Promise.&lt;void&gt;</code>
_Note: This an internal function which is not called directly. Please see example usage below._

Run NW.js application. You can use get mode options in run mode too.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>options</code> | Run mode options |
| options.version | <code>string</code> | NW.js runtime version. Defaults to "latest". |
| options.flavor | <code>&quot;normal&quot;</code> \| <code>&quot;sdk&quot;</code> | NW.js build flavor. Defaults to "normal". |
| options.platform | <code>&quot;linux&quot;</code> \| <code>&quot;osx&quot;</code> \| <code>&quot;win&quot;</code> | Target platform. Defaults to host platform. |
| options.arch | <code>&quot;ia32&quot;</code> \| <code>&quot;x64&quot;</code> \| <code>&quot;arm64&quot;</code> | Target architecture. Defaults to host architecture. |
| options.srcDir | <code>string</code> | Source directory path. Defaults to "./src" |
| options.cacheDir | <code>string</code> | Cache directory path. Defaults to "./cache" |
| options.glob | <code>boolean</code> | If true, file globbing is enabled. Defaults to false. |
| options.argv | <code>Array.&lt;string&gt;</code> | Arguments to pass to NW.js. Defaults to []. See [NW.js CLI options](https://docs.nwjs.io/en/latest/References/Command%20Line%20Options/#command-line-options) for more information. |

**Example**  
```js
// Minimal Usage (uses default values)
nwbuild({
  mode: "run",
});
```

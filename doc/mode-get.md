<a name="get"></a>

## get(options) ⇒ <code>Promise.&lt;void&gt;</code>
Get NW.js binaries

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Get mode options |
| options.version | <code>string</code> | NW.js runtime version. Defaults to "latest". |
| options.flavor | <code>&quot;normal&quot;</code> \| <code>&quot;sdk&quot;</code> | NW.js build flavor. Defaults to "normal". |
| options.platform | <code>&quot;linux&quot;</code> \| <code>&quot;osx&quot;</code> \| <code>&quot;win&quot;</code> | Target platform. Defaults to host platform. |
| options.arch | <code>&quot;ia32&quot;</code> \| <code>&quot;x64&quot;</code> \| <code>&quot;arm64&quot;</code> | Target architecture. Defaults to host architecture. |
| options.downloadUrl | <code>string</code> | File server to download from. Defaults to "https://dl.nwjs.io". Set "https://npm.taobao.org/mirrors/nwjs" for China mirror or "https://cnpmjs.org/mirrors/nwjs/" for Singapore mirror. |
| options.cacheDir | <code>string</code> | Cache directory path. Defaults to "./cache" |
| options.cache | <code>boolean</code> | If false, remove cache before download. Defaults to true. |
| options.ffmpeg | <code>boolean</code> | If true, download ffmpeg. Defaults to false since it contains proprietary codecs. Please read the license's constraints: https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#get-ffmpeg-binaries-from-the-community |


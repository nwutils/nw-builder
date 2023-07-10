<a name="get"></a>

## get(options) ⇒ <code>Promise.&lt;void&gt;</code>

Get NW.js binaries

**Kind**: global function

<<<<<<< HEAD
| Param               | Type                                                                                            | Description                                                                                                                                                                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options             | <code>object</code>                                                                             | Get mode options                                                                                                                                                                                                                                      |
| options.version     | <code>string</code>                                                                             | NW.js runtime version. Defaults to "latest".                                                                                                                                                                                                          |
| options.flavor      | <code>&quot;normal&quot;</code> \| <code>&quot;sdk&quot;</code>                                 | NW.js build flavor. Defaults to "normal".                                                                                                                                                                                                             |
| options.platform    | <code>&quot;linux&quot;</code> \| <code>&quot;osx&quot;</code> \| <code>&quot;win&quot;</code>  | Target platform. Defaults to host platform.                                                                                                                                                                                                           |
| options.arch        | <code>&quot;ia32&quot;</code> \| <code>&quot;x64&quot;</code> \| <code>&quot;arm64&quot;</code> | Target architecture. Defaults to host architecture.                                                                                                                                                                                                   |
| options.downloadUrl | <code>string</code>                                                                             | File server to download from. Defaults to "https://dl.nwjs.io". Set "https://npm.taobao.org/mirrors/nwjs" for China mirror or "https://cnpmjs.org/mirrors/nwjs/" for Singapore mirror.                                                                |
| options.cacheDir    | <code>string</code>                                                                             | Cache directory path. Defaults to "./cache"                                                                                                                                                                                                           |
| options.cache       | <code>boolean</code>                                                                            | If false, remove cache before download. Defaults to true.                                                                                                                                                                                             |
| options.ffmpeg      | <code>boolean</code>                                                                            | If true, download ffmpeg. Defaults to false since it contains proprietary codecs. Please read the license's constraints: https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#get-ffmpeg-binaries-from-the-community |
=======
```javascript
nwbuild({
  mode: "get",
  version: "latest",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  downloadUrl: "https://dl.nwjs.io",
  manifestUrl: "https://nwjs.io/versions",
  cacheDir: "./cache",
  cache: true,
  ffmpeg: false,
});
```

CLI usage:

```shell
nwbuild --mode=get
```

This is equivalent to:

```shell
nwbuild --mode=get --version=latest --flavor=normal --platform=linux --arch=x64 --downloadUrl=https://dl.nwjs.io --manifestUrl=https://nwjs.io/versions --cacheDir=./cache --cache=true --ffmpeg=false
```

> When the `platform` and `arch` are not specified, they default to the host platform and arch. For this guide, we are assumed to be using Linux x64.

This might be useful as a `postInstall` step in your `package.json` or when running `Chromedriver` tests you don't want to run or build your app. Here are some other use cases:

## Download unofficial MacOS ARM builds:

> Thank you [`@corwin-of-amber`](https://github.com/corwin-of-amber/)!

Module usage:

```javascript
nwbuild({
  mode: "get",
  platform: "osx",
  arch: "arm64",
  downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
  manifestUrl:
    "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json",
});
```

CLI usage:

```shell
nwbuild --mode=get --platform=osx --arch=arm64 --downloadUrl=https://github.com/corwin-of-amber/nw.js/releases/download --manifestUrl=https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json
```

Note: Make sure you have [`xattr`](https://ss64.com/osx/xattr.html) installed in your system. This is needed to remove the `com.apple.quarantine` property.

## Download from mirrors

China:

Module usage:

```javascript
nwbuild({
  mode: "get",
  downloadUrl: "https://npm.taobao.org/mirrors/nwjs/",
});
```

CLI usage:

```shell
nwbuild --mode=get --downloadUrl=https://npm.taobao.org/mirrors/nwjs/
```

Singapore:

Module usage:

```javascript
nwbuild({
  mode: "get",
  downloadUrl: "https://cnpmjs.org/mirrors/nwjs/",
});
```

CLI usage:

```shell
nwbuild --mode=get --downloadUrl=https://cnpmjs.org/mirrors/nwjs/
```

## Download `nwjs-ffmpeg-prebuilt`

`ffmpeg` contains [proprietary codecs](https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#get-ffmpeg-binaries-from-the-community) which is why NW.js excludes them from its builds. The prebuilt `ffmpeg` on the other hand does contain proprietary codecs.

> Using the H.264 codec requires you to pay attention to the patent royalties and the license of the source code. Consult a lawyer if you do not understand the licensing constraints and using patented media formats in your application. For more information about the license of the source code, check [here](https://chromium.googlesource.com/chromium/third_party/ffmpeg.git/+/master/CREDITS.chromium).

`nw-builder` by default does not download the prebuilt `ffmpeg`. The user has to explicitly enable this:

```javascript
nwbuild({
  mode: "get",
  ffmpeg: true,
});
```

CLI usage:

```shell
nwbuild --mode=get --ffmpeg
```
>>>>>>> eba33cc6dc7887038159de72e8d2e0718e130d64

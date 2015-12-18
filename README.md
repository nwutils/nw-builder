# nw-builder [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

[![NPM](https://nodei.co/npm/nw-builder.png?downloads=true)](https://nodei.co/npm/nw-builder/)

> Lets you build your [NW.js](https://github.com/nwjs/nw.js) apps for mac, win and linux via cli. It will download the prebuilt binaries for a newest version, unpacks it, creates a release folder, create the app.nw file for a specified directory and copies the app.nw file where it belongs.


### Installation

##### Local
```shell
npm install nw-builder --save-dev
```

##### Global
```shell
npm install nw-builder -g
```

##### Grunt and Gulp Plugins
Yes, there is also a [Grunt Plugin](https://github.com/nwjs/grunt-nw-builder). For Gulp, just use the module :)


## Usage

```shell
Usage: nwbuild [options] [path]

Options:
  -p, --platforms      Platforms to build, comma-sperated, can be: win32,win64,osx32,osx64,linux32,linux64   ['osx32', 'osx64', 'win32', 'win64']
  -v, --version        The nw version, eg. 0.8.4                                             [default: "latest"]
  -r, --run            Runs NW.js for the current platform                                   [default: false]
  -o, --buildDir       The build folder                                                      [default: "./build"]
  -f, --forceDownload  Force download of NW.js                                               [default: false]
  --cacheDir           The cache folder
  --quiet              Disables logging                                                      [default: false]

```
#### Run NW.js
During development you can run NW.js with `nwbuild -r path/to/your/younwapp/`

Or use the module:

```js
var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: './path/to/nwfiles/**/**', // use the glob format
    platforms: ['osx32', 'osx64', 'win32', 'win64']
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
```

`build` also supports callbacks:

```javascript
nw.build(function(err) {
    if(err) console.log(err);
})

```

### Options

#### options.files *Required*
Type: `String`  
Default value: `null`  

The path to your node webkit app. It supports [simple-glob](https://github.com/jedmao/simple-glob) so you can do stuff like `['foo/*.js', '!foo/bar.js', 'foo/bar.js']`.


#### options.version
Type: `String`
Default value: `'latest'`

The version of NW.js you want to use. Per default it looks up the latest version. [Here is a list](https://github.com/nwjs/nw.js/wiki/Downloads-of-old-versions) of all available releases

#### options.platforms
Type: `Array`  
Default value: `['osx32', 'osx64', 'win32', 'win64']`

The platforms you want to build. Can be `['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64']`

The values `['win', 'osx', 'linux']` can also be used and will build both the 32 and 64 bit versions of the specified platforms.

#### options.appName
Type: `String`  
Default value: `false`  

The Name of your NW.js app. If this value is set to null, it will autodetect the `name` from your projects package.json. This will be used to generate a plist file for mac.

#### options.appVersion
Type: `String`  
Default value: `false`  

The version of your NW.js app. If this value is set to null, it will autodetect the `version` form your projects package.json. This will be used to generate a plist file for mac.

#### options.buildDir
Type: `String`  
Default value: `./build`  

This is where the releases are saved.

#### options.cacheDir
Type: `String`  
Default value: `./cache`  

This is where the cached NW.js downloads are

#### options.buildType
Type: `String` or `function`
Default value: `default`  

How you want to save your build.

* `default` [appName]
* `versioned` [appName] -v[appVersion]
* `timestamped` [appName] - [timestamp];
* A function with options as scope (e.g `function () {return this.appVersion;}` )

#### options.forceDownload
Type: `Boolean`  
Default value: `false`  

This will delete everything in your `build_dir` directory, including the cached downloaded prebuilt binaries

#### options.macCredits
Type: `String`  
Default value: `false`  

MAC ONLY: The path to your credits.html file. If your don't provide your own it will use the one provided by NW.js

#### options.macIcns
Type: `String`  
Default value: `false`  

MAC ONLY: The path to your ICNS icon file. If your don't provide your own it will use the one provided by NW.js

#### options.zip
Type: `Boolean`
Default value: `null`

WINDOW ONLY: Instead of zipping the application and merging it into the executable the application content is placed next to the application (which speed up the startup time for large apps). The default behaviour is platform specific. For `windows` and `linux`, the application is zipped and merged into the executable. For `mac`, the application is not zipped.

#### options.macPlist
Type: `String` or `Object`  
Default value: `false`  

MAC ONLY: Pass a string containing the path to your own plist file. If a string isn't passed, a plist file will be generated from your package.json. Pass an object to overwrite or add properties to the generated plist file.

#### options.winIco
Type: `String`  
Default value: `null`

WINDOWS ONLY: The path to your ICO icon file. If your don't provide your own it will use the one provided by NW.js. If you are building on MAC or LINUX you must have [Wine](https://www.winehq.org/) installed to use this option.

#### options.macZip (DEPRECATED)
Type: `Boolean`
Default value: `null`

MAC ONLY: Use a `app.nw` folder instead of `ZIP` file, this significantly improves the startup speed of applications on `mac`, since no decompressing is needed. Builds on other platforms will still use `ZIP` files. The default behaviour of node-webkit-builder is to not use `ZIP` files on the `mac` platform. In case of the `mac` platform the option `macZip` can override the option `zip`.

### Manifest Options

#### platformOverrides

Allows you to specify platform-specific manifest values. Example manifest:

```json
{
    "name": "nw-demo",
    "version": "0.1.0",
    "main": "index.html",
    "window": {
        "frame": false,
        "toolbar": false
    },
    "platformOverrides": {
        "win": {
            "window": {
                "toolbar": true
            }
        },
        "win32": {
            "window": {
                "frame": true,
                "toolbar": false
            }
        },
        "win64": {
            "window": {
                "frame": true
            }
        },
        "osx": {
            ...
        },
        "osx32": {
            ...
        },
        "osx64": {
            ...
        },
        "linux": {
            ...
        },
        "linux32": {
            ...
        },
        "linux64": {
            ...
        },
    }

```

The platform-specific options will override the others only when building that platform only and the `platformOverrides` property will be removed.

For example, when building for Windows, the manifest generated and put into the end app (from the manifest above) would be:

```json
{
    "name": "nw-demo",
    "version": "0.1.0",
    "main": "index.html",
    "window": {
        "frame": true,
        "toolbar": false
    }
}
```

Additionally, when specifying multiple version of the same platform such as "win", "win32", and "win64", changes will be applied such that "win" applies to both "win32" and "win64", while "win32" and "win64" apply only to the specified version. Also note that "win32" and "win64" can further override changes made in "win".

See [#85](https://github.com/nwjs/nw-builder/issues/85) and [#94](https://github.com/nwjs/nw-builder/pull/94) for more information. If you need this during development too, see [platform-overrides](https://github.com/adam-lynch/platform-overrides) and [gulp-platform-overrides](https://github.com/adam-lynch/gulp-platform-overrides). There is no Grunt plugin, [yet](https://github.com/new).

## Troubleshooting

### OSX ulimit

Darwin (OS X kernel) has a low limit for file descriptors (256 per process) by default, so you might get an `EMFILE` error or an error mentioning "too many open files" if youtry to open more file descriptors than this.

To get around it, run `ulimit -n 1024` (or add it to your `~/.bash_profile`). For more information, see [henvic/osx-ulimit](https://github.com/henvic/osx-ulimit).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Release History
- 2015-12-18    `2.2.0` added `zip` option.
- 2015-12-06    `2.1.0` added `cacheDir` command-line option, fix for no info being passed back, etc.
- 2015-06-28    `2.0.2` put upper bound to semver check for windows.
- 2015-06-14    `2.0.1` safer validation of versions.
- 2015-06-14    `2.0.0` changed to nw-builder, etc.
- 2015-05-05    `1.0.12` when using latest NW.js version, it's first validated that it's not an alpha version (fixes [#222](https://github.com/nwjs/nw-builder/issues/222)). Plus a fix for the `winIco` & `macIcns` command line options
- 2015-01-29    `1.0.8` fixed EMFILE errors (see [#147](https://github.com/nwjs/nw-builder/issues/147) [#148](https://github.com/nwjs/nw-builder/pull/148))
- 2015-01-21    `1.0.7` fixed about screen when copyright is not supplied
- 2015-01-15    `1.0.6` fixed downloads for nw.js version 0.12.0-alpha1
- 2015-01-15    `1.0.5` fixed downloads for NW.js versions < 0.12.0-alpha
- 2014-12-12    `1.0.0` 64-bit support, improved platform-overrides and no more EMFILE errors.
- 2014-12-07    `0.4.0` macPlist CFBundleIdentifier is generated from `package.json` (see [#131](https://github.com/nwjs/nw-builder/pull/131))
- 2014-11-14    `0.3.0` macPlist option improvements (see [#96](https://github.com/nwjs/nw-builder/pull/96))
- 2014-10-30    `0.2.0` adds support for platform-specific manifest overrides (see [#94](https://github.com/nwjs/nw-builder/pull/94))
- 2014-08-19    `0.1.2` adds a progress bar to downloads, fixes downloading through a proxy, fixed winIco, bug fixes
- 2014-08-01    `0.1.0` use app filename for generated executables, optimized version checking, (known issue: `winIco` on windows)
- 2014-07-31    `0.0.4` fixed compatibility with nodewebkit 0.10.0
- 2014-04-20    Added run option, bug fixes
- 2014-04-13    Preview Release
## License

[MIT License](https://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://www.npmjs.com/package/nw-builder
[npm-image]: https://img.shields.io/npm/v/nw-builder.svg?style=flat

[travis-url]: https://travis-ci.org/mllrsohn/nw-builder
[travis-image]: https://img.shields.io/travis/mllrsohn/nw-builder/master.svg?style=flat

[depstat-url]: https://david-dm.org/mllrsohn/nw-builder
[depstat-image]: https://david-dm.org/mllrsohn/nw-builder.svg?style=flat

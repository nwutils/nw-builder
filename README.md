# node-webkit-builder [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

[![NPM](https://nodei.co/npm/node-webkit-builder.png?downloads=true)](https://nodei.co/npm/node-webkit-builder/)

> Lets you build your [node-webkit](https://github.com/rogerwang/node-webkit) apps for mac, win and linux via cli. It will download the prebuilt binaries for a newest version, unpacks it, creates a release folder, create the app.nw file for a specified directory and copies the app.nw file where it belongs.


### Installation

##### Local
```shell
npm install node-webkit-builder --save-dev
```

##### Global
```shell
npm install node-webkit-builder -g
```

##### Grunt and Gulp Plugins
Yes, there is also a [Grunt Plugin](https://github.com/mllrsohn/grunt-node-webkit-builder). For Gulp, just use the module :)


## Usage

```shell
Usage: nwbuild [options] [path]

Options:
  -p, --platforms      Platforms to build, comma-sperated, can be: win32,win64,osx32,osx64,linux32,linux64   ['osx32', 'osx64', 'win32', 'win64']
  -v, --version        The nw version, eg. 0.8.4                                             [default: "latest"]
  -r, --run            Runs node-webkit for the current platform                            [default: false]  
  -o, --buildDir       The build folder                                                      [default: "./build"]
  -f, --forceDownload  Force download of node-webkit                                         [default: false]
  --quiet              Disables logging                                                      [default: false]

```
#### Run node-webkit
During development you can run node-webkit with `nwbuild -r path/to/your/younwapp/`

Or use the module:

```js
var NwBuilder = require('node-webkit-builder');
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

The version of node-webkit you want to use. Per default it looks up the latest version. [Here is a list](https://github.com/rogerwang/node-webkit/wiki/Downloads-of-old-versions) of all available releases

#### options.platforms
Type: `Array`  
Default value: `['osx32', 'osx64', 'win32', 'win64']`

The platforms you want to build. Can be `['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64']`

The values `['win', 'osx', 'linux']` can also be used and will build both the 32 and 64 bit versions of the specified platforms.

#### options.appName
Type: `String`  
Default value: `false`  

The Name of your node-webkit app. If this value is set to null, it will autodetect the `name` form your projects package.json. This will be used to generate a plist file for mac.

#### options.appVersion
Type: `String`  
Default value: `false`  

The version of your node-webkit app. If this value is set to null, it will autodetect the `version` form your projects package.json. This will be used to generate a plist file for mac.

#### options.buildDir
Type: `String`  
Default value: `./build`  

This is where the releases are saved.

#### options.cacheDir
Type: `String`  
Default value: `./cache`  

This is where the cached node-webkit downloads are

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

MAC ONLY: The path to your credits.html file. If your don't provide your own it will use the one provided by node-webkit

#### options.macIcns
Type: `String`  
Default value: `false`  

MAC ONLY: The path to your ICNS icon file. If your don't provide your own it will use the one provided by node-webkit

#### options.macZip
Type: `Boolean`  
Default value: `false`  

MAC ONLY: Use a `app.nw` folder instead of `ZIP` file, this significantly improves the startup speed of applications on `mac`, since no decompressing is needed. Builds on other platforms will still use `ZIP` files.

#### options.macPlist
Type: `String` or `Object`  
Default value: `false`  

MAC ONLY: Pass a string containing the path to your own plist file. If a string isn't passed, a plist file will be generated from your package.json. Pass an object to overwrite or add properties to the generated plist file.

#### options.winIco
Type: `String`  
Default value: `null`  

WINDOWS ONLY: The path to your ICO icon file. If your don't provide your own it will use the one provided by node-webkit. If you are building on MAC or LINUX you must have [Wine](http://winehq.org) installed to use this option.

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

See [#85](https://github.com/mllrsohn/node-webkit-builder/issues/85) and [#94](https://github.com/mllrsohn/node-webkit-builder/pull/94) for more information. If you need this during development too, see [platform-overrides](http://github.com/adam-lynch/platform-overrides) and [gulp-platform-overrides](http://github.com/adam-lynch/gulp-platform-overrides). There is no Grunt plugin, [yet](https://github.com/new).

## Troubleshooting

### OSX ulimit

Darwin (OS X kernel) has a low limit for file descriptors (256 per process) by default, so you might get an `EMFILE` error or an error mentioning "too many open files" if youtry to open more file descriptors than this.

To get around it, run `ulimit -n 1024` (or add it to your `~/.bash_profile`). For more information, see [henvic/osx-ulimit](https://github.com/henvic/osx-ulimit).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Release History
- 2015-05-05    `1.0.12` when using latest NW.js version, it's first validated that it's not an alpha version (fixes [#222](https://github.com/mllrsohn/node-webkit-builder/issues/222)). Plus a fix for the `winIco` & `macIcns` command line options
- 2015-01-29    `1.0.8` fixed EMFILE errors (see [#147](https://github.com/mllrsohn/node-webkit-builder/issues/147) [#148](https://github.com/mllrsohn/node-webkit-builder/pull/148))
- 2015-01-21    `1.0.7` fixed about screen when copyright is not supplied
- 2015-01-15    `1.0.6` fixed downloads for nw.js version 0.12.0-alpha1
- 2015-01-15    `1.0.5` fixed downloads for node-webkit versions < 0.12.0-alpha
- 2014-12-12    `1.0.0` 64-bit support, improved platform-overrides and no more EMFILE errors.
- 2014-12-07    `0.4.0` macPlist CFBundleIdentifier is generated from `package.json` (see [#131](https://github.com/mllrsohn/node-webkit-builder/pull/131))
- 2014-11-14    `0.3.0` macPlist option improvements (see [#96](https://github.com/mllrsohn/node-webkit-builder/pull/96))
- 2014-10-30    `0.2.0` adds support for platform-specific manifest overrides (see [#94](https://github.com/mllrsohn/node-webkit-builder/pull/94))
- 2014-08-19    `0.1.2` adds a progress bar to downloads, fixes downloading through a proxy, fixed winIco, bug fixes
- 2014-08-01    `0.1.0` use app filename for generated executables, optimized version checking, (known issue: `winIco` on windows)
- 2014-07-31    `0.0.4` fixed compatibility with nodewebkit 0.10.0
- 2014-04-20    Added run option, bug fixes
- 2014-04-13    Preview Release
## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/node-webkit-builder
[npm-image]: http://img.shields.io/npm/v/node-webkit-builder.svg?style=flat

[travis-url]: http://travis-ci.org/mllrsohn/node-webkit-builder
[travis-image]: http://img.shields.io/travis/mllrsohn/node-webkit-builder/master.svg?style=flat

[depstat-url]: https://david-dm.org/mllrsohn/node-webkit-builder
[depstat-image]: https://david-dm.org/mllrsohn/node-webkit-builder.svg?style=flat

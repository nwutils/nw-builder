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
  -p, --platforms      Platforms to build, comma-sperated, can be: win,osx,linux32,linux64   [default: "osx,win"]
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
    platforms: ['win','osx']
});

// Log stuff you want
nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});

// And supports callbacks
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
Default value: `['win', 'osx']`

The platforms you want to build. Can be `['win', 'osx', 'linux32', 'linux64']`

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
Type: `String`  
Default value: `false`  

MAC ONLY: if you supply a string to a Plist file it will use it. Otherwise it will generate something usefull from your package.json

#### options.winIco
Type: `String`  
Default value: `null`  

WINDOWS ONLY: The path to your ICO icon file. If your don't provide your own it will use the one provided by node-webkit. If you are building on MAC or LINUX you must have [Wine](http://winehq.org) installed to use this option.

## Troubleshooting

### OSX ulimit

Darwin (OS X kernel) has a low limit for file descriptors (256 per process) by default, so you might get an `EMFILE` error or an error mentioning "too many open files" if youtry to open more file descriptors than this.

To get around it, run `ulimit -n 1024` (or add it to your `~/.bash_profile`). For more information, see [henvic/osx-ulimit](https://github.com/henvic/osx-ulimit).


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## To Do:
- Test it on Linux and Windows

## Release History
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

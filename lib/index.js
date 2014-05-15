var Promise = require('bluebird');
var _ = require('lodash');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs-extra');
var path = require('path');
var url = require('url');
var rcedit = Promise.promisify(require('rcedit'));
var spawn = require('child_process').spawn;

var NwVersions = require('./versions');
var Utils = require('./utils');
var Downloader = require('./downloader');

// We inherit from EventEmitter for logging
inherits(NwBuilder, EventEmitter);
module.exports = NwBuilder;
function NwBuilder(options) {
    var self = this;
    var defaults = {
        files: null,
        appName: false,
        appVersion: false,
        platforms: ['win','osx'],
        version: 'lastest',
        buildDir: './build',
        cacheDir: './cache',
        versionsUrl: 'https://s3.amazonaws.com/node-webkit/',
        downloadUrl: 'http://dl.node-webkit.org/',
        buildType: 'default',
        forceDownload: false,
        checkVersions: true,
        macCredits: false,
        macIcns: false,
        macZip: false,
        macPlist: false,
        winIco: null
    };

    // Assing options
    this.options = _.defaults(options, defaults);
    this._platforms = [{
        platform: 'win',
        needsZip: true,
        runable: 'nw.exe',
        files: ['nw.exe', 'ffmpegsumo.dll', 'icudt.dll', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak'] // First file must be the executable
    },{
        platform: 'osx',
        runable: 'node-webkit.app/Contents/MacOS/node-webkit',
        files: ['node-webkit.app']
    },{
        platform: 'linux32',
        needsZip: true,
        chmod: '0755',
        runable: 'nw',
        files: ['nw', 'nw.pak', 'libffmpegsumo.so'] // First file must be the executable
    },{
        platform: 'linux64',
        needsZip: true,
        chmod: '0755', // chmod file file to be executable
        runable: 'nw',
        files: ['nw', 'nw.pak', 'libffmpegsumo.so'] // First file must be the executable
    }];

    // Some Option checking
    if(!this.options.files) {
        throw new Error('Please specify some files');
    }


    // Check Platforms
    this._platforms.forEach(function (platform) {
        platform.active = (self.options.platforms.indexOf(platform.platform) === -1 ? false : true);
    });
    // Platforms
    this._platforms = _.where(this._platforms, {'active':true});

    if(this._platforms.length === 0 || this._platforms.length === undefined) {
        throw new Error('No platform to build!');
    }

    return this;
};

NwBuilder.prototype.build = function (callback) {
    var hasCallback = (typeof callback === 'function'),
        done = Promise.defer();

    // Let's create a node Webkit app
    this.checkFiles().bind(this)
        .then(this.checkVersions)
        .then(this.downloadNodeWebkit)
        .then(this.createReleaseFolder)
        .then(this.copyNodeWebkit)
        .then(this.zipAppFiles)
        .then(this.mergeAppFiles)
        .then(this.handleMacApp)
        .then(this.handleWinApp)
        .then(function (info) {
            if(hasCallback) {
                callback(false, info);
            } else {
                done.resolve(info);
            }
        })
        .catch(function (error) {
            if(hasCallback) {
                callback(error);
            } else {
                done.reject(error);
            }
        });

    return hasCallback ? true : done.promise;
};

NwBuilder.prototype.run = function (callback) {
    var hasCallback = (typeof callback === 'function'),
        done = Promise.defer();

    // Let's create a node Webkit app
    this.checkFiles().bind(this)
        .then(this.checkVersions)
        .then(this.downloadNodeWebkit)
        .then(this.runApp)
        .then(function (info) {
            if(hasCallback) {
                callback(false, info);
            } else {
                done.resolve(info);
            }
        })
        .catch(function (error) {
            if(hasCallback) {
                callback(true, error);
            } else {
                done.reject(error);
            }
        });

    return hasCallback ? true : done.promise;
};


NwBuilder.prototype.checkFiles = function () {
    var self = this;

    return Utils.getFileList(this.options.files).then(function (data) {

        self._appPkg = data.json;
        self._files = data.files;

        if(!self.options.appName || self.options.appVersion) {
            return Utils.getPackageInfo(self._appPkg).then(function (appPkg) {
               self._appPkg = appPkg;
               self.options.appName = (self.options.appName ? self.options.appName : appPkg.name);
               self.options.appVersion = (self.options.appVersion ? self.options.appVersion : appPkg.version);
            });
        }
    });

};

NwBuilder.prototype.checkVersions = function (versions) {
    var self = this,
        version;

    // Remove unwanted v strings
    self.options.version = self.options.version.replace('v', '');
    if(!self.options.checkVersions) {
        version = NwVersions.getVersionNames(self.options.version);
    } else {
        version = NwVersions.getVersions(this.options.versionsUrl);
    }

    return version.then(function (data) {
        self._version = _.findWhere(data, {'version': self.options.version});
        if(!self._version) {
            self._version = _.findLast(data);
        }

        // log something
        self.emit('log', 'Using v' + self._version.version);

        return self._version;
    });

};

NwBuilder.prototype.downloadNodeWebkit = function () {
    var self = this,
        downloads = [];

    this._platforms.map(function (single_platform) {
        single_platform.cache = path.resolve(self.options.cacheDir, self._version.version, single_platform.platform);
        single_platform.url = url.resolve(self.options.downloadUrl, self._version.platforms[single_platform.platform]);

        // Ensure that there is a cache folder
        if(self.options.forceDownload) {
            fs.removeSync(single_platform.cache);
        }

        fs.mkdirpSync(single_platform.cache);
        self.emit('log', 'Create cache folder in ' + path.resolve(self.options.cacheDir, self._version.version));

        if(!Downloader.checkCache(single_platform.cache, single_platform.files)) {
            downloads.push(Downloader.downloadAndUnpack(single_platform.cache, single_platform.url));
            self.emit('log', 'Downloading: ' + single_platform.url);
        } else {
            self.emit('log', 'Using cache for: ' + single_platform.platform);
        }

        return single_platform;
    });

    return Promise.all(downloads);
};

NwBuilder.prototype.buildGypModules = function () {
    // @todo
    // If we trigger a rebuild we have to copy
    // the node_modules to a tmp location because
    // we don't want to change the source files

};



NwBuilder.prototype.createReleaseFolder = function () {
    var self = this,
        releasePath;

    if (_.isFunction(self.options.buildType)) {
      releasePath = self.options.buildType.call(self.options);
    } else {
      // buildTypes
      switch(self.options.buildType) {
          case 'timestamped':
              releasePath = self.options.appName + ' - ' + Math.round(Date.now() / 1000).toString();
          break;

          case 'versioned':
              releasePath = self.options.appName + ' - v' + self.options.appVersion;
          break;

          default:
              releasePath = self.options.appName;
      }
    }

    this._platforms.forEach(function (single_platform) {
        single_platform.releasePath = path.resolve(self.options.buildDir, releasePath, single_platform.platform);

        // Ensure that there is a release Folder, delete and create it.
        fs.removeSync(single_platform.releasePath);
        fs.mkdirpSync(single_platform.releasePath);
        self.emit('log', 'Create release folder in ' + single_platform.releasePath);
    });

    return true;

};

NwBuilder.prototype.copyNodeWebkit = function () {
    var copiedFiles = [];

    this._platforms.forEach(function (single_platform) {
        single_platform.files.forEach(function (file) {
            copiedFiles.push(Utils.copyFile(path.resolve(single_platform.cache, file), path.resolve(single_platform.releasePath, file)));
        });
    });

    return Promise.all(copiedFiles);
};

NwBuilder.prototype.zipAppFiles = function () {
    var self = this;

    // Check if zip is needed
    this._needsZip = (self.options.macZip || _.any(this._platforms, {'needsZip':true}));

    return new Promise(function(resolve, reject) {
        if(self._needsZip) {
            Utils.generateZipFile(self._files, self).then(function (nwFile) {
                self._nwFile = nwFile;
                resolve();
            }, reject);
        } else {
            self._nwFile = null;
            resolve();
        }
    });
};

NwBuilder.prototype.mergeAppFiles = function () {
    var self = this,
        copiedFiles = [];

    this._platforms.forEach(function (single_platform) {
        // We copy the app files if we are on mac and don't force zip
        if(single_platform.platform === 'osx') {
            // no zip, copy the files
            if(!self.options.macZip) {
                self._files.forEach(function (file) {
                    var dest = path.resolve(single_platform.releasePath, 'node-webkit.app', 'Contents', 'Resources', 'app.nw', file.dest);
                    copiedFiles.push(Utils.copyFile(file.src, dest));
                });
            } else {
                // zip just copy the app.nw
                copiedFiles.push(Utils.copyFile(self._nwFile, path.resolve(single_platform.releasePath, 'node-webkit.app', 'Contents', 'Resources', 'nw.icns')));
            }
        } else {
            // We cat the app.nw file into the .exe / nw
            copiedFiles.push(Utils.mergeFiles(path.resolve(single_platform.releasePath, _.first(single_platform.files)), self._nwFile), single_platform.chmod);
        }
    });

    return Promise.all(copiedFiles);
};

NwBuilder.prototype.handleMacApp = function () {
    var self = this, allDone = [];
    var macPlatform = _.findWhere(self._platforms, {'platform':'osx'});
    if(!macPlatform) return Promise.resolve();

    // Let's first handle the mac icon
    if(self.options.macIcns) {
        allDone.push(Utils.copyFile(self.options.macIcns, path.resolve(macPlatform.releasePath, 'node-webkit.app', 'Contents', 'Resources', 'nw.icns')));
    }

    // Let handle the Plist
    var PlistPath = path.resolve(macPlatform.releasePath, 'node-webkit.app', 'Contents', 'Info.plist');

    // If the macPlist is a string we just copy the file
    if(typeof self.options.macPlist === 'String') {
        allDone.push(Utils.copyFile(self.options.macPlist, PlistPath));
    } else {
        // Setup the Plst
        var defaultPlist = {
            appName: self.options.appName,
            appVersion: self.options.appVersion,
            copyright: self._appPkg.copyright || false
        };

        var plistOptions = (self.options.macPlist ? _.defaults(self.options.macPlist, defaultPlist) : defaultPlist);
        allDone.push(Utils.editPlist(PlistPath, PlistPath, plistOptions));
    }

    return Promise.all(allDone);

};

NwBuilder.prototype.handleWinApp = function () {
    var self = this, allDone = [];
    var winPlatform = _.findWhere(self._platforms, {'platform':'win'});
    if(!winPlatform) return Promise.resolve();

    // Set icon
    if (self.options.winIco) {
        self.emit('log', 'Update executable icon');
        allDone.push(rcedit(
            path.resolve(winPlatform.releasePath, _.first(winPlatform.files)),
            {
                icon: path.resolve(self.options.winIco)
            }
        ));
    }

    return Promise.all(allDone);
};

NwBuilder.prototype.runApp = function () {
    var self = this,
        platform = this._platforms[0],
        executable = path.resolve(platform.cache, platform.runable);

        self.emit('log', 'Launching App');
        return new Promise(function(resolve, reject) {
            var p = spawn(executable, ['--enable-logging', self.options.files.replace(/\*[\/\*]*/,"")]);

            p.stdout.on('data', function(data) {
                self.emit('stdout', data);
            });

            p.stderr.on('data', function(data) {
                self.emit('stderr', data);
            });

            p.on('close', function(code) {
                self.emit('log', 'App exited with code ' + code);
                resolve();
            });
        });
};

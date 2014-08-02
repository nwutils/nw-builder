var Promise = require('bluebird');
var _ = require('lodash');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs-extra');
var path = require('path');
var url = require('url');
var rcedit = Promise.promisify(require('rcedit'));
var spawn = require('child_process').spawn;
var semver = require('semver');

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
        version: 'latest',
        buildDir: './build',
        cacheDir: './cache',
        downloadUrl: 'http://dl.node-webkit.org/',
        buildType: 'default',
        forceDownload: false,
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
        files: { // First file must be the executable
            '<=0.9.2': ['nw.exe', 'ffmpegsumo.dll', 'icudt.dll', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak'],
            '>0.9.2': ['nw.exe', 'ffmpegsumo.dll', 'icudtl.dat', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak']
        }
    },{
        platform: 'osx',
        runable: 'node-webkit.app/Contents/MacOS/node-webkit',
        files: {
            '*': ['node-webkit.app']
        }
    },{
        platform: 'linux32',
        needsZip: true,
        chmod: '0755',
        runable: 'nw',
        files: { // First file must be the executable
            '<=0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so'],
            '>0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so', 'icudtl.dat']
        }
    },{
        platform: 'linux64',
        needsZip: true,
        chmod: '0755', // chmod file file to be executable
        runable: 'nw',
        files: { // First file must be the executable
            '<=0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so'],
            '>0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so', 'icudtl.dat']
        }
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
        .then(this.resolveLatestVersion)
        .then(this.checkVersion)
        .then(this.platformFilesForVersion)
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
        .then(this.resolveLatestVersion)
        .then(this.checkVersion)
        .then(this.platformFilesForVersion)
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

NwBuilder.prototype.resolveLatestVersion = function () {
    var self = this;
    
    if(self.options.version !== 'latest') return Promise.resolve();
    
    return NwVersions.getLatestVersion().then(function(latestVersion){
        self.emit('log', 'Latest Version: v' + latestVersion);
        self.options.version = latestVersion;
    });
};

NwBuilder.prototype.checkVersion = function () {
    var version = this.options.version.replace('v', '');

    if(!semver.valid(this.options.version)){
        return Promise.reject('The version ' + this.options.version + ' is not valid.');
    } else {
        this._version = NwVersions.getVersionNames( version );
        this.emit('log', 'Using v' + this._version.version);
    }

    return Promise.resolve();
};

NwBuilder.prototype.platformFilesForVersion = function () {
    var self = this;

    this._platforms.forEach(function (single_platform) {
        var satisfied = !Object.keys(single_platform.files).every(function(range) {
            if (semver.satisfies(self._version.version, range)) {
                single_platform.files = single_platform.files[range];
                return false;
            }
            return true;
        });

        if (!satisfied) {
            throw new Error("Unsupported node-webkit version '" + this._version.version + "' for platform '" + platform.type + "'");
        }
    });
    
    return true;
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
            downloads.push(
                Downloader.downloadAndUnpack(single_platform.cache, single_platform.url)
                    .catch(function(err){
                        if(err.statusCode === 404){
                            self.emit('log', 'ERROR: The version '+self._version.version+' does not have a corresponding build posted at http://dl.node-webkit.org/. Please choose a version from that list.')
                        } else {
                            self.emit('log', err.msg)
                        }
                        
                        return Promise.reject('Unable to download nodewebkit.');
                    })
            );
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
    var self = this,
        copiedFiles = [];

    this._platforms.forEach(function (single_platform) {
        var executable = single_platform.runable.split('/')[0]; 
        single_platform.files.forEach(function (file, i) {
            var destFile = file;
            if(i===0) {
                // rename executable to app name
                destFile = self.options.appName + path.extname(file);
                // save new filename back to files list
                single_platform.files[0] = destFile;
            }
            copiedFiles.push(Utils.copyFile(path.resolve(single_platform.cache, file), path.resolve(single_platform.releasePath, destFile)));
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
                    var dest = path.resolve(single_platform.releasePath, self.options.appName+'.app', 'Contents', 'Resources', 'app.nw', file.dest);
                    copiedFiles.push(Utils.copyFile(file.src, dest));
                });
            } else {
                // zip just copy the app.nw
                copiedFiles.push(Utils.copyFile(self._nwFile, path.resolve(single_platform.releasePath, self.options.appName+'.app', 'Contents', 'Resources', 'nw.icns')));
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
        allDone.push(Utils.copyFile(self.options.macIcns, path.resolve(macPlatform.releasePath, self.options.appName+'.app', 'Contents', 'Resources', 'nw.icns')));
    }

    // Let handle the Plist
    var PlistPath = path.resolve(macPlatform.releasePath, self.options.appName+'.app', 'Contents', 'Info.plist');

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
    var self = this,
        done = Promise.defer();
    var winPlatform = _.findWhere(self._platforms, {'platform':'win'});
    if(!winPlatform || !self.options.winIco) return Promise.resolve();

    // Set icon
    if (self.options.winIco) {
        self.emit('log', 'Update executable icon');
        rcedit(
            path.resolve(winPlatform.releasePath, _.first(winPlatform.files)),
            {
                icon: path.resolve(self.options.winIco)
            },
            function(err){
                if(err) {
                    done.reject('Error while updating the Windows icon.' +
                        (process.platform !== "win32" ? ' Wine (winehq.org) must be installed to add custom icons from Mac and Linux.' : '')
                    );
                }
                else {
                    done.resolve();
                }
            }
        );
    }

    return done.promise;
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

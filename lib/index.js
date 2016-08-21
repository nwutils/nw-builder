var Promise = require('bluebird');
var _ = require('lodash');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var fs = require('graceful-fs-extra');
var recursiveReaddirSync = require('recursive-readdir-sync');
var path = require('path');
var url = require('url');
var winresourcer = Promise.promisify(require('winresourcer'));
var spawn = require('child_process').spawn;
var semver = require('semver');
var platformOverrides = require('platform-overrides');
var deprecate = require('deprecate');
var detectCurrentPlatform = require('./detectCurrentPlatform.js');

var NwVersions = require('./versions');
var Version = require('./Version');
var Utils = require('./utils');
var Downloader = require('./downloader');
var platforms = require('./platforms');

// We inherit from EventEmitter for logging
inherits(NwBuilder, EventEmitter);
module.exports = NwBuilder;
function NwBuilder(options) {
    var defaults = {
        files: null,
        appName: false,
        appVersion: false,
        platforms: ['osx32', 'osx64', 'win32', 'win64'],
        currentPlatform: detectCurrentPlatform(),
        version: 'latest',
        buildDir: './build',
        cacheDir: './cache',
        downloadUrl: 'http://dl.nwjs.io/',
        flavor: 'sdk',
        buildType: 'default',
        forceDownload: false,
        macCredits: false,
        macIcns: false,
        macZip: null,
        zip: null,
        macPlist: false,
        winIco: null,
        argv: process.argv.slice(2)
    };
    // Intercept the platforms and check for the legacy platforms of 'osx' and 'win' and
    // replace with 'osx32', 'osx64', and 'win32', 'win64' respectively.
    if(typeof options.platforms != 'undefined'){
        if(options.platforms.indexOf('osx') >= 0){
            options.platforms.splice(options.platforms.indexOf('osx'), 1, 'osx32', 'osx64');
        }
        if(options.platforms.indexOf('win') >= 0){
            options.platforms.splice(options.platforms.indexOf('win'), 1, 'win32', 'win64');
        }
        if(options.platforms.indexOf('linux') >= 0){
            options.platforms.splice(options.platforms.indexOf('linux'), 1, 'linux32', 'linux64');
        }
    }
    // Assign options
    this.options = _.defaults(options, defaults);

    // Some Option checking
    if(!this.options.files) {
        throw new Error('Please specify some files');
    }

    if (this.options.platforms.length === 0)
        throw new Error('No platform to build!');

    // verify all the platforms specifed by the user are supported
    // this + previous check assures as we have only buildable platforms specified
    this.options.platforms.forEach(function(platform) {
        if (!(platform in platforms))
            throw new Error('Unknown platform ' + platform);
    });

    this._platforms = _.cloneDeep(platforms);

    // clear all unused platforms
    for (var name in this._platforms) {
        if (this.options.platforms.indexOf(name) === -1)
            delete this._platforms[name];
    }
}

NwBuilder.prototype.build = function (callback) {
    var hasCallback = (typeof callback === 'function'),
        done = Promise.defer();

    // Let's create a NWjs app
    this.checkFiles().bind(this)
        .then(this.resolveLatestVersion)
        .then(this.checkVersion)
        .then(this.platformFilesForVersion)
        .then(this.downloadNwjs)
        .then(this.preparePlatformSpecificManifests)
        .then(this.createReleaseFolder)
        .then(this.copyNwjs)
        .then(this.handleMacApp)
        .then(this.handleWinApp)
        .then(this.zipAppFiles)
        .then(this.mergeAppFiles)
        .then(function (info) {
            // the promise(s) resolves to nothing in some cases
            var result = info || this;

            if(hasCallback) {
                callback(false, result);
            } else {
                done.resolve(result);
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

    // Let's run this NWjs app
    this.checkFiles().bind(this)
        .then(this.resolveLatestVersion)
        .then(this.checkVersion)
        .then(this.platformFilesForVersion)
        .then(this.downloadNwjs)
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

        return Utils.getPackageInfo(self._appPkg).then(function (appPkg) {
            self._appPkg = appPkg;

            if(!self.options.appName || !self.options.appVersion) {
                self.options.appName = (self.options.appName ? self.options.appName : appPkg.name);
                self.options.appVersion = (self.options.appVersion ? self.options.appVersion : appPkg.version);
            }
        });
    });

};

NwBuilder.prototype.resolveLatestVersion = function () {
    var self = this;

    if(self.options.version !== 'latest') return Promise.resolve();

    return NwVersions.getLatestVersion(self.options.downloadUrl, self.options.flavor).then(function(latestVersion){
        self.emit('log', 'Latest Version: v' + latestVersion.version);
        self.options.version = latestVersion.version;
        return latestVersion;
    });
};

NwBuilder.prototype.checkVersion = function () {
    var version = this.options.version,
        flavor = semver.valid(version) && semver.satisfies(version, '<0.12.3') ? 'sdk' : this.options.flavor,
        self = this;

    if(!semver.valid(version)){
        return Promise.reject('The version ' + version + ' is not valid.');
    }


    var getVersionFromManifest = function(){
        return NwVersions.getVersion({
            desiredVersion: version,
            flavor: flavor,
            downloadUrl: self.options.downloadUrl
        });
    };
    var getVersion;

    // if the user specified the exact version and all its platforms are cached, don't hit the manifest at all;
    // just trust the ones are cached and assume they're supported
    if(self.options.version !== 'latest'){
        var areAllPlatformsCached = true;
        this._forEachPlatform(function(name, platform){
            var platformToCheck = platform;

            if(semver.satisfies(self.options.version, '>=0.12.3')) {
                platformToCheck = _.clone(platform);
                platformToCheck.files = ['*']; // otherwise it'll try to check cache legacy version files
            }

            if(!self.isPlatformCached(name, platformToCheck, self.options.version)){
                areAllPlatformsCached = false;
            }
        });
        if(areAllPlatformsCached){
            getVersion = Promise.resolve(new Version({
                version: version,
                flavor: flavor,
                downloadUrl: self.options.downloadUrl,
                supportedPlatforms: Object.keys(this._platforms)
            }));
        }
        else {
            // otherwise hit the manifest
            getVersion = getVersionFromManifest();
        }
    }
    else {
        // otherwise hit the manifest
        getVersion = getVersionFromManifest();
    }


    return getVersion
        .then(function(version){
            self._version = version;
            self._version.flavor = flavor;
            self.emit('log', 'Using v' + self._version.version + ' (' + ((self._version.flavor === '') ? 'normal' : self._version.flavor + ')'));
            if(self._version.isLegacy) {
                deprecate('NW.js / node-webkit versions <0.12.3 are deprecated.');
            }
        });
};

NwBuilder.prototype.platformFilesForVersion = function () {
    var self = this;

    this._forEachPlatform(function (name, platform) {
        var satisfied = self.preparePlatformFiles(name, platform);

        // need the second condition for newer NW.js versions
        if (!(satisfied && !!self._version.platforms[name + "-" + self._version.flavor])) {
            throw new Error("Unsupported NW.js version '" + self._version.version + " (" + self._version.flavor + ")' for platform '" + name + "'");
        }
    });

    return true;
};

NwBuilder.prototype.downloadNwjs = function () {
    var self = this,
        downloads = [];

    this._forEachPlatform(function (name, platform) {
        self.setPlatformCacheDirectory(name, platform, self._version.version, self._version.flavor);
        platform.url = self._version.platforms[name + '-' + self._version.flavor];

        // Ensure that there is a cache folder
        if(self.options.forceDownload) {
            fs.removeSync(platform.cache);
        }

        fs.mkdirpSync(platform.cache);
        self.emit('log', 'Create cache folder in ' + path.resolve(self.options.cacheDir, self._version.version + '-' + self._version.flavor));

        if(!self.isPlatformCached(name, platform, self._version.version, self._version.flavor)) {
            downloads.push(
                Downloader.downloadAndUnpack(platform.cache, platform.url)
                    .catch(function(err){
                        if(err.statusCode === 404){
                            self.emit('log', 'ERROR: The version '+self._version.version+ ' (' + self._version.flavor + ') does not have a corresponding build posted at ' + self.options.downloadUrl + '. Please choose a version from that list.');
                        } else {
                            self.emit('log', err.msg);
                        }

                        return Promise.reject('Unable to download NWjs.');
                    })
            );
            self.emit('log', 'Downloading: ' + platform.url);
        } else {
            self.emit('log', 'Using cache for: ' + name);
        }
    });

    return Promise.all(downloads)
        .then(function(data) {
            Downloader.clearProgressbar();
            return data;
        });
};

NwBuilder.prototype.buildGypModules = function () {
    // @todo
    // If we trigger a rebuild we have to copy
    // the node_modules to a tmp location because
    // we don't want to change the source files

};


NwBuilder.prototype.preparePlatformSpecificManifests = function(){

    if(!(this._appPkg.platformOverrides && Object.keys(this._appPkg.platformOverrides).length)){
        return true;
    }

    var self = this;

    this._forEachPlatform(function (name, platform) {

        var overrides = self._appPkg.platformOverrides;
        if (overrides[name] || overrides[name.substr(0, name.length-2)]) {

            platformOverrides({
                options: self._appPkg,
                platform: name
            }, function(err, result){
                if(err) throw(err);
                platform.platformSpecificManifest = result;
            });
        }
    });
};


NwBuilder.prototype.createReleaseFolder = function () {
    var self = this,
        releasePath,
        directoryCreationPromises = [];

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

    this._forEachPlatform(function (name, platform) {
        directoryCreationPromises.push(new Promise(function(resolve, reject){
            platform.releasePath = path.resolve(self.options.buildDir, releasePath, name);

            // Ensure that there is a release Folder, delete and create it.
            fs.remove(platform.releasePath, function(err){
                if(err) return reject(err);

                fs.mkdirp(platform.releasePath, function(err){
                    if(err) return reject(err);

                    self.emit('log', 'Create release folder in ' + platform.releasePath);
                    resolve();
                });

            });
        }));
    });

    return Promise.all(directoryCreationPromises);
};

NwBuilder.prototype.copyNwjs = function () {
    var self = this,
        copiedFiles = [];

    this._forEachPlatform(function (name, platform) {
        // >= v0.12.3
        // Since we only have `*`, we're going to recursively get all the files, then copy them
        // Since a .app is treated like a directory, we need to ignore files inside them and just copy them entirely
        if(platform.files.length === 1 && platform.files[0] === '*'){
            // convert all paths inside a .app, etc. to just point to the .app
            // then remove duplicates
            var files = recursiveReaddirSync(platform.cache).map(function(file){
                var matches = file.match(/^(.+?(\.app|\.framework))/);
                if(matches){
                    return matches[1];
                }
                return file;
            });

            var totalFiles = _.uniq(files);
            platform.files = totalFiles;

            totalFiles.forEach(function(file){
                var destFile = path.relative(platform.cache, file);
                var options = {};

                if(['nw', 'nwjs.app', 'nw.exe'].indexOf(destFile) !== -1){
                    // ignore nwjs.app/Contents/Resources/*.lproj, otherwise the app name will show as nwjs.app in
                    // Finder
                    if(destFile === 'nwjs.app'){
                        options.filter = function(filepath){
                            return !/nwjs\.app\/Contents\/Resources\/[^.]+\.lproj(\/|$)/.test(filepath);
                        };
                    }
                    // rename executable to app name
                    destFile = self.options.appName + path.extname(destFile);
                }

                copiedFiles.push(Utils.copyFile(file, path.join(platform.releasePath, destFile), self, options));
                platform.files.push(destFile);
            });

            return;
        }

        // legacy
        platform.files.forEach(function (file, i) {
            var destFile = file;
            if(i===0) {
                // rename executable to app name
                destFile = self.options.appName + path.extname(file);
                // save new filename back to files list
                platform.files[0] = destFile;
            }
            copiedFiles.push(Utils.copyFile(path.resolve(platform.cache, file), path.resolve(platform.releasePath, destFile), self));
        });
    });

    return Promise.all(copiedFiles);
};

NwBuilder.prototype.isPlatformNeedingZip = function(name, platform) {
    var self = this,
        needsZip = platform.needsZip;

    if(name.indexOf('osx') === 0 && self.options.macZip != null) {
        deprecate('macZip is deprecated. Use the zip option instead.');
        needsZip = self.options.macZip;
    } else if(self.options.zip != null) {
        needsZip = self.options.zip;
    }

    return needsZip;
};

NwBuilder.prototype.zipAppFiles = function () {
    var self = this;

    // Check if zip is needed
    var doAnyNeedZip = false,
        numberOfPlatformsWithoutOverrides = 0;

    self._zips = {};

    this._forEachPlatform(function(name, platform) {
        var needsZip = self.isPlatformNeedingZip(name, platform);

        if(needsZip) {
            var platformSpecific = !!platform.platformSpecificManifest;

            self._zips[name] = { platformSpecific: platformSpecific };

            numberOfPlatformsWithoutOverrides += !platformSpecific;
        }

        doAnyNeedZip = doAnyNeedZip || needsZip;
    });

    self._needsZip = doAnyNeedZip;

    return new Promise(function(resolve, reject) {

        if(!self._needsZip){
            resolve();
            return;
        }


        // create (or don't create) a ZIP for multiple platforms
        new Promise(function(resolve, reject) {
            if(numberOfPlatformsWithoutOverrides > 1){
                Utils.generateZipFile(self._files, self).then(function (zip) {
                    resolve(zip);
                }, reject);
            }
            else {
                resolve();
            }
        })
            .then(function(platformAgnosticZip){
                var zipPromises = [];

                _.forEach(self._zips, function(zip, platformName){

                    if(platformAgnosticZip && !zip.platformSpecific){
                        zip.file = platformAgnosticZip;
                        return;
                    }

                    zipPromises.push(Utils.generateZipFile(
                        self._files,
                        self,
                        JSON.stringify(self._platforms[platformName].platformSpecificManifest)
                    ).then(function(file){
                        zip.file = file;
                    }));
                });

                Promise.all(zipPromises).then(resolve, reject);
            }, reject);
    });
};

NwBuilder.prototype.mergeAppFiles = function () {
    var self = this;

    var copyPromises = [];

    this._forEachPlatform(function (name, platform) {
        var zipping = self.isPlatformNeedingZip(name, platform);
        // We copy the app files if we are on mac and don't force zip
        if(!zipping) {
            // no zip, copy the files
            self._files.forEach(function (file) {
                var dest;

                if(name == 'osx32' || name === 'osx64') {
                    dest = path.resolve(self.getResourcesDirectoryPath(platform), 'app.nw', file.dest);
                } else {
                    dest = path.resolve(platform.releasePath, file.dest);
                }

                if(file.dest === 'package.json' && platform.platformSpecificManifest){
                    copyPromises.push(self.writePlatformSpecificManifest(platform, dest));
                }
                else {
                    copyPromises.push(Utils.copyFile(file.src, dest, self));
                }
            });
        } else if(name == 'osx32' || name == 'osx64') {
            // zip just copy the app.nw
            copyPromises.push(Utils.copyFile(
                self.getZipFile(name),
                path.resolve(self.getResourcesDirectoryPath(platform), 'app.nw'),
                self
            ));
        } else {
            var executableToMergeWith = self._version.isLegacy ? _.first(platform.files) : self.getExecutableName(name);

            // We cat the app.nw file into the .exe / nw
            copyPromises.push(Utils.mergeFiles(
                path.resolve(platform.releasePath, executableToMergeWith),
                self.getZipFile(name),
                platform.chmod
            ));
        }
    });

    return Promise.all(copyPromises);
};

NwBuilder.prototype.getZipFile = function(platformName){
    return this._zips[platformName] && this._zips[platformName].file || null;
};

NwBuilder.prototype.writePlatformSpecificManifest = function(platform, dest){
    return new Promise(function(resolve, reject){
        var pkgParentDirectory = path.join(dest, '../');
        if(!fs.existsSync(pkgParentDirectory)) fs.mkdirpSync(pkgParentDirectory);

        fs.writeFile(dest, JSON.stringify(platform.platformSpecificManifest), function(err){
            if(err) return reject(err);
            resolve();
        });
    });
};

NwBuilder.prototype.handleMacApp = function () {
    var self = this,
        allDone = [];

    this._forEachPlatform(function (name, platform) {
        if(['osx32', 'osx64'].indexOf(name) < 0) return;

        // Let's first handle the mac icon
        if(self.options.macIcns) {
            if(semver.satisfies(self._version.version, '<=0.12.3')) {
                allDone.push(Utils.copyFile(self.options.macIcns, path.resolve(self.getResourcesDirectoryPath(platform), 'nw.icns'), self));
            }
            else {
                allDone.push(Utils.copyFile(self.options.macIcns, path.resolve(self.getResourcesDirectoryPath(platform), 'app.icns'), self));
                allDone.push(Utils.copyFile(self.options.macIcns, path.resolve(self.getResourcesDirectoryPath(platform), 'document.icns'), self));
            }
        }

        // Handle mac credits
        if(self.options.macCredits) {
            allDone.push(Utils.copyFile(self.options.macCredits, path.resolve(self.getResourcesDirectoryPath(platform), 'Credits.html'), self));
        }

        // Let's handle the Plist
        var PlistPath = path.resolve(platform.releasePath, self.options.appName+'.app', 'Contents', 'Info.plist');

        // If the macPlist is a string we just copy the file
        if(typeof self.options.macPlist === 'string') {
            allDone.push(Utils.copyFile(self.options.macPlist, PlistPath, self));
        } else {
            // Setup the Plist
            var plistOptions = Utils.getPlistOptions(
                {
                    name: self.options.appName,
                    version: self.options.appVersion,
                    copyright: self._appPkg.copyright
                },
                self.options.macPlist
            );

            allDone.push(Utils.editPlist(PlistPath, PlistPath, plistOptions));
        }
    });

    return Promise.all(allDone);
};

NwBuilder.prototype.handleWinApp = function () {
    var self = this,
        allDone = [];

    this._forEachPlatform(function (name, platform) {
        if(!self.options.winIco || ['win32', 'win64'].indexOf(name) < 0) return;

        // build a promise chain
        allDone.push(new Promise(function(resolve, reject) {
            self.emit('log', 'Update ' + name + ' executable icon');
            var executableName = self._version.isLegacy ? _.first(platform.files) : self.getExecutableName(name);
            // Set icon
            winresourcer({
                operation: "Update",
                exeFile: path.resolve(platform.releasePath, executableName),
                resourceType: "Icongroup",
                resourceName: "IDR_MAINFRAME",
                lang: 1033, // Required, except when updating or deleting
                resourceFile: path.resolve(self.options.winIco)
            }, function(err) {
                if(!err) { resolve(); }
                else {
                    reject('Error while updating the Windows icon.' +
                        (process.platform !== "win32"
                                ? ' Wine (winehq.org) must be installed to add custom icons from Mac and Linux.'
                                : ''
                        )
                    );
                }
            });
        }));
    });

    return Promise.all(allDone);
};

NwBuilder.prototype.runApp = function () {
    var self = this;

    var currentPlatform = this.options.currentPlatform;
    var platform = this._platforms[currentPlatform];
    // if the user is on Windows/OS X 64-bit, but there is no 64-bit build, try the 32-bit build
    if(!platform){
        if(['osx64', 'win64'].indexOf(this.options.currentPlatform) !== -1) {
            currentPlatform = currentPlatform.split('64')[0] + '32';
            platform = this._platforms[currentPlatform];

            if(!platform) {
                throw new Error('currentPlatform selected (' + this.options.currentPlatform + ") doesn't exist in selected platforms (" +
                    Object.keys(this._platforms).join(', ') + '). We also tried ' + currentPlatform + " and that doesn't exist either"
                );
            }
        }
        else {
            throw new Error('currentPlatform selected (' + currentPlatform + ") doesn't exist in selected platforms (" +
                Object.keys(this._platforms).join(', ') + ')'
            );
        }
    }

    var runnable;
    if(this._version.isLegacy) {
        runnable = platform.getRunnable(this.options.version);
    }
    else {
        if(currentPlatform.indexOf('osx') === 0){
            runnable = 'nwjs.app/Contents/MacOS/nwjs'
        }
        else if(currentPlatform.indexOf('win') === 0) {
            runnable = 'nw.exe'
        }
        else {
            runnable = 'nw'
        }
    }
    var executable = path.resolve(platform.cache, runnable);

    self.emit('log', 'Launching App');
    return new Promise(function(resolve, reject) {
        var nwProcess = self._nwProcess = spawn(executable, ['--enable-logging', self.options.files.replace(/\*[\/\*]*/,"")].concat(self.options.argv));

        self.emit('appstart');

        nwProcess.stdout.on('data', function(data) {
            self.emit('stdout', data);
        });

        nwProcess.stderr.on('data', function(data) {
            self.emit('stderr', data);
        });

        nwProcess.on('error', function(err) {
            self.emit('log', 'App launch error: ' + err);
            reject(err);
        });

        nwProcess.on('close', function(code) {
            self._nwProcess = undefined;
            self.emit('log', 'App exited with code ' + code);
            resolve();
        });
    });
};

NwBuilder.prototype.isAppRunning = function () {
    return this._nwProcess !== undefined;
};

NwBuilder.prototype.getAppProcess = function () {
    return this._nwProcess;
};

NwBuilder.prototype._forEachPlatform = function (fn) {
    _.forEach(this._platforms, function(platform, name) {
        return fn(name, platform);
    });
};

// Mac only
NwBuilder.prototype.getResourcesDirectoryPath = function (platform) {
    return path.resolve(platform.releasePath, this.options.appName+'.app', 'Contents', 'Resources');
};

// Don't use if legacy version
NwBuilder.prototype.getExecutableName = function (platform) {
    var executableExtension = '';

    if(platform.indexOf('osx') === 0){
        executableExtension = '.app';
    }
    else if(platform.indexOf('win') === 0){
        executableExtension = '.exe';
    }

    return this.options.appName + executableExtension;
};

NwBuilder.prototype.setPlatformCacheDirectory = function (platformName, platform, version, flavor) {
    if(!platform.cache) {
        platform.cache = path.resolve(this.options.cacheDir, version + "-" + flavor, platformName);
    }
};


NwBuilder.prototype.isPlatformCached = function (platformName, platform, version, flavor) {
    this.setPlatformCacheDirectory(platformName, platform, version, flavor);
    if (this.options.forceDownload) {
        return false;
    }
    this.preparePlatformFiles(platformName, platform, version);
    return Downloader.checkCache(platform.cache, platform.files);
};

// returns a Boolean; true if the desired platform is supported
NwBuilder.prototype.preparePlatformFiles = function(platformName, platform, version) {
    // return if platform.files is already prepared
    if(Object.keys(platform.files)[0] !== Object.keys(platforms[platformName].files)[0]){
        return true;
    }

    if(semver.satisfies(version, '<0.12.3')) {
        return !Object.keys(platform.files).every(function (range) {
            if (semver.satisfies(version, range)) {
                platform.files = platform.files[range];
                if ('string' === typeof platform.files) {
                    platform.files = [platform.files];
                }
                return false;
            }
            return true;
        });
    }

    platform.files = ['*']; // otherwise bad stuff will happen like at attempt to download legacy version files
    // all we can do here is assume it's oke because this._version might not exist yet, but callers of this function
    // will check properly where necessary
    return true;
};
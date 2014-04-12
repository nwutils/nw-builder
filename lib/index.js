var Promise = require('bluebird');
var _ = require('lodash');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs-extra');
var path = require('path');
var url = require('url');

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
        plattforms: ['win','osx'],
        version: 'lastest',
        buildDir: './build',
        cacheDir: './cache',
        versionsUrl: 'https://s3.amazonaws.com/node-webkit/',
        downloadUrl: 'http://dl.node-webkit.org/',
        buildType: 'default', // timestamped
        forceDownload: false,
        checkVersions: true,
        macCredits: false,
        macIcns: false,
        macZip: false,
        macPlist: false
    };

    // Assing options
    this.options = _.defaults(options, defaults);
    this._plattforms = [{
        plattform: 'win',
        needsZip: true,
        files: ['nw.exe', 'ffmpegsumo.dll', 'icudt.dll', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak'] // First file must be the executable
    },{
        plattform: 'osx',
        files: ['node-webkit.app']
    },{
        plattform: 'linux32',
        needsZip: true,
        chmod: '0755',
        files: ['nw', 'nw.pak', 'libffmpegsumo.so'] // First file must be the executable
    },{
        plattform: 'linux64',
        needsZip: true,
        chmod: '0755', // chmod file file to be executable
        files: ['nw', 'nw.pak', 'libffmpegsumo.so'] // First file must be the executable
    }];

    // Some Option checking
    if(!this.options.files) {
        throw new Error('Please specify some files');
    }

    // Check Plattforms
    this._plattforms.forEach(function (plattform) {
        plattform.active = (self.options.plattforms.indexOf(plattform.plattform) === -1 ? false : true);
    });

    // Plattforms
    this._plattforms = _.where(this._plattforms, {'active':true});

    if(this._plattforms.length === 0 || this._plattforms.length === undefined) {
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
               self.options.appName = appPkg.name;
               self.options.appVersion = appPkg.version;
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

    this._plattforms.map(function (single_plattform) {
        single_plattform.cache = path.resolve(self.options.cacheDir, self._version.version, single_plattform.plattform);
        single_plattform.url = url.resolve(self.options.downloadUrl, self._version.plattforms[single_plattform.plattform]);

        // Ensure that there is a cache folder
        if(self.options.forceDownload) {
            fs.removeSync(single_plattform.cache);
        }

        fs.mkdirpSync(single_plattform.cache);
        self.emit('log', 'Create cache folder in ' + path.resolve(self.options.cacheDir, self._version.version));

        if(!Downloader.checkCache(single_plattform.cache, single_plattform.files)) {
            downloads.push(Downloader.downloadAndUnpack(single_plattform.cache, single_plattform.url));
            self.emit('log', 'Downloading: ' + single_plattform.url);
        } else {
            self.emit('log', 'Using cache for: ' + single_plattform.plattform);
        }

        return single_plattform;
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

    // buildTypes
    switch(self.options.buildType) {
        case 'timestamped':
            releasePath = self.options.appName + ' - ' + Math.round(Date.now() / 1000).toString();
        break;

        case 'versioned':
            releasePath = self.options.appName + ' - v' + self.options.appVersion;
        break;

        case 'default':
            releasePath = self.options.appName;
        break;

        default:
            releasePath = self.options.appName;
    }


    this._plattforms.forEach(function (single_plattform) {
        single_plattform.releasePath = path.resolve(self.options.buildDir, releasePath, single_plattform.plattform);

        // Ensure that there is a release Folder, delete and create it.
        fs.removeSync(single_plattform.releasePath);
        fs.mkdirpSync(single_plattform.releasePath);
        self.emit('log', 'Create release folder in ' + single_plattform.releasePath);
    });

    return true;

};

NwBuilder.prototype.copyNodeWebkit = function () {
    var copiedFiles = [];

    this._plattforms.forEach(function (single_plattform) {
        single_plattform.files.forEach(function (file) {
            copiedFiles.push(Utils.copyFile(path.resolve(single_plattform.cache, file), path.resolve(single_plattform.releasePath, file)));
        });
    });

    return Promise.all(copiedFiles);
};

NwBuilder.prototype.zipAppFiles = function () {
    var self = this;

    // Check if zip is needed
    this._needsZip = (self.options.macZip || _.any(this._plattforms, {'needsZip':true}));

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

    this._plattforms.forEach(function (single_plattform) {
        // We copy the app files if we are on mac and don't force zip
        if(single_plattform.plattform === 'osx') {
            // no zip, copy the files
            if(!self.options.macZip) {
                self._files.forEach(function (file) {
                    var dest = path.resolve(single_plattform.releasePath, 'node-webkit.app', 'Contents', 'Resources', 'app.nw', file.dest);
                    copiedFiles.push(Utils.copyFile(file.src, dest));
                });
            } else {
                // zip just copy the app.nw
                copiedFiles.push(Utils.copyFile(self._nwFile, path.resolve(single_plattform.releasePath, 'node-webkit.app', 'Contents', 'Resources', 'nw.icns')));
            }
        } else {
            // We cat the app.nw file into the .exe / nw
            copiedFiles.push(Utils.mergeFiles(path.resolve(single_plattform.releasePath, _.first(single_plattform.files)), self._nwFile), single_plattform.chmod);
        }
    });

    return Promise.all(copiedFiles);
};

NwBuilder.prototype.handleMacApp = function () {
    var self = this, allDone = [];
    var macPlattform = _.findWhere(self._plattforms, {'plattform':'osx'});
    if(!macPlattform) return Promise.resolve();

    // Let's first handle the mac icon
    if(self.options.macIcns) {
        allDone.push(Utils.copyFile(self.options.macIcns, path.resolve(macPlattform.releasePath, 'node-webkit.app', 'Contents', 'Resources', 'app.icns')));
    }

    // Let handle the Plist
    var PlistPath = path.resolve(macPlattform.releasePath, 'node-webkit.app', 'Contents', 'Info.plist');

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

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

    var defaults = {
        files: null,
        appName: false,
        appVersion: false,
        plattforms: 'win,osx',
        version: 'lastest',
        buildDir: './build',
        cacheDir: './cache',
        downloadUrl: 'https://s3.amazonaws.com/node-webkit/',
        buildType: 'default', // timestamped
        forceDownload: false,
        macCredits: false,
        macIcns: false,
        macZip: false,
        macPlist: false
    };

    // Assing options
    this.options = _.defaults(options, defaults);
    this._plattforms = [{
        plattform: 'win',
        files: ['ffmpegsumo.dll', 'icudt.dll', 'libEGL.dll', 'libGLESv2.dll', 'nw.exe', 'nw.pak'],
    },{
        plattform: 'osx',
        files: ['node-webkit.app'],
    },{
        plattform: 'linux32',
        files: ['nw', 'nw.pak', 'libffmpegsumo.so'],
    },{
        plattform: 'linux64',
        files: ['nw', 'nw.pak', 'libffmpegsumo.so'],
    }];

    // Some Option checking
    if(!this.options.files) {
        throw new Error('Please specify some files');
    }

    // Check Plattforms
    var _plattforms = this.options.plattforms.split(',');
    this._plattforms.forEach(function (plattform) {
        plattform.active = (_plattforms.indexOf(plattform.plattform) === -1 ? false : true);
    });

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
        .then(this.copyAppFiles)
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
    return NwVersions.getVersions(this.options.downloadUrl).then(function (data) {
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

NwBuilder.prototype.copyNodeWebkit = function (data) {
    var copiedFiles = [];
    this._plattforms.forEach(function (single_plattform) {
        single_plattform.files.forEach(function (file) {
            copiedFiles.push(Utils.copyFiles(path.resolve(single_plattform.cache, file), path.resolve(single_plattform.releasePath, file)));
        });
    });

    return Promise.all(copiedFiles);
};

NwBuilder.prototype.zipAppFiles = function (data) {
    console.log('NwBuilder.prototype.zipAppFiles');
    return new Promise(function(resolve, reject) {

    });
};



var Promise = require('bluebird');
var _ = require('lodash');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var Mkdirp = require('mkdirp');
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
        appVerson: false,
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
        self._json = data.json;
        self._files = data.files;
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
        Mkdirp.sync(single_plattform.cache);
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
    return new Promise(function(resolve, reject) {

    });
};

NwBuilder.prototype.copyNodeWebkit = function (data) {
    return new Promise(function(resolve, reject) {

    });
};

NwBuilder.prototype.zipAppFiles = function (data) {
    return new Promise(function(resolve, reject) {

    });
};



var Promise = require('bluebird');
var _ = require('lodash');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var NwVersions = require('./versions');

// We inherit from EventEmitter for logging
inherits(NwBuilder, EventEmitter);
module.exports = NwBuilder;
function NwBuilder(options) {

    var defaults = {
        files: null,
        appName: false,
        appVerson: false,
        plattforms: 'win,mac',
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

    // Some Option checking
    if(!this.options.files) {
        throw new Error('Please specify some files');
    }

    // Check Plattforms
    var plattforms = this.options.plattforms.split(','),
        validPlattforms = [];


    plattforms.forEach(function (plattform) {
        if(['win', 'mac', 'linux32', 'linux64'].indexOf(plattform) !== -1) {
            validPlattforms.push(plattform);
        }
    });

    if(validPlattforms.length === 0) {
        throw new Error('No platform to build!');
    }

    this.plattforms = validPlattforms;

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
    var self = this,
        version;

    // Remove unwanted v strings
    self.options.version = self.options.version.replace('v', '');
    return NwVersions.getVersions(this.options.downloadUrl).then(function (data) {
        self._version = _.findWhere(data, {'version': self.options.version});
        if(!self._version) {
            self._version = _.findLast(data);
        }

        self.emit('log', 'Using v' + self._version.version);

        return self._version;
    });

};

NwBuilder.prototype.checkVersions = function (data) {
    return new Promise(function(resolve, reject) {

    });
};

NwBuilder.prototype.downloadNodeWebkit = function (data) {
    return new Promise(function(resolve, reject) {

    });
};

NwBuilder.prototype.createReleaseFolder = function (data) {
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



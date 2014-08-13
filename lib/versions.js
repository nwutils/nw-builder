var Promise = require('bluebird');
var npm = Promise.promisifyAll(require('npm'));
var semver = require('semver');
var platforms = require('./platforms.js')
var _ = require('lodash');

function getNPMVersions() {
    return npm.loadAsync()
        .then(function() {
            return Promise.promisify(npm.commands.info)(['nodewebkit', 'versions'], true);
        });
}

function filterVersions(data) {
    // filter out patch/build versions
    return data[Object.keys(data)[0]].versions.filter(function(version) {
        return !/\-/.test(version);
    });
}

module.exports = {
    getLatestVersion: function() {
        return getNPMVersions()
            .then(function(data) {
                return Object.keys(data)[0];
            });
    },
    getVersions: function () {
        return getNPMVersions()
            .then(filterVersions)
            .then(this.getVersionNames);
    },
    getVersionNames: function (v) {
        var versionNames = {
            version: v,
            platforms: {}
        };

        // create a hash of platform version names based on current platforms
        _.forEach(platforms, function (platform, name) {
            versionNames.platforms[name] = _.template(platform.versionNameTemplate, versionNames);
        })

        return versionNames;
    }
};

var Promise = require('bluebird');
var npm = Promise.promisifyAll(require('npm'));
var semver = require('semver');

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
        return {
            'version': v,
            'platforms': {
                'win':     'v' + v + '/node-webkit-v' + v + '-win-ia32.zip',
                'osx':     'v' + v + '/node-webkit-v' + v + '-osx-ia32.zip',
                'linux32': 'v' + v + '/node-webkit-v' + v + '-linux-ia32.tar.gz',
                'linux64': 'v' + v + '/node-webkit-v' + v + '-linux-x64.tar.gz'
            }
        };
    }
};

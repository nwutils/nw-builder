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
    var versions = data[Object.keys(data)[0]].versions.filter(function(version) {
        return !/\-/.test(version);
    });
    // sort highest to lowest
    versions.sort(function(a, b) {
        return semver.lt(a, b);
    });
    return versions;
}

module.exports = {
    getLatestVersion: function() {
        return getNPMVersions()
            .then(filterVersions)
            .then(function(versions) {
                return versions[0];
            });
    },
    getVersions: function () {
        return getNPMVersions()
            .then(filterVersions)
            .then(this.getVersionNames);
    },
    getVersionNames: function (version) {
        // The nodewebkit npm package tracks the version of node-webkit, which is why we build
        // the archive names using the versions from npm.
        return new Promise(function(resolve, reject) {
            if (!version || version === 'latest') {
                reject('You need to specify a version (eg 0.8.4) if you disable checkVersions');
            } else {
                if (!Array.isArray(version)) version = [version];
                resolve(version.map(function(v) {
                    return {
                        'version': v,
                        'platforms': {
                            'win':     'v' + v + '/node-webkit-v' + v + '-win-ia32.zip',
                            'osx':     'v' + v + '/node-webkit-v' + v + '-osx-ia32.zip',
                            'linux32': 'v' + v + '/node-webkit-v' + v + '-linux-ia32.tar.gz',
                            'linux64': 'v' + v + '/node-webkit-v' + v + '-linux-x64.tar.gz'
                        }
                    };
                }));
            }
        });
    }
};

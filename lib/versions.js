var Promise = require('bluebird');
var npm = Promise.promisify(require('npm'));

function getNpmInfo(prop) {
    return npm.loadAsync()
        .then(function() {
            return Promise.promisify(npm.commands.info)(['nodewebkit', prop], true);
        });
}

module.exports = {
    getLatestVersion: function() {
        return getNpmInfo('version')
            .then(function(info) {
                return Object.keys(info)[0];
            });
    },
    getVersions: function () {
        return getNpmInfo('versions')
            .then(function(info) {
                return info[Object.keys(info)[0]].versions;
            })
            .then(this.getVersionNames);
    },
    getVersionNames: function (version) {
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

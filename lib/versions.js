var Promise = require('bluebird');
var exec = Promise.promisify(require('child_process').exec);

module.exports = {
    getVersions: function () {
        return exec('npm info nodewebkit --json').then(function(results) {
            return JSON.parse(results[0]).versions;
        }).then(this.getVersionNames);
    },
    getVersionNames: function (version) {
        return new Promise(function(resolve, reject) {
            if (!version || version === 'latest') {
                reject('You need to specify a version (eg 0.8.4) if you disable checkVersions');
            } else {
                if (!Array.isArray(version)) version = [version];
                resolve(version.map(function(v) {
                    v = v.slice(0, 5);
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

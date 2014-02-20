var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var _ = require('lodash');

module.exports = {
    getVersions: function (baseUrl) {
        return request(baseUrl).then(this.matchVersions);
    },
    matchVersions: function (data) {
        var match, plattforms = [{
            plattform: 'win',
            regex: /v(\d.\d.\d)\/node-webkit-v(?:\d.\d.\d)-win-ia32\.zip/g
        }, {
            plattform: 'osx',
            regex: /v(\d.\d.\d)\/node-webkit-v(?:\d.\d.\d)-osx-ia32\.zip/g
        }, {
            plattform: 'linux32',
            regex: /v(\d.\d.\d)\/node-webkit-v(?:\d.\d.\d)-linux-x64\.tar\.gz/g
        }, {
            plattform: 'linux64',
            regex: /v(\d.\d.\d)\/node-webkit-v(?:\d.\d.\d)-linux-ia32\.tar\.gz/g
        }], versions = {}, sortedVersions = [];

        plattforms.forEach(function (plattform) {
            while (match = plattform.regex.exec(data)) {
                versions[match[1]] = versions[match[1]] || {};
                versions[match[1]][plattform.plattform] = match[0];
            }
        });

        Object.keys(versions).forEach(function(key) {
            sortedVersions.push({
                'version': key,
                'plattforms': {
                    'win': versions[key].win,
                    'osx': versions[key].osx,
                    'linux32': versions[key].linux32,
                    'linux64': versions[key].linux64
                }
            });
        });

        return _.sortBy(sortedVersions, function (v) {
            return parseFloat(v.version);
        });
    }

};
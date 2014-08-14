var Promise = require('bluebird');
var semver = require('semver');
var request = require('request');
var _ = require('lodash');

function getVersionList(url){
    var done = Promise.defer(),
        self = this,
        scrapePtrn = /href="v?([0-9]+\.[0-9]+\.[0-9]+[^"]*)\/"/ig,
        searchRes,
        versions = [];

    request(url, function (err, res, body) {
        if (err) {
            done.reject(err);
        } else if (res.statusCode !== 200) {
            done.reject('Received status code '+res.statusCode+' when checking for available versions.');
        } else {
            // scrapes valid semver versions from apache directory listing
            while ((searchRes = scrapePtrn.exec(body)) !== null) {
                searchRes = searchRes[1];
                if( semver.valid(searchRes) && !_.contains(versions, searchRes) ) {
                    versions.push(searchRes);
                }
            }
            // order with newest version at front of array
            versions = versions.sort(function(a,b){ return semver.compare(b,a); })
            done.resolve(versions);
        }

    });

    return done.promise;
}

module.exports = {
    getLatestVersion: function(url) {
        return getVersionList(url)
            .then(function(versions) {
                return versions[0];
            });
    },
    getVersions: function (url) {
        return getVersionList(url);
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

var Promise = require('bluebird');
var semver = require('semver');
var platforms = require('./platforms.js');
var request = require('request');
var _ = require('lodash');
var resolveUrl = require('url').resolve;

function getVersionList(url){
    var done = Promise.defer(),
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
            versions = versions.sort(function(a,b){ return semver.compare(b,a); });

            // filter out invalid / alpha versions
            var validationPromises = [];
            versions.forEach(function(version){
                validationPromises.push(new Promise(function(resolve, reject){
                    // check if windows 64-bit ZIP exists
                    request.head(resolveUrl(url, module.exports.getVersionNames(version).platforms.win32), function(err, res){
                        // note: this takes a version string and replaces it with an object (will be converted back later)
                        resolve({
                            version: version,
                            valid: !err && res.statusCode === 200
                        });
                    });
                }));
            });

            Promise.all(validationPromises)
                .then(function(versions){
                    // convert back to array of version strings (filtered)
                    versions = versions.filter(function(versionObj){ return versionObj.valid; })
                        .map(function(versionObj){ return versionObj.version; });
                    done.resolve(versions);
                }, done.reject);
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
        var versionNames = {
            version: v,
            platforms: {}
        };

        var templateData = {
            version: v,
            name: semver.satisfies(v, '>=0.12.0 || ~0.12.0-alpha') ? 'nwjs' : 'node-webkit'
        };

        // create a hash of platform version names based on current platforms
        _.forEach(platforms, function (platform, name) {
            versionNames.platforms[name] = _.template(platform.versionNameTemplate, templateData);
        });

        return versionNames;
    }
};

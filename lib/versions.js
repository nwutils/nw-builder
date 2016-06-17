var Promise = require('bluebird');
var platforms = require('./platforms');
var semver = require('semver');
var request = require('request');
var _ = require('lodash');
var Version = require('./Version');

function get(url, options){
    var deferred = Promise.defer();

    request(url, options, function (err, res, body) {
        if (err) {
            deferred.reject(err);
        } else if (res.statusCode !== 200) {
            deferred.reject('Received status code ' + res.statusCode + ': ' + url);
        } else {
            deferred.resolve(body);
        }
    });

    return deferred.promise;
}

function getLegacyVersions(downloadUrl){
    var scrapePtrn = /href="v?([0-9]+\.[0-9]+\.[0-9]+[^"]*)\/"/ig,
        searchRes,
        versions = [];

    return get(downloadUrl).then(function(body){
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
            if(!isLegacyVersion(version)){
                return;
            }
            validationPromises.push(new Promise(function(resolve, reject){
                // check if windows 64-bit ZIP exists
                var win32Url = new Version({
                    version: version,
                    supportedPlatforms: ['win32'],
                    downloadUrl: downloadUrl
                }).platforms.win32;
                request.head(win32Url, function(err, res){
                    // note: this takes a version string and replaces it with an object (will be converted back later)
                    resolve({
                        version: version,
                        valid: !err && res.statusCode === 200
                    });
                });

            }));
        });

        var allPlatforms = Object.keys(platforms);

        return Promise.all(validationPromises)
            .then(function(versions){
                // convert back to array of version strings (filtered)
                return versions.filter(function(versionObj){
                        return versionObj.valid;
                    })
                    .map(function(versionObj){
                        return new Version({
                            version: versionObj.version,
                            supportedPlatforms: allPlatforms,
                            downloadUrl: downloadUrl
                        });
                    });
            });
    });
}

function getManifest(){
    return get('http://nwjs.io/versions.json', { json: true }).then(function(body){
        return body;
    });
}

function getVersionsFromManifest(downloadUrl){
    var mapFilesToPlatforms = function(files){
        return files.map(function(file){
            // convert win-x64 to win64, linux-ia32 to linux 32, etc.
            return file.replace(/-(x|ia)/, '');
        });
    };

    return getManifest().then(function(manifest){
        return manifest.versions
            .filter(function(versionFromManifest){
                return versionFromManifest.flavors.indexOf('sdk') !== -1;
            })
            .map(function(versionFromManifest){
                return new Version({
                    version: versionFromManifest.version.replace('v', ''),
                    supportedPlatforms: mapFilesToPlatforms(versionFromManifest.files),
                    downloadUrl: downloadUrl
                });
            });
    });
}

function isLegacyVersion(version){
    return semver.satisfies(version, '<0.12.3');
}

module.exports = {
    // Gets the latest stable version
    getLatestVersion: function(downloadUrl) {
        return getManifest()
            .then(function(manifest) {
                return {
                    desiredVersion: manifest.stable.replace('v', ''),
                    downloadUrl: downloadUrl
                }
            })
            .then(this.getVersion);
    },
    // TODO js doc
    getVersion: function(args){
        return (isLegacyVersion(args.desiredVersion) ? getLegacyVersions : getVersionsFromManifest)(args.downloadUrl)
            .then(function(versions) {
                var version = versions.find(function(version){
                    if(version.version === args.desiredVersion) {
                        return version;
                    }
                });

                if(version){
                    return version;
                }
                throw new Error('Version ' + args.desiredVersion + ' not found.');
            });
    },
    getVersions: function(downloadUrl){
        return Promise.all([getVersionsFromManifest(downloadUrl), getLegacyVersions(downloadUrl)])
            .then(function(versionLists){
                return versionLists[0].concat(versionLists[1]);
            });
    }
};

var Promise = require('bluebird');
var platforms = require('./platforms');
var semver = require('semver');
var request = require('request');
var _ = require('lodash');
var Version = require('./Version');

/**
 * @param {string} url
 * @param {object} options - Passed to request
 * @returns {promise} which resolves to response body
 */
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

/**
 * @param {string} downloadUrl
 * @returns {promise} which resolves to an array of {Version}s
 */
function getLegacyVersions(downloadUrl, flavor){
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
                    flavors: ['sdk'],
                    supportedPlatforms: ['win32'],
                    downloadUrl: downloadUrl
                }).platforms['win32-sdk'];
                request.head(win32Url, function(err, res){
                    // note: this takes a version string and replaces it with an object (will be converted back later)
                    resolve({
                        version: version,
                        flavor: ['sdk'],
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
                            flavors: versionObj.flavor,
                            supportedPlatforms: allPlatforms,
                            downloadUrl: downloadUrl
                        });
                    });
            });
    });
}

/**
 * @returns {promise} which resolves to response body
 */
function getManifest(){
    return get('http://nwjs.io/versions.json', { json: true }).then(function(body){
        return body;
    });
}

/**
 * @param {string} downloadUrl
 * @returns {promise} which resolves to an array of {Version}s
 */
function getVersionsFromManifest(downloadUrl, flavor){
    var mapFilesToPlatforms = function(files){
        return files.map(function(file){
            // convert win-x64 to win64, linux-ia32 to linux 32, etc.
            return file.replace(/-(x|ia)/, '');
        });
    };

    return getManifest().then(function(manifest){
        return manifest.versions
            .filter(function(versionFromManifest){
                // 0.12.3 is an exception that is in the manifest but is kind of a legacy version
                return (versionFromManifest.flavors !== undefined) && ( versionFromManifest.flavors.indexOf('sdk') !== -1 || versionFromManifest.version === 'v0.12.3');
            })
            .map(function(versionFromManifest){
                return new Version({
                    version: versionFromManifest.version.replace('v', ''),
                    flavors: versionFromManifest.flavors,
                    supportedPlatforms: mapFilesToPlatforms(versionFromManifest.files),
                    downloadUrl: downloadUrl
                });
            });
    });
}

/**
 * @param {string} version
 * @returns {boolean}
 */
function isLegacyVersion(version){
    return semver.satisfies(version, '<0.12.3');
}

module.exports = {
    /**
     * Gets the latest stable version
     * @param {string} downloadUrl
     * @param {string} flavor
     * @returns {promise} which resolves to a {Version}
     */
    getLatestVersion: function(downloadUrl, flavor) {
        return getManifest()
            .then(function(manifest) {
                return {
                    desiredVersion: manifest.stable.replace('v', ''),
                    flavor: flavor,
                    downloadUrl: downloadUrl
                }
            })
            .then(this.getVersion);
    },
    /**
     * @param {string} args.desiredVersion
     * @param {string} args.downloadUrl
     * @param {string} args.flavor
     * @returns {promise} which resolves to a {Version}
     */
       getVersion: function(args){
	   return (isLegacyVersion(args.desiredVersion) ? getLegacyVersions : getVersionsFromManifest)(args.downloadUrl)
            .then(function(versions) {
                var version = versions.findIndex(function(version){
                    return version.version === args.desiredVersion;
                });

                return version >= 0
                    ? Promise.resolve(versions[version])
                    : Promise.reject('Version ' + args.desiredVersion + ' not found.');
            });
},
    /**
     * @param {string} downloadUrl
     * @param {string} flavor
     * @returns {promise} which resolves to an array of {Version}s
     */
    getVersions: function(downloadUrl, flavor){
       
        return Promise.all([getVersionsFromManifest(downloadUrl, flavor), getLegacyVersions(downloadUrl, flavor)])
            .then(function(versionLists){
                return versionLists[0].concat(versionLists[1]);
            });
    }
};

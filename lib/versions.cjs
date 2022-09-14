/**
 * @file    Makes network requests and performs logic related to retrieving, filtering, and organizing data about NW.js versions
 * @author  ayushmxn
 */

const _ = require('lodash');
const request = require('request');
const semver = require('semver');

const { Platforms } = require('../dist/index.cjs');
const Version = require('./Version.cjs');

/**
 * Makes network requests using GET HTTP method.
 *
 * @param  {string}          url      The URL to GET data from
 * @param  {object}          options  Passed to request
 * @return {Promise<string>}          Resolves to response body string
 */
function get(url, options) {
  return new Promise(function (resolve, reject) {
    request(url, options, function (err, res, body) {
      if (err) {
        reject(err);
      } else if (res.statusCode !== 200) {
        reject("Received status code " + res.statusCode + ": " + url);
      } else {
        resolve(body);
      }
    });
  });
}

/**
 * Produces an array of objects for valid, stable NW.js versions, sorted by newest version first.
 *
 * @param  {string}            downloadUrl  URL used to GET data
 * @return {Promise<object[]>}              Resolves to array of {Version}s
 */
function getLegacyVersions(downloadUrl) {
  let scrapePattern = /href="v?([0-9]+\.[0-9]+\.[0-9]+[^"]*)\/"/gi;
  let searchResponse;
  let versions = [];

  return get(downloadUrl).then(function (body) {
    // scrapes valid semver versions from apache directory listing
    while ((searchResponse = scrapePattern.exec(body)) !== null) {
      searchResponse = searchResponse[1];
      if (semver.valid(searchResponse) && !_.includes(versions, searchResponse)) {
        versions.push(searchResponse);
      }
    }
    // order with newest version at front of array
    versions = versions.sort(function (a, b) {
      return semver.compare(b, a);
    });

    // filter out invalid / alpha versions
    var validationPromises = [];
    versions.forEach(function (version) {
      if (!isLegacyVersion(version)) {
        return;
      }
      validationPromises.push(
        new Promise(function (resolve) {
          // check if Windows 64-bit ZIP exists
          var win32Url = new Version({
            version,
            flavors: ['sdk'],
            supportedPlatforms: ['win32'],
            downloadUrl
          }).platforms['win32-sdk'];
          request.head(win32Url, function (err, response) {
            // note: this takes a version string and replaces it with an object (will be converted back later)
            resolve({
              version,
              flavors: ['sdk'],
              valid: (!err && response.statusCode === 200)
            });
          });
        }),
      );
    });

    var allPlatforms = Object.keys(Platforms);

    return Promise.all(validationPromises)
      .then(function (versions) {
        // convert back to array of version strings (filtered)
        return versions
          .filter(function (versionObj) {
            return versionObj.valid;
          })
          .map(function (versionObj) {
            return new Version({
              version: versionObj.version,
              flavors: versionObj.flavors,
              supportedPlatforms: allPlatforms,
              downloadUrl: downloadUrl,
            });
          });
      });
  });
}

/**
 * Downlaods the 'versions.json' file.
 *
 * @param  {string}  [manifestUrl]  Optional URL, defaults to 'https://nwjs.io/versions.json'
 * @return {Promise}                Resolves to response body
 */
function getManifest(manifestUrl) {
  manifestUrl = manifestUrl || 'https://nwjs.io/versions.json';
  const options = { json: true };
  return get(manifestUrl, options)
    .then(function (body) {
      return body;
    });
}

/**
 * [getVersionsFromManifest description]
 *
 * @param  {string}            downloadUrl    [description]
 * @param  {string}            [manifestUrl]  Optional URL, defaults to 'https://nwjs.io/versions.json'
 * @return {Promise<object[]>}                Resolves to an array of Version objects
 */
function getVersionsFromManifest(downloadUrl, manifestUrl) {
  const mapFilesToPlatforms = function (files) {
    return files.map(function (file) {
      // convert win-x64 to win64, linux-ia32 to linux32, etc.
      return file.replace(/-(x|ia)/, '');
    });
  };

  return getManifest(manifestUrl)
    .then(function (manifest) {
      return manifest.versions
        .filter(function (versionFromManifest) {
          // 0.12.3 is an exception that is in the manifest but is kind of a legacy version
          return (
            versionFromManifest.flavors !== undefined &&
            (
              versionFromManifest.flavors.includes('sdk') ||
              versionFromManifest.version === 'v0.12.3'
            )
          );
        })
        .map(function (versionFromManifest) {
          return new Version({
            version: versionFromManifest.version.replace('v', ''),
            flavors: versionFromManifest.flavors,
            supportedPlatforms: mapFilesToPlatforms(versionFromManifest.files),
            downloadUrl
          });
        });
    });
}

/**
 * Detects if NW.js version is 0.12.3 or below. 0.13.0 was a major architectural rewrite, all versions
 * since have been based on. 0.12.3 uses an older approach and slightly different APIs and is considered
 * legacy.
 *
 * @param  {string}  version  A supplied NW.js version to check
 * @return {boolean}          true = the version is legacy
 */
function isLegacyVersion(version) {
  return semver.lte(version, '0.12.3');
}

module.exports = {
  /**
   * Gets the latest stable version.
   *
   * @param  {string}  downloadUrl    [description]
   * @param  {string}  [manifestUrl]  Optional URL, defaults to 'https://nwjs.io/versions.json'
   * @param  {string}  flavor         Desired flavor of the NW.js version ('sdk' or 'normal')
   * @return {Promise}                Resolves to a {Version}
   */
  getLatestVersion: function (downloadUrl, manifestUrl, flavor) {
    return getManifest(manifestUrl)
      .then(function (manifest) {
        return {
          desiredVersion: manifest.stable.replace('v', ''),
          downloadUrl,
          manifestUrl,
          flavor
        };
      })
      .then(this.getVersion);
  },
  /**
   * [getVersion description]
   *
   * @param  {object}  args                 [description]
   * @param  {string}  args.desiredVersion  [description]
   * @param  {string}  args.downloadUrl     [description]
   * @param  {string}  args.manifestUrl     [description]
   * @param  {string}  args.flavor          Desired flavor of the NW.js version ('sdk' or 'normal')
   * @return {Promise}                      Resolves to a {Version}
   */
  getVersion: function (args) {
    let method = getVersionsFromManifest;
    if (isLegacyVersion(args.desiredVersion)) {
      method = getLegacyVersions;
    }

    return method(args.downloadUrl, args.manifestUrl)
      .then(function (versions) {
        const versionIndex = versions.findIndex(function (version) {
          return version.version === args.desiredVersion;
        });

        if (versionIndex >= 0) {
          return Promise.resolve(versions[versionIndex]);
        }
        return Promise.reject('Version ' + args.desiredVersion + ' not found.');
      });
  },
  /**
   * Gets a combined array of versions as objects from manifest and legacy.
   *
   * @param  {string}  downloadUrl    [description]
   * @param  {string}  [manifestUrl]  Optional URL, defaults to 'https://nwjs.io/versions.json'
   * @param  {string}  flavor         Desired flavor of the NW.js version ('sdk' or 'normal')
   * @return {Promise}                Resolves to an array of {Version}s
   */
  getVersions: function (downloadUrl, manifestUrl, flavor) {
    return Promise
      .all([
        getVersionsFromManifest(downloadUrl, manifestUrl, flavor),
        getLegacyVersions(downloadUrl, flavor),
      ])
      .then(function (versionLists) {
        const versionsFromManifest = versionLists[0];
        const legacyVersions = versionLists[1];
        return [
          ...versionsFromManifest,
          ...legacyVersions
        ];
      });
  },
};

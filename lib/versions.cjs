/**
 * @file    [Description of file purpose]
 * @author  ayushmxn
 */

const { Platforms } = require("../dist/index.cjs");
var semver = require("semver");
var request = require("request");
var _ = require("lodash");
var Version = require("./Version.cjs");

/**
 * Makes network requests using GET HTTP method.
 *
 * @param  {string}          url      [description]
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
 * [getLegacyVersions description]
 *
 * @param  {string}            downloadUrl  [description]
 * @return {Promise<object[]>}              Resolves to array of {Version}s
 */
function getLegacyVersions(downloadUrl) {
  var scrapePtrn = /href="v?([0-9]+\.[0-9]+\.[0-9]+[^"]*)\/"/gi,
    searchRes,
    versions = [];

  return get(downloadUrl).then(function (body) {
    // scrapes valid semver versions from apache directory listing
    while ((searchRes = scrapePtrn.exec(body)) !== null) {
      searchRes = searchRes[1];
      if (semver.valid(searchRes) && !_.includes(versions, searchRes)) {
        versions.push(searchRes);
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
          // check if windows 64-bit ZIP exists
          var win32Url = new Version({
            version: version,
            flavors: ["sdk"],
            supportedPlatforms: ["win32"],
            downloadUrl: downloadUrl,
          }).platforms["win32-sdk"];
          request.head(win32Url, function (err, res) {
            // note: this takes a version string and replaces it with an object (will be converted back later)
            resolve({
              version: version,
              flavors: ["sdk"],
              valid: !err && res.statusCode === 200,
            });
          });
        }),
      );
    });

    var allPlatforms = Object.keys(Platforms);

    return Promise.all(validationPromises).then(function (versions) {
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
 * @param  {string}  manifestUrl  [description]
 * @return {Promise}              Resolves to response body
 */
function getManifest(manifestUrl) {
  if (!manifestUrl) {
    manifestUrl = "https://nwjs.io/versions.json";
  }
  return get(manifestUrl, { json: true }).then(function (body) {
    return body;
  });
}

/**
 * [getVersionsFromManifest description]
 *
 * @param  {string}            downloadUrl  [description]
 * @param  {string}            manifestUrl  [description]
 * @return {Promise<object[]>}              which resolves to an array of {Version}s]
 */
function getVersionsFromManifest(downloadUrl, manifestUrl) {
  var mapFilesToPlatforms = function (files) {
    return files.map(function (file) {
      // convert win-x64 to win64, linux-ia32 to linux 32, etc.
      return file.replace(/-(x|ia)/, "");
    });
  };

  return getManifest(manifestUrl).then(function (manifest) {
    return manifest.versions
      .filter(function (versionFromManifest) {
        // 0.12.3 is an exception that is in the manifest but is kind of a legacy version
        return (
          versionFromManifest.flavors !== undefined &&
          (versionFromManifest.flavors.indexOf("sdk") !== -1 ||
            versionFromManifest.version === "v0.12.3")
        );
      })
      .map(function (versionFromManifest) {
        return new Version({
          version: versionFromManifest.version.replace("v", ""),
          flavors: versionFromManifest.flavors,
          supportedPlatforms: mapFilesToPlatforms(versionFromManifest.files),
          downloadUrl: downloadUrl,
        });
      });
  });
}

/**
 * [isLegacyVersion description]
 *
 * @param  {string}  version  [description]
 * @return {boolean}          [description]
 */
function isLegacyVersion(version) {
  return semver.lte(version, "0.12.3");
}

module.exports = {
  /**
   * Gets the latest stable version.
   *
   * @param  {string}  downloadUrl  [description]
   * @param  {string}  manifestUrl  [description]
   * @param  {string}  flavor       [description]
   * @return {Promise}              Resolves to a {Version}
   */
  getLatestVersion: function (downloadUrl, manifestUrl, flavor) {
    return getManifest(manifestUrl)
      .then(function (manifest) {
        return {
          desiredVersion: manifest.stable.replace("v", ""),
          downloadUrl: downloadUrl,
          manifestUrl: manifestUrl,
          flavor: flavor,
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
   * @param  {string}  args.flavor          [description]
   * @return {Promise}                      Resolves to a {Version}
   */
  getVersion: function (args) {
    return (
      isLegacyVersion(args.desiredVersion)
        ? getLegacyVersions
        : getVersionsFromManifest
    )(args.downloadUrl, args.manifestUrl).then(function (versions) {
      var version = versions.findIndex(function (version) {
        return version.version === args.desiredVersion;
      });

      return version >= 0
        ? Promise.resolve(versions[version])
        : Promise.reject("Version " + args.desiredVersion + " not found.");
    });
  },
  /**
   * [getVersions description]
   *
   * @param  {string}  downloadUrl  [description]
   * @param  {string}  manifestUrl  [description]
   * @param  {string}  flavor       [description]
   * @return {Promise}              Resolves to an array of {Version}s
   */
  getVersions: function (downloadUrl, manifestUrl, flavor) {
    return Promise.all([
      getVersionsFromManifest(downloadUrl, manifestUrl, flavor),
      getLegacyVersions(downloadUrl, flavor),
    ]).then(function (versionLists) {
      return versionLists[0].concat(versionLists[1]);
    });
  },
};

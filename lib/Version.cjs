/**
 * @file    [Description of file purpose]
 * @author  ayushmxn
 */

var { Platforms } = require("../dist/index.cjs");
var _ = require("lodash");
var semver = require("semver");

/**
 * Represents a version.
 *
 * @param  {object}   args                     Function options
 * @param  {string}   args.downloadUrl         Base URL path for dowloading NW.js, such as 'https://dl.nwjs.io/'
 * @param  {string}   args.version             An NW.js version, such as '0.12.3'
 * @param  {string[]} args.flavors             Array of strings for NW.js flavors, such as ['normal', 'sdk']
 * @param  {string[]} args.supportedPlatforms  Array of strings for supported platforms, such as ['osx64', 'win32']
 * @return {object}                            Object containing platforms key with generated URLs
 */
module.exports = function Version(args) {
  var generatePlatformUrls,
    result = {
      isLegacy: semver.lt(args.version, "0.12.3"),
      name:
        semver.gte(args.version, "0.12.0") ||
        semver.satisfies(args.version, "~0.12.0-alpha")
          ? "nwjs"
          : "node-webkit",
      version: args.version,
    };

  // 0.12.3 is an exception that is in the manifest but is pretty much a legacy version
  if (result.isLegacy || args.version === "0.12.3") {
    generatePlatformUrls = function (version, flavors, supportedPlatforms) {
      var platformUrls = {};
      supportedPlatforms.forEach(function (supportedPlatform) {
        flavors.forEach(function (flavor) {
          platformUrls[supportedPlatform + "-" + flavor] =
            args.downloadUrl +
            _.template(Platforms[supportedPlatform].versionNameTemplate)(
              result,
            );
        });
      });
      return platformUrls;
    };
  } else {
    var fixPlatformName = function (platform) {
      return platform.replace("32", "-ia32").replace("64", "-x64");
    };

    var mapPlatformToExtension = function (platform) {
      if (platform.indexOf("linux") === 0) {
        return "tar.gz";
      }

      return "zip";
    };

    generatePlatformUrls = function (version, flavors, supportedPlatforms) {
      var platformUrls = {};
      supportedPlatforms.forEach(function (platform) {
        flavors.forEach(function (flavor) {
          platformUrls[platform + "-" + flavor] =
            args.downloadUrl +
            "v" +
            version +
            "/nwjs" +
            (flavor === "normal" ? "" : "-" + flavor) +
            "-v" +
            version +
            "-" +
            fixPlatformName(platform) +
            "." +
            mapPlatformToExtension(platform);
        });
      });
      return platformUrls;
    };
  }

  result.platforms = generatePlatformUrls(
    args.version,
    args.flavors,
    args.supportedPlatforms,
  );
  return result;
};

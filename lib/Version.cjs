/**
 * @file  Performs logic to determine which version to use.
 */

const _ = require('lodash');
const semver = require('semver');

const { Platforms } = require('../dist/index.cjs');

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
module.exports = function Version (args) {
  let generatePlatformUrls;
  let name = 'node-webkit';
  if (
    semver.gte(args.version, '0.12.0') ||
    semver.satisfies(args.version, '~0.12.0-alpha')
  ) {
    name = 'nwjs';
  }
  const result = {
    isLegacy: semver.lt(args.version, '0.12.3'),
    name,
    version: args.version,
  };

  // 0.12.3 is an exception that is in the manifest but is pretty much a legacy version
  if (result.isLegacy || args.version === '0.12.3') {
    generatePlatformUrls = function (version, flavors, supportedPlatforms) {
      const platformUrls = {};
      supportedPlatforms.forEach(function (supportedPlatform) {
        flavors.forEach(function (flavor) {
          const platformName = supportedPlatform + '-' + flavor;
          const url = args.downloadUrl + _.template(Platforms[supportedPlatform].versionNameTemplate)(result);
          platformUrls[platformName] = url;
        });
      });
      return platformUrls;
    };
  } else {
    const fixPlatformName = function (platform) {
      return platform.replace('32', '-ia32').replace('64', '-x64');
    };

    const mapPlatformToExtension = function (platform) {
      if (platform.indexOf('linux') === 0) {
        return 'tar.gz';
      }

      return 'zip';
    };

    generatePlatformUrls = function (version, flavors, supportedPlatforms) {
      const platformUrls = {};
      supportedPlatforms.forEach(function (platform) {
        flavors.forEach(function (flavor) {
          const platformName = platform + '-' + flavor;
          let flavorName = '-' + flavor;
          if (flavor === 'normal') {
            flavorName = '';
          }
          const extension = '.' + mapPlatformToExtension(platform);

          platformUrls[platformName] = [
            args.downloadUrl,
            'v' + version,
            '/nwjs',
            flavorName,
            '-v' + version,
            '-',
            fixPlatformName(platform),
            extension
          ].join('');
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

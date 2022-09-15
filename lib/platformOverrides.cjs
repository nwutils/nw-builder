/**
 * @file    [Description of file purpose]
 * @author  ayushmxn
 */

/*
Apply platform-specific manifest values.
Works with JSON or plain objects.
The platform-specific options will override the others only when "building" for that platform and the platformOverrides property will be removed.
(c) The MIT license, 2014, Adam Lynch <contact@adamlynch.com> (https://github.com/adam-lynch/platform-overrides)
*/

const _ = require('lodash');

/**
 * Detects the platform you are currently running on.
 *
 * @return {object} Object of "agnostic" platform value and "specific" platform + arch value
 */
const detectPlatform = function () {
  let platform = process.platform;
  if (platform === 'darwin') {
    platform = 'osx';
  } else if (platform.startsWith('win')) {
    platform = 'win';
  }

  let arch = '32';
  if (
    process.arch === 'x64' ||
    Object.prototype.hasOwnProperty.call(process.env, 'PROCESSOR_ARCHITEW6432')
  ) {
    arch = '64';
  }

  return {
    agnostic: platform,
    specific: platform + arch
  };
};

/**
 * Gets overrides to apply by platform
 *
 * @param  {string}   platform  A platform name like win, win64, or win32
 * @param  {Function} callback  First arg is null or error, second is Object of "agnostic" and "specific" platform values
 * @return {any}                Returns the result of the callback function
 */
const getOverridesToApply = function (platform, callback) {
  const architectureAgnostic = ['linux', 'osx', 'win'];
  const architectureSpecific = [];

  architectureAgnostic.forEach(function (agnosticPlatform) {
    architectureSpecific.push(agnosticPlatform + '32');
    architectureSpecific.push(agnosticPlatform + '64');
  });

  /**
   * Removes last two characters and returns the remaining value;
   *
   * @param  {string} value  Any string
   * @return {string}        The original value, but without the last two characters
   */
  function removeLastTwoCharacters (value) {
    return value.substr(0, value.length, - 2);
  }

  if (platform) {
    if (
      !architectureAgnostic.includes(platform) &&
      !architectureSpecific.includes(platform)
    ) {
      return callback(new Error('Invalid platform passed', null));
    }
    if (architectureAgnostic.includes(platform)) {
      return callback(null, {
        agnostic: platform,
        specific: null
      });
    } else {
      return callback(null, {
        agnostic: removeLastTwoCharacters(platform),
        specific: platform
      });
    }
  } else {
    return callback(null, detectPlatform());
  }
};

const applyOverrides = function (_arg) {
  var cb, options, platform, result;
  (platform = _arg.platform), (options = _arg.options), (cb = _arg.cb);
  result = _.cloneDeep(options);
  if (
    options.platformOverrides[platform] != null &&
    Object.keys(options.platformOverrides[platform]).length
  ) {
    result = _.mergeWith(
      result,
      options.platformOverrides[platform],
      function (optionValue, overrideValue) {
        /*
        If overrides.x is {} but source.x is a non-empty object {prop:0, another:2},
        take the {}}
       */
        if (
          (_.isPlainObject(overrideValue) || _.isArray(overrideValue)) &&
          _.isEmpty(overrideValue)
        ) {
          return overrideValue;
        }
      },
    );
  }
  return cb(result);
};

/**
 * [exports description]
 *
 * @param  {[type]}   _arg  [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
module.exports = function (_arg, cb) {
  var callback, options, platform;
  (options = _arg.options), (platform = _arg.platform);
  callback = cb != null ? cb : function () {};
  return getOverridesToApply(platform, function (err, overridesToApply) {
    var applySpecificOverrides, objectMode, originalOptions;
    if (err != null) {
      return callback(err, null);
    }
    originalOptions = options;
    objectMode = _.isPlainObject(options);
    try {
      options = objectMode ? options : JSON.parse(options);
    } catch (_error) {
      err = _error;
      return callback(err, null);
    }
    if (options.platformOverrides != null) {
      applySpecificOverrides = function (optionsToOverride) {
        return applyOverrides({
          platform: overridesToApply.specific,
          options: optionsToOverride,
          cb: function (result) {
            delete result.platformOverrides;
            return callback(null, objectMode ? result : JSON.stringify(result));
          },
        });
      };
      if (overridesToApply.agnostic != null) {
        return applyOverrides({
          platform: overridesToApply.agnostic,
          options: options,
          cb: function (result) {
            if (overridesToApply.specific != null) {
              return applySpecificOverrides(result);
            } else {
              delete result.platformOverrides;
              return callback(
                null,
                objectMode ? result : JSON.stringify(result),
              );
            }
          },
        });
      } else {
        return applySpecificOverrides(options);
      }
    } else {
      return callback(null, originalOptions);
    }
  });
};

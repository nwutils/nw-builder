/*
Apply platform-specific manifest values. Works with JSON or plain objects. The platform-specific options will override the others only when "building" for that platform and the platformOverrides property will be removed.

(c) The MIT license, 2014, Adam Lynch <contact@adamlynch.com> (https://github.com/adam-lynch/platform-overrides)
*/

var applyOverrides, detectPlatform, getOverridesToApply, os, _;

os = require("os");
_ = require("lodash");

detectPlatform = function () {
  var platform;
  platform = os.platform();
  if (platform === "darwin") {
    platform = "osx";
  } else if (platform.match(/^win/)) {
    platform = "win";
  }
  return {
    agnostic: platform,
    specific:
      platform +
      (process.arch === "x64" ||
      Object.prototype.hasOwnProperty.call(
        process.env,
        "PROCESSOR_ARCHITEW6432",
      )
        ? 64
        : 32),
  };
};

getOverridesToApply = function (platform, cb) {
  var agnosticPlatform, architectureAgnostic, architectureSpecific, _i, _len;
  architectureAgnostic = ["linux", "osx", "win"];
  architectureSpecific = [];
  for (_i = 0, _len = architectureAgnostic.length; _i < _len; _i++) {
    agnosticPlatform = architectureAgnostic[_i];
    architectureSpecific.push(agnosticPlatform + "32");
    architectureSpecific.push(agnosticPlatform + "64");
  }
  if (platform) {
    if (
      !(
        architectureAgnostic.indexOf(platform) > -1 ||
        architectureSpecific.indexOf(platform) > -1
      )
    ) {
      return cb(new Error("Invalid platform passed", null));
    }
    if (architectureAgnostic.indexOf(platform) > -1) {
      return cb(null, {
        agnostic: platform,
        specific: null,
      });
    } else {
      return cb(null, {
        agnostic: platform.substr(0, platform.length - 2),
        specific: platform,
      });
    }
  } else {
    return cb(null, detectPlatform());
  }
};

applyOverrides = function (_arg) {
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

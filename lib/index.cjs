const { resolve } = require("node:path");
const { mkdir, readdir, cp, rm, rename } = require("node:fs/promises");
const glob = require('simple-glob');
var _ = require("lodash");
var inherits = require("inherits");
var EventEmitter = require("events").EventEmitter;
var fs = require("graceful-fs-extra");
var path = require("path");
var thenify = require("thenify");
var rcedit = require("rcedit");
var winresourcer = thenify(require("winresourcer"));
var semver = require("semver");
var platformOverrides = require("./platformOverrides.cjs");

const {
  checkCache,
  detectCurrentPlatform,
  get,
  log,
  run,
  Platforms,
  checkPkgOptions,
  Options,
  parseOptions,
} = require("../dist/index.cjs");
var NwVersions = require("./versions.cjs");
var Version = require("./Version.cjs");
var Utils = require("./utils.cjs");

// We inherit from EventEmitter for logging
inherits(NwBuilder, EventEmitter);

function NwBuilder(options) {
  const pkgOptions = checkPkgOptions(options.files);
  // Options are defined in package.json take precedence
  if (Object.entries(pkgOptions).length !== 0) {
    this.options = parseOptions(pkgOptions, Options);
    this.options.files = options.files;
  } else {
    this.options = parseOptions(options, Options);
  }

  if (this.options.currentPlatform === null) {
    this.options.currentPlatform = detectCurrentPlatform(process);
  }

  if (this.options.platforms && this.options.platforms.length === 0) {
    this.options.platforms = [detectCurrentPlatform(process)];
  } else if (this.options.platforms && this.options.platforms.length === 1) {
    this.options.platforms = this.options.platforms[0].split(",");
  }

  // Intercept the platforms and check for the legacy platforms of 'osx' and 'win' and
  // replace with 'osx32', 'osx64', and 'win32', 'win64' respectively.
  if (typeof this.options.platforms != "undefined") {
    if (this.options.platforms && this.options.platforms.indexOf("osx") >= 0) {
      this.options.platforms.splice(
        this.options.platforms.indexOf("osx"),
        1,
        "osx32",
        "osx64",
      );
    }
    if (this.options.platforms && this.options.platforms.indexOf("win") >= 0) {
      this.options.platforms.splice(
        this.options.platforms.indexOf("win"),
        1,
        "win32",
        "win64",
      );
    }
    if (
      this.options.platforms &&
      this.options.platforms.indexOf("linux") >= 0
    ) {
      this.options.platforms.splice(
        this.options.platforms.indexOf("linux"),
        1,
        "linux32",
        "linux64",
      );
    }
  }

  // Some Option checking
  if (!this.options.files) {
    throw new Error("Please specify some files");
  }

  if (this.options.platforms && this.options.platforms.length === 0)
    throw new Error("No platform to build!");

  // verify all the platforms specifed by the user are supported
  // this + previous check assures as we have only buildable platforms specified
  this.options.platforms &&
    this.options.platforms.forEach(function (platform) {
      if (!(platform in Platforms))
        throw new Error("Unknown platform " + platform);
    });

  this._platforms = _.cloneDeep(Platforms);

  // clear all unused platforms
  for (var name in this._platforms) {
    if (this.options.platforms && this.options.platforms.indexOf(name) === -1)
      delete this._platforms[name];
  }
}

/**
 * Check if NW binaries are cached
 *
 * @param  {string}           nwDir  Path to cached NW binaries
 * @return {Promise<boolean>}        Boolean value to denote if cache exists or not
 */
NwBuilder.prototype.isCached = async function (nwDir) {
  let exists = true;
  try {
    await readdir(nwDir);
  } catch (e) {
    exists = false;
  }
  return exists;
};

NwBuilder.prototype.build = function (callback) {
  // Let's create a NWjs app
  var build = this.checkFiles()
    .then(this.downloadNwjs.bind(this))
    .then(this.preparePlatformSpecificManifests.bind(this))
    .then(this.createReleaseFolder.bind(this))
    .then(this.copyNwjs.bind(this))
    .then(this.handleLinuxApp.bind(this))
    .then(this.handleMacApp.bind(this))
    .then(this.handleWinApp.bind(this))
    .then(this.zipAppFiles.bind(this))
    .then(this.mergeAppFiles.bind(this))
    .then(function (info) {
      // the promise(s) resolves to nothing in some cases
      return info || this;
    });

  if (typeof callback === "function") {
    build
      .then(function (result) {
        callback(false, result);
      })
      .catch(callback);
    return true;
  }

  return build;
};

NwBuilder.prototype.run = function (callback) {
  // We do not want to download nwjs for other platforms if are going to run the App
  var platforms = this.options.platforms;
  this.options.platforms = [this.options.currentPlatform];

  // Let's run this NWjs app
  var run = this.checkFiles()
    .then(this.downloadNwjs.bind(this))
    .then(this.runApp.bind(this));

  if (typeof callback === "function") {
    run
      .then(function (result) {
        this.options.platforms = platforms;
        callback(false, result);
      })
      .catch(function (error) {
        this.options.platforms = platforms;
        callback(true, error);
      });
    return true;
  }

  return run;
};

NwBuilder.prototype.checkFiles = function () {
  var self = this;

  return Utils.getFileList(this.options.files)
    .then(function (data) {
      self._appPkg = data.json;
      self._files = data.files;
      return self._appPkg;
    })
    .then(Utils.getPackageInfo)
    .then(function (appPkg) {
      self._appPkg = appPkg;

      if (!self.options.appName || !self.options.appVersion) {
        self.options.appName = self.options.appName
          ? self.options.appName
          : appPkg.name;
        self.options.appVersion = self.options.appVersion
          ? self.options.appVersion
          : appPkg.version;
      }
    });
};

NwBuilder.prototype.resolveLatestVersion = function () {
  var self = this;

  if (self.options.version !== "latest") return Promise.resolve();

  return NwVersions.getLatestVersion(
    self.options.downloadUrl,
    self.options.manifestUrl,
    self.options.flavor,
  ).then(function (latestVersion) {
    self.emit("log", "Latest Version: v" + latestVersion.version);
    self.options.version = latestVersion.version;
    return latestVersion;
  });
};

NwBuilder.prototype.checkVersion = function () {
  var version = this.options.version,
    flavor =
      semver.valid(version) && semver.satisfies(version, "<0.12.3")
        ? "sdk"
        : this.options.flavor,
    self = this;

  if (!semver.valid(version)) {
    return Promise.reject("The version " + version + " is not valid.");
  }

  var getVersionFromManifest = function () {
    return NwVersions.getVersion({
      desiredVersion: version,
      downloadUrl: self.options.downloadUrl,
      manifestUrl: self.options.manifestUrl,
      flavor: flavor,
    });
  };
  var getVersion;

  // if the user specified the exact version and all its platforms are cached, don't hit the manifest at all;
  // just trust the ones are cached and assume they're supported
  if (self.options.version !== "latest") {
    var areAllPlatformsCached = true;
    this._forEachPlatform(function (name, platform) {
      var platformToCheck = platform;

      if (semver.satisfies(self.options.version, ">=0.12.3")) {
        platformToCheck = _.clone(platform);
        platformToCheck.files = ["*"]; // otherwise it'll try to check cache legacy version files
      }

      if (
        !self.isPlatformCached(
          name,
          platformToCheck,
          self.options.version,
          flavor,
        )
      ) {
        areAllPlatformsCached = false;
      }
    });
    if (areAllPlatformsCached) {
      getVersion = Promise.resolve(
        new Version({
          version: version,
          flavors: [flavor],
          downloadUrl: self.options.downloadUrl,
          supportedPlatforms: Object.keys(this._platforms),
        }),
      );
    } else {
      // otherwise hit the manifest
      getVersion = getVersionFromManifest();
    }
  } else {
    // otherwise hit the manifest
    getVersion = getVersionFromManifest();
  }

  return getVersion.then(function (version) {
    self._version = version;
    self._version.flavor = flavor;
    self.emit(
      "log",
      "Using v" +
      self._version.version +
      " (" +
      (self._version.flavor === "" ? "normal" : self._version.flavor + ")"),
    );
    if (self._version.isLegacy) {
      log.warn("NW.js / node-webkit versions <0.12.3 are deprecated.");
    }
  });
};

NwBuilder.prototype.platformFilesForVersion = function () {
  var self = this;

  this._forEachPlatform(function (name, platform) {
    var satisfied = self.preparePlatformFiles(name, platform);

    // need the second condition for newer NW.js versions
    if (
      !(
        satisfied &&
        !!self._version.platforms[name + "-" + self._version.flavor]
      )
    ) {
      throw new Error(
        "Unsupported NW.js version '" +
        self._version.version +
        " (" +
        self._version.flavor +
        ")' for platform '" +
        name +
        "'",
      );
    }
  });

  return Promise.resolve();
};

NwBuilder.prototype.downloadNwjs = async function () {
  let options = this.options;
  let built;

  built = await this.isCached(options.cacheDir);
  if (built === false) {
    await mkdir(options.cacheDir, { recursive: true });
  }
  for await (const os of options.platforms) {
    let platform = os.slice(0, os.length - 2)
    let arch = "x" + os.slice(os.length - 2);
    await get({
      version: options.version,
      flavor: options.flavor,
      platform: platform,
      arch: arch,
      downloadUrl: options.downloadUrl,
      cacheDir: options.cacheDir,
      cache: !options.forceDownload,
      ffmpeg: false,
    });
  }
};

NwBuilder.prototype.buildGypModules = function () {
  // @todo
  // If we trigger a rebuild we have to copy
  // the node_modules to a tmp location because
  // we don't want to change the source files
};

NwBuilder.prototype.preparePlatformSpecificManifests = function () {
  if (
    !(
      this._appPkg.platformOverrides &&
      Object.keys(this._appPkg.platformOverrides).length
    )
  ) {
    return Promise.resolve();
  }

  var self = this;
  var promises = [];

  self._forEachPlatform(function (name, platform) {
    promises.push(
      new Promise(function (resolve, reject) {
        var overrides = self._appPkg.platformOverrides;
        if (overrides[name] || overrides[name.substr(0, name.length - 2)]) {
          platformOverrides(
            {
              options: self._appPkg,
              platform: name,
            },
            function (err, result) {
              if (err) {
                return reject(err);
              }

              platform.platformSpecificManifest = result;
              resolve();
            },
          );
        } else {
          resolve();
        }
      }),
    );
  });

  return Promise.all(promises);
};

NwBuilder.prototype.createReleaseFolder = function () {
  var self = this,
    releasePath,
    directoryCreationPromises = [];

  if (_.isFunction(self.options.buildType)) {
    releasePath = self.options.buildType.call(self.options);
  } else {
    // buildTypes
    switch (self.options.buildType) {
      case "timestamped":
        releasePath =
          self.options.appName +
          " - " +
          Math.round(Date.now() / 1000).toString();
        break;

      case "versioned":
        releasePath = self.options.appName + " - v" + self.options.appVersion;
        break;

      default:
        releasePath = self.options.appName;
    }
  }

  this._forEachPlatform(function (name, platform) {
    directoryCreationPromises.push(
      new Promise(function (resolve, reject) {
        platform.releasePath = path.resolve(
          self.options.buildDir,
          releasePath,
          name,
        );

        // Ensure that there is a release Folder, delete and create it.
        fs.remove(platform.releasePath, function (err) {
          if (err) return reject(err);

          fs.mkdirp(platform.releasePath, function (err) {
            if (err) return reject(err);

            self.emit(
              "log",
              "Create release folder in " + platform.releasePath,
            );
            resolve();
          });
        });
      }),
    );
  });

  return Promise.all(directoryCreationPromises);
};

NwBuilder.prototype.copyNwjs = async function () {

  for await (const os of this.options.platforms) {
    const platform = os.slice(0, os.length - 2);
    const arch = "x" + os.slice(os.length - 2);

    await rm(resolve(this.options.buildDir, this.options.appName, os), { recursive: true, force: true });

    const nwDir = resolve(
      this.options.cacheDir,
      `nwjs${this.options.flavor === "sdk" ? "-sdk" : ""}-v${this.options.version}-${platform}-${arch}`,
    );

    await cp(nwDir, resolve(this.options.buildDir, this.options.appName, os), { recursive: true });

    for (const file of glob(this.options.files)) {
      await cp(
        file,
        resolve(
          this.options.buildDir, this.options.appName, os,
          platform !== "osx"
            ? "package.nw"
            : "nwjs.app/Contents/Resources/app.nw",
          file,
        ),
        { recursive: true, verbatimSymlinks: true },
      );
    }
  }
};

NwBuilder.prototype.isPlatformNeedingZip = function (name, platform) {
  var self = this,
    needsZip = platform.needsZip;

  if (name.indexOf("osx") === 0 && self.options.macZip != null) {
    log.warn("macZip is deprecated. Use the zip option instead.");
    needsZip = self.options.macZip;
  } else if (self.options.zip != null) {
    needsZip = self.options.zip;
  }

  return needsZip;
};

NwBuilder.prototype.zipAppFiles = function () {
  var self = this;

  // Check if zip is needed
  var doAnyNeedZip = false,
    zipOptions = this.options.zipOptions,
    numberOfPlatformsWithoutOverrides = 0;

  self._zips = {};

  this._forEachPlatform(function (name, platform) {
    var needsZip = self.isPlatformNeedingZip(name, platform);

    if (needsZip) {
      var platformSpecific = !!platform.platformSpecificManifest;

      self._zips[name] = { platformSpecific: platformSpecific };

      numberOfPlatformsWithoutOverrides += !platformSpecific;
    }

    doAnyNeedZip = doAnyNeedZip || needsZip;
  });

  self._needsZip = doAnyNeedZip;

  return new Promise(function (resolve, reject) {
    if (!self._needsZip) {
      resolve();
      return;
    }

    // create (or don't create) a ZIP for multiple platforms
    new Promise(function (resolve, reject) {
      if (numberOfPlatformsWithoutOverrides > 1) {
        Utils.generateZipFile(self._files, self, null, zipOptions).then(
          function (zip) {
            resolve(zip);
          },
          reject,
        );
      } else {
        resolve();
      }
    }).then(function (platformAgnosticZip) {
      var zipPromises = [];

      _.forEach(self._zips, function (zip, platformName) {
        if (platformAgnosticZip && !zip.platformSpecific) {
          zip.file = platformAgnosticZip;
          return;
        }

        zipPromises.push(
          Utils.generateZipFile(
            self._files,
            self,
            JSON.stringify(
              self._platforms[platformName].platformSpecificManifest,
            ),
            zipOptions,
          ).then(function (file) {
            zip.file = file;
          }),
        );
      });

      Promise.all(zipPromises).then(resolve, reject);
    }, reject);
  });
};

NwBuilder.prototype.mergeAppFiles = function () {
  var self = this;

  var copyPromises = [];

  this._forEachPlatform(function (name, platform) {
    var zipping = self.isPlatformNeedingZip(name, platform);
    // We copy the app files if we are on mac and don't force zip
    if (!zipping) {
      // no zip, copy the files
      self._files.forEach(function (file) {
        var dest;

        if (name == "osx32" || name === "osx64") {
          dest = path.resolve(
            self.getResourcesDirectoryPath(platform),
            "app.nw",
            file.dest,
          );
        } else {
          dest = path.resolve(platform.releasePath, file.dest);
        }

        if (file.dest === "package.json" && platform.platformSpecificManifest) {
          copyPromises.push(self.writePlatformSpecificManifest(platform, dest));
        } else {
          copyPromises.push(Utils.copyFile(file.src, dest, self));
        }
      });
    } else if (!self.options.mergeZip) {
      // copy the zipped package.nw into the app directory
      copyPromises.push(
        Utils.copyFile(
          self.getZipFile(name),
          path.resolve(platform.releasePath, "package.nw"),
          self,
        ),
      );
    } else if (name == "osx32" || name == "osx64") {
      // zip just copy the app.nw
      copyPromises.push(
        Utils.copyFile(
          self.getZipFile(name),
          path.resolve(self.getResourcesDirectoryPath(platform), "app.nw"),
          self,
        ),
      );
    } else {
      var executableToMergeWith = self.getExecutableName(name);

      // We cat the app.nw file into the .exe / nw
      copyPromises.push(
        Utils.mergeFiles(
          path.resolve(platform.releasePath, executableToMergeWith),
          self.getZipFile(name),
          platform.chmod,
        ),
      );
    }
  });

  return Promise.all(copyPromises);
};

NwBuilder.prototype.getZipFile = function (platformName) {
  return (this._zips[platformName] && this._zips[platformName].file) || null;
};

NwBuilder.prototype.writePlatformSpecificManifest = function (platform, dest) {
  return new Promise(function (resolve, reject) {
    var pkgParentDirectory = path.join(dest, "../");
    if (!fs.existsSync(pkgParentDirectory)) fs.mkdirpSync(pkgParentDirectory);

    fs.writeFile(
      dest,
      JSON.stringify(platform.platformSpecificManifest),
      function (err) {
        if (err) return reject(err);
        resolve();
      },
    );
  });
};

NwBuilder.prototype.handleLinuxApp = function () {
  var self = this;

  this._forEachPlatform(async function (name, platform) {
    if (["linux64", "linux32"].indexOf(name) < 0) return;

    var executableName = self.getExecutableName(name);

    await rename(
      resolve(platform.releasePath, "nw"),
      resolve(platform.releasePath, executableName)
    );
  });
}

NwBuilder.prototype.handleMacApp = function () {
  var self = this,
    allDone = [];

  this._forEachPlatform(async function (name, platform) {
    if (["osx32", "osx64"].indexOf(name) < 0) return;

    var executableName = self.getExecutableName(name);

    await rename(
      resolve(platform.releasePath, "nwjs.app"),
      resolve(platform.releasePath, executableName)
    );

    // Let's first handle the mac icon
    if (self.options.macIcns) {
      if (semver.satisfies(self._version.version, "<=0.12.3")) {
        allDone.push(
          Utils.copyFile(
            self.options.macIcns,
            path.resolve(self.getResourcesDirectoryPath(platform), "nw.icns"),
            self,
          ),
        );
      } else {
        allDone.push(
          Utils.copyFile(
            self.options.macIcns,
            path.resolve(self.getResourcesDirectoryPath(platform), "app.icns"),
            self,
          ),
        );
        allDone.push(
          Utils.copyFile(
            self.options.macIcns,
            path.resolve(
              self.getResourcesDirectoryPath(platform),
              "document.icns",
            ),
            self,
          ),
        );
      }
    }

    // Handle mac credits
    if (self.options.macCredits) {
      allDone.push(
        Utils.copyFile(
          self.options.macCredits,
          path.resolve(
            self.getResourcesDirectoryPath(platform),
            "Credits.html",
          ),
          self,
        ),
      );
    }

    // Let's handle the Plist
    var PlistPath = path.resolve(
      platform.releasePath,
      self.options.appName + ".app",
      "Contents",
      "Info.plist",
    );

    // If the macPlist is a string we just copy the file
    if (typeof self.options.macPlist === "string") {
      allDone.push(Utils.copyFile(self.options.macPlist, PlistPath, self));
    } else {
      // Setup the Plist
      var plistOptions = Utils.getPlistOptions(
        {
          name: self.options.appName,
          version: self.options.appVersion,
          copyright: self._appPkg.copyright,
        },
        self.options.macPlist,
      );

      allDone.push(Utils.editPlist(PlistPath, PlistPath, plistOptions));
    }
  });

  return Promise.all(allDone);
};

NwBuilder.prototype.handleWinApp = function () {
  var self = this,
    allDone = [];

  this._forEachPlatform(async function (name, platform) {
    if (
      (!self.options.winIco && !self.options.winVersionString) ||
      ["win32", "win64"].indexOf(name) < 0
    )
      return;

    var executableName = self.getExecutableName(name);
    var executablePath = path.resolve(platform.releasePath, executableName);

    await rename(
      resolve(platform.releasePath, "nw.exe"),
      resolve(platform.releasePath, executableName),
    );

    var rcConf = {};
    if (self.options.winVersionString) {
      rcConf["version-string"] = Object.assign(
        {},
        {
          // The process name used in the Task Manager
          FileDescription: self.options.appName,
        },
        self.options.winVersionString,
      );
    }
    if (self.options.winIco && self.options.useRcedit) {
      rcConf["icon"] = path.resolve(self.options.winIco);
    }

    var updateVersionStringPromise = rcedit(executablePath, rcConf);

    var updateIconsPromise = updateVersionStringPromise.then(function () {
      return new Promise(function (resolve, reject) {
        if (!self.options.winIco || self.options.useRcedit) {
          resolve();
        } else {
          self.emit("log", "Update " + name + " executable icon");
          // Set icon
          winresourcer(
            {
              operation: "Update",
              exeFile: executablePath,
              resourceType: "Icongroup",
              resourceName: "IDR_MAINFRAME",
              lang: 1033, // Required, except when updating or deleting
              resourceFile: path.resolve(self.options.winIco),
            },
            function (err) {
              if (!err) {
                resolve();
              } else {
                reject(
                  "Error while updating the Windows icon." +
                  (process.platform !== "win32"
                    ? " Wine (winehq.org) must be installed to add custom icons from Mac and Linux."
                    : ""),
                );
              }
            },
          );
        }
      });
    });

    // build a promise chain
    allDone.push(updateIconsPromise);
  });

  return Promise.all(allDone);
};

NwBuilder.prototype.runApp = async function () {
  const options = this.options;

  let platform = options.currentPlatform.slice(0, options.currentPlatform.length - 2)
  let arch = "x" + options.currentPlatform.slice(options.currentPlatform.length - 2);

  await run({
    version: options.version,
    flavor: options.flavor,
    platform: platform,
    arch: arch,
    srcDir: options.files,
    cacheDir: options.cacheDir,
    argv: options.argv,
  });

};

NwBuilder.prototype.isAppRunning = function () {
  return this._nwProcess !== undefined;
};

NwBuilder.prototype.getAppProcess = function () {
  return this._nwProcess;
};

NwBuilder.prototype._forEachPlatform = function (fn) {
  _.forEach(this._platforms, function (platform, name) {
    return fn(name, platform);
  });
};

// Mac only
NwBuilder.prototype.getResourcesDirectoryPath = function (platform) {
  return path.resolve(
    platform.releasePath,
    this.options.appName + ".app",
    "Contents",
    "Resources",
  );
};

// Don't use if legacy version
NwBuilder.prototype.getExecutableName = function (platform) {
  var executableExtension = "";

  if (platform.indexOf("osx") === 0) {
    executableExtension = ".app";
  } else if (platform.indexOf("win") === 0) {
    executableExtension = ".exe";
  }

  return this.options.appName + executableExtension;
};

NwBuilder.prototype.setPlatformCacheDirectory = function (
  platformName,
  platform,
  version,
  flavor,
) {
  if (!platform.cache) {
    platform.cache = path.resolve(
      this.options.cacheDir,
      version + "-" + flavor,
      platformName,
    );
  }
};

NwBuilder.prototype.isPlatformCached = function (
  platformName,
  platform,
  version,
  flavor,
) {
  this.setPlatformCacheDirectory(platformName, platform, version, flavor);
  if (this.options.forceDownload) {
    return false;
  }
  this.preparePlatformFiles(platformName, platform, version);
  return checkCache(platform.cache, platform.files);
};

// returns a Boolean; true if the desired platform is supported
NwBuilder.prototype.preparePlatformFiles = function (
  platformName,
  platform,
  version,
) {
  // return if platform.files is already prepared
  if (
    Object.keys(platform.files)[0] !==
    Object.keys(Platforms[platformName].files)[0]
  ) {
    return true;
  }

  if (semver.satisfies(version, "<0.12.3")) {
    return !Object.keys(platform.files).every(function (range) {
      if (semver.satisfies(version, range)) {
        platform.files = platform.files[range];
        if ("string" === typeof platform.files) {
          platform.files = [platform.files];
        }
        return false;
      }
      return true;
    });
  }

  platform.files = ["*"]; // otherwise bad stuff will happen like at attempt to download legacy version files
  // all we can do here is assume it's oke because this._version might not exist yet, but callers of this function
  // will check properly where necessary
  return true;
};

const nwbuild = (options) => {
  let nw = new NwBuilder(options);

  if (options.mode === "build") {
    nw.build();
    return 0;
  }
  if (options.mode === "run") {
    nw.run();
    return 0;
  } else {
    console.error("[ WARN ] Invalid mode option.");
    return 1;
  }
};

module.exports = NwBuilder;
exports = module.exports;
exports.nwbuild = nwbuild;

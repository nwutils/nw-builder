/**
 * @file    [Description of file purpose]
 * @author  ayushmxn
 */

const path = require('path');

const archiver = require('archiver');
const fs = require('graceful-fs-extra');
const _ = require('lodash');
const plist = require('plist');
const Glob = require('simple-glob');
const temp = require('temp');
const thenify = require('thenify');

const readFile = thenify(fs.readFile);
const writeFile = thenify(fs.writeFile);

// Automatically track and cleanup files at exit
temp.track();

module.exports = {
  /**
   * Reads and parses the package.json file. Validates it has a name and version number.
   *
   * @param  {string}          path  Path the app's package.json file
   * @return {Promise<object>}       Resolves to JSON parsed object of the app's package.json, Rejects to string error message
   */
  getPackageInfo: function (path) {
    return new Promise(function (resolve, reject) {
      fs.readFile(path, function (err, data) {
        if (err) return reject(err);
        try {
          var appPkg = JSON.parse(data);
        } catch (err) {
          reject('Invalid package.json: ' + err + '\nMake sure the file is encoded as utf-8');
          return;
        }
        if (!appPkg.name || !appPkg.version) {
          reject('Please make sure that your project\'s package.json includes a version and a name value');
        } else {
          resolve(appPkg);
        }
      });
    });
  },
  /**
   * [getFileList description]
   *
   * @param  {[type]} fileglob  [description]
   * @return {[type]}           [description]
   */
  getFileList: function (fileglob) {
    let jsonfile;
    let destFiles = [];
    let srcFiles = [];
    let packagePath;
    const matches = Glob(fileglob);

    return new Promise((resolve, reject) => {
      if (!matches.length) {
        return reject('No files matching');
      }

      matches.forEach((file) => {
        const internalFileName = path.normalize(file);
        if (path.basename(internalFileName) === 'package.json') {
          jsonfile = this.closerPathDepth(internalFileName, jsonfile);
          packagePath = path.normalize(jsonfile.split('package.json')[0] || './');
        }
        if (!fs.lstatSync(internalFileName).isDirectory()) {
          srcFiles.push(internalFileName);
        }
      });

      if (!jsonfile) {
        return reject('Could not find a package.json in your src folder');
      }

      srcFiles.forEach(function (file) {
        destFiles.push({
          src: file,
          dest: file.replace(packagePath, '')
        });
      });

      resolve({
        files: destFiles,
        json: jsonfile
      });
    });
  },
  /**
   * [closerPathDepth description]
   *
   * @param  {[type]} path1  [description]
   * @param  {[type]} path2  [description]
   * @return {[type]}        [description]
   */
  closerPathDepth: function (path1, path2) {
    if (!path2) {
      return path1;
    }

    var d1 = this.pathDepth(path1),
      d2 = this.pathDepth(path2);

    return d1 < d2 ? path1 : path2;
  },
  /**
   * [pathDepth description]
   *
   * @param  {[type]} absolutePath  [description]
   * @return {[type]}               [description]
   */
  pathDepth: function (absolutePath) {
    return absolutePath.split(path.sep).length;
  },
  /**
   * [copyFile description]
   *
   * @param  {[type]} src      [description]
   * @param  {[type]} dest     [description]
   * @param  {[type]} _event   [description]
   * @param  {[type]} options  [description]
   * @return {[type]}          [description]
   */
  copyFile: function (src, dest, _event, options) {
    return new Promise(function (resolve, reject) {
      options = options || {};
      var stats = fs.lstatSync(src);
      fs.copy(src, dest, options, function (err) {
        if (err) return reject(err);

        var retryCount = 0;
        var existsCallback = function (exists) {
          if (exists) {
            fs.chmod(dest, stats.mode, function (err) {
              // ignore error
              if (err) {
                _event.emit(
                  "log",
                  "chmod " +
                    stats.mode +
                    " on " +
                    dest +
                    " failed after copying, ignoring",
                );
              }

              resolve();
            });
          } else if (retryCount++ < 2) {
            // This is antipattern!!!
            // Callback should be called when the copy is finished!!!!
            setTimeout(function () {
              fs.exists(dest, existsCallback);
            }, 1000);
          } else {
            reject(
              new Error(
                "Copied file (" +
                  dest +
                  ") doesn't exist in destination after copying",
              ),
            );
          }
        };

        fs.exists(dest, existsCallback);
      });
    });
  },
  /**
   * [mergeFiles description]
   *
   * @param  {[type]} app      [description]
   * @param  {[type]} zipfile  [description]
   * @param  {[type]} chmod    [description]
   * @return {[type]}          [description]
   */
  mergeFiles: function (app, zipfile, chmod) {
    // we need to pipe the app into the zipfile and chmod it
    return new Promise(function (resolve, reject) {
      var zipStream = fs.createReadStream(zipfile),
        writeStream = fs.createWriteStream(app, { flags: "a" });

      zipStream.on("error", reject);
      writeStream.on("error", reject);

      writeStream.on("finish", function () {
        if (chmod) {
          fs.chmodSync(app, chmod);
        }
        resolve();
      });

      zipStream.pipe(writeStream);
    });
  },
  /**
   * [generateZipFile description]
   *
   * @param  {[type]} files                     [description]
   * @param  {[type]} _event                    [description]
   * @param  {[type]} platformSpecificManifest  [description]
   * @param  {[type]} zipOptions                [description]
   * @return {[type]}                           [description]
   */
  generateZipFile: function (
    files,
    _event,
    platformSpecificManifest,
    zipOptions,
  ) {
    var destStream = temp.createWriteStream(),
      archive = archiver("zip", zipOptions || {});

    return new Promise(function (resolve, reject) {
      // Resolve on close
      destStream.on("close", function () {
        resolve(destStream.path);
      });

      // Reject on Error
      archive.on("error", reject);

      // Add the files
      files.forEach(function (file) {
        if (file.dest === "package.json" && platformSpecificManifest) {
          archive.append(platformSpecificManifest, { name: "package.json" });
        } else {
          archive.file(file.src, { name: file.dest });
        }
      });

      // Some logs
      archive.on("entry", function (file) {
        _event.emit("log", "Zipping " + file.name);
      });

      // Pipe the stream
      archive.pipe(destStream);
      archive.finalize();
    });
  },
  /**
   * [getPlistOptions description]
   *
   * @param  {[type]} parsedParams  [description]
   * @param  {[type]} custom        [description]
   * @return {[type]}               [description]
   */
  getPlistOptions: function (parsedParams, custom) {
    var obj = {};
    if (parsedParams.name) {
      obj.CFBundleName = parsedParams.name;
      obj.CFBundleDisplayName = parsedParams.name;
    }
    if (parsedParams.version) {
      obj.CFBundleVersion = parsedParams.version;
      obj.CFBundleShortVersionString = parsedParams.version;
    }
    if (parsedParams.copyright) {
      obj.NSHumanReadableCopyright = parsedParams.copyright;
    }

    return _.merge(obj, custom);
  },
  /**
   * [editPlist description]
   *
   * @param  {[type]} plistInput   [description]
   * @param  {[type]} plistOutput  [description]
   * @param  {[type]} options      [description]
   * @return {[type]}              [description]
   */
  editPlist: function (plistInput, plistOutput, options) {
    options = options || {};

    // Make sure all required properties are set
    [
      "CFBundleName",
      "CFBundleDisplayName",
      "CFBundleVersion",
      "CFBundleShortVersionString",
    ].forEach(function (prop) {
      if (!Object.prototype.hasOwnProperty.call(options, prop)) {
        throw new Error("Missing macPlist property '" + prop + "'");
      }
    });

    // Bundle identifier based on package name
    if (options.CFBundleIdentifier === undefined) {
      options.CFBundleIdentifier =
        "com.nw-builder." +
        options.CFBundleName.toLowerCase().replace(/[^a-z-]/g, "");
    }

    // Read the input file
    return (
      readFile(plistInput, "utf8")
        // Parse it
        .then(plist.parse)
        // Then overwrite the properties with custom values
        .then(function (info) {
          // Keep backwards compatibility and handle aliases
          Object.keys(options).forEach(function (key) {
            var value = options[key];
            switch (key) {
              case "mac_bundle_id":
                info.CFBundleIdentifier = value;
                break;
              case "mac_document_types":
                info.CFBundleDocumentTypes = value.map(function (type) {
                  return {
                    CFBundleTypeName: type.name,
                    CFBundleTypeExtensions: type.extensions,
                    CFBundleTypeRole: type.role,
                    LSIsAppleDefaultForType: type.isDefault,
                  };
                });
                break;
              default:
                info[key] = value;
            }
          });

          // Remove some unwanted properties
          if (
            !(
              Object.prototype.hasOwnProperty.call(
                options,
                "mac_document_types",
              ) ||
              Object.prototype.hasOwnProperty.call(
                options,
                "CFBundleDocumentTypes",
              )
            )
          ) {
            info.CFBundleDocumentTypes = [];
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              options,
              "UTExportedTypeDeclarations",
            )
          )
            info.UTExportedTypeDeclarations = [];

          // Write output file
          return writeFile(plistOutput, plist.build(info));
        })
    );
  },
};

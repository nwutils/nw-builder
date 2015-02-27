var fs = require('graceful-fs-extra');
var path = require('path');
var _ = require('lodash');
var Promise = require('bluebird');
var plist = require('plist');
var Glob = require('simple-glob');
var temp = require('temp');
var archiver = require('archiver');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

// Automatically track and cleanup files at exit
temp.track();

module.exports = {
    getPackageInfo: function(path) {
        return new Promise(function(resolve, reject) {
            fs.readFile(path, function (err, data) {
                if (err) return reject(err);
                try {
                    var appPkg = JSON.parse(data);
                } catch(e) {
                    reject("Invalid package.json: " + e + "\nMake sure the file is encoded as utf-8");
                    return;
                }
                if (!appPkg.name || !appPkg.version) {
                    reject("Please make sure that your project's package.json includes a version and a name value");
                } else {
                    resolve(appPkg);
                }
            });
        });
    },
    getFileList: function(fileglob) {
        var self = this,
            jsonfile, destFiles = [],
            srcFiles = [],
            package_path,
            matches = Glob(fileglob);

        return new Promise(function(resolve, reject) {
            if(!matches.length) return reject('No files matching');

            matches.forEach(function(file) {
                var internalFileName = path.normalize(file);
                if (internalFileName.match('package.json')) {
                    jsonfile = self.closerPathDepth(internalFileName, jsonfile);
                    package_path = path.normalize(jsonfile.split('package.json')[0] || './');
                }
                if(!fs.lstatSync(internalFileName).isDirectory()) {
                    srcFiles.push(internalFileName);
                }
            });

            if (!jsonfile) {
                return reject('Could not find a package.json in your src folder');
            }

            srcFiles.forEach(function(file) {
                destFiles.push({
                    src: file,
                    dest: file.replace(package_path, '')
                });
            });

            resolve({
                files: destFiles,
                json: jsonfile
            });
        });
    },
    closerPathDepth: function(path1, path2) {
        if (!path2) { return path1; }

        var d1 = this.pathDepth(path1),
            d2 = this.pathDepth(path2);

        return d1 < d2 ? path1 : path2;
    },
    pathDepth: function(absolutePath) {
        return absolutePath.split(path.sep).length;
    },
    copyFile: function (src, dest, _event) {
        return new Promise(function(resolve, reject) {
            var stats = fs.lstatSync(src);
            fs.copy(src, dest, function (err) {
                if(err) return reject(err);

                var retryCount = 0;
                var existsCallback = function(exists){
                    if(exists){
                        fs.chmod(dest, stats.mode, function(err){
                            // ignore error
                            if (err) {
                                _event.emit('log', 'chmod ' + stats.mode + ' on ' + dest + ' failed after copying, ignoring');
                            }
                            
                            resolve();
                        });
                    } else if (retryCount++ < 2) {
                        // This is antipattern!!!
                        // Callback should be called when the copy is finished!!!!
                        setTimeout(function(){
                            fs.exists(dest, existsCallback);
                        }, 1000);
                    } else {
                        reject(new Error("Copied file (" + dest + ") doesn't exist in destination after copying"));
                    }
                }

                fs.exists(dest, existsCallback);
            });
        });
    },
    mergeFiles: function (app, zipfile, chmod) {
        // we need to pipe the app into the zipfile and chmod it
        return new Promise(function(resolve, reject) {
            var zipStream = fs.createReadStream(zipfile),
                writeStream = fs.createWriteStream(app, {flags:'a'});

            zipStream.on('error', reject);
            writeStream.on('error', reject);

            writeStream.on('finish', function () {
                if(chmod) {
                    fs.chmodSync(app, chmod);
                }
                resolve();
            });

            zipStream.pipe(writeStream);
        });
    },
    generateZipFile: function (files, _event, platformSpecificManifest) {
        var destStream = temp.createWriteStream(),
            archive = archiver('zip');

        return new Promise(function(resolve, reject) {

            // Resolve on close
            destStream.on('close', function () {
                resolve(destStream.path);
            });

            // Reject on Error
            archive.on('error', reject);

            // Add the files
            var filesBulk = [];
            files.forEach(function(file){
                if(file.dest === 'package.json' && platformSpecificManifest){
                    archive.append(platformSpecificManifest, {name: 'package.json'});
                }
                else
                {
                    filesBulk.push({
                        src: file.src,
                        data: { name: path.basename(file.dest) },
                        expand: true,
                        flatten: true,
                        dest: path.dirname(file.dest)
                    });
                }
            })
            archive.bulk(filesBulk)

            // Some logs
            archive.on('entry', function (file) {
                _event.emit('log', 'Zipping ' + file.name);
            });

            // Pipe the stream
            archive.pipe(destStream);
            archive.finalize();

        });
    },
    getPlistOptions: function(parsedParams, custom) {
        var obj = {};
        if(parsedParams.name) {
            obj.CFBundleName = parsedParams.name;
            obj.CFBundleDisplayName = parsedParams.name;
        }
        if(parsedParams.version) {
            obj.CFBundleVersion = parsedParams.version;
            obj.CFBundleShortVersionString = 'Version ' + parsedParams.version;
        }
        if(parsedParams.copyright) {
            obj.NSHumanReadableCopyright = parsedParams.copyright;
        }

        return _.merge(obj, custom);
    },
    editPlist: function(plistInput, plistOutput, options) {
        options = options || {};

        // Make sure all required properties are set
        [
            'CFBundleName',
            'CFBundleDisplayName',
            'CFBundleVersion',
            'CFBundleShortVersionString'
        ].forEach(function(prop) {
                if(!options.hasOwnProperty(prop)) {
                    throw new Error('Missing macPlist property \'' + prop + '\'');
                }
            });

        // Bundle identifier based on package name
        if(options.CFBundleIdentifier === undefined) {
            options.CFBundleIdentifier = 'com.node-webkit-builder.' + options.CFBundleName.toLowerCase().replace(/[^a-z\-]/g,'');
        }

        // Read the input file
        return readFile(plistInput, 'utf8')
            // Parse it
            .then(plist.parse)
            // Then overwrite the properties with custom values
            .then(function(info) {
                // Keep backwards compatibility and handle aliases
                Object.keys(options).forEach(function(key) {
                    var value = options[key];
                    switch(key) {
                        case 'mac_bundle_id':
                            info.CFBundleIdentifier = value;
                            break;
                        case 'mac_document_types':
                            info.CFBundleDocumentTypes = value.map(function(type) {
                                return {
                                    CFBundleTypeName: type.name,
                                    CFBundleTypeExtensions: type.extensions,
                                    CFBundleTypeRole: type.role,
                                    LSIsAppleDefaultForType: type.isDefault
                                };
                            });
                            break;
                        default:
                            info[key] = value;
                    }
                });

                // Remove some unwanted properties
                if(!(options.hasOwnProperty('mac_document_types') || options.hasOwnProperty('CFBundleDocumentTypes'))) {
                    info.CFBundleDocumentTypes = [];
                }

                if(!options.hasOwnProperty('UTExportedTypeDeclarations'))
                    info.UTExportedTypeDeclarations = [];

                // Write output file
                return writeFile(plistOutput, plist.build(info));
            });
    }
};

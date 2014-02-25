var fs = require('fs-extra');
var path = require('path');
var Promise = require('bluebird');
var plist = require('plist');
var Glob = require('simple-glob');
var temp = require('temp');
var archiver = require('archiver');

// Automatically track and cleanup files at exit
//temp.track();

module.exports = {
    getPackageInfo: function(path) {
        return new Promise(function(resolve, reject) {
            fs.readFile(path, function (err, data) {
                if (err) return reject(err);
                var appPkg = JSON.parse(data);
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
    copyFiles: function (src, dest) {
        return new Promise(function(resolve, reject) {
            var stats = fs.lstatSync(src);
            fs.copy(src, dest, function (err) {
                if(err) return reject(err);
                fs.chmodSync(dest, stats.mode);
                resolve();
            });
        });
    },
    generateZipFile: function (files, _event) {
        var destStream = temp.createWriteStream(),
            archive = archiver('zip');

        return new Promise(function(resolve, reject) {

            // Resolve on close
            destStream.on('close', function (argument) {
                resolve(destStream.path);
            });

            // Reject on Error
            archive.on('error', reject);

            // Add the files
            files.forEach(function (file) {
                archive.file(file.src, { name:file.dest });
            });

            archive.on('entry', function (file) {
                _event.emit('log', 'Zipping ' + file.name);
            });

            // Pipe the stream
            archive.pipe(destStream);
            archive.finalize();

        });
    },
    editPlist: function (inputPlist, ouputPlist, options) {
        options.app_name = options.app_name;
        options.app_version = options.app_version;
        options.copyright = options.copyright;

        // Handle the INfo.plist file
        var info = plist.parseFileSync(inputPlist);
        info.CFBundleDisplayName = options.app_name;
        info.CFBundleName = options.app_name;

        info.CFBundleDocumentTypes = []; // zero out any document binding
        info.UTExportedTypeDeclarations = [];

        info.CFBundleVersion = options.app_version;
        info.CFBundleShortVersionString = 'Version ' + options.app_version;

        if(options.copyright) {
          info.NSHumanReadableCopyright = options.copyright;
        }

        fs.writeFileSync(ouputPlist, plist.build(info));
    }
};
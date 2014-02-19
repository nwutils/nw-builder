var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var plist = require('plist');
var Glob = require('glob').Glob;

module.exports = {
    getPackageInfo: function(path) {
        // Read JSON File
        var appPkg = JSON.parse(fs.readFileSync(path));
        if (!appPkg.name || !appPkg.version) {
            throw new Error("Please make sure that your project's package.json includes a version and a name value");
        }

        return appPkg;
    },
    getFileList: function(fileglob) {
        var self = this,
            fl = new Glob(fileglob),
            jsonfile, destFiles = [],
            srcFiles = [],
            package_path,
            done = Promise.defer();

        fl.on('error', function(err) {
            done.reject(err);
        });

        fl.on('end', function(matches) {
            matches.forEach(function(file) {
                var internalFileName = path.normalize(file);
                if (internalFileName.match('package.json')) {
                    jsonfile = self.closerPathDepth(internalFileName, jsonfile);
                    package_path = path.normalize(jsonfile.split('package.json')[0] || './');
                }
                srcFiles.push(internalFileName);
            });

            if (!jsonfile) {
                done.reject('Could not find a package.json in your src folder');
            }

            srcFiles.forEach(function(file) {
                destFiles.push({
                    src: file,
                    dest: file.replace(package_path, '')
                });
            });

            done.resolve({
                files: destFiles,
                json: jsonfile
            });

        });

        return done.promise;
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
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var plist = require('plist');
//parseStringSync

module.exports = {
    getPackageInfo: function(path) {
        // Read JSON File
        var appPkg = JSON.parse(fs.readFileSync(path));
        if (!appPkg.name || !appPkg.version) {
            throw new Error("Please make sure that your project's package.json includes a version and a name value");
        }

        return appPkg;
    },
    getFileList: function (fileglob) {

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
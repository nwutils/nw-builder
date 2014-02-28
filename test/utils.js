var test = require('tape');
var temp = require('temp');
var fs = require('fs');
var utils = require('./../lib/utils');
var DecompressZip = require('decompress-zip');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

test('getPackageInfo invalid', function (t) {
    t.plan(1);
    utils.getPackageInfo('./test/fixtures/invalid.json').catch(function (error) {
        t.ok(error);
    });
});

test('getPackageInfo valid', function (t) {
    t.plan(2);
    var pkg = utils.getPackageInfo('./test/fixtures/nwapp/package.json').then(function (pkg) {
        t.equal(pkg.name, 'nw-demo', 'get package name');
        t.equal(pkg.version, '0.1.0', 'get package version');
    });

});

test('editPlist', function (t) {
    t.plan(1);
    temp.open('plstest', function(err, info) {
        utils.editPlist('./test/fixtures/Info.plist', info.path, {
            appName: 'TestApp',
            appVersion: '1.3.3.7',
            copyright: '(c) by me'
        }).then(function () {
            var acctual = fs.readFileSync(info.path);
            var expected = fs.readFileSync('./test/expected/Info.plist');
            t.equal(acctual.toString(), expected.toString(), 'generate and write a valid plist file');
            t.end();
        });

    });

});

test('getFileList', function (t) {
    t.plan(5);

    utils.getFileList('./test/fixtures/nwapp/**').then(function(data) {
        t.equal(data.json, 'test/fixtures/nwapp/package.json', 'figure out the right json');
        var expected = [{
            "src": "test/fixtures/nwapp/images/imagefile.img",
            "dest": "images/imagefile.img"
        }, {
            "src": "test/fixtures/nwapp/index.html",
            "dest": "index.html"
        }, {
            "src": "test/fixtures/nwapp/javascript/bower_packages/simple/package.json",
            "dest": "javascript/bower_packages/simple/package.json"
        }, {
            "src": "test/fixtures/nwapp/javascript/jsfile.js",
            "dest": "javascript/jsfile.js"
        }, {
            "src": "test/fixtures/nwapp/node_modules/package/package.json",
            "dest": "node_modules/package/package.json"
        }, {
            "src": "test/fixtures/nwapp/package.json",
            "dest": "package.json"
        }];
        t.deepEqual(data.files, expected);
    });

    utils.getFileList('./test/fixtures/nwapp/images/**').then(function(data) {
    }, function (error) {
        t.equal(error, 'Could not find a package.json in your src folder', 'throw an error if there is no package json');
    });

    utils.getFileList('./test/fixtures/nwapp/images/*.js').then(function(data) {
    }, function (error) {
        t.equal(error, 'No files matching');
    });

    utils.getFileList(['./test/fixtures/nwapp/**/*', '!./test/fixtures/nwapp/node_modules/**/*',  '!./test/fixtures/nwapp/javascript/**/*']).then(function(data) {
        var expected = [{
            "src": "test/fixtures/nwapp/images/imagefile.img",
            "dest": "images/imagefile.img"
        }, {
            "src": "test/fixtures/nwapp/index.html",
            "dest": "index.html"
        }, {
            "src": "test/fixtures/nwapp/package.json",
            "dest": "package.json"
        }];
        t.deepEqual(data.files, expected);
    });

});

test('should zip the app and create the app.nw file + log it', function (t) {
    t.plan(6);

    var files = [{
        "src": "test/fixtures/nwapp/images/imagefile.img",
        "dest": "images/imagefile.img"
    }, {
        "src": "test/fixtures/nwapp/javascript/bower_packages/simple/package.json",
        "dest": "javascript/bower_packages/simple/package.json"
    }, {
        "src": "test/fixtures/nwapp/javascript/jsfile.js",
        "dest": "javascript/jsfile.js"
    }, {
        "src": "test/fixtures/nwapp/node_modules/package/package.json",
        "dest": "node_modules/package/package.json"
    }, {
        "src": "test/fixtures/nwapp/package.json",
        "dest": "package.json"
    }], expected = _.pluck(files, 'dest');

    var _evt = new EventEmitter();
    _evt.on('log', function (logging) {
        t.ok(logging, 'LOG: ' + logging);
    });

    utils.generateZipFile(files, _evt).then(function(nwfile) {
        var unzipper = new DecompressZip(nwfile);
        unzipper.on('list', function (files) {
            t.deepEqual(expected, files);
        });
        unzipper.list();
    });

});

test('mergeFiles', function (t) {
    t.plan(2);

    var releasefile = temp.openSync();
    fs.writeFileSync(releasefile.path, 'A');

    var zipFile = temp.openSync();
    fs.writeFileSync(zipFile.path, 'B');

    utils.mergeFiles(releasefile.path, zipFile.path, '0755').then(function() {
        var contents = fs.readFileSync(releasefile.path);
        var stats = fs.lstatSync(releasefile.path);
        t.equal(contents.toString(), 'AB', 'merge two files');
        t.equal(stats.mode.toString(8), '100755', 'fix the permission');
    });

});

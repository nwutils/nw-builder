var test = require('tape');
var testSetup = require('redtape');
var temp = require('temp');
var fs   = require('fs');
var path = require('path');
var utils = require('./../lib/utils');
var DecompressZip = require('decompress-zip');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var del = require('rimraf');
var thenify = require('thenify');
var isWindows = process.platform === 'win32';
var tempFile = thenify(temp.open);

var tempFileCleanup = function(){
    return new Promise(function(resolve, reject){
        temp.cleanup(function(err, result){
            if(err){
                return reject(err);
            }
            resolve(result);
        });
    });
};

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

test('generate and write a valid plist file', function (t) {
    t.plan(2);
    var tests = [];

    // custom properties
    tests.push(tempFile('plist-1').then(function (info) {
        var options = utils.getPlistOptions(
            {
                name: 'TestApp',
                version: '1.3.3.7',
                copyright: '(c) by me'
            },
            {
                CFBundleDisplayName: 'My cool TestApp',
                LSEnvironment: {
                    PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'
                }
            }
        );
        return utils.editPlist('./test/fixtures/osx-plist/Info.plist', info.path, options).then(function () {
            var actual   = fs.readFileSync(info.path).toString().replace(/\r|\n/gm, '');
            var expected = fs.readFileSync('./test/expected/osx-plist/1.plist').toString().replace(/\r|\n/gm, '');
            t.equal(actual, expected, 'with custom properties');
        });
    }));

    // without copyright information
    tests.push(tempFile('plist-2').then(function (info) {
        var options = utils.getPlistOptions(
            {
                name: 'TestApp',
                version: '1.3.3.7'
            }
        );
        return utils.editPlist('./test/fixtures/osx-plist/Info.plist', info.path, options).then(function () {
            var actual   = fs.readFileSync(info.path).toString().replace(/\r|\n/gm, '');
            var expected = fs.readFileSync('./test/expected/osx-plist/2.plist').toString().replace(/\r|\n/gm, '');
            t.equal(actual, expected, 'without copyright information');
        });
    }));

    Promise.all(tests).then(tempFileCleanup).then(function () {
        t.end();
    });

});

test('getFileList', function (t) {
    t.plan(5);

    utils.getFileList(['./test/fixtures/nwapp/**', '!./test/fixtures/nwapp/README.md']).then(function(data) {
        t.equal(data.json, path.normalize('test/fixtures/nwapp/package.json'), 'figure out the right json');
        var expected = [{
            "src" : path.normalize("test/fixtures/nwapp/images/imagefile.img"),
            "dest": path.normalize("images/imagefile.img")
        }, {
            "src" : path.normalize("test/fixtures/nwapp/index.html"),
            "dest": path.normalize("index.html")
        }, {
            "src" : path.normalize("test/fixtures/nwapp/javascript/bower_packages/simple/package.json"),
            "dest": path.normalize("javascript/bower_packages/simple/package.json")
        }, {
            "src" : path.normalize("test/fixtures/nwapp/javascript/jsfile.js"),
            "dest": path.normalize("javascript/jsfile.js")
        }, {
            "src" : path.normalize("test/fixtures/nwapp/node_modules/package/package.json"),
            "dest": path.normalize("node_modules/package/package.json")
        }, {
            "src" : path.normalize("test/fixtures/nwapp/package.json"),
            "dest": path.normalize("package.json")
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

    utils.getFileList(['./test/fixtures/nwapp/**/*', '!./test/fixtures/nwapp/node_modules/**/*',  '!./test/fixtures/nwapp/javascript/**/*', '!./test/fixtures/nwapp/README.md']).then(function(data) {
        var expected = [{
            "src" : path.normalize("test/fixtures/nwapp/images/imagefile.img"),
            "dest": path.normalize("images/imagefile.img")
        }, {
            "src" : path.normalize("test/fixtures/nwapp/index.html"),
            "dest": path.normalize("index.html")
        }, {
            "src" : path.normalize("test/fixtures/nwapp/package.json"),
            "dest": path.normalize("package.json")
        }];
        t.deepEqual(data.files, expected);
    });

});

test('should zip the app and create the app.nw file + log it', function (t) {
    t.plan(6);

    var files = [{
        "src" : path.normalize("test/fixtures/nwapp/images/imagefile.img"),
        "dest": path.normalize("images/imagefile.img")
    }, {
        "src" : path.normalize("test/fixtures/nwapp/javascript/bower_packages/simple/package.json"),
        "dest": path.normalize("javascript/bower_packages/simple/package.json")
    }, {
        "src" : path.normalize("test/fixtures/nwapp/javascript/jsfile.js"),
        "dest": path.normalize("javascript/jsfile.js")
    }, {
        "src" : path.normalize("test/fixtures/nwapp/node_modules/package/package.json"),
        "dest": path.normalize("node_modules/package/package.json")
    }, {
        "src" : path.normalize("test/fixtures/nwapp/package.json"),
        "dest": path.normalize("package.json")
    }], expected = _.map(files, 'dest').sort();

    var _evt = new EventEmitter();
    _evt.on('log', function (logging) {
        t.ok(logging, 'LOG: ' + logging);
    });

    utils.generateZipFile(files, _evt).then(function(nwfile) {
        var unzipper = new DecompressZip(nwfile);
        unzipper.on('list', function (files) {
            t.deepEqual(files.sort(), expected);
        });
        unzipper.list();
    });

});

testSetup({
    afterEach: function(done){
        del('./test/temp/platform-specific-unzipped', done);
    }
})('should zip but use platform-specific manifest with overrides in package.json', function (t) {
    t.plan(3);

    var files = [{
        "src" : path.normalize("test/fixtures/nwapp/images/imagefile.img"),
        "dest": path.normalize("images/imagefile.img")
    }, {
        "src" : path.normalize("test/fixtures/nwapp/package.json"),
        "dest": path.normalize("package.json")
    }], expectedPackage = "{hello: 'world'}";

    var _evt = new EventEmitter();
    _evt.on('log', function (logging) {
        t.ok(logging, 'LOG: ' + logging);
    });

    utils.generateZipFile(files, _evt, expectedPackage).then(function(nwfile) {
        var unzipper = new DecompressZip(nwfile),
            unzipDestination = 'test/temp/platform-specific-unzipped';

        unzipper.on('extract', function (log) {
            t.equal(fs.readFileSync(path.join(unzipDestination, 'package.json')).toString(), expectedPackage);
            t.end();
        });

        unzipper.extract({
            path: unzipDestination
        });
    });

});

test('mergeFiles', function (t) {
    t.plan(isWindows ? 1 : 2);

    var releasefile = temp.openSync();
    fs.writeFileSync(releasefile.path, 'A');

    var zipFile = temp.openSync();
    fs.writeFileSync(zipFile.path, 'B');

    utils.mergeFiles(releasefile.path, zipFile.path, '0755').then(function() {
        var contents = fs.readFileSync(releasefile.path);
        var stats    = fs.lstatSync(releasefile.path);
        t.equal(contents.toString(), 'AB', 'merge two files');

        if(!isWindows) {
            t.equal(stats.mode.toString(8), '100755', 'fix the permission'); // DOES NOT WORK ON WINDOWS
        }
    });

});

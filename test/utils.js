var test = require('tape');
var temp = require('temp');
var fs = require('fs');
var utils = require('./../lib/utils');


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
            app_name: 'TestApp',
            app_version: '1.3.3.7',
            copyright: '(c) by me'
        });
        var acctual = fs.readFileSync(info.path);
        var expected = fs.readFileSync('./test/expected/Info.plist');
        t.equal(acctual.toString(), expected.toString(), 'generate and write a valid plist file');
        t.end();
    });

});

test('getFileList', function (t) {
    t.plan(5);

    utils.getFileList('./test/fixtures/nwapp/**').then(function(data) {
        console.log(data.json);
        t.equal(data.json, 'test/fixtures/nwapp/package.json', 'figure out the right json');
        var expected = [ { src: 'test/fixtures/nwapp', dest: 'test/fixtures/nwapp' }, { src: 'test/fixtures/nwapp/images', dest: 'images' }, { src: 'test/fixtures/nwapp/images/imagefile', dest: 'images/imagefile' }, { src: 'test/fixtures/nwapp/javascript', dest: 'javascript' }, { src: 'test/fixtures/nwapp/javascript/bower_packages', dest: 'javascript/bower_packages' }, { src: 'test/fixtures/nwapp/javascript/bower_packages/simple', dest: 'javascript/bower_packages/simple' }, { src: 'test/fixtures/nwapp/javascript/bower_packages/simple/package.json', dest: 'javascript/bower_packages/simple/package.json' }, { src: 'test/fixtures/nwapp/javascript/jsfile', dest: 'javascript/jsfile' }, { src: 'test/fixtures/nwapp/node_modules', dest: 'node_modules' }, { src: 'test/fixtures/nwapp/node_modules/package', dest: 'node_modules/package' }, { src: 'test/fixtures/nwapp/node_modules/package/package.json', dest: 'node_modules/package/package.json' }, { src: 'test/fixtures/nwapp/package.json', dest: 'package.json' } ];
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
        var expected = [ { src: 'test/fixtures/nwapp/images', dest: 'images' }, { src: 'test/fixtures/nwapp/images/imagefile', dest: 'images/imagefile' }, { src: 'test/fixtures/nwapp/javascript', dest: 'javascript' }, { src: 'test/fixtures/nwapp/node_modules', dest: 'node_modules' }, { src: 'test/fixtures/nwapp/package.json', dest: 'package.json' } ]
        t.deepEqual(data.files, expected);
    });

});



var test = require('tape');
var temp = require('temp');
var fs = require('fs');
var utils = require('./../lib/utils');


test('getPackageInfo invalid', function (t) {
    t.plan(1);
    t.throws(function() {
        utils.getPackageInfo('./test/fixtures/invalid.json');
    }, 'throw error on invalid json');
});

test('getPackageInfo valid', function (t) {
    t.plan(2);
    var pkg = utils.getPackageInfo('./test/fixtures/nwapp/package.json');
    t.equal(pkg.name, 'nw-demo', 'get package name');
    t.equal(pkg.version, '0.1.0', 'get package version');
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




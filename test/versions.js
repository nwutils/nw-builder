var test = require('tape'),
    nock = require('nock'),
    _ = require('lodash');

var versions = require('./../lib/versions');

test('getVersions', function (t) {
    t.plan(1);

    var expected = {
        linux32: 'v0.8.4/node-webkit-v0.8.4-linux-ia32.tar.gz',
        linux64: 'v0.8.4/node-webkit-v0.8.4-linux-x64.tar.gz',
        osx: 'v0.8.4/node-webkit-v0.8.4-osx-ia32.zip',
        win: 'v0.8.4/node-webkit-v0.8.4-win-ia32.zip'
    };

    versions.getVersions().then(function(result) {
        var actual = _.findWhere(result, {'version': '0.8.4'});
        t.deepEqual(actual.platforms, expected);
    })

});

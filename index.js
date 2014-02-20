var NwBuilder = require('./lib');

var nw = new NwBuilder({
        files: '/**/',
        appName: false,
        appVerson: false,
        plattforms: 'win',
        version: 'lastest',
        buildDir: './build',
        cacheDir: './cache',
        downloadUrl: 'https://s3.amazonaws.com/node-webkit/',
        buildType: 'default', // timestamped
        forceDownload: false,
        macCredits: false,
        macIcns: false,
        macZip: false,
        macPlist: false
});

nw.build(function (err, status) {
    // body...
});

// var Glob = require("glob").Glob
// var mg = new Glob(['test/fixtures/nwapp/**/*']);
// mg.on('end', function (matches) {
//     console.log(matches);
// })

/*
var utils = {
    log : function(mgs) {
        console.log('LOG: ', mgs);
    }
};

var downloader = require('./lib/downloader')(utils);

downloader.downloadAndUnpack('./cache/v0.8.3/win', 'https://s3.amazonaws.com/node-webkit/v0.8.4/node-webkit-v0.8.4-osx-ia32.zip');




/*
var fixturesCache = './fixtures/cache/v0.8.3';

console.log(downloader.checkCache(fixturesCache + '/osx', ['node-webkit.app']));


var request = require('request');
var decompress = require('decompress');

var src = request('https://s3.amazonaws.com/node-webkit/v0.8.4/node-webkit-v0.8.4-osx-ia32.zip');
var dest = decompress.extract({ ext: '.zip' });

src.pipe(dest);

var filename = 'node-webkit-v0.8.3-win-ia32.zip';
var DecompressZip = require('decompress-zip');
var unzipper = new DecompressZip(filename);
var fs = require('fs');

unzipper.on('error', function (err) {
    console.log('Caught an error', err);
});

var files = [];
unzipper.extract({
    path: './tmp',
    filter: function (file) {
        files.push({
            path: file.path,
            mode: file.mode.toString(8)
        });
        return true;
    }
});

unzipper.on('extract', function (log) {
    files.forEach(function (file) {
        fs.chmodSync('./tmp/' + file.path, file.mode);
    });
});*/
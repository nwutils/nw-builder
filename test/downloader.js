var test = require('tape'),
    nock = require('nock'),
    temp = require('temp'),
    path = require('path'),
    fs = require('fs');

    temp.track();

var downloader = require('./../lib/downloader');
var fixturesCache = './test/fixtures/cache/v0.8.3';
var fixturesZip = './test/fixtures/test.zip';
var fixturesZipStrip = './test/fixtures/test-strip.zip';
var fixturesTar = './test/fixtures/test.tar.gz';

test('checkCache', function (t) {
    t.plan(2);
    t.ok(downloader.checkCache(fixturesCache + '/osx', ['node-webkit.app']));
    t.notOk(downloader.checkCache(fixturesCache + '/linux32', ['nwsnapshot', 'nwsnapshot2']));
});

test('downloadAndUnpack: zip', function (t) {
    t.plan(6);
    nock('https://amazon.s3.nw.com').get('/test.zip').replyWithFile(200, fixturesZip);
    temp.mkdir('tmpcache', function(err, dirPath) {
        downloader.downloadAndUnpack(dirPath, 'https://amazon.s3.nw.com/test.zip').then(function (files) {
            files.forEach(function (file) {
                t.ok(fs.existsSync(path.join(dirPath, file.path)), file.path + ' unpacked');
            });

            t.ok(fs.statSync(path.join(dirPath, 'file1')).mode.toString(8) == 100444, '444 file permission');
            t.ok(fs.statSync(path.join(dirPath, 'file2')).mode.toString(8) == 100666, '666 file permission');
            t.ok(fs.statSync(path.join(dirPath, 'file3')).mode.toString(8) == 100644, '644 file permission'); // DOES NOT WORK ON WINDOWS

        });
    });
});

test('downloadAndUnpack: zip+strip', function (t) {
    t.plan(6);
    nock('https://amazon.s3.nw.com').get('/test-strip.zip').replyWithFile(200, fixturesZipStrip);
    temp.mkdir('tmpcache', function(err, dirPath) {
        downloader.downloadAndUnpack(dirPath, 'https://amazon.s3.nw.com/test-strip.zip').then(function (files) {
            files.forEach(function (file) {
                t.ok(fs.existsSync(path.join(dirPath, file.path)), file.path + ' unpacked');
            });

            t.ok(fs.statSync(path.join(dirPath, 'file1')).mode.toString(8) == 100444, '444 file permission');
            t.ok(fs.statSync(path.join(dirPath, 'file2')).mode.toString(8) == 100666, '666 file permission');
            t.ok(fs.statSync(path.join(dirPath, 'file3')).mode.toString(8) == 100644, '644 file permission'); // DOES NOT WORK ON WINDOWS

        });
    });
});

test('downloadAndUnpack: tar', function (t) {
    t.plan(6);
    nock('https://amazon.s3.nw.com').get('/test.tar.gz').replyWithFile(200, fixturesTar);
    temp.mkdir('tmpcache', function(err, dirPath) {
        downloader.downloadAndUnpack(dirPath, 'https://amazon.s3.nw.com/test.tar.gz').then(function (files) {
            files.forEach(function (file) {
                t.ok(fs.existsSync(path.join(dirPath, file.path)), file.path + ' unpacked');
            });

            t.ok(fs.statSync(path.join(dirPath, 'file1')).mode.toString(8) == 100444, '444 file permission'); // DOES NOT WORK ON WINDOWS
            t.ok(fs.statSync(path.join(dirPath, 'file2')).mode.toString(8) == 100666, '666 file permission');
            t.ok(fs.statSync(path.join(dirPath, 'file3')).mode.toString(8) == 100644, '644 file permission'); // DOES NOT WORK ON WINDOWS

        });
    });
});

test('Should throw an error if you try to download a file that is not available', function (t) {
    t.plan(2);
    nock('https://doesnot.com').get('/exist.zip').reply(404);
    downloader.downloadAndUnpack('/', 'https://doesnot.com/exist.zip').catch(function (err) {
        t.equal(err.statusCode, 404, err.msg);
    });
    nock('https://doesnot.com').get('/exist.tar').reply(404);
    downloader.downloadAndUnpack('/', 'https://doesnot.com/exist.tar').catch(function (err) {
        t.equal(err.statusCode, 404, err.msg);
    });
});    

var Promise = require('bluebird');
var request = require('request');
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var tar = require('tar-fs');
var temp = require('temp');
var DecompressZip = require('decompress-zip');

// Automatically track and cleanup files at exit
temp.track();
var isWin = /^win/.test(process.platform);

module.exports = {
    checkCache: function(cachepath, files) {
        var missing;
        files.forEach(function(file) {
            if (missing) {
                return;
            }
            if (!fs.existsSync(path.join(cachepath, file))) {
                missing = true;
            }
        });

        return !missing;
    },
    downloadAndUnpack: function(cachepath, url) {
        var extention = path.extname(url),
            done = Promise.defer(),
            self = this,
            stream, rq = request(url);

        rq.on('error', function(err) {
            done.reject(err);
        });

        if (extention === '.zip') {
            stream = temp.createWriteStream();

            stream.on('close', function() {
                self.extractZip(stream.path, cachepath).then(function(files) {
                    done.resolve(files);
                });
            });

            rq.pipe(stream);
        }

        if (extention === '.gz') {
            this.extractTar(rq, cachepath).then(function(files) {
                done.resolve(files);
            });
        }

        return done.promise;
    },
    extractTar: function(tarstream, destination) {
        var done = Promise.defer(),
            gunzip = zlib.createGunzip(),
            files = [];

        tarstream
            .pipe(gunzip)
            .on('error', done.reject)
            .pipe(tar.extract(destination, {
                umask: (isWin ? false : 0),
                map: function(header) {
                    var filename = header.name.split('/');
                    header.name = (filename[1] ? filename[1] : filename[0]);
                    return header;
                },
                ignore: function(name) {
                    files.push({path: path.basename(name)});
                    return false;
                }
            }))
            .on('finish', function() {
                done.resolve(files);
            });

        return done.promise;
    },
    extractZip: function(zipfile, destination) {
        var files = [],
            done = Promise.defer();

        new DecompressZip(zipfile)
            .on('error', done.reject)
            .on('extract', function(log) {

                // Setup chmodSync to fix permissions
                files.forEach(function(file) {
                    fs.chmodSync(path.join(destination, file.path), file.mode);
                });
                // resolve
                done.resolve(files);
            })
            .extract({
                path: destination,
                filter: function(entry) {
                    files.push({
                        path: entry.path,
                        mode: entry.mode.toString(8)
                    });

                    return true;
                }
            });

        return done.promise;
    }
};
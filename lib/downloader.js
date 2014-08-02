var Promise = require('bluebird');
var request = require('request');
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var tar = require('tar-fs');
var temp = require('temp');
var DecompressZip = require('decompress-zip');
var ncp = require('ncp').ncp;
var rimraf = require('rimraf');

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
        rq.on('response', function (res) {
            if (res.statusCode !== 200) {
                done.reject({
                    statusCode: res.statusCode,
                    msg: "Recieved status code " + format(res.statusCode)
                });
                return;
            }
            function format(statusCode){
               return statusCode + ": " + require("http").STATUS_CODES[statusCode]
            }
        });

        if (extention === '.zip') {
            stream = temp.createWriteStream();

            stream.on('close', function() {
                if(done.promise.isRejected()) return;
                self.extractZip(stream.path, cachepath).then(function(files) {
                    done.resolve(files);
                });
            });

            rq.pipe(stream);
        }

        if (extention === '.gz') {
            rq.on('response', function(res) {
                if(res.statusCode !== 200) return;
                self.extractTar(res, cachepath).then(function(files) {
                    done.resolve(files);
                });
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
            .on('error', function(err){
                done.reject(err);
            })
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
            .on('error', function(err){
                done.reject(err);
            })
            .on('extract', function(log) {

                // Setup chmodSync to fix permissions
                files.forEach(function(file) {
                    fs.chmodSync(path.join(destination, file.path), file.mode);
                });

                var rootFiles = fs.readdirSync(destination);
                var fromDir = path.join(destination, rootFiles.length === 1 ? rootFiles[0] : '');
                // strip out root folder if it exists
                if(rootFiles.length === 1 && fs.statSync(fromDir).isDirectory() ){
                    // strip folder from files
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        file.path = path.relative(rootFiles[0], file.path);
                        if(file.path === '') {
                            console.log('kill it', i);
                            files.splice(i, 1);
                            i--;
                        }
                    }
                    // move stripped folder to destination
                    ncp(fromDir, destination, function (err) {
                        if (err) done.reject();
                        else rimraf(fromDir, function(){
                            done.resolve(files);
                        });
                    });
                } else {
                    done.resolve(files);
                }

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
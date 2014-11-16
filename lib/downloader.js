var Promise = require('bluebird');
var request = require('request');
var progress = require('progress');
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var tar = require('tar-fs');
var temp = require('temp');
var DecompressZip = require('decompress-zip');
var ncp = require('graceful-ncp').ncp;
var rimraf = require('rimraf');

// Automatically track and cleanup files at exit
temp.track();
var isWin = /^win/.test(process.platform);

// one progressbar for all downloads
var bar;

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
    clearProgressbar: function() {
        bar && bar.terminate();
        bar = null;
    },
    downloadAndUnpack: function(cachepath, url) {
        var extention = path.extname(url),
            done = Promise.defer(),
            self = this,
            rq = request(url),
            len,
            stream;

        function format(statusCode) {
            return statusCode + ': ' + require('http').STATUS_CODES[statusCode];
        }

        rq.proxy = true;
        rq.on('error', function(err) {
            bar && bar.terminate();
            done.reject(err);
        });
        rq.on('response', function (res) {
            len = parseInt(res.headers['content-length'], 10);
            if (res.statusCode !== 200) {
                done.reject({
                    statusCode: res.statusCode,
                    msg: 'Recieved status code ' + format(res.statusCode)
                });
            } else if (len) {
                if (!bar) {
                    bar = new progress('  downloading [:bar] :percent :etas', {
                        complete: '=',
                        incomplete: '-',
                        width: 20,
                        total: len
                    });
                } else {
                    bar.total += len;
                }
            }
        });
        rq.on('data', function(chunk) {
            len && bar && bar.tick(chunk.length);
        });

        if (extention === '.zip') {
            stream = temp.createWriteStream();

            stream.on('close', function() {
                if(done.promise.isRejected()) return;
                self.extractZip(stream.path, cachepath).then(self.stripRootFolder).then(function(files) {
                    done.resolve(files);
                });
            });

            rq.pipe(stream);
        }

        if (extention === '.gz') {
            rq.on('response', function(res) {
                if(res.statusCode !== 200) return;
                self.extractTar(res, cachepath).then(self.stripRootFolder).then(function(files) {
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
                    files.push({path: path.basename(header.name)});
                    return header;
                }
            }))
            .on('finish', function() {
                done.resolve({files:files, destination:destination});
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

                done.resolve({files:files, destination:destination});
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
    },
    stripRootFolder: function(extracted){
        var done = Promise.defer(),
            files = extracted.files,
            destination = extracted.destination,
            rootFiles = fs.readdirSync(destination),
            fromDir = path.join(destination, rootFiles.length === 1 ? rootFiles[0] : '');

        // strip out root folder if it exists
        if(rootFiles.length === 1 && fs.statSync(fromDir).isDirectory() ){
            // strip folder from files
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                file.path = path.relative(rootFiles[0], file.path);
                if(file.path === '') {
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

        return done.promise;
    }
};

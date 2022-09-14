/**
 * @file    [Description of file purpose]
 * @author  ayushmxn
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const request = require('request');
const progress = require('progress');
const tar = require('tar-fs');
const temp = require('temp');
const ncp = require('graceful-ncp').ncp;
const rimraf = require('rimraf');
const extract = require('extract-zip');

// Automatically track and cleanup files at exit
temp.track();

// one progressbar for all downloads
let bar;

module.exports = {
  /**
   * Clears out the progressbar.
   * Called when NW.js finishes downloading.
   */
  clearProgressbar: function () {
    bar && bar.terminate();
    bar = null;
  },
  /**
   * Handles downloading a file from a given URL, then detecting if it is an archive (zip, gz)
   * then unzips the contents to the cachepath directory.
   *
   * @param  {string}  cachepath  The location of where to store the unzipped files
   * @param  {string}  url        The file to download
   * @return {Promise}            Resolves { files, destination } or Rejects if the download/unzip failed
   */
  downloadAndUnpack: function (cachepath, url) {
    const rq = request(url);
    const extension = path.extname(url);
    const self = this;
    let len;
    let stream;

    /**
     * Format the status code into a human readable description, such as
     * '404: Not Found', '503: Service Unavailable', or '200: OK'.
     *
     * @param  {number} statusCode  A HTTP status code, such as 200, 301, 404, or 500
     * @return {string}             A string of the code and it's meaning in English
     */
    function format(statusCode) {
      return statusCode + ': ' + require('http').STATUS_CODES[statusCode];
    }

    return new Promise(function (resolve, reject) {
      rq.proxy = true;
      rq.on('error', function (err) {
        bar && bar.terminate();
        reject(err);
      });
      rq.on('response', function (res) {
        len = parseInt(res.headers['content-length'], 10);
        if (res.statusCode !== 200) {
          reject({
            statusCode: res.statusCode,
            msg: 'Recieved status code ' + format(res.statusCode),
          });
        } else if (len) {
          if (!bar) {
            bar = new progress('  downloading [:bar] :percent :etas', {
              complete: "=",
              incomplete: "-",
              width: 20,
              total: len,
            });
          } else {
            bar.total += len;
          }
        }
      });
      rq.on('data', function (chunk) {
        len && bar && bar.tick(chunk.length);
      });

      if (extension === '.zip') {
        rq.on('response', function (res) {
          if (res.statusCode !== 200) return;
          stream = temp.createWriteStream();

          stream.on('finish', function () {
            self
              .extractZip(stream.path, cachepath)
              .then(self.stripRootFolder)
              .then(function (files) {
                resolve(files);
              });
          });

          rq.pipe(stream);
        });
      } else if (extension === '.gz') {
        rq.on('response', function (res) {
          if (res.statusCode !== 200) return;
          self
            .extractTar(res, cachepath)
            .then(self.stripRootFolder)
            .then(function (files) {
              resolve(files);
            });
        });
      }
    });
  },
  /**
   * Extracts files from a Tar archive to a directory.
   *
   * @param  {Function} tarStream    A Node bit stream of data to pipe as the archive is downloaded
   * @param  {string}   destination  The location to extract files to
   * @return {Promise}               Resolves { files, destination } or Rejects if the unzip failed
   */
  extractTar: function (tarStream, destination) {
    const gunzip = zlib.createGunzip();
    const files = [];
    const isWindows = process.platform.startsWith('win');

    return new Promise(function (resolve, reject) {
      tarStream
        .pipe(gunzip)
        .on('error', function (err) {
          reject(err);
        })
        .pipe(
          tar.extract(destination, {
            umask: isWindows ? false : 0,
            map: function (header) {
              files.push({ path: path.basename(header.name) });
              return header;
            },
          }),
        )
        .on('finish', function () {
          resolve({ files, destination });
        });
    });
  },
  /**
   * Extracts files from a Zip archive to a directory.
   *
   * @param  {string}  zipfile      The location of the zip file to extract files from
   * @param  {string}  destination  The location to extract files to
   * @return {Promise}              Resolves { files, destination } or Rejects if the /unzip failed
   */
  extractZip: function (zipfile, destination) {
    const files = [];

    const onEntry = function (entry) {
      files.push({
        mode: entry.externalFileAttributes >>> 16,
        path: entry.fileName,
      });
    };

    return new Promise(function (resolve, reject) {
      extract(zipfile, { dir: destination, onEntry })
        .catch(reject)
        .then(function () {
          // Setup chmodSync to fix permissions
          files.forEach(function (file) {
            fs.chmodSync(path.join(destination, file.path), file.mode);
          });
          resolve({ files, destination });
        });
    });
  },
  /**
   * Moves files from extracted folder to the root directory of the destination folder (I think).
   *
   * @param  {object}  extracted  The resulting information from the zip/tar extraction process
   * @return {Promise}            Resolves to the extracted files, Rejects if unable to move files
   */
  stripRootFolder: function (extracted) {
    const { files, destination } = extracted;
    const rootFiles = fs.readdirSync(destination);
    let rootFile = '';
    if (rootFiles.length === 1) {
      rootFile = rootFiles[0];
    }
    const fromDir = path.join(destination, rootFile);

    // strip out root folder if it exists
    if (rootFiles.length === 1 && fs.statSync(fromDir).isDirectory()) {
      // strip folder from files
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        file.path = path.relative(rootFiles[0], file.path);
        if (file.path === '') {
          files.splice(i, 1);
          i--;
        }
      }

      return new Promise(function (resolve, reject) {
        // move stripped folder to destination
        ncp(fromDir, destination, function (err) {
          if (err) {
            return reject();
          } else
            rimraf(fromDir, function () {
              resolve(files);
            });
        });
      });
    } else {
      return Promise.resolve(files);
    }
  },
};

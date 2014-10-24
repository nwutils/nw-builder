var Promise = require('bluebird');
var _ = require('lodash');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs-extra');
var path = require('path');
var url = require('url');
var winresourcer = Promise.promisify(require('winresourcer'));
var spawn = require('child_process').spawn;
var semver = require('semver');
var detectCurrentPlatform = require('./detectCurrentPlatform.js')

var NwVersions = require('./versions');
var Utils = require('./utils');
var Downloader = require('./downloader');
var platforms = require('./platforms');
var rimraf = require('rimraf');
var walk = require('walk');
var Glob = require('simple-glob');

var defaults = {
    files: null,
    appName: false,
    appVersion: false,
    platforms: ['win','osx'],
    currentPlatform: detectCurrentPlatform(),
    version: 'latest',
    buildDir: './build',
    cacheDir: './cache',
    downloadUrl: 'http://dl.node-webkit.org/',
    buildType: 'default',
    forceDownload: false,
    macCredits: false,
    macIcns: false,
    macZip: false,
    macPlist: false,
    winIco: null,
    argv: process.argv.slice(2)
};



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!
Promise.longStackTraces();


// We inherit from EventEmitter for logging
inherits(NwBuilder, EventEmitter);
module.exports = NwBuilder;
function NwBuilder(options) {
    var self = this;
    

    // Assing options
    this.options = _.defaults(options, defaults);
    this._platforms = platforms;

    // Some Option checking
    if(!this.options.files) {
        throw new Error('Please specify some files');
    }

    if (this.options.platforms.length === 0)
        throw new Error('No platform to build!');

    // verify all the platforms specifed by the user are supported
    // this + previous check assures as we have only buildable platforms specified
    this.options.platforms.forEach(function(platform) {
        if (!(platform in platforms))
            throw new Error('unknown platform ' + platform);
    });
    
    this._platforms = _.cloneDeep(platforms);

    // clear all unused platforms
    for (var name in this._platforms) {
        if (this.options.platforms.indexOf(name) === -1)
            delete this._platforms[name];
    }
}

var getAppName = function(base, options, user_files) {
    base.appName = options.appName;
    base.appVersion = options.appVersion;
    if(!base.appName || base.appVersion) {
        return user_files
            .then(function() {
                return Utils.getPackageInfo(base._appPkg);
            })
            .then(function (appPkg) {
               base._appPkg = appPkg;
               base.appName = (base.appName ? options.appName : appPkg.name);
               base.appVersion = (base.appVersion ? options.appVersion : appPkg.version);
            });
    } else {
        return true;
    }
};

var getLatestVersion = function(base, options) {
    
    if(options.version !== 'latest') return Promise.resolve();
    
    return NwVersions.getLatestVersion(options.downloadUrl).then(function(latestVersion){
        base.emit('log', 'Latest Version: v' + latestVersion);
        options.version = latestVersion;
    });
};
var checkVersion = function(base, options) {
    var version = options.version.replace('v', '');

    if(!semver.valid(options.version)){
        return Promise.reject('The version ' + options.version + ' is not valid.');
    } else {
        base._version = NwVersions.getVersionNames( version );
        base.emit('log', 'Using v' + base._version.version);
    }

    return Promise.resolve();
};

var setPlatformsFilesSchema = function(base, options) {
    base._forEachPlatform(function (name, platform) {
        
        var satisfied = !Object.keys(platform.files).every(function(range) {
            if (semver.satisfies(base._version.version, range)) {
                platform.files = platform.cv_files = platform.files[range];
                return false;
            }
            return true;
        });

        if (!satisfied) {
            throw new Error("Unsupported node-webkit version '" + base._version.version + "' for platform '" + platform.type + "'");
        }
    });
    
    return true;
};

var downloadPlatformFiles = function(base, options, platform, platform_name) {
    var self = base;
    platform.cache = path.resolve(options.cacheDir, self._version.version, platform_name);
    platform.url = url.resolve(options.downloadUrl, self._version.platforms[ platform_name ]);

    // Ensure that there is a cache folder
    if(options.forceDownload) {
        rimraf.sync(platform.cache);
    }

    //fs.mkdirpSync(platform.cache);
    self.emit('log', 'Create cache folder in ' + path.resolve(options.cacheDir, self._version.version));

    if(!Downloader.checkCache(platform.cache, platform.cv_files)) {
        self.emit('log', 'Downloading: ' + platform.url);
        return Downloader.downloadAndUnpack(platform.cache, platform.url)
            .catch(function(err){
                if (err.statusCode === 404){
                    self.emit('log', 
                        'ERROR: The version ' + 
                        self._version.version +
                        ' does not have a corresponding build posted at' +
                        ' http://dl.node-webkit.org/. ' +
                        'Please choose a version from that list.');
                } else {
                    self.emit('log', err.msg);
                }
            });
    } else {
        self.emit('log', 'Using cache for: ' + platform_name);
        return true;
    }
};

var getPlatformFilesListBySchema = function(base, options, platform, platform_name) {
    var matches_checks = [];
    var matches = Glob({cwd: platform.cache}, platform.cv_files);

    var files = [];

    matches.forEach(function(file) {
        var full_path = path.resolve( platform.cache, file );
        var stats = fs.statSync( full_path );
        if (stats.isDirectory()) {
            matches_checks.push(new Promise(function(resolve, reject) {
                var walker = walk.walk( full_path );
                var files = [];
                walker.on('file', function(root, fileStats, next) {
                    files.push( path.resolve( root, fileStats.name ) );
                    next();
                });
                walker.on("errors", function (root, nodeStatsArray, next) {
                    reject(nodeStatsArray);
                    next();
                });
                walker.on('end', function() {
                    resolve( files );
                });
                //return
            }));
        } else if (stats.isFile()) {
            matches_checks.push( [full_path] );
        }
    });

    return Promise.all(matches_checks);
};




var fromMap = function(source, args) {
    var cache = {};
    var all_args;
    var get = function(key_name) {
        if (!cache[key_name]) {
            if (!source[key_name]) {
                throw new Error('unknown part: ' + key_name);
            }
            cache[key_name] = source[key_name].apply(null, all_args);
        }
        return cache[key_name];
    };
    all_args = [get].concat(args);
    return get;
};


var getReleaseFolder = function(reqb, base, options) {
    var self = base;
    return reqb('app_name').then(function() {
        var releasePath;
        if (_.isFunction(options.buildType)) {
          releasePath = options.buildType.call(options, base.appName);
        } else {
          // buildTypes
          switch (options.buildType) {
              case 'timestamped':
                  releasePath = base.appName + ' - ' + Math.round(Date.now() / 1000).toString();
              break;

              case 'versioned':
                  releasePath = base.appName + ' - v' + options.appVersion;
              break;

              default:
                  releasePath = base.appName;
          }
        }
        base.rootReleasePath = path.resolve(options.buildDir, releasePath);
        if (!fs.existsSync(base.rootReleasePath)) {
            fs.mkdirpSync(base.rootReleasePath);
        }
    });
};


var createPlaformReleasFolder = function(base, options, platform, platform_name, getReleaseFolderP) {
    return getReleaseFolderP().then(function() {
        platform.releasePath = path.resolve(base.rootReleasePath, platform_name);

        // Ensure that there is a release Folder, delete and create it.
        rimraf.sync(platform.releasePath);
        //fs.removeSync(platform.releasePath);
        fs.mkdirpSync(platform.releasePath);
        base.emit('log', 'Create release folder in ' + platform.releasePath);
    });
};


var base_map = {
    user_files: function(reqb, base, options) {
        return Utils.getFileList(options.files)
            .then(function (data) {
                base._appPkg = data.json;
                base._files = data.files;
            });
    },
    platform_files_schema: function(reqb, base, options) {
        return getLatestVersion(base, options)
            .then(function() {
                return checkVersion(base, options);
            })
            .then(function() {
                return setPlatformsFilesSchema(base, options);
            });
    },
    app_name: function(reqb, base, options) {
        return getAppName(base, options, reqb('user_files'));
    },
    release_folder: getReleaseFolder
};

var app_path_shift = {
    index: {
        osx: function(reqp, reqb, platform, platform_name, base, options) {
            return Promise.all([reqb('platform_files_schema'), reqb('app_name')])
                .then(function() {
                    var oapp_fname = platform.cv_files[0];
                    platform.path_shift = base.appName + path.extname(oapp_fname);
                    platform.userfiles_path_shift = path.join(platform.path_shift, 'Contents', 'Resources', 'app.nw');
                });
        }
    },
    default: function(base, options, platform) {
        platform.path_shift = '';
        platform.userfiles_path_shift = '';
        return Promise.resolve();
    }
};
var nwkit_zipstruc = {
    index: {
        osx: function(reqp, reqb, platform, platform_name, base, options) {
            var files_map = [];
            var oapp_fname = platform.cv_files[0];

            var deep_root = path.resolve( platform.cache, oapp_fname );

            platform.files_list.forEach(function(file) {
                if (file.indexOf(deep_root) === 0) {
                    var relpath = path.relative( deep_root, file );
                    files_map.push({
                        src: file,
                        dest: path.join( platform.path_shift, relpath )
                    });
                }
            });
            return files_map;
        }
    },
    default: function(reqp, reqb, platform, platform_name, base, options) {
        var files_map = [];
        var oapp_fname = platform.cv_files[0];
        var oldpath = path.resolve( platform.cache, oapp_fname );
        var renamed = false;

        var app_filename = base.appName + path.extname(oapp_fname);

        platform.files_list.forEach(function(file) {
           
            if (!renamed && file === oldpath) {
                renamed = true;
                files_map.push({
                    src: file,
                    dest: path.join( platform.path_shift, app_filename )
                });
            } else {
                var relpath = path.relative( platform.cache, file );
                files_map.push({
                    src: file,
                    dest: path.join( platform.path_shift, relpath )
                });
            }
        });

       


        return files_map;
    }
};

var selectHandler = function(index_key, index) {
    if (index.index[index_key]) {
        return index.index[index_key];
    } else {
        return index['default'];
    }
};

var platform_map = {
    nodewebkit: function(reqp, reqb, platform, platform_name, base, options) {
        return reqb('platform_files_schema').then(function() {
            return downloadPlatformFiles(base, options, platform, platform_name);
        });
    },
    nodewebkit_files_list_raw: function(reqp, reqb, platform, platform_name, base, options) {
        return reqp('nodewebkit').then(function() {
            return getPlatformFilesListBySchema(base, options, platform, platform_name);
        });
    },
    /*
function(reqp, reqb, platform, platform_name, base, options) {}
    */
    nodewebkit_files_list: function(reqp, reqb, platform, platform_name, base, options) {
        return reqp('nodewebkit_files_list_raw').then(function(result) {
            platform.files_list = _.flatten( result );
        });
    },
    zip_nwfiles_struc: function(reqp, reqb, platform, platform_name, base, options) {
        var args = arguments;
        return Promise.all([reqp('nodewebkit_files_list'), reqp('app_path_shift')])
            .then(function() {
                var handler = selectHandler(platform_name, nwkit_zipstruc);
                platform.zipstruc = handler.apply(null, args);
                console.log(platform.zipstruc[0]);
                console.log(platform.zipstruc[2]);
            });
    },
    app_path_shift: function(reqp, reqb, platform, platform_name, base, options) {
        var handler = selectHandler(platform_name, app_path_shift);
        return handler.apply(null, arguments);
    },
    zip_userfiles_sctruc: function(reqp, reqb, platform, platform_name, base, options) {
        return Promise.all([reqb('user_files'), reqp('app_path_shift')]).then(function() {
            var result = [];
            base._files.forEach(function(map) {
                var dest_path;
                if (platform.userfiles_path_shift) {
                    result.push({
                        src: map.src,
                        dest: path.join(platform.userfiles_path_shift, map.dest)
                    });
                } else {
                    result.push(map);
                }
            });

            platform.zip_userfiles_map = result;

        });
    },
    zip_app: function(reqp, reqb, platform, platform_name, base, options) {
        return Promise.all([reqp('zip_nwfiles_struc'), reqp('zip_userfiles_sctruc')]).then(function() {
            var all_files = platform.zipstruc.concat(platform.zip_userfiles_map);
            return new Promise(function(resolve, reject) {
                Utils.generateZipFile(all_files, base).then(function (nwFile) {
                    reqb('release_folder').then(function() {
                        Utils.copyFile(nwFile, 
                            path.resolve( base.rootReleasePath, base.appName + '-' + platform_name + '.zip')
                        ).then(resolve, reject);
                    }, reject);
                }, reject);
            });
        });
    }


};

NwBuilder.prototype.baseB = function() {
    var self = this;


    var reqb = fromMap(base_map, [self, self.options]);

    //var user_files = reqb('user_files');
    //var platform_files_schema = reqb('platform_files_schema');
    var all = [];

    this._forEachPlatform(function(platform_name, platform) {
        var reqp = fromMap(platform_map, [reqb, platform, platform_name, self, self.options]);

        /*var nodewebkit = reqp('nodewebkit');
        var nodewebkit_files_list_raw = reqp('nodewebkit_files_list_raw');


        var nodewebkit_files_list = reqp('nodewebkit_files_list');
        */
        var zip_nwfiles_struc = reqp('zip_nwfiles_struc');
        var zip_userfiles_sctruc = reqp('zip_userfiles_sctruc');
        reqp('zip_app');

        all.push(reqp('zip_app'));


        zip_userfiles_sctruc.then(function() {
            //console.log(platform.zip_userfiles_map[5]);
        });

        //var release_folder = createPlaformReleasFolder(self, self.options, platform, platform_name, getReleaseFolderP);


        

    });

    return Promise.all(all);
};

NwBuilder.prototype.build = function (callback) {
    var hasCallback = (typeof callback === 'function'),
        done = Promise.defer();

    // Let's create a node Webkit app
    var common_part = this.checkFiles().bind(this)
    //получить дерево файлов пользователя

    
        .then(this.resolveLatestVersion) 
        //получить последнюю версию если в параметрках указано version: 'latest'


        .then(this.checkVersion)
        //проверить правлиьность написания версии, сформировать имя файла для получения для каждой платформы
        .then(this.platformFilesForVersion)
        //проверить что мы знаем как использовать файлы из архива с сервера для используемой версии
        .then(this.downloadNodeWebkit)
        //загрузить нодвебкит
        .then(this.createReleaseFolder)
        //создать папку
        .then(this.copyNodeWebkit)
        // скопировать нодвебкит файлы
        .then(this.handleMacApp)
        // скопировать иконки, описание, сгенирировать плист
        .then(this.handleWinApp);
        //изменить иконку приложения

    var pack_part;


    var containerType = this.options.containerType || 'no_zip_and_embed';

    if (containerType == 'zip_no_embed') {
        pack_part = common_part
        //    .then(this.CombineApp) //скопировать все файлы
            .then(this.ZipApp);//заархивировать всё приложение

    } else if (containerType == 'no_zip_and_embed') {
        pack_part = common_part
            .then(this.zipAppFiles)//заархивипровать файлы приложения
            .then(this.mergeAppFiles);//присоединить zip файл к исполняемому файлу
    }

    

    pack_part
        .then(function (info) {
            if(hasCallback) {
                callback(false, info);
            } else {
                done.resolve(info);
            }
        })
        .catch(function (error) {
            if(hasCallback) {
                callback(error);
            } else {
                done.reject(error);
            }
        });

    return hasCallback ? true : done.promise;
};

NwBuilder.prototype.run = function (callback) {
    var hasCallback = (typeof callback === 'function'),
        done = Promise.defer();

    // Let's run this node Webkit app
    this.checkFiles().bind(this)
        .then(this.resolveLatestVersion)
        .then(this.checkVersion)
        .then(this.platformFilesForVersion)
        .then(this.downloadNodeWebkit)
        .then(this.runApp)
        .then(function (info) {
            if(hasCallback) {
                callback(false, info);
            } else {
                done.resolve(info);
            }
        })
        .catch(function (error) {
            if(hasCallback) {
                callback(true, error);
            } else {
                done.reject(error);
            }
        });

    return hasCallback ? true : done.promise;
};


NwBuilder.prototype.checkFiles = function () {
    var self = this;

    return Utils.getFileList(this.options.files).then(function (data) {

        self._appPkg = data.json;
        self._files = data.files;

        if(!self.options.appName || self.options.appVersion) {
            return Utils.getPackageInfo(self._appPkg).then(function (appPkg) {
               self._appPkg = appPkg;
               self.options.appName = (self.options.appName ? self.options.appName : appPkg.name);
               self.options.appVersion = (self.options.appVersion ? self.options.appVersion : appPkg.version);
            });
        }
    });

};

NwBuilder.prototype.resolveLatestVersion = function () {
    var self = this;
    
    if(self.options.version !== 'latest') return Promise.resolve();
    
    return NwVersions.getLatestVersion(self.options.downloadUrl).then(function(latestVersion){
        self.emit('log', 'Latest Version: v' + latestVersion);
        self.options.version = latestVersion;
    });
};

NwBuilder.prototype.checkVersion = function () {
    var version = this.options.version.replace('v', '');

    if(!semver.valid(this.options.version)){
        return Promise.reject('The version ' + this.options.version + ' is not valid.');
    } else {
        this._version = NwVersions.getVersionNames( version );
        this.emit('log', 'Using v' + this._version.version);
    }

    return Promise.resolve();
};

NwBuilder.prototype.platformFilesForVersion = function () {
    var self = this;

    this._forEachPlatform(function (name, platform) {
        
        var satisfied = !Object.keys(platform.files).every(function(range) {
            if (semver.satisfies(self._version.version, range)) {
                platform.files = platform.files[range];
                return false;
            }
            return true;
        });

        if (!satisfied) {
            throw new Error("Unsupported node-webkit version '" + self._version.version + "' for platform '" + platform.type + "'");
        }
    });
    
    return true;
};

NwBuilder.prototype.downloadNodeWebkit = function () {
    var self = this,
        downloads = [];

    this._forEachPlatform(function (name, platform) {
        platform.cache = path.resolve(self.options.cacheDir, self._version.version, name);
        platform.url = url.resolve(self.options.downloadUrl, self._version.platforms[name]);

        // Ensure that there is a cache folder
        if(self.options.forceDownload) {
            rimraf.sync(platform.cache);
            //fs.removeSync(platform.cache);
        }

        fs.mkdirpSync(platform.cache);
        self.emit('log', 'Create cache folder in ' + path.resolve(self.options.cacheDir, self._version.version));

        if(!Downloader.checkCache(platform.cache, platform.files)) {
            downloads.push(
                Downloader.downloadAndUnpack(platform.cache, platform.url)
                    .catch(function(err){
                        if(err.statusCode === 404){
                            self.emit('log', 'ERROR: The version '+self._version.version+' does not have a corresponding build posted at http://dl.node-webkit.org/. Please choose a version from that list.')
                        } else {
                            self.emit('log', err.msg)
                        }
                        
                        return Promise.reject('Unable to download nodewebkit.');
                    })
            );
            self.emit('log', 'Downloading: ' + platform.url);
        } else {
            self.emit('log', 'Using cache for: ' + name);
        }
    });

    return Promise.all(downloads)
        .then(function(data) {
            Downloader.clearProgressbar();
            return data;
        });
};

NwBuilder.prototype.buildGypModules = function () {
    // @todo
    // If we trigger a rebuild we have to copy
    // the node_modules to a tmp location because
    // we don't want to change the source files

};

NwBuilder.prototype.createReleaseFolder = function () {
    var self = this,
        releasePath;

    if (_.isFunction(self.options.buildType)) {
      releasePath = self.options.buildType.call(self.options);
    } else {
      // buildTypes
      switch(self.options.buildType) {
          case 'timestamped':
              releasePath = self.options.appName + ' - ' + Math.round(Date.now() / 1000).toString();
          break;

          case 'versioned':
              releasePath = self.options.appName + ' - v' + self.options.appVersion;
          break;

          default:
              releasePath = self.options.appName;
      }
    }
    var rootReleasePath = path.resolve(self.options.buildDir, releasePath);
    self.rootReleasePath = rootReleasePath;

    this._forEachPlatform(function (name, platform) {
        platform.rootReleasePath = rootReleasePath;
        platform.releasePath = path.resolve(rootReleasePath, name);

        // Ensure that there is a release Folder, delete and create it.
        rimraf.sync(platform.releasePath);
        //fs.removeSync(platform.releasePath);
        fs.mkdirpSync(platform.releasePath);
        self.emit('log', 'Create release folder in ' + platform.releasePath);
    });

    return true;
};

NwBuilder.prototype.copyNodeWebkit = function () {
    var self = this,
        copiedFiles = [];



    this._forEachPlatform(function (name, platform) {
        platform.ofiles = platform.files.slice();
        var executable = platform.runable.split('/')[0]; 
        platform.files.forEach(function (file, i) {
            var destFile = file;
            if(i===0) {
                // rename executable to app name
                destFile = self.options.appName + path.extname(file);
                // save new filename back to files list
                platform.files[0] = destFile;
            }
            copiedFiles.push(Utils.copyFile(path.resolve(platform.cache, file), path.resolve(platform.releasePath, destFile)));
        });
    });

    return Promise.all(copiedFiles);
};

NwBuilder.prototype.CombineApp = function() {
    var self = this,
        copiedFiles = [];

    this._forEachPlatform(function (name, platform) {
        // We copy the app files if we are on mac and don't force zip
        if(name === 'osx') {
            // no zip, copy the files
            self._files.forEach(function (file) {
                var dest = path.resolve(platform.releasePath, self.options.appName + '.app', 'Contents', 'Resources', 'app.nw', file.dest);
                copiedFiles.push(Utils.copyFile(file.src, dest));
            });
        } else {
            self._files.forEach(function (file) {
                var dest = path.resolve(platform.releasePath, file.dest);
                copiedFiles.push(Utils.copyFile(file.src, dest));
            });
            // We cat the app.nw file into the .exe / nw
            //copiedFiles.push(Utils.mergeFiles(path.resolve(platform.releasePath, _.first(platform.files)), self._nwFile, platform.chmod));
        }
    });

    return Promise.all(copiedFiles);

};
NwBuilder.prototype.ZipApp = function() {
    var self = this,
        copiedFiles = [];

    this._forEachPlatform(function (platform_name, platform) {
        if (platform_name == 'osx') {
            var common_files = new Array(platform.ofiles.length);
            platform.ofiles.forEach(function(file, i) {
                common_files[i] = {

                    src: path.resolve(platform.cache, file),
                    dest: file//path.relative(platform.releasePath, file)
                };
            });
            var all_files = common_files.concat(self._files);
            if (platform_name == 'osx') {
                all_files = all_files.slice(1).map(function(el, i) {

                    return {
                        src: el.src,

                        dest:  path.join(self.options.appName + '.app', el.dest)
                    };
                });
            }

            copiedFiles.push(new Promise(function(resolve, reject) {
                Utils.generateZipFile(all_files, self).then(function (nwFile) {
                    Utils.copyFile(nwFile, path.resolve( self.rootReleasePath, self.options.appName + '-' + platform_name + '.zip')).then(resolve, reject);

                    //console.log(nwFile);
                    //resolve();
                }, reject);
            }));
        }

    });

    return Promise.all(copiedFiles);
};

NwBuilder.prototype.zipAppFiles = function () {
    var self = this;

    // Check if zip is needed
    var _needsZip = self.options.macZip;

    // this can be improved
    this._forEachPlatform(function(name, platform) {
        if (platform.needsZip) {
            _needsZip = true;
        }
            
    });

    this._needsZip = _needsZip;

    return new Promise(function(resolve, reject) {
        if(self._needsZip) {
            Utils.generateZipFile(self._files, self).then(function (nwFile) {
                self._nwFile = nwFile;
                resolve();
            }, reject);
        } else {
            self._nwFile = null;
            resolve();
        }
    });
};

NwBuilder.prototype.mergeAppFiles = function () {
    var self = this,
        copiedFiles = [];

    this._forEachPlatform(function (name, platform) {
        // We copy the app files if we are on mac and don't force zip
        if(name === 'osx') {
            // no zip, copy the files
            if(!self.options.macZip) {
                self._files.forEach(function (file) {
                    var dest = path.resolve(platform.releasePath, self.options.appName+'.app', 'Contents', 'Resources', 'app.nw', file.dest);
                    copiedFiles.push(Utils.copyFile(file.src, dest));
                });
            } else {
                // zip just copy the app.nw
                copiedFiles.push(Utils.copyFile(self._nwFile, path.resolve(platform.releasePath, self.options.appName+'.app', 'Contents', 'Resources', 'nw.icns')));
            }
        } else {
            // We cat the app.nw file into the .exe / nw
            copiedFiles.push(Utils.mergeFiles(path.resolve(platform.releasePath, _.first(platform.files)), self._nwFile, platform.chmod));
        }
    });

    return Promise.all(copiedFiles);
};

NwBuilder.prototype.handleMacApp = function () {
    var self = this, allDone = [];
    var macPlatform = this._platforms.osx;

    if(!macPlatform) return Promise.resolve();

    // Let's first handle the mac icon
    if(self.options.macIcns) {
        allDone.push(Utils.copyFile(self.options.macIcns, path.resolve(macPlatform.releasePath, self.options.appName+'.app', 'Contents', 'Resources', 'nw.icns')));
    }
    
    // Handle mac credits
    if(self.options.macCredits) {
        allDone.push(Utils.copyFile(self.options.macCredits, path.resolve(macPlatform.releasePath, self.options.appName+'.app', 'Contents', 'Resources', 'Credits.html')));
    }

    // Let handle the Plist
    var PlistPath = path.resolve(macPlatform.releasePath, self.options.appName+'.app', 'Contents', 'Info.plist');

    // If the macPlist is a string we just copy the file
    if(typeof self.options.macPlist === 'string') {
        allDone.push(Utils.copyFile(self.options.macPlist, PlistPath));
    } else {
        // Setup the Plst
        var defaultPlist = {
            appName: self.options.appName,
            appVersion: self.options.appVersion,
            copyright: self._appPkg.copyright || false
        };

        var plistOptions = (self.options.macPlist ? _.defaults(self.options.macPlist, defaultPlist) : defaultPlist);
        allDone.push(Utils.editPlist(PlistPath, PlistPath, plistOptions));
    }

    return Promise.all(allDone);

};

NwBuilder.prototype.handleWinApp = function () {
    var self = this,
        done = Promise.defer();
    var winPlatform = this._platforms.win;
    if(!winPlatform || !self.options.winIco) return Promise.resolve();

    // Set icon
    if (self.options.winIco) {
        self.emit('log', 'Update executable icon');
        winresourcer({
            operation: "Update",
            exeFile: path.resolve(winPlatform.releasePath, _.first(winPlatform.files)),
            resourceType: "Icongroup",
            resourceName: "IDR_MAINFRAME",
            lang: 1033, // Required, except when updating or deleting 
            resourceFile: path.resolve(self.options.winIco)
        }, function(err) {
            if(err) {
                done.reject('Error while updating the Windows icon.' +
                    (process.platform !== "win32" ? ' Wine (winehq.org) must be installed to add custom icons from Mac and Linux.' : '')
                );
            }
            else {
                done.resolve();
            }
        });
    }

    return done.promise;
};

NwBuilder.prototype.runApp = function () {
    var self = this,
        platform = this._platforms[this.options.currentPlatform],
        executable = path.resolve(platform.cache, platform.runable);

        self.emit('log', 'Launching App');
        return new Promise(function(resolve, reject) {
            var p = spawn(executable, ['--enable-logging', self.options.files.replace(/\*[\/\*]*/,"")].concat(self.options.argv));

            p.stdout.on('data', function(data) {
                self.emit('stdout', data);
            });

            p.stderr.on('data', function(data) {
                self.emit('stderr', data);
            });

            p.on('close', function(code) {
                self.emit('log', 'App exited with code ' + code);
                resolve();
            });
        });
};

NwBuilder.prototype._forEachPlatform = function (fn) {
    _.forEach(this._platforms, function(platform, name) {        
        return fn(name, platform);
    });
};

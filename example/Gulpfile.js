var NwBuilder = require('node-webkit-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('nw', function (callback) {

    var nw = new NwBuilder({
        version: '0.9.2',
        files: [ './nwapp/**']
    });

    // Log stuff you want
    nw.on('log', function (mgs) {
        gutil.log('node-webkit-builder', mgs);
    });

    // Build retruns a promise
    nw.build(function (err) {
        if(err) {
            gutil.log('node-webkit-builder', err);
        }
        callback();
        gutil.beep();
    });
});
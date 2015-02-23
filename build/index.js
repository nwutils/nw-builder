var fs = require('fs'),
    eol = require('eol');

var log = function(content){
    console.log('Build: ' + content);
};

log('Fixing line-endings');
fs.writeFileSync('./bin/nwbuild', eol.lf(fs.readFileSync('bin/nwbuild').toString()));

log('Finished');
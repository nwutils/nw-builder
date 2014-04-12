var NwBuilder = require('./lib');

var nw = new NwBuilder({
    files: './test/fixtures/nwapp/**/*',
    macZip: true
});

nw.on('log', function (msg) {
    console.log(msg);
});

nw.build().catch(function (error) {
    console.log(error);
});
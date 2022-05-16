const NwBuilder = require('../lib');

const nw = new NwBuilder({
    version: '0.64.1',
    files: './nwapp/**',
    macIcns: './icons/icon.icns',
    macPlist: {mac_bundle_id: 'myPkg'},
    // Comment out the incompatible platforms before running the example
    platforms: [
        'linux',
        'osx64',
        'win64',
    ]
});


nw.on('log', (msg) => console.log('nw-builder', msg));

nw.run()
    .then(() => process.exit(0))
    .catch((error) => console.log(error))

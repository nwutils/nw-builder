const NwBuilder = require('../lib');

const nw = new NwBuilder({
    version: '0.14.6',
    files: './**',
    macIcns: './icons/icon.icns',
    macPlist: {mac_bundle_id: 'myPkg'},
    platforms: ['linux64'],
});

nw.on('log', (msg) => console.log(msg))

nw.run()
    .then(() => console.log('Demo is running!'))
    .catch((error) => console.log(error))
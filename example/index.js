const NwBuilder = require('../lib');

const nw = new NwBuilder({
    version: '0.64.1',
    files: './**',
    platforms: ['linux64'],
});

nw.on('log', (msg) => console.log(msg))

nw.run()
    .then(() => console.log('Demo is running!'))
    .catch((error) => console.log(error))
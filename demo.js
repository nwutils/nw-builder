const NwBuilder = require('./lib');

const nw = new NwBuilder({
    version: '0.64.1',
    files: './example/**',
    platforms: ['linux64'],
});

nw.on('log', (msg) => console.log(msg))

nw.run()
    .then(() => process.exit(0))
    .catch((error) => console.log(error))
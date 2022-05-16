const NwBuilder = require('./lib');

const nw = new NwBuilder({
    version: '0.64.1',
    files: './example/**',
    // Comment out the incompatible platforms
    platforms: [
        'linux64',
        'osx64',
        'win64',
    ],
});

nw.on('log', (msg) => console.log(msg))

nw.run()
    .then(() => process.exit(0))
    .catch((error) => console.log(error))
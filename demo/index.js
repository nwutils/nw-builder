const NW = require('../src');

const nw = new NW({
    files: './**',
    version: '0.64.0',

    platforms: ['linux64']
});

nw.on('log', (msg) => {
    console.log(msg)
});

// nw.build().catch((error) => {
//     console.log(error)
// });

nw.run()
    .then(() => {
        console.log('Demo app is running!')
    })
    .catch((error) => {
        console.log(error)
    })
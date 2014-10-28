module.exports = {
    win: {
        needsZip: true,
        runable: 'nw.exe',
        files: { // First file must be the executable
            '<=0.9.2': ['nw.exe', 'ffmpegsumo.dll', 'icudt.dll', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak'],
            '>0.9.2': ['nw.exe', 'ffmpegsumo.dll', 'icudtl.dat', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak', 'locales']
        },
        versionNameTemplate: 'v${ version }/node-webkit-v${ version }-win-ia32.zip'
    },
    osx: {
        runable: 'node-webkit.app/Contents/MacOS/node-webkit',
        files: {
            '*': ['node-webkit.app']
        },
        versionNameTemplate: 'v${ version }/node-webkit-v${ version }-osx-ia32.zip'
    },
    linux32: {
        needsZip: true,
        chmod: '0755',
        runable: 'nw',
        files: { // First file must be the executable
            '<=0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so'],
            '>0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so', 'icudtl.dat']
        },
        versionNameTemplate: 'v${ version }/node-webkit-v${ version }-linux-ia32.tar.gz'
    },
    linux64: {
        needsZip: true,
        chmod: '0755', // chmod file file to be executable
        runable: 'nw',
        files: { // First file must be the executable
            '<=0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so'],
            '>0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so', 'icudtl.dat']
        },
        versionNameTemplate: 'v${ version }/node-webkit-v${ version }-linux-x64.tar.gz'
    }
};

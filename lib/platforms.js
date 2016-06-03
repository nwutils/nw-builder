var semver = require('semver');

module.exports = {
    win32: {
        needsZip: true,
        getRunnable: function() { return 'nw.exe'; },
        files: { // First file must be the executable
            '>=0.15.1': ['nw.exe', 'd3dcompiler_47.dll', 'ffmpeg.dll', 'icudtl.dat', 'libEGL.dll', 'libGLESv2.dll', 'natives_blob.bin', 'node.dll', 'locales', 'nw.dll', 'nw_100_percent.pak', 'nw_200_percent.pak', 'nw_elf.dll', 'nw_material_100_percent.pak', 'nw_material_200_percent.pak', 'resources.pak', 'snapshot_blob.bin'],
            '>=0.14.6': ['nw.exe', 'd3dcompiler_47.dll', 'dbghelp.dll', 'ffmpeg.dll', 'icudtl.dll', 'libEGL.dll', 'libexif.dll', 'libGLESv2.dll', 'natives_blob.bin', 'node.dll', 'nw.dll', 'nw_100_percent.pak', 'nw_200_percent.pak', 'nw_elf.dll', 'resources.pak', 'snapshot_blob.bin'],
            '>=0.11.5': ['nw.exe', 'ffmpegsumo.dll', 'icudtl.dat', 'libEGL.dll', 'libGLESv2.dll', 'pdf.dll', 'd3dcompiler_46.dll', 'nw.pak', 'locales'],
            '>=0.9.2': ['nw.exe', 'ffmpegsumo.dll', 'icudtl.dat', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak', 'locales'],
            '<=0.9.2': ['nw.exe', 'ffmpegsumo.dll', 'icudt.dll', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak']
        },
        versionNameTemplate: 'v${ version }/${ name }-v${ version }-win-ia32.zip'
    },
    win64: {
        needsZip: true,
        getRunnable: function() { return 'nw.exe'; },
        files: { // First file must be the executable
            '>=0.15.1': ['nw.exe', 'd3dcompiler_47.dll', 'ffmpeg.dll', 'icudtl.dat', 'libEGL.dll', 'libGLESv2.dll', 'natives_blob.bin', 'node.dll', 'locales', 'nw.dll', 'nw_100_percent.pak', 'nw_200_percent.pak', 'nw_elf.dll', 'nw_material_100_percent.pak', 'nw_material_200_percent.pak', 'resources.pak', 'snapshot_blob.bin'],
            '>=0.14.6': ['nw.exe', 'd3dcompiler_47.dll', 'dbghelp.dll', 'ffmpeg.dll', 'icudtl.dll', 'libEGL.dll', 'libexif.dll', 'libGLESv2.dll', 'natives_blob.bin', 'node.dll', 'nw.dll', 'nw_100_percent.pak', 'nw_200_percent.pak', 'nw_elf.dll', 'resources.pak', 'snapshot_blob.bin'],
            '>=0.11.5': ['nw.exe', 'ffmpegsumo.dll', 'icudtl.dat', 'libEGL.dll', 'libGLESv2.dll', 'pdf.dll', 'd3dcompiler_46.dll', 'nw.pak', 'locales'],
            '>=0.9.2': ['nw.exe', 'ffmpegsumo.dll', 'icudtl.dat', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak', 'locales'],
            '<=0.9.2': ['nw.exe', 'ffmpegsumo.dll', 'icudt.dll', 'libEGL.dll', 'libGLESv2.dll', 'nw.pak']
        },
        versionNameTemplate: 'v${ version }/${ name }-v${ version }-win-x64.zip'
    },
    osx32: {
        getRunnable: function(version) {
            if(semver.satisfies(version, '>=0.12.0 || ~0.12.0-alpha')) {
                return 'nwjs.app/Contents/MacOS/nwjs';
            } else {
                return 'node-webkit.app/Contents/MacOS/node-webkit';
            }
        },
        files: {
            '<0.12.0-alpha': ['node-webkit.app'],
            '>=0.12.0 || ~0.12.0-alpha': ['nwjs.app']
        },
        versionNameTemplate: 'v${ version }/${ name }-v${ version }-osx-ia32.zip'
    },
    osx64: {
        getRunnable: function(version) {
            if(semver.satisfies(version, '>=0.12.0 || ~0.12.0-alpha')) {
                return 'nwjs.app/Contents/MacOS/nwjs';
            } else {
                return 'node-webkit.app/Contents/MacOS/node-webkit';
            }
        },
        files: {
            '<0.12.0-alpha': ['node-webkit.app'],
            '>=0.12.0 || ~0.12.0-alpha': ['nwjs.app']
        },
        versionNameTemplate: 'v${ version }/${ name }-v${ version }-osx-x64.zip'
    },
    linux32: {
        needsZip: true,
        chmod: '0755',
        getRunnable: function() { return 'nw'; },
        files: { // First file must be the executable
            '<=0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so'],
            '>0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so', 'icudtl.dat']
        },
        versionNameTemplate: 'v${ version }/${ name }-v${ version }-linux-ia32.tar.gz'
    },
    linux64: {
        needsZip: true,
        chmod: '0755', // chmod file file to be executable
        getRunnable: function() { return 'nw'; },
        files: { // First file must be the executable
            '<=0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so'],
            '>0.9.2': ['nw', 'nw.pak', 'libffmpegsumo.so', 'icudtl.dat']
        },
        versionNameTemplate: 'v${ version }/${ name }-v${ version }-linux-x64.tar.gz'
    }
};
/*
	detect the current platform according to expected constants

	return undefined if platform is unrecognized
*/
module.exports = function () {
	switch(process.platform) {
        case 'darwin':
            return process.arch === 'x64' ? 'osx64' : 'osx32';

        case 'win32':
            return (process.arch === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')) ? 'win64' : 'win32';

        case 'linux':
						const arch = process.arch;
						if (arch === 'x64') {
							return 'linux64';
						} else if (arch === 'x32') {
							return 'linux32';
						} else if (arch === 'arm') {
							return 'linuxARM';
						}
	}
};

/*
	detect the current platform according to expected constants

	return undefined if platform is unrecognized
*/
module.exports = function () {
	switch(process.platform) {
        case 'darwin':
            return'osx';
        
        case 'win32':
        	return 'win';

        case 'linux':
            return process.arch === 'x64' ? 'linux64' : 'linux32';
	}
}
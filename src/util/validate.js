import { readdir } from 'node:fs/promises';

/**
 * Validate options
 *
 * @param  {object}    options      Options
 * @param  {object}    releaseInfo  Version specific NW release info
 * @return {undefined}              True if options are valid. False otherwise
 */
export const validate = (options, releaseInfo) => {
    if (options.srcDir && readdir(options.srcDir).length === 0) {
        throw new Error('srcDir is empty');
    } if (options.mode !== "run" || options.mode !== "build") {
        throw new Error('Invalid mode value. Expected run or build.');
    } if (options.platform && options.arch && !releaseInfo.files.includes(`${options.platform}-${options.arch}`)) {
        throw new Error(`Platform ${options.platform} and architecture ${options.arch} is not supported. Sorry!`);
    } if (options.outDir && readdir(options.outDir).length === 0) {
        throw new Error('outDir is empty');
    }
    return undefined;
};

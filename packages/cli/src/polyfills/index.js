import { isDevToolsOpen } from './window.js';

/**
 * Polyfill function for missing NW.js functionality.
 * 
 * The environment is checked before adding the relevant function.
 * 
 * @returns {string} - A message indicating whether the polyfill was applied or not.
*/
export default function polyfill() {
    // @ts-ignore
    if (process.versions['nw-flavor'] === 'sdk' && typeof nw.Window.isDevToolsOpen !== 'function' && process.versions['nw'] && process.versions['nw'] <= '0.92.0') {
        // @ts-ignore
        nw.Window.isDevToolsOpen = isDevToolsOpen;
        // @ts-ignore
        global.nw.Window.isDevToolsOpen = isDevToolsOpen;
        // @ts-ignore
        window.nw.Window.isDevToolsOpen = isDevToolsOpen;
        return 'Polyfill applied';
    } else {
        return 'Polyfill not applied';
    }
}

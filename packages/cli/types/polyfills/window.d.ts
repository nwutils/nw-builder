/**
 * Query the status of DevTools window.
 *
 * @example
 * nw.Window.isDevToolsOpen(function(status) {
 *   console.log(status);
 * });
 *
 * @function
 * @param {(status: boolean) => void} callback - Callback function
 * @returns {void}
 */
export function isDevToolsOpen(callback: (status: boolean) => void): void;

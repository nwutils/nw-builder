declare namespace _default {
    export { resolvePlatform };
    export { resolveArch };
    export { CACHE_DIR };
}
export default _default;
/**
 * @returns {string}
 */
declare function resolvePlatform(): string;
/**
 * @returns {string}
 */
declare function resolveArch(): string;
declare const CACHE_DIR: string;

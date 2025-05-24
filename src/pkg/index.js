import path from "node:path";

import createAppImage from "appimage";

/**
 * 
 * @param {object} options
 * @param {string} options.outDir - Output directory for the built application
 * @param {string} options.pkgDir - Output directory for the packaged application
 * @param {boolean} options.appimage - Package the application as an AppImage for Linux
 * @param {object} options.app - Application specific options
 * @param {string} options.app.name - Application name
 * @returns {Promise<void>}
 */
export default async function pkg({
    outDir,
    pkgDir,
    appimage = false,
    app,
}) {

    if (appimage === true) {

        await createAppImage({
            appName: app.name,
            outDir: pkgDir,
            appImagePath: './node_modules/nw/appimagetool.AppImage',
            srcMap: {
                '/usr/bin/lib': path.resolve(outDir, "lib"),
                '/usr/bin/locales': path.resolve(outDir, "locales"),
                '/usr/bin/package.nw': path.resolve(outDir, "package.nw"),
                '/usr/bin/swiftshader': path.resolve(outDir, "swiftshader"),
                '/usr/bin/chrome_crashpad_handler': path.resolve(outDir, "chrome_crashpad_handler"),
                '/usr/bin/chromedriver': path.resolve(outDir, "chromedriver"),
                '/usr/bin/nw': path.resolve(outDir, app.name),
                '/usr/bin/nw.desktop': path.resolve(outDir, `${app.name}.desktop`),
                '/usr/bin/icudtl.dat': path.resolve(outDir, "icudtl.dat"),
                '/usr/bin/minidump_stackwalk': path.resolve(outDir, "minidump_stackwalk"),
                '/usr/bin/nw_100_percent.pak': path.resolve(outDir, "nw_100_percent.pak"),
                '/usr/bin/nw_200_percent.pak': path.resolve(outDir, "nw_200_percent.pak"),
                '/usr/bin/nwjc': path.resolve(outDir, "nwjc"),
                '/usr/bin/resources.pak': path.resolve(outDir, "resources.pak"),
                '/usr/bin/v8_context_snapshot.bin': path.resolve(outDir, "v8_context_snapshot.bin"),
            }
        });
    }

}

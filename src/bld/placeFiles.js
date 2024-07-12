import fs from 'node:fs';
import path from 'node:path';

import util from '../util';

export default async function placeFiles (version, flavor, platform, arch, cacheDir, outDir, srcDir, glob) {
    const nwDir = path.resolve(
        cacheDir,
        `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform
        }-${arch}`,
      );

      await fs.promises.rm(outDir, { force: true, recursive: true });
      await fs.promises.cp(nwDir, outDir, { recursive: true, verbatimSymlinks: true });

      const files = await util.globFiles({ srcDir, glob });

      if (glob) {
        for (let file of files) {
          await fs.promises.cp(
            file,
            path.resolve(
              outDir,
              platform !== "osx"
                ? "package.nw"
                : "nwjs.app/Contents/Resources/app.nw",
              file,
            ),
            { recursive: true, verbatimSymlinks: true },
          );
        }
      } else {
        await fs.promises.cp(
          files,
          path.resolve(
            outDir,
            platform !== "osx"
              ? "package.nw"
              : "nwjs.app/Contents/Resources/app.nw",
          ),
          { recursive: true, verbatimSymlinks: true },
        );
      }
}
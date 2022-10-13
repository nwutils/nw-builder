import fs from "node:fs";

const setLinuxConfig = async (pkg, outDir) => {
  let fileContent = `[Desktop Entry]
    Name=${pkg.name}
    Version=${pkg.version}
    Exec=bash -c "nw package.nw"
    Type=Application
    Terminal=false`;

  let filePath = `${outDir}/${pkg.name}.desktop`;
  fs.writeFileSync(filePath, fileContent);
  fs.chmodSync(filePath, "755");
  return 0;
};

export { setLinuxConfig };

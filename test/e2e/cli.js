import { exec } from "child_process";

exec(
  "nwbuild ./nwapp/**/* ./node_modules/**/* --mode=build --version=latest --flavour=normal --platform=win --arch=x64 --outDir=./build",
);

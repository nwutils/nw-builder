import { exec } from "child_process";

exec(
  "nwbuild ./nwapp/**/* ./node_modules/**/* --mode=build --version=latest --flavor=normal --platform=win --arch=x64 --outDir=./build",
);

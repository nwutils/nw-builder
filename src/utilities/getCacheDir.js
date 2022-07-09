const getCacheDir = (version, flavor, os, arch) => {
    return `${process.cwd()}/${version}-${flavor === "sdk" ? "-sdk" : ""}/${os}/${arch === "x64" ? "64" : "32" }`;
};

export default getCacheDir;
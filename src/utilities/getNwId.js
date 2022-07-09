const getNwId = (version, flavor, os, arch) => {
  return `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${os}-${arch}-${
    os === "linux" ? ".tar.gz" : ".zip"
  }`;
};

export default getNwId;

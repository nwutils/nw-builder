const getNwId = (version, flavor, platform, arch) => {
  return `nwjs${
    flavor === "sdk" ? "-sdk" : ""
  }-v${version}-${platform}-${arch}${
    platform === "linux" ? ".tar.gz" : ".zip"
  }`;
};

export default getNwId;

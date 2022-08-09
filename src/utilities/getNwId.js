const getNwId = (version, flavor, platform, arch, ext = true) => {
  if (ext) {
    return `nwjs${
      flavor === "sdk" ? "-sdk" : ""
    }-v${version}-${platform}-${arch}${
      platform === "linux" ? ".tar.gz" : ".zip"
    }`;
  }
  return `nwjs${
    flavor === "sdk" ? "-sdk" : ""
  }-v${version}-${platform}-${arch}`;
};

export default getNwId;

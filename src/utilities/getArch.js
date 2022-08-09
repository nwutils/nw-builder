import Arch from "../constants/arch";

const getArch = (arch) => {
  if (arch === "x64") {
    return Arch.x64;
  } else {
    return Arch.x32;
  }
};

export default getArch;

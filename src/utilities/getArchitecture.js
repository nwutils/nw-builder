const getArchitecture = (process) => {
    switch (process.arch) {
        case "x64":
            return "x64";
        case "ia32":
            return "ia32";
        default:
            return null;
    }
};

export default getArchitecture;
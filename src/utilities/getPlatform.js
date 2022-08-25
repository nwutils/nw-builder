const getPlatform = (process) => {
    switch (process.platform) {
        case "linux":
            return "linux"
        case "darwin":
            return "osx"
        case "win32":
            return "win"
        default:
            return null
    }
};

export default getPlatform;
let nwbuild = undefined;

(async () => {
    try {
        nwbuild = (await import("./nwbuild.js")).nwbuild;
    } catch (e) {
        console.log(e);
    }
})();

module.exports = { nwbuild };
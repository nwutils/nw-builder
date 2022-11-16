import https from "node:https";

export const getManifest  = (manifestUrl) => {
    let chunks = undefined;

    return new Promise((resolve, reject) => {
        https.get(manifestUrl, (res) => {
            res.on("data", (chunk) => {
                chunks += chunk;
            });

            res.on("error", (e) => {
                reject(e);
            });

            res.on("end", () => {
                resolve(chunks);
            });
        });
    });
};

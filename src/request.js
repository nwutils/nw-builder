import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import process from "node:process";
import { URL } from "node:url";

/**
 * Download from `url` and save at `filePath`.
 * @param {string} url
 * @param {string} filePath
 * @returns {Promise<void>}
 */
export default function request(url, filePath) {
  const parsedUrl = new URL(url);
  const client = parsedUrl.protocol === "https:" ? https : http;

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);

    /* Handle writeStream errors immediately */
    writeStream.on("error", (err) => {
      cleanup();
      reject(err);
    });

    /* Ctrl+C cleanup */
    const onSigInt = () => {
      writeStream.destroy();
      /*
       * Unlink unconditionally and swallow ENOENT: checking with existsSync
       * first is a check-then-act race (CWE-367) - the file can vanish between
       * the two calls, and on SIGINT there is no useful recovery either way.
       */
      try {
        fs.unlinkSync(filePath);
      } catch {
        /* Nothing to clean up. */
      }
      process.exit();
    };
    process.once("SIGINT", onSigInt);

    const req = client.get(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
          "User-Agent": "node:http(s)",
        },
      },
      (res) => {
        /* Redirect handling */
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          cleanup();

          const redirectedUrl = new URL(
            res.headers.location,
            parsedUrl,
          ).toString();
          return resolve(request(redirectedUrl, filePath));
        }

        if (res.statusCode !== 200) {
          cleanup();
          return reject(
            new Error(`Request failed. Status code: ${res.statusCode}`),
          );
        }

        res.pipe(writeStream);

        writeStream.on("finish", () => {
          cleanup();
          resolve();
        });

        res.on("error", (err) => {
          cleanup();
          reject(err);
        });
      },
    );

    req.on("error", (err) => {
      cleanup();
      reject(err);
    });

    function cleanup() {
      process.removeListener("SIGINT", onSigInt);
      req.destroy();
      writeStream.destroy();
    }
  });
}

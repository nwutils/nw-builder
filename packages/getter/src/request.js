import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import process from "node:process";
import { URL } from "node:url";

/**
 * Maximum number of HTTP redirects to follow before giving up.
 * @type {number}
 */
const MAX_REDIRECTS = 5;

/**
 * Download from `url` and save at `filePath`.
 * @param {string} url
 * @param {string} filePath
 * @param {number} [redirectCount] - Number of redirects already followed. Used internally for recursive calls.
 * @returns {Promise<void>}
 */
export default function request(url, filePath, redirectCount = 0) {
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

          if (redirectCount >= MAX_REDIRECTS) {
            return reject(
              new Error(
                `Too many redirects (> ${MAX_REDIRECTS}) while requesting ${url}`,
              ),
            );
          }

          const redirectedUrl = new URL(res.headers.location, parsedUrl);

          /*
           * A redirect response can be injected by a network attacker even
           * when the original request can't be, so refuse one that would
           * silently strip transport security from the rest of the chain.
           */
          if (
            parsedUrl.protocol === "https:" &&
            redirectedUrl.protocol === "http:"
          ) {
            return reject(
              new Error(
                `Refusing to follow redirect from ${url} to ${redirectedUrl.toString()}: downgrades from https to http.`,
              ),
            );
          }

          return resolve(
            request(redirectedUrl.toString(), filePath, redirectCount + 1),
          );
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

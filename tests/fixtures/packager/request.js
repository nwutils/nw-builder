import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const filePath = path.join(import.meta.dirname, "request_test.txt"); // ensure this file exists

const server = http.createServer((req, res) => {
  if (req.url === "/request_test.txt") {
    fs.createReadStream(filePath)
      .on("open", () => {
        res.writeHead(200, { "Content-Type": "text/plain" });
      })
      .on("error", () => {
        res.writeHead(500);
        res.end("Could not read file");
      })
      .pipe(res);
  } else if (req.url === "/redirect") {
    res.writeHead(301, { Location: "http://localhost:8090/request_test.txt" });
    res.end();
  } else if (req.url === "/redirect-loop") {
    res.writeHead(301, { Location: "http://localhost:8090/redirect-loop" });
    res.end();
  } else if (req.url === "/error") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("some data");
    res.destroy(new Error("Simulated response error"));
  } else if (req.url?.startsWith("/good/appimagetool-")) {
    // ELF magic bytes followed by filler, standing in for a real appimagetool binary.
    res.writeHead(200, { "Content-Type": "application/octet-stream" });
    res.end(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 0x00, 0x00, 0x00, 0x00]));
  } else if (req.url?.startsWith("/bad/appimagetool-")) {
    // eg. a GitHub 404 page served with a 200 status by a misconfigured mirror.
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<html>not found</html>");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

export default server;

import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const filePath = path.resolve("./tests/fixtures/request_test.txt"); // ensure this file exists

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
    res.writeHead(301, { Location: "http://localhost:8080/request_test.txt" });
    res.end();
  } else if (req.url === "/redirect-loop") {
    res.writeHead(301, { Location: "http://localhost:8080/redirect-loop" });
    res.end();
  } else if (req.url === "/error") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("some data");
    res.destroy(new Error("Simulated response error"));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

export default server;

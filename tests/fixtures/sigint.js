import fs from "node:fs";
import path from "node:path";

import request from "../../src/request.js";

const filePath = path.resolve("./tests/fixtures/cache/partial.txt");
fs.mkdirSync(path.dirname(filePath), { recursive: true });
request("http://localhost:8080/test.txt", filePath, () => {});

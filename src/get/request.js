import fs from 'node:fs';
import process from 'node:process';
import stream from 'node:stream';

import axios from 'axios';

/**
 * Download from `url`.
 * @async
 * @function
 * @param  {string}        url       - Download server
 * @param  {string}        filePath  - file path of downloaded content
 * @returns {Promise<void>}
 */
export default async function request(url, filePath) {

  const writeStream = fs.createWriteStream(filePath);

  /* Listen for SIGINT (Ctrl+C) */
  process.on('SIGINT', function () {
    /* Delete file if it exists. This prevents unnecessary `Central Directory not found` errors. */
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    process.exit();
  });

  const response = await axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  });

  await stream.promises.pipeline(response.data, writeStream);

}

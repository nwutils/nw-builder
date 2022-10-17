import fs from "node:fs";
import archiver from "archiver";

/**
 *
 * @param outDir
 * @param type
 */
const compress = (outDir, type="zip") => {
  const output = fs.createWriteStream(`${outDir}.${type}`);
  const archive = archiver("zip");

  return new Promise((res, rej) => {
    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', function() {
    console.log('Data has been drained');
    res(0);
  });

  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
      console.log(err);
    } else {
      // throw error
      console.log(err);
      rej(1);
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', function(err) {
    console.log(err);
    rej(1);
  });

  archive.pipe(output);

  archive.directory(outDir, false);

  archive.finalize();

  });

};

export { compress };
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message }) => {
  return `[ ${level.toUpperCase()} ] ${message}`;
});

export let log = createLogger({
  format: combine(timestamp(), customFormat),
  transports: [
    new transports.Console({
      level: "info",
    }),
  ],
});

/**
 * Sets the log level
 *
 * @param {import("./index.js").Options.logLevel} level  Log level
 */
export function setLogLevel(level) {
  log = createLogger({
    format: combine(timestamp(), customFormat),
    transports: [
      new transports.Console({
        level: level,
      }),
    ],
  });
}

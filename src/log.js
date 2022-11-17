import { cwd } from "node:process";
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `[ ${level.toUpperCase()} ] ${timestamp} ${message}`;
});

export const log = createLogger({
  format: combine(timestamp(), customFormat),
  transports: [
    new transports.File({
      filename: `${cwd()}/nwbuild.log`,
      level: "silly",
    }),
    new transports.Console({
      level: "silly",
    }),
  ],
});

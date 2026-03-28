const { createLogger, format, transports } = require("winston");
const env = require("../config/env");

module.exports = createLogger({
  level: env.NODE_ENV === "production" ? "warn" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    env.NODE_ENV === "production"
      ? format.json()
      : format.printf(({ timestamp, level, message, ...meta }) => {
          const extras = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          return `${timestamp} [${level.toUpperCase()}] ${message}${extras}`;
        })
  ),
  transports: [
    new transports.Console(),
    ...(env.NODE_ENV === "production"
      ? [new transports.File({ filename: "logs/error.log", level: "error" }),
         new transports.File({ filename: "logs/combined.log" })]
      : []),
  ],
});

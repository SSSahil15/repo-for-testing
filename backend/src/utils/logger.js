const winston = require("winston");

const { combine, timestamp, json, errors } = winston.format;

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    errors({ stack: true }), // Automatically includes stack traces
    timestamp(),
    json()
  ),
  defaultMeta: { service: "devpulse-backend" },
  transports: [
    new winston.transports.Console()
  ],
});

module.exports = logger;

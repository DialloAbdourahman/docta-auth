// src/utils/logger.ts
import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

const logDir = path.join(process.cwd(), "logs");

// ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const transport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "14d",
});

export const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    transport,
    new winston.transports.Console({ format: winston.format.simple() }), // optional
  ],
});

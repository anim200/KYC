import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// 1. Transport for Errors (Saved for 30 days)
const errorFileRotateTransport = new DailyRotateFile({
  filename: path.join("logs", "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "error", // Only logs error level and below
  maxSize: "20m",
  maxFiles: "30d",
});

// 2. Transport for All Logs (Info, Warn, Error) (Saved for 14 days)
const combinedFileRotateTransport = new DailyRotateFile({
  filename: path.join("logs", "combined-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [errorFileRotateTransport, combinedFileRotateTransport],
});

// 3. If we are NOT in production, also log to the console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      // Silent logs during testing to keep output clean
      silent: process.env.NODE_ENV === "test",
    })
  );
}

export default logger;
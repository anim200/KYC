import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log the request details
  logger.info(`Incoming ${req.method} request to ${req.originalUrl}`);

  // Listen for the response to finish to log the status code
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      logger.error(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
    } else {
      logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
    }
  });

  next();
};

export default requestLogger;
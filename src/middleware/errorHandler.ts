import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";
import { EnumStatusCode } from "../enums/status-codes";
import { logger } from "../utils/winston";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json(err.serializeErrors());
    return;
  }

  // Log the error with stack trace and request info
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    body: req.body,
  });

  console.error(err);
  res.status(500).json({
    code: EnumStatusCode.SOMETHING_WENT_WRONG,
    message: "Internal Server Error",
  });
};

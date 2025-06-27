import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";
import { EnumStatusCode } from "../enums/status-codes";

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

  console.error(err);
  res.status(500).json({
    code: EnumStatusCode.SOMETHING_WENT_WRONG,
    message: "Internal Server Error",
  });
};

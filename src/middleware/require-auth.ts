import { Request, Response, NextFunction } from "express";
import { EnumStatusCode } from "../enums/status-codes";
import { UnAuthorizedError } from "../errors/UnAuthorizedError";
import { TokenUtils } from "../utils/token-utils";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new UnAuthorizedError(
      EnumStatusCode.NO_ACCESS_TOKEN,
      "No access token"
    );
  }

  try {
    const decoded = TokenUtils.verifyAccessToken(accessToken);

    if (!decoded) {
      throw new UnAuthorizedError(
        EnumStatusCode.CANNOT_DECODE_ACCESS_TOKEN,
        "Cannot decode access token"
      );
    }

    req.currentUser = decoded;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new UnAuthorizedError(
        EnumStatusCode.ACCESS_TOKEN_EXPIRED,
        "Access token has expired."
      );
    } else {
      throw new UnAuthorizedError(
        EnumStatusCode.CANNOT_DECODE_ACCESS_TOKEN,
        "Cannot decode access token"
      );
    }
  }
};

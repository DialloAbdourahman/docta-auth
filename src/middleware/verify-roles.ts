import { Request, Response, NextFunction } from "express";
import { EnumUserRole } from "../enums/user-role";
import { UnAuthorizedError } from "../errors/UnAuthorizedError";
import { EnumStatusCode } from "../enums/status-codes";

export const verifyRoles = (roles: EnumUserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (roles.includes(req.currentUser?.role)) {
      next();
    } else {
      throw new UnAuthorizedError(
        EnumStatusCode.NOT_ALLOWED,
        "You are not allowed to perform this action."
      );
    }
  };
};

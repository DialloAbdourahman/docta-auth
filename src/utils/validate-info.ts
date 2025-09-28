import { EnumStatusCode } from "../enums/status-codes";
import { NotFoundError } from "../errors/NotFoundError";
import { UnAuthorizedError } from "../errors/UnAuthorizedError";
import { IUserDocument } from "../models/user";

export class ValidateInfo {
  static validateUser(user: IUserDocument): void {
    if (!user) {
      throw new NotFoundError(EnumStatusCode.NOT_FOUND, "User not found");
    }

    if (user.isDeleted) {
      throw new UnAuthorizedError(
        EnumStatusCode.ACCOUNT_DELETED,
        "Your account has been deleted"
      );
    }

    if (!user.isActive) {
      throw new UnAuthorizedError(
        EnumStatusCode.ACCOUNT_DEACTIVATED,
        "Account is deactivated"
      );
    }
  }
}

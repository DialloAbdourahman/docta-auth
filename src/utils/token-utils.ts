import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { LoggedInUserTokenData } from "../interfaces/LoggedInUserToken";

export class TokenUtils {
  static createActivationToken(userId: string): string {
    return jwt.sign({ userId }, config.activationTokenSecret);
  }
  static decodeActivationToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, config.activationTokenSecret) as
        | JwtPayload
        | string;
      if (typeof decoded === "string") {
        return null;
      }
      return typeof decoded.userId === "string" ? decoded.userId : null;
    } catch {
      return null;
    }
  }

  static createAccessToken(payload: LoggedInUserTokenData): string {
    return jwt.sign(payload, config.accessTokenSecret, {
      expiresIn: config.accessTokenExpiry,
    });
  }

  static createRefreshToken(payload: LoggedInUserTokenData): string {
    return jwt.sign(payload, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenExpiry,
    });
  }
}

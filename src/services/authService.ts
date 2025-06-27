import { EnumStatusCode } from "../enums/status-codes";
import { BadRequestError } from "../errors/BadRequestError";

export class AuthService {
  public static async createUser(userData: any): Promise<any> {
    // if (true) {
    //   throw new BadRequestError(
    //     EnumStatusCode.UNAUTHORIZED,
    //     "User creation failed"
    //   );
    // }

    return { message: "User created successfully", user: userData };
  }
}

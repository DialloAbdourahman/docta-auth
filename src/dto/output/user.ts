import { IUserDocument } from "../../models/user";

/**
 * PatientOutputDto defines the safe subset of user fields that will be
 * exposed via API responses.  It intentionally omits sensitive data like
 * the password or any internal tokens.
 */
export class UserOutputDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(user: IUserDocument, isAdmin: boolean = false) {
    this.id = user.id.toString();
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.isActive = user.isActive;

    this.createdAt = isAdmin ? user.createdAt : undefined;
    this.updatedAt = isAdmin ? user.updatedAt : undefined;
  }
}

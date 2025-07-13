import { IUserDocument } from "../../models/user";
export class UserOutputDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(user: IUserDocument, isAdmin: boolean = false) {
    this.id = user.id.toString();
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;

    this.isActive = isAdmin ? user.isActive : undefined;
    this.isDeleted = isAdmin ? user.isDeleted : undefined;
    this.createdAt = isAdmin ? user.createdAt : undefined;
    this.updatedAt = isAdmin ? user.updatedAt : undefined;
  }
}

export class LoggedInUserOutputDto {
  user: UserOutputDto;
  accessToken: string;
  refreshToken: string;

  constructor(user: UserOutputDto, accessToken: string, refreshToken: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

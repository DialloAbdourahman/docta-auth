import { IUserDocument } from "../../models/user";
export class UserOutputDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;

  constructor(user: IUserDocument, isAdmin: boolean = false) {
    this.id = user.id.toString();
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;

    this.isActive = user.isActive;
    this.isDeleted = user.isDeleted;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
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

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

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(user: IUserDocument, isAdmin: boolean = false) {
    this.id = user.id.toString();
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;

    this.isActive = user.isActive;
    this.isDeleted = user.isDeleted;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;

    this.createdBy = isAdmin ? user.createdBy?.name : undefined;
    this.updatedBy = isAdmin ? user.updatedBy?.name : undefined;
    this.deletedBy = isAdmin ? user.deletedBy?.name : undefined;
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

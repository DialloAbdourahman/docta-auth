import { IUserDocument } from "../../models/user";

// Base DTO for everyone
export class UserOutputDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;

  constructor(user: IUserDocument) {
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

// Extended DTO for admin responses
export class UserAdminOutputDto extends UserOutputDto {
  createdBy: UserOutputDto | null;
  updatedBy: UserOutputDto | null;
  deletedBy: UserOutputDto | null;

  constructor(user: IUserDocument) {
    super(user); // call base constructor

    this.createdBy = user.createdBy ? new UserOutputDto(user.createdBy) : null;
    this.updatedBy = user.updatedBy ? new UserOutputDto(user.updatedBy) : null;
    this.deletedBy = user.deletedBy ? new UserOutputDto(user.deletedBy) : null;
  }
}

// DTO for logged-in user responses
export class LoggedInUserOutputDto {
  user: UserOutputDto | UserAdminOutputDto;
  accessToken: string;
  refreshToken: string;

  constructor(
    user: UserOutputDto | UserAdminOutputDto,
    accessToken: string,
    refreshToken: string
  ) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

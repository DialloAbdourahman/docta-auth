import { ISpecialtyDocument } from "../../models/specialty";
import { UserOutputDto } from "./user";

// Base DTO for everyone
export class SpecialtyOutputDto {
  id: string;
  name: string;
  description: string | null;

  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;

  constructor(specialty: ISpecialtyDocument) {
    this.id = specialty.id.toString();
    this.name = specialty.name;
    this.description = specialty.description || null;
    this.isDeleted = specialty.isDeleted;
    this.createdAt = specialty.createdAt;
    this.updatedAt = specialty.updatedAt;
  }
}

// Extended DTO for admin responses
export class SpecialtyAdminOutputDto extends SpecialtyOutputDto {
  createdBy: UserOutputDto | null;
  updatedBy: UserOutputDto | null;
  deletedBy: UserOutputDto | null;

  constructor(specialty: ISpecialtyDocument) {
    super(specialty); // call base constructor

    this.createdBy = specialty.createdBy
      ? new UserOutputDto(specialty.createdBy)
      : null;

    this.updatedBy = specialty.updatedBy
      ? new UserOutputDto(specialty.updatedBy)
      : null;

    this.deletedBy = specialty.deletedBy
      ? new UserOutputDto(specialty.deletedBy)
      : null;
  }
}

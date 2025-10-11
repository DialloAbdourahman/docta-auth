import { ISpecialtyDocument } from "../../models/specialty";
import { UserOutputDto } from "./user";

// Base DTO for everyone
export class SpecialtyOutputDto {
  id: string;
  en: { name: string; description: string | null };
  fr: { name: string; description: string | null } | null;

  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;

  constructor(specialty: ISpecialtyDocument) {
    this.id = specialty.id.toString();
    this.en = {
      name: specialty.en.name,
      description: specialty.en.description || null,
    };
    this.fr = specialty.fr
      ? {
          name: specialty.fr.name,
          description: specialty.fr.description || null,
        }
      : null;
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

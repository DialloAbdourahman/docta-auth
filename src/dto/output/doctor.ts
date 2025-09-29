import { IDoctorDocument } from "../../models/doctor";
import { UserOutputDto } from "./user";

export class DoctorOutputDto {
  id: string;
  user: UserOutputDto;
  specialty: string;
  name: string;
  biography?: string;
  slug: string;
  isActive?: boolean;
  consultationFee?: number;
  isVerified: boolean;
  isVisible: boolean;
  photo?: string;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
  isDeactivatedByAdmin?: boolean;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(doctor: IDoctorDocument, isAdmin: boolean = false) {
    this.id = doctor.id.toString();
    this.user = new UserOutputDto(doctor.user, isAdmin);
    this.name = doctor.name;
    this.specialty = doctor.specialty.name;
    this.isActive = doctor.isActive;
    this.isVerified = doctor.isVerified;
    this.isVisible = doctor.isVisible;
    this.isDeactivatedByAdmin = doctor.isDeactivatedByAdmin;
    this.photo = doctor.photo;
    this.isDeleted = doctor.isDeleted;
    this.createdAt = doctor.createdAt;
    this.updatedAt = doctor.updatedAt;
    this.consultationFee = doctor.consultationFee;

    this.createdBy = isAdmin ? doctor.createdBy?.name : undefined;
    this.updatedBy = isAdmin ? doctor.updatedBy?.name : undefined;
    this.deletedBy = isAdmin ? doctor.deletedBy?.name : undefined;
  }
}

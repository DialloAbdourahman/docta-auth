import { Gender } from "../../models/patient";
import { IPatientDocument } from "../../models/patient";
import { SpecialtyOutputDto } from "./specialty";
import { UserOutputDto } from "./user";

// Base DTO for everyone
export class PatientOutputDto {
  id: string;
  user: UserOutputDto;
  dob: number | null;
  phoneNumber: string | null;
  gender: Gender | null;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;

  constructor(patient: IPatientDocument) {
    this.id = patient.id.toString();
    this.user = new UserOutputDto(patient.user);
    this.dob = patient.dob || null;
    this.phoneNumber = patient.phoneNumber || null;
    this.gender = patient.gender || null;
    this.isDeleted = patient.isDeleted;
    this.createdAt = patient.createdAt;
    this.updatedAt = patient.updatedAt;
  }
}

// Extended DTO for admin responses
export class PatientAdminOutputDto extends PatientOutputDto {
  createdBy: UserOutputDto | null;
  updatedBy: UserOutputDto | null;
  deletedBy: UserOutputDto | null;

  constructor(patient: IPatientDocument) {
    super(patient); // call base constructor

    this.createdBy = patient.createdBy
      ? new UserOutputDto(patient.createdBy)
      : null;

    this.updatedBy = patient.updatedBy
      ? new UserOutputDto(patient.updatedBy)
      : null;

    this.deletedBy = patient.deletedBy
      ? new UserOutputDto(patient.deletedBy)
      : null;
  }
}

import { IDoctorDocument } from "../../models/doctor";
import { SpecialtyOutputDto } from "./specialty";
import { UserOutputDto } from "./user";
import { EducationOutputDto } from "./education";
import { PositionOutputDto } from "./position";
import { LanguageOutputDto } from "./language";

// Base DTO for everyone
export class DoctorOutputDto {
  id: string;
  user: UserOutputDto;
  specialty: SpecialtyOutputDto;
  name: string;
  biography: string | null;
  slug: string;
  isActive: boolean;
  consultationFee: number | null;
  isVerified: boolean;
  isVisible: boolean;
  photo: string | null;
  educations: EducationOutputDto[];
  positions: PositionOutputDto[];
  languages: LanguageOutputDto[];

  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;

  constructor(doctor: IDoctorDocument) {
    this.id = doctor.id.toString();
    this.user = new UserOutputDto(doctor.user);
    this.name = doctor.name;
    this.specialty = new SpecialtyOutputDto(doctor.specialty);
    this.slug = doctor.slug;
    this.biography = doctor.biography || null;
    this.isActive = doctor.isActive;
    this.consultationFee = doctor.consultationFee ?? null;
    this.isVerified = doctor.isVerified;
    this.isVisible = doctor.isVisible;
    this.photo = doctor.photo || null;
    this.educations = (doctor.educations || [])
      .map((e) => new EducationOutputDto(e))
      .sort((a, b) => b.year - a.year);
    this.positions = (doctor.positions || [])
      .map((p) => new PositionOutputDto(p))
      .sort((a, b) => b.startDate - a.startDate);
    this.languages = (doctor.languages || []).map(
      (l) => new LanguageOutputDto(l)
    );
    this.isDeleted = doctor.isDeleted;
    this.createdAt = doctor.createdAt;
    this.updatedAt = doctor.updatedAt;
  }
}

// Extended DTO for admin responses
export class DoctorAdminOutputDto extends DoctorOutputDto {
  isDeactivatedByAdmin: boolean | null;
  createdBy: UserOutputDto | null;
  updatedBy: UserOutputDto | null;
  deletedBy: UserOutputDto | null;

  constructor(doctor: IDoctorDocument) {
    super(doctor); // call base constructor

    this.isDeactivatedByAdmin = doctor.isDeactivatedByAdmin ?? null;

    this.createdBy = doctor.createdBy
      ? new UserOutputDto(doctor.createdBy)
      : null;

    this.updatedBy = doctor.updatedBy
      ? new UserOutputDto(doctor.updatedBy)
      : null;

    this.deletedBy = doctor.deletedBy
      ? new UserOutputDto(doctor.deletedBy)
      : null;
  }
}

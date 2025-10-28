import {
  EnumStatusCode,
  ExpertiseModel,
  IExpertiseDocument,
  ValidateInfo,
} from "docta-package";
import { NotFoundError } from "docta-package";
import { IUserDocument, UserModel } from "docta-package";
import { IDoctorDocument, DoctorModel } from "docta-package";
import { UpdateDoctorDto } from "docta-package";
import { DoctorOutputDto } from "docta-package";
import { AwsS3Helper } from "docta-package";
import path from "path";

export class DoctorService {
  public updateMyDoctorInfo = async (
    userId: string,
    dto: UpdateDoctorDto
  ): Promise<DoctorOutputDto> => {
    // Find and validate user
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;

    // Find doctor's profile for this user
    const doctor: IDoctorDocument | null = (await DoctorModel.findOne({
      user: user._id,
    })
      .populate("user")
      .populate("specialty")
      .populate("expertises")) as IDoctorDocument;

    if (!doctor) {
      throw new NotFoundError(
        EnumStatusCode.DOCTOR_NOT_FOUND,
        "Doctor profile not found"
      );
    }

    // Update only provided fields
    doctor.name = dto.name ?? doctor.name;
    doctor.biography = dto.biography ?? doctor.biography;
    doctor.consultationFeePerHour =
      dto.consultationFeePerHour ?? doctor.consultationFeePerHour;
    doctor.isVisible = dto.isVisible ?? doctor.isVisible;
    doctor.educations = dto.educations ?? doctor.educations;
    doctor.positions = dto.positions ?? doctor.positions;
    doctor.languages = dto.languages ?? doctor.languages;
    doctor.faqs = dto.faqs ?? doctor.faqs;

    if (dto.expertises) {
      const expertises = [] as IExpertiseDocument[];
      for (const expertise of dto.expertises) {
        const expertiseDoc = await ExpertiseModel.findById(expertise);
        if (expertiseDoc) {
          expertises.push(expertiseDoc);
        } else {
          throw new NotFoundError(
            EnumStatusCode.EXPERTISE_NOT_FOUND,
            "Expertise not found"
          );
        }
      }
      doctor.expertises = expertises;
    }
    doctor.location = dto.location ?? doctor.location;

    // Audit
    doctor.updatedBy = user;

    await doctor.populate("expertises");
    await doctor.save();
    return new DoctorOutputDto(doctor);
  };

  public getMyDoctor = async (userId: string): Promise<DoctorOutputDto> => {
    // Find and validate user
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;

    // Find doctor's profile for this user
    const doctor: IDoctorDocument | null = (await DoctorModel.findOne({
      user: user._id,
    })
      .populate("user")
      .populate("specialty")
      .populate("expertises")) as IDoctorDocument;

    ValidateInfo.validateDoctor(doctor);

    return new DoctorOutputDto(doctor);
  };

  public uploadMyPhoto = async (
    userId: string,
    file: Express.Multer.File
  ): Promise<DoctorOutputDto> => {
    // Find and validate user
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;

    const s3 = new AwsS3Helper();

    // Find doctor's profile for this user
    const doctor: IDoctorDocument | null = (await DoctorModel.findOne({
      user: user._id,
    })
      .populate("user")
      .populate("specialty")
      .populate("expertises")) as IDoctorDocument;

    if (!doctor) {
      throw new NotFoundError(
        EnumStatusCode.DOCTOR_NOT_FOUND,
        "Doctor profile not found"
      );
    }

    const oldPhoto = doctor.photo;

    const ext = path.extname(file.originalname) || "";
    const key = `doctors/${doctor._id}/profile-${Date.now()}${ext}`;
    await s3.uploadImage(key, file.mimetype, file.buffer);

    doctor.photo = key;
    doctor.updatedBy = user;
    await doctor.save();

    if (oldPhoto) {
      await s3.deleteImageFromS3(oldPhoto);
    }

    return new DoctorOutputDto(doctor);
  };
}

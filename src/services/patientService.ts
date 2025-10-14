import { EnumStatusCode } from "docta-package";
import { NotFoundError } from "docta-package";
import { IUserDocument, UserModel } from "docta-package";
import { IPatientDocument, PatientModel } from "docta-package";
import { UpdatePatientDto } from "docta-package";
import { PatientAdminOutputDto, PatientOutputDto } from "docta-package";

export class PatientService {
  public updateMyPatientInfo = async (
    userId: string,
    dto: UpdatePatientDto
  ): Promise<PatientOutputDto> => {
    // Find and validate user
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;

    // Find patient's profile for this user
    const patient: IPatientDocument | null = (await PatientModel.findOne({
      user: user._id,
    }).populate("user")) as IPatientDocument;
    if (!patient) {
      throw new NotFoundError(
        EnumStatusCode.NOT_FOUND,
        "Patient profile not found"
      );
    }

    // Update only provided fields
    patient.gender = dto.gender ?? patient.gender;
    patient.phoneNumber = dto.phoneNumber ?? patient.phoneNumber;
    patient.dob = dto.dob ?? patient.dob;

    // Audit
    patient.updatedBy = user;

    await patient.save();
    return new PatientOutputDto(patient);
  };

  public getMyPatient = async (
    userId: string
  ): Promise<PatientAdminOutputDto> => {
    // Find and validate user
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;

    // Find patient's profile for this user
    const patient: IPatientDocument | null = (await PatientModel.findOne({
      user: user._id,
    }).populate("user")) as IPatientDocument;

    if (!patient) {
      throw new NotFoundError(
        EnumStatusCode.NOT_FOUND,
        "Patient profile not found"
      );
    }

    return new PatientAdminOutputDto(patient);
  };
}

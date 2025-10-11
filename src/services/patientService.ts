import { EnumStatusCode } from "../enums/status-codes";
import { NotFoundError } from "../errors/NotFoundError";
import { IUserDocument, UserModel } from "../models/user";
import { IPatientDocument, PatientModel } from "../models/patient";
import { UpdatePatientDto } from "../dto/input/patient";
import { PatientOutputDto } from "../dto/output/patient";

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
}

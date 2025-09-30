import { EnumStatusCode } from "../enums/status-codes";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidateInfo } from "../utils/validate-info";
import { IUserDocument, UserModel } from "../models/user";
import { IDoctorDocument, DoctorModel } from "../models/doctor";
import { UpdateDoctorDto } from "../dto/input/doctor";
import { DoctorAdminOutputDto, DoctorOutputDto } from "../dto/output/doctor";

export class DoctorService {
  //   public createDoctorProfile = async (
  //     dto: CreateDoctorDto,
  //     admin: LoggedInUserTokenData
  //   ): Promise<{ user: IUserDocument; doctor: IDoctorDocument }> => {
  //     const existingUser = await UserModel.findOne({ email: dto.email });
  //     if (existingUser) {
  //       throw new BadRequestError(
  //         EnumStatusCode.EXISTS_ALREADY,
  //         "User already exists"
  //       );
  //     }
  //     const specialty = await SpecialtyModel.findById(dto.specialtyId);
  //     if (!specialty) {
  //       throw new NotFoundError(
  //         EnumStatusCode.SPECIALTY_NOT_FOUND,
  //         "Specialty not found"
  //       );
  //     }
  //     const session = await mongoose.startSession();
  //     session.startTransaction();
  //     try {
  //       // Create user WITHOUT password
  //       const user = new UserModel({
  //         name: dto.name,
  //         email: dto.email,
  //         role: EnumUserRole.DOCTOR,
  //         isActive: false,
  //         createdBy: admin.id,
  //       });
  //       await user.save({ session });
  //       const doctor = new DoctorModel({
  //         user: user._id,
  //         specialty: specialty._id,
  //         name: dto.name,
  //         biography: dto.biography,
  //         consultationFee: dto.consultationFee,
  //         isActive: user.isActive,
  //         isDeleted: user.isDeleted,
  //         createdBy: admin.id,
  //       });
  //       await doctor.save({ session });
  //       // Activation token
  //       const activationToken = TokenUtils.createActivationToken(
  //         String(user._id)
  //       );
  //       user.activationToken = activationToken;
  //       // Send email to doctor to activate his account and create a password.
  //       await user.save({ session });
  //       await session.commitTransaction();
  //       session.endSession();
  //       console.log("Doctor activation token:", activationToken);
  //       return { user, doctor };
  //     } catch (err) {
  //       await session.abortTransaction();
  //       session.endSession();
  //       console.error("Error creating doctor via admin:", err);
  //       throw new BadRequestError(
  //         EnumStatusCode.BAD_REQUEST,
  //         "Doctor creation failed"
  //       );
  //     }
  //   };

  public updateMyDoctorInfo = async (
    userId: string,
    dto: UpdateDoctorDto
  ): Promise<DoctorOutputDto> => {
    // Find and validate user
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;
    ValidateInfo.validateUser(user);

    // Find doctor's profile for this user
    const doctor: IDoctorDocument | null = (await DoctorModel.findOne({
      user: user._id,
    })
      .populate("user")
      .populate("specialty")) as IDoctorDocument;

    if (!doctor) {
      throw new NotFoundError(
        EnumStatusCode.DOCTOR_NOT_FOUND,
        "Doctor profile not found"
      );
    }

    // Update only provided fields
    doctor.name = dto.name ?? doctor.name;
    doctor.biography = dto.biography ?? doctor.biography;
    doctor.consultationFee = dto.consultationFee ?? doctor.consultationFee;
    doctor.isVisible = dto.isVisible ?? doctor.isVisible;

    // Audit
    doctor.updatedBy = user;

    await doctor.save();
    return new DoctorOutputDto(doctor);
  };

  public getMyDoctor = async (userId: string): Promise<DoctorOutputDto> => {
    // Find and validate user
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;
    ValidateInfo.validateUser(user);

    // Find doctor's profile for this user
    const doctor: IDoctorDocument | null = (await DoctorModel.findOne({
      user: user._id,
    })
      .populate("user")
      .populate("specialty")) as IDoctorDocument;

    if (!doctor) {
      throw new NotFoundError(
        EnumStatusCode.DOCTOR_NOT_FOUND,
        "Doctor profile not found"
      );
    }

    return new DoctorAdminOutputDto(doctor);
  };
}

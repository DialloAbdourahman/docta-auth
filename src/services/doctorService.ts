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
}

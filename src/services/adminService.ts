import mongoose from "mongoose";
import {
  DoctorCreatedEvent,
  Exchanges,
  IUserDocument,
  publishToTopicExchange,
  RoutingKey,
  UserModel,
} from "docta-package";
import { DoctorModel, IDoctorDocument } from "docta-package";
import { ISpecialtyDocument, SpecialtyModel } from "docta-package";
import { TokenUtils } from "docta-package";
import { BadRequestError } from "docta-package";
import { EnumStatusCode } from "docta-package";
import { CreateDoctorDto } from "docta-package";
import { NotFoundError } from "docta-package";
import { EnumUserRole } from "docta-package";
import { LoggedInUserTokenData } from "docta-package";
import { CreateSpecialtyDto, UpdateSpecialtyDto } from "docta-package";
import { SpecialtyAdminOutputDto, SpecialtyOutputDto } from "docta-package";

export class AdminService {
  public createDoctorProfile = async (
    dto: CreateDoctorDto,
    admin: LoggedInUserTokenData
  ): Promise<{ user: IUserDocument; doctor: IDoctorDocument }> => {
    const existingUser = await UserModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new BadRequestError(
        EnumStatusCode.EXISTS_ALREADY,
        "User already exists"
      );
    }

    const specialty = await SpecialtyModel.findById(dto.specialtyId);
    if (!specialty) {
      throw new NotFoundError(
        EnumStatusCode.SPECIALTY_NOT_FOUND,
        "Specialty not found"
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create user WITHOUT password
      const user = new UserModel({
        name: dto.fullname,
        email: dto.email,
        role: EnumUserRole.DOCTOR,
        isActive: false,
        timezone: dto.timezone,
        createdBy: admin.id,
      });
      await user.save({ session });

      const doctor = new DoctorModel({
        user: user._id,
        specialty: specialty._id,
        title: dto.title,
        professionalEmail: dto.professionalEmail,
        biography: dto.biography,
        consultationFeePerHour: dto.consultationFeePerHour,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
        createdBy: admin.id,
      });
      await doctor.save({ session });

      // Activation token
      const activationToken = TokenUtils.createActivationToken(
        String(user._id)
      );
      user.activationToken = activationToken;
      // Send email to doctor to activate his account and create a password.
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      console.log("Doctor activation token:", activationToken);
      publishToTopicExchange<DoctorCreatedEvent>({
        exchange: Exchanges.DOCTA_EXCHANGE,
        routingKey: RoutingKey.DOCTOR_CREATED,
        message: {
          id: user.id,
          email: user.email,
          fullName: user.name,
          token: activationToken,
        },
      });
      return { user, doctor };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error creating doctor via admin:", err);
      throw new BadRequestError(
        EnumStatusCode.BAD_REQUEST,
        "Doctor creation failed"
      );
    }
  };
}

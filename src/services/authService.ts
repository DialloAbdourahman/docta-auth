import { EnumStatusCode } from "../enums/status-codes";
import { BadRequestError } from "../errors/BadRequestError";
import mongoose from "mongoose";
import { IUserDocument, UserModel } from "../models/user";
import { IPatientDocument, PatientModel } from "../models/patient";
import { TokenUtils } from "../utils/token-utils";
import { EnumUserRole } from "../models/user";
import { CreatePatientDto } from "../dto/input/user";
import { NotFoundError } from "../errors/NotFoundError";
import { UnAuthorizedError } from "../errors/UnAuthorizedError";

export class AuthService {
  public createUserAndPatient = async (
    userData: CreatePatientDto
  ): Promise<{ user: IUserDocument; patient: IPatientDocument }> => {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new BadRequestError(
        EnumStatusCode.EXISTS_ALREADY,
        "User already exists"
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create user
      const user = new UserModel({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: EnumUserRole.PATIENT,
      });
      await user.save({ session });

      // Create patient
      const patient = new PatientModel({
        user: user._id,
      });
      await patient.save({ session });

      // Generate activation token
      const activationToken = TokenUtils.createActivationToken(
        String(user._id)
      );
      user.activationToken = activationToken;
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      // Send activation email to the user
      console.log("Activation token generated:", activationToken);
      return { user, patient };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error creating user and patient:", error);
      throw new BadRequestError(
        EnumStatusCode.BAD_REQUEST,
        "User creation failed"
      );
    }
  };

  public activateUser = async (token: string): Promise<IUserDocument> => {
    const userId = TokenUtils.decodeActivationToken(token);
    if (!userId) {
      throw new UnAuthorizedError(
        EnumStatusCode.UNAUTHORIZED,
        "Invalid or expired activation token"
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError(
        EnumStatusCode.NOT_FOUND,
        "User not found for this token"
      );
    }

    if (user.isActive) {
      return user; // already active, idempotent
    }

    user.isActive = true;
    user.activationToken = null;
    await user.save();

    return user;
  };
}

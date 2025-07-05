import { EnumStatusCode } from "../enums/status-codes";
import { BadRequestError } from "../errors/BadRequestError";
import mongoose from "mongoose";
import { IUserDocument, UserModel } from "../models/user";
import { IPatientDocument, PatientModel } from "../models/patient";
import { TokenUtils } from "../utils/token-utils";
import { EnumUserRole } from "../models/user";
import { CreatePatientDto } from "../dto/input/user";

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
}

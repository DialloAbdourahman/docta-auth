import { EnumStatusCode } from "../enums/status-codes";
import { BadRequestError } from "../errors/BadRequestError";
import mongoose from "mongoose";
import { IUserDocument, UserModel } from "../models/user";
import { IPatientDocument, PatientModel } from "../models/patient";
import { DoctorModel } from "../models/doctor";
import { TokenUtils } from "../utils/token-utils";
import { CreatePatientDto } from "../dto/input/patient";
import { NotFoundError } from "../errors/NotFoundError";
import { UnAuthorizedError } from "../errors/UnAuthorizedError";
import { LoggedInUserOutputDto, UserOutputDto } from "../dto/output/user";
import { LoggedInUserTokenData } from "../interfaces/LoggedInUserToken";
import { EnumUserRole } from "../enums/user-role";

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

  public activatePatientUser = async (
    token: string
  ): Promise<IUserDocument> => {
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

    if (user.role !== EnumUserRole.PATIENT) {
      throw new BadRequestError(
        EnumStatusCode.NOT_ALLOWED,
        "Only patients can use this route"
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

  public activateDoctorUser = async (
    token: string,
    password: string
  ): Promise<IUserDocument> => {
    const userId = TokenUtils.decodeActivationToken(token);
    if (!userId) {
      throw new UnAuthorizedError(
        EnumStatusCode.UNAUTHORIZED,
        "Invalid or expired activation token"
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Find and update the user
      const user = await UserModel.findById(userId).session(session);
      if (!user) {
        throw new NotFoundError(
          EnumStatusCode.NOT_FOUND,
          "User not found for this token"
        );
      }

      if (user.role !== EnumUserRole.DOCTOR) {
        throw new BadRequestError(
          EnumStatusCode.NOT_ALLOWED,
          "Only doctors can use this route"
        );
      }

      if (user.isActive) {
        await session.commitTransaction();
        session.endSession();
        return user; // already active, idempotent
      }

      // 2. Update the user with new password
      user.password = password;
      user.isActive = true;
      user.activationToken = null;
      await user.save({ session });

      // 3. Update the doctor record
      const doctor = await DoctorModel.findOne({ user: user._id }).session(
        session
      );

      if (!doctor) {
        throw new NotFoundError(
          EnumStatusCode.DOCTOR_NOT_FOUND,
          "Doctor record not found for this user"
        );
      }

      doctor.isActive = true;
      await doctor.save({ session });

      await session.commitTransaction();
      session.endSession();
      return user;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };

  public login = async (
    email: string,
    password: string
  ): Promise<LoggedInUserOutputDto> => {
    // 1. Find user by email
    console.log(email, password);
    const user: IUserDocument | null = await UserModel.findOne({ email });
    if (!user) {
      throw new UnAuthorizedError(
        EnumStatusCode.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    // 2. Check if account is active
    if (!user.isActive) {
      throw new UnAuthorizedError(
        EnumStatusCode.ACCOUNT_DEACTIVATED,
        "Please activate your account before logging in"
      );
    }

    // 2. Check if account is active
    if (user.isDeleted) {
      throw new UnAuthorizedError(
        EnumStatusCode.ACCOUNT_DELETED,
        "Your account has been deleted"
      );
    }

    // 4. Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnAuthorizedError(
        EnumStatusCode.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    // 5. Generate tokens and store refresh token in db.
    const tokenData: LoggedInUserTokenData = {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = TokenUtils.createAccessToken(tokenData);
    const refreshToken = TokenUtils.createRefreshToken(tokenData);

    user.token = refreshToken;

    // 6. Return user and tokens
    const userDto = new UserOutputDto(user);
    return new LoggedInUserOutputDto(userDto, accessToken, refreshToken);
  };
}

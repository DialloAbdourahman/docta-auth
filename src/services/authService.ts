import {
  EnumStatusCode,
  Exchanges,
  ForgotPasswordEvent,
  RoutingKey,
} from "docta-package";
import { BadRequestError } from "docta-package";
import mongoose from "mongoose";
import { IUserDocument, UserModel } from "docta-package";
import { IPatientDocument, PatientModel } from "docta-package";
import { DoctorModel } from "docta-package";
import { TokenUtils } from "docta-package";
import { CreateUserDto, UpdateUserDto } from "docta-package";
import { NotFoundError } from "docta-package";
import { UnAuthorizedError } from "docta-package";
import { LoggedInUserOutputDto, UserOutputDto } from "docta-package";
import { LoggedInUserTokenData } from "docta-package";
import { EnumUserRole } from "docta-package";
import { ValidateInfo } from "docta-package";
import { publishToTopicExchange, PatientCreatedEvent } from "docta-package";

export class AuthService {
  public createUserAndPatient = async (
    userData: CreateUserDto
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
        timezone: userData.timezone,
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
      publishToTopicExchange<PatientCreatedEvent>({
        exchange: Exchanges.DOCTA_EXCHANGE,
        routingKey: RoutingKey.PATIENT_CREATED,
        message: {
          id: user.id,
          email: user.email,
          fullName: user.name,
          token: activationToken,
        },
      });
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
    const userId = TokenUtils.verifyActivationToken(token);
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
    const userId = TokenUtils.verifyActivationToken(token);
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
    //  Find user by email
    const user: IUserDocument | null = (await UserModel.findOne({
      email,
    })) as IUserDocument;

    // Validate user information
    ValidateInfo.validateUser(user);

    //  Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnAuthorizedError(
        EnumStatusCode.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    //  Generate tokens and store refresh token in db.
    const tokenData: LoggedInUserTokenData = {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = TokenUtils.createAccessToken(tokenData);
    const refreshToken = TokenUtils.createRefreshToken(tokenData);

    user.token = refreshToken;
    await user.save();

    //  Return user and tokens
    const userDto = new UserOutputDto(user);
    return new LoggedInUserOutputDto(userDto, accessToken, refreshToken);
  };

  public refreshToken = async (
    refreshToken: string
  ): Promise<LoggedInUserOutputDto> => {
    // Verify the refresh token
    const tokenData = TokenUtils.verifyRefreshToken(refreshToken);
    if (!tokenData) {
      throw new UnAuthorizedError(
        EnumStatusCode.UNAUTHORIZED,
        "Invalid or expired refresh token"
      );
    }

    // Find user by ID from token
    const user: IUserDocument | null = (await UserModel.findById(
      tokenData.id
    )) as IUserDocument;

    // Validate user information
    ValidateInfo.validateUser(user);

    // Verify that the incoming token matches the token stored in the user
    if (user.token !== refreshToken) {
      throw new UnAuthorizedError(
        EnumStatusCode.UNAUTHORIZED,
        "Refresh token does not match stored token"
      );
    }

    // Generate new tokens (token rotation)
    const newTokenData: LoggedInUserTokenData = {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    };

    const newAccessToken = TokenUtils.createAccessToken(newTokenData);
    const newRefreshToken = TokenUtils.createRefreshToken(newTokenData);

    // Store new refresh token in database
    user.token = newRefreshToken;
    await user.save();

    // Return user and new tokens
    const userDto = new UserOutputDto(user);
    return new LoggedInUserOutputDto(userDto, newAccessToken, newRefreshToken);
  };

  public forgotPassword = async (email: string): Promise<void> => {
    // Find user by email
    const user: IUserDocument | null = (await UserModel.findOne({
      email,
    })) as IUserDocument;

    // Validate user information
    ValidateInfo.validateUser(user);

    // Generate forgot password token and save
    const token = TokenUtils.createForgotPasswordToken(user.id.toString());
    user.forgotPasswordToken = token;
    await user.save();

    // TODO: send token via email
    console.log("Forgot password token generated:", token);
    publishToTopicExchange<ForgotPasswordEvent>({
      exchange: Exchanges.DOCTA_EXCHANGE,
      routingKey: RoutingKey.FORGOT_PASSWORD,
      message: {
        id: user.id,
        email: user.email,
        fullName: user.name,
        token,
      },
    });
  };

  public resetPassword = async (
    token: string,
    password: string
  ): Promise<void> => {
    // 1. Decode forgot password token
    const userId = TokenUtils.verifyForgotPasswordToken(token);
    if (!userId) {
      throw new UnAuthorizedError(
        EnumStatusCode.UNAUTHORIZED,
        "Invalid or expired reset token"
      );
    }

    // 2. Find user by id
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;

    // Validate user information
    ValidateInfo.validateUser(user);

    // Ensure token matches the one stored in DB
    if (!user.forgotPasswordToken || user.forgotPasswordToken !== token) {
      throw new UnAuthorizedError(
        EnumStatusCode.UNAUTHORIZED,
        "Reset token does not match stored token"
      );
    }

    // Update password and clear forgot password token
    user.password = password;
    user.forgotPasswordToken = null;
    await user.save();
  };

  public updateUserInfo = async (
    userId: string,
    dto: UpdateUserDto
  ): Promise<UserOutputDto> => {
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;

    // Apply only provided fields
    user.name = dto.name || user.name;
    user.timezone = dto.timezone || user.timezone;
    user.updatedBy = user;

    await user.save();
    return new UserOutputDto(user);
  };

  public updatePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> => {
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new UnAuthorizedError(
        EnumStatusCode.UNAUTHORIZED,
        "Old password is incorrect"
      );
    }

    user.password = newPassword;
    user.updatedBy = user;
    await user.save();
  };

  public logout = async (userId: string): Promise<void> => {
    const user: IUserDocument | null = (await UserModel.findById(
      userId
    )) as IUserDocument;

    user.token = null;
    await user.save();
  };
}

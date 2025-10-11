import mongoose from "mongoose";
import { IUserDocument, UserModel } from "../models/user";
import { DoctorModel, IDoctorDocument } from "../models/doctor";
import { ISpecialtyDocument, SpecialtyModel } from "../models/specialty";
import { TokenUtils } from "../utils/token-utils";
import { BadRequestError } from "../errors/BadRequestError";
import { EnumStatusCode } from "../enums/status-codes";
import { CreateDoctorDto } from "../dto/input/doctor";
import { NotFoundError } from "../errors/NotFoundError";
import { EnumUserRole } from "../enums/user-role";
import { LoggedInUserTokenData } from "../interfaces/LoggedInUserToken";
import { CreateSpecialtyDto, UpdateSpecialtyDto } from "../dto/input/specialty";
import {
  SpecialtyAdminOutputDto,
  SpecialtyOutputDto,
} from "../dto/output/specialty";

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
        name: dto.name,
        email: dto.email,
        role: EnumUserRole.DOCTOR,
        isActive: false,
        createdBy: admin.id,
      });
      await user.save({ session });

      const doctor = new DoctorModel({
        user: user._id,
        specialty: specialty._id,
        name: dto.name,
        biography: dto.biography,
        consultationFee: dto.consultationFee,
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

  public createSpecialty = async (
    dto: CreateSpecialtyDto,
    admin: LoggedInUserTokenData
  ): Promise<SpecialtyOutputDto> => {
    const specialty = new SpecialtyModel({
      en: dto.en,
      fr: dto.fr ?? null,
      createdBy: admin.id,
    });
    await specialty.save();
    return new SpecialtyOutputDto(specialty as ISpecialtyDocument);
  };

  public updateSpecialty = async (
    id: string,
    dto: UpdateSpecialtyDto,
    admin: LoggedInUserTokenData
  ): Promise<SpecialtyOutputDto> => {
    const specialty = (await SpecialtyModel.findById(
      id
    )) as ISpecialtyDocument | null;
    if (!specialty) {
      throw new NotFoundError(
        EnumStatusCode.SPECIALTY_NOT_FOUND,
        "Specialty not found"
      );
    }

    // Update localized fields if provided
    if (dto.en) {
      specialty.en.name = dto.en.name ?? specialty.en.name;
      specialty.en.description = dto.en.description ?? specialty.en.description;
    }
    if (dto.fr) {
      if (!specialty.fr) specialty.fr = { name: "", description: null } as any;
      specialty.fr!.name = dto.fr.name ?? specialty.fr!.name;
      specialty.fr!.description =
        dto.fr.description ?? specialty.fr!.description;
    }

    specialty.updatedBy = admin.id as any;
    await specialty.save();
    return new SpecialtyOutputDto(specialty);
  };

  public deleteSpecialty = async (
    id: string,
    admin: LoggedInUserTokenData
  ): Promise<void> => {
    const specialty = (await SpecialtyModel.findById(
      id
    )) as ISpecialtyDocument | null;
    if (!specialty) {
      throw new NotFoundError(
        EnumStatusCode.SPECIALTY_NOT_FOUND,
        "Specialty not found"
      );
    }
    specialty.isDeleted = true;
    specialty.deletedAt = Date.now();
    specialty.deletedBy = admin.id as any;
    await specialty.save();
  };

  public listSpecialties = async (
    page: number,
    itemsPerPage: number
  ): Promise<{
    items: SpecialtyAdminOutputDto[];
    totalItems: number;
  }> => {
    const filter = { isDeleted: false };
    const skip = (page - 1) * itemsPerPage;
    const [docs, totalItems] = await Promise.all([
      SpecialtyModel.find(filter)
        .skip(skip)
        .limit(itemsPerPage)
        .populate("createdBy")
        .populate("updatedBy")
        .populate("deletedBy"),
      SpecialtyModel.countDocuments(filter),
    ]);
    const items = (docs as ISpecialtyDocument[]).map(
      (s) => new SpecialtyAdminOutputDto(s)
    );
    return { items, totalItems };
  };
}

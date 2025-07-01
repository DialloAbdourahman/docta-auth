import { Schema, model, Document, Model } from "mongoose";

export enum EnumUserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin",
}

export interface IUser {
  role: EnumUserRole;
  name: string;
  email: string;
  password: string;
  activationToken?: string | null;
  forgotPasswordToken?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {
  // toto(): void;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    activationToken: { type: String, default: null },
    forgotPasswordToken: { type: String, default: null },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(EnumUserRole),
      default: EnumUserRole.PATIENT,
    },
  },
  { timestamps: true }
);

// UserSchema.statics.toto = () => {};

export const UserModel = model<IUserDocument, IUserModel>("User", UserSchema);

// const tot = async (): Promise<IUserDocument[]> => {
//   const user: IUserDocument[] = await UserModel.find({});
//   return user;
// };

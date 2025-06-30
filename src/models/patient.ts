import { Schema, model, Document, Model } from "mongoose";
import { IUserDocument, UserModel } from "./user";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface IPatient {
  user: IUserDocument;
  birthday?: Date;
  gender?: Gender;
  phoneNumber?: string;
  isDeleted: boolean;
}

export interface IPatientDocument extends IPatient, Document {}

export interface IPatientModel extends Model<IPatientDocument> {}

const PatientSchema = new Schema<IPatientDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: UserModel.modelName,
      required: true,
      onDelete: "cascade",
    },
    birthday: { type: Date, required: false },
    phoneNumber: { type: String, required: false },
    gender: { type: String, enum: Object.values(Gender), required: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PatientModel = model<IPatientDocument, IPatientModel>(
  "Patient",
  PatientSchema
);

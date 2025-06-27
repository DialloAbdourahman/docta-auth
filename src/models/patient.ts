import { Schema, model, Document, Model } from "mongoose";
import { IUserDocument, UserModel } from "./user";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface IPatient {
  user: IUserDocument;
  birthday: Date;
  gender: Gender;
}

export interface IPatientDocument extends IPatient, Document {}

export interface IPatientModel extends Model<IPatientDocument> {}

const PatientSchema = new Schema<IPatientDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: UserModel.modelName,
      required: true,
    },
    birthday: { type: Date, required: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
  },
  { timestamps: true }
);

export const PatientModel = model<IPatientDocument, IPatientModel>(
  "Patient",
  PatientSchema
);

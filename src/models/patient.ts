import { Schema, model, Document, Model } from "mongoose";
import { IUserDocument, UserModel } from "./user";
import { BaseSchemaFields, BaseSchemaPlugin, IBaseModel } from "./base";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface IPatient extends IBaseModel {
  user: IUserDocument;
  dob?: number;
  gender?: Gender;
  phoneNumber?: string;
}

export interface IPatientDocument extends IPatient, Document {}

export interface IPatientModel extends Model<IPatientDocument> {}

const PatientSchema = new Schema<IPatientDocument>({
  ...BaseSchemaFields,
  user: {
    type: Schema.Types.ObjectId,
    ref: UserModel.modelName,
    required: true,
    onDelete: "cascade",
  },
  dob: { type: Number, required: false },
  phoneNumber: { type: String, required: false },
  gender: { type: String, enum: Object.values(Gender), required: false },
});

PatientSchema.plugin(BaseSchemaPlugin);

export const PatientModel = model<IPatientDocument, IPatientModel>(
  "Patient",
  PatientSchema
);

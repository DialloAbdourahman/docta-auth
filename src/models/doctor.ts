import { Schema, model, Document, Model } from "mongoose";
import { ISpecialtyDocument, SpecialtyModel } from "./specialty";
import { IUserDocument, UserModel } from "./user";

export interface IDoctor {
  user: IUserDocument;
  specialty: ISpecialtyDocument;
  biography: string;
  consultation_fee: number;
  is_verified: boolean;
}

export interface IDoctorDocument extends IDoctor, Document {}

export interface IDoctorModel extends Model<IDoctorDocument> {}

const DoctorSchema = new Schema<IDoctorDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    specialty: {
      type: Schema.Types.ObjectId,
      ref: SpecialtyModel,
      required: true,
    },
    biography: { type: String, required: false },
    consultation_fee: { type: Number, required: false },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DoctorModel = model<IDoctorDocument, IDoctorModel>(
  "Doctor",
  DoctorSchema
);

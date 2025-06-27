import { Schema, model, Document, Model } from "mongoose";

export interface ISpecialty {
  name: string;
  description?: string;
}

export interface ISpecialtyDocument extends ISpecialty, Document {}

export interface ISpecialtyModel extends Model<ISpecialtyDocument> {}

const SpecialtySchema = new Schema<ISpecialtyDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

export const SpecialtyModel = model<ISpecialtyDocument, ISpecialtyModel>(
  "Specialty",
  SpecialtySchema
);

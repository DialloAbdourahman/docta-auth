import { Schema, model, Document, Model } from "mongoose";
import { BaseSchemaFields, BaseSchemaPlugin, IBaseModel } from "./base";

export interface ISpecialty extends IBaseModel {
  name: string;
  description?: string;
}

export interface ISpecialtyDocument extends ISpecialty, Document {}

export interface ISpecialtyModel extends Model<ISpecialtyDocument> {}

const SpecialtySchema = new Schema<ISpecialtyDocument>({
  ...BaseSchemaFields,
  name: { type: String, required: true },
  description: { type: String, default: null },
});

SpecialtySchema.plugin(BaseSchemaPlugin);

export const SpecialtyModel = model<ISpecialtyDocument, ISpecialtyModel>(
  "Specialty",
  SpecialtySchema
);

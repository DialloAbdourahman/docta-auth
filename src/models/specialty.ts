import { Schema, model, Document, Model } from "mongoose";
import { BaseSchemaFields, BaseSchemaPlugin, IBaseModel } from "./base";

export interface ILocalizedSpecialtyFields {
  name: string;
  description?: string | null;
}

export interface ISpecialty extends IBaseModel {
  en: ILocalizedSpecialtyFields;
  fr?: ILocalizedSpecialtyFields;
}

export interface ISpecialtyDocument extends ISpecialty, Document {}

export interface ISpecialtyModel extends Model<ISpecialtyDocument> {}

const LocalizedFieldsSchema = new Schema<ILocalizedSpecialtyFields>(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
  },
  { _id: false }
);

const SpecialtySchema = new Schema<ISpecialtyDocument>({
  ...BaseSchemaFields,
  en: { type: LocalizedFieldsSchema, required: true },
  fr: { type: LocalizedFieldsSchema, required: false, default: null },
});

SpecialtySchema.plugin(BaseSchemaPlugin);

export const SpecialtyModel = model<ISpecialtyDocument, ISpecialtyModel>(
  "Specialty",
  SpecialtySchema
);

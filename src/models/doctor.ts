import { Schema, model, Document, Model } from "mongoose";
import { ISpecialtyDocument, SpecialtyModel } from "./specialty";
import { IUserDocument, UserModel } from "./user";
import { BaseSchemaFields, BaseSchemaPlugin, IBaseModel } from "./base";
import { EducationSchema, IEducation } from "./education";
import { PositionSchema, IPosition } from "./position";
import { LanguageSchema, ILanguage } from "./language";
import { FaqSchema, IFaq } from "./faq";
import { LocationSchema, ILocation } from "./location";

export interface IDoctor extends IBaseModel {
  name: string;
  slug: string;
  isActive: boolean;
  user: IUserDocument;
  specialty: ISpecialtyDocument;
  biography: string;
  consultationFee: number;
  isVerified: boolean;
  isVisible: boolean;
  isDeactivatedByAdmin: boolean;
  photo?: string;
  educations: IEducation[];
  positions: IPosition[];
  languages: ILanguage[];
  faqs: IFaq[];
  expertises: string[];
  location?: ILocation;
}

export interface IDoctorDocument extends IDoctor, Document {}

export interface IDoctorModel extends Model<IDoctorDocument> {}

const DoctorSchema = new Schema<IDoctorDocument>({
  ...BaseSchemaFields,
  user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    onDelete: "cascade",
  },
  specialty: {
    type: Schema.Types.ObjectId,
    ref: SpecialtyModel,
    required: true,
  },
  name: { type: String, required: true, trim: true },
  biography: { type: String, required: false },
  slug: { type: String, required: true, unique: true, trim: true },
  isActive: { type: Boolean, default: false },
  consultationFee: { type: Number, required: false },
  isVerified: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  isDeactivatedByAdmin: { type: Boolean, default: false },
  photo: { type: String, required: false },
  educations: { type: [EducationSchema], required: true, default: [] },
  positions: { type: [PositionSchema], required: true, default: [] },
  languages: { type: [LanguageSchema], required: true, default: [] },
  faqs: { type: [FaqSchema], required: true, default: [] },
  expertises: { type: [String], required: true, default: [] },
  location: { type: LocationSchema, required: false },
});

const createSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

DoctorSchema.pre<IDoctorDocument>("validate", async function (next) {
  // Only set slug if it hasn't been set before
  if (this.slug) return next();

  const baseSlug = createSlug(this.name);
  let slug = baseSlug;
  let counter = 0;

  const Doctor = this.constructor as IDoctorModel;

  while (await Doctor.exists({ slug })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  this.slug = slug;
  next();
});

DoctorSchema.plugin(BaseSchemaPlugin);

export const DoctorModel = model<IDoctorDocument, IDoctorModel>(
  "Doctor",
  DoctorSchema
);

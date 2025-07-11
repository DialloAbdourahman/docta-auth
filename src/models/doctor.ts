import { Schema, model, Document, Model } from "mongoose";
import { ISpecialtyDocument, SpecialtyModel } from "./specialty";
import { IUserDocument, UserModel } from "./user";

export interface IDoctor {
  name: string;
  slug: string;
  isActive: boolean;
  user: IUserDocument;
  specialty: ISpecialtyDocument;
  biography: string;
  consultation_fee: number;
  is_verified: boolean;
  isDeleted: boolean;
}

export interface IDoctorDocument extends IDoctor, Document {}

export interface IDoctorModel extends Model<IDoctorDocument> {}

const DoctorSchema = new Schema<IDoctorDocument>(
  {
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
    consultation_fee: { type: Number, required: false },
    is_verified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

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

export const DoctorModel = model<IDoctorDocument, IDoctorModel>(
  "Doctor",
  DoctorSchema
);
